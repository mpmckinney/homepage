import getServiceWidget from "utils/config/service-helpers";
import { formatApiCall, sanitizeErrorURL } from "utils/proxy/api-helpers";
import createLogger from "utils/logger";
import { httpProxy } from "utils/proxy/http";
import widgets from "widgets/widgets";

const logger = createLogger("adguardsyncProxyHandler");

export default async function customProxyHandler(req, res) {
  const { group, service, endpoint } = req.query;

  if (!group || !service) {
    logger.debug("Invalid or missing service '%s' or group '%s'", service, group);
    return res.status(400).json({ error: "Invalid proxy service type" });
  }

  const widget = await getServiceWidget(group, service);
  if (!widget) {
    logger.debug("Invalid or missing widget for service '%s' in group '%s'", service, group);
    return res.status(400).json({ error: "Invalid proxy service type" });
  }

  const url = new URL(formatApiCall(widgets[widget.type].api, { endpoint, ...widget }));

  const headers = {};
  if (widget.username && widget.password) {
    headers.Authorization = `Basic ${Buffer.from(`${widget.username}:${widget.password}`).toString("base64")}`;
  }

  const [status, contentType, data] = await httpProxy(url, { method: "GET", headers });

  if (status !== 200) {
    logger.debug(
      "HTTP Error %d calling %s//%s%s%s...",
      status,
      url.protocol,
      url.hostname,
      url.port ? `:${url.port}` : "",
      url.pathname,
    );
    return res.status(status).json({ error: { message: "HTTP Error", url: sanitizeErrorURL(url), resultData: data } });
  }

  if (contentType) res.setHeader("Content-Type", contentType);

  if (contentType === "text/plain") {
    return res.status(status).json({ text: data.toString() });
  }

  return res.status(status).send(data);
}