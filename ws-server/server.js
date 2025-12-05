// ws-server/server.js
import { WebSocketServer } from 'ws';
import { v4 as uuid } from 'uuid';
import fetch from 'node-fetch';

const WS_PORT = process.env.WS_PORT || 8080;
// Cambia esto al puerto real donde corre TU Next (3000 es el típico)
const NEXT_API_BASE = process.env.NEXT_API_BASE || 'http://127.0.0.1:3000';

const wss = new WebSocketServer({ port: WS_PORT });
console.log(`WS listening on ws://0.0.0.0:${WS_PORT}`);

function send(ws, obj) { try { ws.send(JSON.stringify(obj)); } catch {} }

const rooms = new Map(); // deviceId -> Set<ws>
function joinRoom(ws, deviceId) {
  if (!rooms.has(deviceId)) rooms.set(deviceId, new Set());
  rooms.get(deviceId).add(ws);
  ws.deviceId = deviceId;
}
function leaveRoom(ws) {
  const id = ws.deviceId;
  if (!id) return;
  const set = rooms.get(id);
  if (!set) return;
  set.delete(ws);
  if (set.size === 0) rooms.delete(id);
}
function fanout(deviceId, obj, except = null) {
  const set = rooms.get(deviceId);
  if (!set) return;
  const str = JSON.stringify(obj);
  for (const c of set) {
    if (c !== except && c.readyState === 1) { try { c.send(str); } catch {} }
  }
}

wss.on('connection', (ws) => {
  ws.id = uuid();

  ws.on('message', async (raw) => {
    let msg;
    try { msg = JSON.parse(raw.toString()); } catch { return; }

    // 1) Handshake para canal
    if (msg.type === 'hello' && typeof msg.deviceId === 'string') {
      joinRoom(ws, msg.deviceId);
      send(ws, { type: 'ack', yourId: ws.id, deviceId: msg.deviceId });
      return;
    }
    if (!ws.deviceId) { send(ws, { type: 'error', err: 'hello-required' }); return; }

    // 2) Broadcast entre web y unity
    if (msg.type === 'broadcast') {
      fanout(ws.deviceId, {
        type: 'event',
        from: ws.id,
        deviceId: ws.deviceId,
        event: msg.event || 'message',
        payload: msg.payload ?? null
      }, ws);
      return;
    }

    // 3) Puente a tus APIs Next (HTTP) y retorno por WS
    if (msg.type === 'apiCall' && typeof msg.path === 'string') {
      try {
        const url = `${NEXT_API_BASE}${msg.path}`;
        const r = await fetch(url, {
          method: (msg.method || 'GET').toUpperCase(),
          headers: { 'content-type': 'application/json' },
          body: msg.body ? JSON.stringify(msg.body) : undefined
        });
        const text = await r.text();
        fanout(ws.deviceId, {
          type: 'apiResult',
          from: 'server',
          deviceId: ws.deviceId,
          path: msg.path,
          status: r.status,
          body: text
        });
      } catch (e) {
        fanout(ws.deviceId, {
          type: 'apiResult',
          from: 'server',
          deviceId: ws.deviceId,
          path: msg.path,
          status: 500,
          body: JSON.stringify({ error: String(e) })
        });
      }
    }
  });

  ws.on('close', () => leaveRoom(ws));
  ws.on('error', () => leaveRoom(ws));
});
