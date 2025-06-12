const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Conecta a MongoDB
mongoose.connect('mongodb+srv://alejandro17069:Alejo1706@contingencia01.srcmb9u.mongodb.net/?retryWrites=true&w=majority&appName=contingencia01', { useNewUrlParser: true, useUnifiedTopology: true });

const Message = mongoose.model('Message', {
  user: String,
  content: String,
});

// Servimos el frontend
app.use(express.static('public'));

// Conexiones Socket.IO
io.on('connection', (socket) => {
  console.log('Cliente conectado');

  // Enviar todos los mensajes al conectar
  Message.find().then((msgs) => {
    socket.emit('init', msgs);
  });

  // Nuevo mensaje recibido
  socket.on('newMessage', async (data) => {
    const msg = new Message(data);
    await msg.save();
    io.emit('message', msg); // reenviar a todos los clientes
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

// Iniciar el servidor
server.listen(3000, () => {
  console.log('Servidor en http://localhost:3000');
});
