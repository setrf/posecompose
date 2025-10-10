type LogPayload = Record<string, unknown>;

interface LogEntry extends LogPayload {
  event: string;
  level: "info" | "error";
  timestamp: string;
}

const LOG_ENDPOINT = import.meta.env.VITE_LOG_ENDPOINT;

const deliverLog = (entry: LogEntry) => {
  if (!LOG_ENDPOINT) {
    return;
  }

  const body = JSON.stringify(entry);

  if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon(LOG_ENDPOINT, blob);
    return;
  }

  void fetch(LOG_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
    keepalive: true,
  }).catch(() => {
    // swallow transport errors
  });
};

export const logEvent = (event: string, payload: LogPayload = {}) => {
  const entry: LogEntry = {
    event,
    level: "info",
    timestamp: new Date().toISOString(),
    ...payload,
  };

  console.info("[PoseCompose]", entry);
  deliverLog(entry);
};

export const logError = (event: string, error: unknown, payload: LogPayload = {}) => {
  const normalizedError =
    error instanceof Error
      ? { message: error.message, stack: error.stack }
      : { message: typeof error === "string" ? error : JSON.stringify(error) };

  const entry: LogEntry = {
    event,
    level: "error",
    timestamp: new Date().toISOString(),
    ...payload,
    ...normalizedError,
  };

  console.error("[PoseCompose]", entry);
  deliverLog(entry);
};
