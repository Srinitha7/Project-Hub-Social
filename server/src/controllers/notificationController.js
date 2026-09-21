import prisma from '../prisma.js';

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const notifications = await prisma.notification.findMany({
      where: { userId },
      include: {
        actor: {
          select: {
            id: true,
            fullName: true,
            username: true,
            avatarUrl: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    const unreadCount = await prisma.notification.count({
      where: { userId, isRead: false }
    });

    return res.json({
      notifications,
      unreadCount
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    if (id === 'all') {
      await prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true }
      });
      return res.json({ message: 'All notifications marked as read' });
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { isRead: true }
    });

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};
