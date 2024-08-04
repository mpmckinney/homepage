import { useTranslation } from "next-i18next";

import Container from "components/services/widget/container";
import Block from "components/services/widget/block";
import useWidgetAPI from "utils/proxy/use-widget-api";

export default function Component({ service }) {
  const { t } = useTranslation();

  const { widget } = service;

  const { data: statusData, error: statusError } = useWidgetAPI(widget, "status");
  const { data: logsData, error: logsError } = useWidgetAPI(widget, "logs");

  if (statusError || logsError) {
    return <Container service={service} error={statusError ?? logsError} />;
  }

  if (!statusData || !logsData) {
    return (
      <Container service={service}>
        <Block label="widget.status" />
        <Block label="adguardsync.replicas" />
        <Block label="adguardsync.replicasSynced" />
        <Block label="adguardsync.lastSync" />
      </Container>
    );
  }

  const logs = logsData.text.toString().split("\n").map(line => {
    const log = {};
    [ log.timestamp, log.level, log.logger, log.caller, log.message] = line.split("\t");
    return log;
  });
  const syncDoneLogs = logs.filter(log => log.message === "Sync done")

  return (
    <Container service={service}>
      <Block label="widget.status" value={t(statusData.syncRunning ? "adguardsync.syncing" : "adguardsync.idle")} />
      <Block label="adguardsync.replicas" value={t("common.number", { value: statusData.replicas.length })} />
      <Block label="adguardsync.replicasSynced" value={t("common.number", { value: statusData.replicas.filter(replica => replica.status === "success").length })} />
      <Block label="adguardsync.lastSync" value={syncDoneLogs.length > 0 ? t("common.relativeDate", { value: syncDoneLogs[syncDoneLogs.length - 1].timestamp }) : "-"} />
    </Container>
  );
}
