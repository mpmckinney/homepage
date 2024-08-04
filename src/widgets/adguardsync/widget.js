import adguardsyncProxyHandler from "./proxy";

const widget = {
  api: "{url}/{endpoint}",
  proxyHandler: adguardsyncProxyHandler,

  mappings: {
    status: {
      endpoint: "api/v1/status",
    },
    logs: {
      endpoint: "api/v1/logs",
    },
  },
};

export default widget;
