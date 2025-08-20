

const LOG_ENDPOINT = "http://20.244.56.144/evaluation-service/logs";
const QUEUE_KEY = "logQueue_v1";


function readQueue() {
  try { return JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]"); }
  catch { return []; }
}


function saveQueue(q) {
  try { localStorage.setItem(QUEUE_KEY, JSON.stringify(q)); }
  catch { /* intentionally no console logging */ }
}


async function send(payload) {
  return fetch(LOG_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}


export async function flushLogs() {
  if (!navigator.onLine) return;
  let q = readQueue();
  while (q.length) {
    const item = q[0];
    try {
      const res = await send(item);
      if (!res.ok) break; 
      q.shift();
      saveQueue(q);
    } catch {
      break; 
    }
  }
}


export function Log(stack, level, packageName, message, meta = {}) {
  const payload = {
    stack,              
    level,              
    package: packageName, 
    message,            
    meta,               
    timestamp: new Date().toISOString(),
    client: {
      url: window.location.href,
      userAgent: navigator.userAgent,
    },
  };

  
  const q = readQueue();
  q.push(payload);
  saveQueue(q);
  flushLogs();
}


export const logInfo  = (pkg, msg, meta) => Log("frontend", "info",  pkg, msg, meta);
export const logWarn  = (pkg, msg, meta) => Log("frontend", "warn",  pkg, msg, meta);
export const logError = (pkg, msg, meta) => Log("frontend", "error", pkg, msg, meta);
export const logFatal = (pkg, msg, meta) => Log("frontend", "fatal", pkg, msg, meta);


window.addEventListener("online", flushLogs);

flushLogs();
