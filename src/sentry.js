import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.PROD
    ? "https://e97316f0c99790958df7048ec41a4669@o4510913396015104.ingest.us.sentry.io/4510913399685120"
    : undefined,
});
