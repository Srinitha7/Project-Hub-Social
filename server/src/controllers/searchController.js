import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const globalSearch = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || !q.trim()) {
      return res.json({
        users: [],
        projects: [],
        hackathons: [],
        teams: []
      });
    }

    const query = q.trim();

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { fullName: { contains: query } },
          { username: { contains: query } },
          { bio: { contains: query } },
          { college: { contains: query } },
          { skills: { some: { skillName: { contains: query } } } }
        ]
      },
      include: { skills: true },
      take: 6
    });

    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { title: { contains: query } },
          { description: { contains: query } },
          { technologies: { contains: query } }
        ]
      },
      include: {
        creator: { select: { fullName: true, username: true } }
      },
      take: 6
    });

    const hackathons = await prisma.hackathon.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { organizer: { contains: query } },
          { technologies: { contains: query } }
        ]
      },
      take: 4
    });

    const teams = await prisma.team.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { description: { contains: query } },
          { requiredSkills: { contains: query } }
        ]
      },
      include: {
        leader: { select: { fullName: true, username: true } }
      },
      take: 6
    });

    const cleanUsers = users.map(({ passwordHash, ...u }) => u);

    return res.json({
      users: cleanUsers,
      projects,
      hackathons,
      teams
    });
  } catch (error) {
    console.error('Global Search Error:', error);
    return res.status(500).json({ error: 'Search failed' });
  }
};
