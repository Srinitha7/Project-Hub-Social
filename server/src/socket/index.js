export const setupSocketIO = (io) => {
  const activeUsers = new Map(); // userId -> socketId

  io.on('connection', (socket) => {
    console.log('⚡ Socket connected:', socket.id);

    // Register user socket
    socket.on('register_user', (userId) => {
      if (userId) {
        activeUsers.set(userId, socket.id);
        socket.userId = userId;
        console.log(`👤 User registered on socket: ${userId}`);
        io.emit('user_status_change', { userId, status: 'online' });
      }
    });

    // Handle direct message sending via socket
    socket.on('send_direct_message', (data) => {
      const { receiverId, message } = data;
      const receiverSocketId = activeUsers.get(receiverId);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receive_direct_message', message);
        io.to(receiverSocketId).emit('new_notification', {
          type: 'MESSAGE',
          title: 'New Message',
          body: `${message.sender.fullName}: ${message.content.slice(0, 30)}...`
        });
      }
    });

    // Handle team chat message
    socket.on('join_team_room', (teamId) => {
      socket.join(`team_${teamId}`);
      console.log(`👥 Socket ${socket.id} joined team room team_${teamId}`);
    });

    socket.on('send_team_message', (data) => {
      const { teamId, message } = data;
      io.to(`team_${teamId}`).emit('receive_team_message', message);
    });

    socket.on('disconnect', () => {
      if (socket.userId) {
        activeUsers.delete(socket.userId);
        io.emit('user_status_change', { userId: socket.userId, status: 'offline' });
      }
      console.log('❌ Socket disconnected:', socket.id);
    });
  });
};
