import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getHackathons = async (req, res) => {
  try {
    const { mode, query } = req.query;

    let whereClause = {};

    if (mode && mode !== 'ALL') {
      whereClause.mode = mode;
    }

    if (query) {
      whereClause.OR = [
        { name: { contains: query } },
        { organizer: { contains: query } },
        { description: { contains: query } },
        { technologies: { contains: query } }
      ];
    }

    const hackathons = await prisma.hackathon.findMany({
      where: whereClause,
      include: {
        teams: {
          include: {
            members: {
              include: {
                user: {
                  select: {
                    id: true,
                    fullName: true,
                    avatarUrl: true
                  }
                }
              }
            }
          }
        },
        _count: {
          select: { teams: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formatted = hackathons.map(h => {
      let parsedTech = [];
      try {
        parsedTech = JSON.parse(h.technologies);
      } catch (e) {
        parsedTech = h.technologies.split(',').map(s => s.trim());
      }
      return {
        ...h,
        technologiesList: parsedTech,
        teamsCount: h._count.teams
      };
    });

    return res.json(formatted);
  } catch (error) {
    console.error('Get Hackathons Error:', error);
    return res.status(500).json({ error: 'Failed to fetch hackathons' });
  }
};

export const getHackathonById = async (req, res) => {
  try {
    const { id } = req.params;

    const hackathon = await prisma.hackathon.findUnique({
      where: { id },
      include: {
        teams: {
          include: {
            leader: {
              select: {
                id: true,
                fullName: true,
                username: true,
                avatarUrl: true
              }
            },
            members: {
              include: {
                user: {
                  select: {
                    id: true,
                    fullName: true,
                    username: true,
                    avatarUrl: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!hackathon) {
      return res.status(404).json({ error: 'Hackathon not found' });
    }

    let parsedTech = [];
    try {
      parsedTech = JSON.parse(hackathon.technologies);
    } catch (e) {
      parsedTech = hackathon.technologies.split(',').map(s => s.trim());
    }

    return res.json({
      ...hackathon,
      technologiesList: parsedTech
    });
  } catch (error) {
    console.error('Get Hackathon By ID Error:', error);
    return res.status(500).json({ error: 'Failed to fetch hackathon details' });
  }
};
