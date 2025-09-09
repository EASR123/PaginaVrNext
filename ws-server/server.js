const WebSocket = require('ws');  // Paquete WebSocket

// Crear un servidor WebSocket en el puerto 8080
const wss = new WebSocket.Server({ port: 8080 });

// Cuando un cliente se conecta
wss.on('connection', (ws) => {
  console.log('Nuevo cliente conectado');

  // Enviar un mensaje de bienvenida al cliente cuando se conecta
  ws.send('Conexión establecida con el servidor WebSocket');

  // Escuchar los mensajes enviados por el cliente
  ws.on('message', (message) => {
    console.log('Mensaje recibido desde el cliente:', message);

    // Enviar una respuesta al cliente
    ws.send(`Mensaje recibido: ${message}`);
  });

  // Manejar desconexiones del cliente
  ws.on('close', () => {
    console.log('Cliente desconectado');
  });
});

console.log('Servidor WebSocket escuchando en ws://localhost:8080');
