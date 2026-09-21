import prisma from '../prisma.js';

export const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all messages where user is sender or receiver
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ]
      },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            username: true,
            avatarUrl: true
          }
        },
        receiver: {
          select: {
            id: true,
            fullName: true,
            username: true,
            avatarUrl: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Group by partner user ID
    const partnerMap = new Map();

    for (const msg of messages) {
      const partner = msg.senderId === userId ? msg.receiver : msg.sender;
      if (!partnerMap.has(partner.id)) {
        partnerMap.set(partner.id, {
          partner,
          lastMessage: msg,
          unreadCount: msg.receiverId === userId && !msg.isRead ? 1 : 0
        });
      } else if (msg.receiverId === userId && !msg.isRead) {
        partnerMap.get(partner.id).unreadCount += 1;
      }
    }

    const conversations = Array.from(partnerMap.values());
    return res.json(conversations);
  } catch (error) {
    console.error('Get Conversations Error:', error);
    return res.status(500).json({ error: 'Failed to fetch conversations' });
  }
};

export const getMessagesWithUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { partnerId } = req.params;

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: partnerId },
          { senderId: partnerId, receiverId: userId }
        ]
      },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            username: true,
            avatarUrl: true
          }
        },
        receiver: {
          select: {
            id: true,
            fullName: true,
            username: true,
            avatarUrl: true
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    // Mark unread messages as read
    await prisma.message.updateMany({
      where: {
        senderId: partnerId,
        receiverId: userId,
        isRead: false
      },
      data: { isRead: true }
    });

    return res.json(messages);
  } catch (error) {
    console.error('Get Messages Error:', error);
    return res.status(500).json({ error: 'Failed to fetch message history' });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiverId, content, projectLink, teamInviteId } = req.body;

    if (!receiverId || (!content && !projectLink && !teamInviteId)) {
      return res.status(400).json({ error: 'Receiver ID and content are required' });
    }

    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        content: content ? content.trim() : '',
        projectLink: projectLink || '',
        teamInviteId: teamInviteId || '',
        isRead: false
      },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            username: true,
            avatarUrl: true
          }
        },
        receiver: {
          select: {
            id: true,
            fullName: true,
            username: true,
            avatarUrl: true
          }
        }
      }
    });

    // Notification
    const senderUser = await prisma.user.findUnique({ where: { id: senderId } });
    await prisma.notification.create({
      data: {
        userId: receiverId,
        actorId: senderId,
        type: 'MESSAGE',
        title: 'New Message',
        body: `${senderUser.fullName}: "${content ? content.slice(0, 35) : 'Sent a link'}"`,
        link: `/messages`
      }
    });

    return res.status(201).json(message);
  } catch (error) {
    console.error('Send Message Error:', error);
    return res.status(500).json({ error: 'Failed to send message' });
  }
};
