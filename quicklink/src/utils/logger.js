// src/utils/logger.js

const LOG_ENDPOINT = "http://20.244.56.144/evaluation-service/logs";
const QUEUE_KEY = "logQueue_v1";

// Read queue
function readQueue() {
  try { return JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]"); }
  catch { return []; }
}

// Save queue
function saveQueue(q) {
  try { localStorage.setItem(QUEUE_KEY, JSON.stringify(q)); }
  catch { /* intentionally no console logging */ }
}

// Try sending a single payload
async function send(payload) {
  return fetch(LOG_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

// Flush queued logs (called on load and when online)
export async function flushLogs() {
  if (!navigator.onLine) return;
  let q = readQueue();
  while (q.length) {
    const item = q[0];
    try {
      const res = await send(item);
      if (!res.ok) break; // stop if server rejects; keep for later
      q.shift();
      saveQueue(q);
    } catch {
      break; // network error, keep queue for retry
    }
  }
}

// Main reusable middleware function
export function Log(stack, level, packageName, message, meta = {}) {
  const payload = {
    stack,              // e.g., "frontend" | "backend"
    level,              // "info" | "warn" | "error" | "fatal"
    package: packageName, // module/component name
    message,            // human-readable message
    meta,               // optional extra context
    timestamp: new Date().toISOString(),
    client: {
      url: window.location.href,
      userAgent: navigator.userAgent,
    },
  };

  // Enqueue then try to flush
  const q = readQueue();
  q.push(payload);
  saveQueue(q);
  flushLogs();
}

// Helpers for convenience (optional)
export const logInfo  = (pkg, msg, meta) => Log("frontend", "info",  pkg, msg, meta);
export const logWarn  = (pkg, msg, meta) => Log("frontend", "warn",  pkg, msg, meta);
export const logError = (pkg, msg, meta) => Log("frontend", "error", pkg, msg, meta);
export const logFatal = (pkg, msg, meta) => Log("frontend", "fatal", pkg, msg, meta);

// Auto-flush when network returns
window.addEventListener("online", flushLogs);
// Try once on load
flushLogs();
