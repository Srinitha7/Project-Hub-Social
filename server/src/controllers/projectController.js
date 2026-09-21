import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getProjects = async (req, res) => {
  try {
    const { tech, status, query } = req.query;
    const currentUserId = req.user ? req.user.id : null;

    let whereClause = {};

    if (status && status !== 'ALL') {
      whereClause.status = status;
    }

    if (tech && tech !== 'ALL') {
      whereClause.technologies = {
        contains: tech
      };
    }

    if (query) {
      whereClause.OR = [
        { title: { contains: query } },
        { description: { contains: query } },
        { technologies: { contains: query } }
      ];
    }

    const projects = await prisma.project.findMany({
      where: whereClause,
      include: {
        creator: {
          select: {
            id: true,
            fullName: true,
            username: true,
            avatarUrl: true,
            college: true
          }
        },
        likes: {
          select: { userId: true }
        },
        savedPosts: {
          select: { userId: true }
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                fullName: true,
                username: true,
                avatarUrl: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        teams: {
          select: {
            id: true,
            name: true,
            status: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formatted = projects.map(p => {
      let parsedTech = [];
      try {
        parsedTech = JSON.parse(p.technologies);
      } catch (e) {
        parsedTech = p.technologies.split(',').map(s => s.trim());
      }

      const isLiked = currentUserId ? p.likes.some(l => l.userId === currentUserId) : false;
      const isSaved = currentUserId ? p.savedPosts.some(s => s.userId === currentUserId) : false;

      return {
        ...p,
        technologiesList: parsedTech,
        isLiked,
        isSaved,
        likesCount: p._count.likes,
        commentsCount: p._count.comments,
      };
    });

    return res.json(formatted);
  } catch (error) {
    console.error('Get Projects Error:', error);
    return res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user ? req.user.id : null;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            fullName: true,
            username: true,
            avatarUrl: true,
            college: true,
            bio: true
          }
        },
        likes: { select: { userId: true } },
        savedPosts: { select: { userId: true } },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                fullName: true,
                username: true,
                avatarUrl: true
              }
            }
          },
          orderBy: { createdAt: 'asc' }
        },
        teams: {
          include: {
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
        },
        _count: {
          select: { likes: true, comments: true }
        }
      }
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    let parsedTech = [];
    try {
      parsedTech = JSON.parse(project.technologies);
    } catch (e) {
      parsedTech = project.technologies.split(',').map(s => s.trim());
    }

    const isLiked = currentUserId ? project.likes.some(l => l.userId === currentUserId) : false;
    const isSaved = currentUserId ? project.savedPosts.some(s => s.userId === currentUserId) : false;

    return res.json({
      ...project,
      technologiesList: parsedTech,
      isLiked,
      isSaved,
      likesCount: project._count.likes,
      commentsCount: project._count.comments
    });
  } catch (error) {
    console.error('Get Project By ID Error:', error);
    return res.status(500).json({ error: 'Error fetching project details' });
  }
};

export const createProject = async (req, res) => {
  try {
    const creatorId = req.user.id;
    const { title, description, imageUrl, status, technologies, githubLink, liveDemoLink } = req.body;

    if (!title || !description || !technologies) {
      return res.status(400).json({ error: 'Title, description, and technologies are required' });
    }

    let techString = '';
    if (Array.isArray(technologies)) {
      techString = JSON.stringify(technologies);
    } else {
      techString = JSON.stringify(technologies.split(',').map(s => s.trim()));
    }

    const newProject = await prisma.project.create({
      data: {
        creatorId,
        title: title.trim(),
        description: description.trim(),
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
        status: status || 'IN_DEVELOPMENT',
        technologies: techString,
        githubLink: githubLink || '',
        liveDemoLink: liveDemoLink || ''
      },
      include: {
        creator: {
          select: {
            id: true,
            fullName: true,
            username: true,
            avatarUrl: true,
            college: true
          }
        }
      }
    });

    return res.status(201).json(newProject);
  } catch (error) {
    console.error('Create Project Error:', error);
    return res.status(500).json({ error: 'Failed to create project' });
  }
};

export const toggleLikeProject = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id: projectId } = req.params;

    const existingLike = await prisma.like.findFirst({
      where: { userId, projectId }
    });

    if (existingLike) {
      await prisma.like.delete({ where: { id: existingLike.id } });
      return res.json({ isLiked: false });
    } else {
      await prisma.like.create({
        data: { userId, projectId }
      });
      return res.json({ isLiked: true });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Failed to toggle project like' });
  }
};

export const addProjectComment = async (req, res) => {
  try {
    const authorId = req.user.id;
    const { id: projectId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Comment content cannot be empty' });
    }

    const comment = await prisma.comment.create({
      data: {
        authorId,
        projectId,
        content: content.trim()
      },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            username: true,
            avatarUrl: true
          }
        }
      }
    });

    return res.status(201).json(comment);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to add project comment' });
  }
};
