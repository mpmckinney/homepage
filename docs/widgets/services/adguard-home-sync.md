---
title: AdguardHome Sync
description: AdguardHome Sync Widget Configuration
---

Learn more about [AdguardHome Sync](https://github.com/bakito/adguardhome-sync).

The username and password are the same as used to login to the web interface.

Allowed fields: `["status", "replicas", "replicasSynced", "lastSync"]`.

```yaml
widget:
  type: adguardsync
  url: http://adguardsync.host.or.ip
  username: admin
  password: password
```
