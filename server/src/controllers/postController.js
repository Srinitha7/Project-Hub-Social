import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getPosts = async (req, res) => {
  try {
    const currentUserId = req.user ? req.user.id : null;
    const { feedType } = req.query; // 'all' or 'following'

    let whereClause = {};

    if (feedType === 'following' && currentUserId) {
      const followingList = await prisma.follow.findMany({
        where: { followerId: currentUserId },
        select: { followingId: true }
      });
      const followingIds = followingList.map(f => f.followingId);
      followingIds.push(currentUserId);

      whereClause.authorId = { in: followingIds };
    }

    const posts = await prisma.post.findMany({
      where: whereClause,
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            username: true,
            avatarUrl: true,
            college: true
          }
        },
        likes: { select: { userId: true } },
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
        savedPosts: { select: { userId: true } },
        _count: {
          select: { likes: true, comments: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedPosts = posts.map(post => {
      const isLiked = currentUserId ? post.likes.some(l => l.userId === currentUserId) : false;
      const isSaved = currentUserId ? post.savedPosts.some(s => s.userId === currentUserId) : false;

      return {
        ...post,
        isLiked,
        isSaved,
        likesCount: post._count.likes,
        commentsCount: post._count.comments,
      };
    });

    return res.json(formattedPosts);
  } catch (error) {
    console.error('Get Posts Error:', error);
    return res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

export const getSavedPosts = async (req, res) => {
  try {
    const userId = req.user.id;

    const savedRecords = await prisma.savedPost.findMany({
      where: { userId },
      include: {
        post: {
          include: {
            author: {
              select: {
                id: true,
                fullName: true,
                username: true,
                avatarUrl: true,
                college: true
              }
            },
            likes: { select: { userId: true } },
            comments: {
              include: {
                author: { select: { id: true, fullName: true, username: true, avatarUrl: true } }
              }
            },
            savedPosts: { select: { userId: true } },
            _count: { select: { likes: true, comments: true } }
          }
        },
        project: {
          include: {
            creator: { select: { id: true, fullName: true, username: true, avatarUrl: true } },
            likes: { select: { userId: true } },
            savedPosts: { select: { userId: true } },
            _count: { select: { likes: true, comments: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const posts = savedRecords
      .filter(r => r.post)
      .map(r => ({
        ...r.post,
        isLiked: r.post.likes.some(l => l.userId === userId),
        isSaved: true,
        likesCount: r.post._count.likes,
        commentsCount: r.post._count.comments
      }));

    const projects = savedRecords
      .filter(r => r.project)
      .map(r => {
        let parsedTech = [];
        try { parsedTech = JSON.parse(r.project.technologies); } catch (e) { parsedTech = r.project.technologies.split(','); }
        return {
          ...r.project,
          technologiesList: parsedTech,
          isLiked: r.project.likes.some(l => l.userId === userId),
          isSaved: true,
          likesCount: r.project._count.likes,
          commentsCount: r.project._count.comments
        };
      });

    return res.json({ posts, projects });
  } catch (error) {
    console.error('Get Saved Posts Error:', error);
    return res.status(500).json({ error: 'Failed to fetch saved posts' });
  }
};

export const createPost = async (req, res) => {
  try {
    const authorId = req.user.id;
    const { content, imageUrl, projectTitle, projectDesc, technologies, githubLink, liveDemoLink } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Post content cannot be empty' });
    }

    const post = await prisma.post.create({
      data: {
        authorId,
        content: content.trim(),
        imageUrl: imageUrl || '',
        projectTitle: projectTitle || '',
        projectDesc: projectDesc || '',
        technologies: technologies || '',
        githubLink: githubLink || '',
        liveDemoLink: liveDemoLink || ''
      },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            username: true,
            avatarUrl: true,
            college: true
          }
        },
        likes: true,
        comments: true,
        _count: { select: { likes: true, comments: true } }
      }
    });

    return res.status(201).json({
      ...post,
      isLiked: false,
      isSaved: false,
      likesCount: 0,
      commentsCount: 0
    });
  } catch (error) {
    console.error('Create Post Error:', error);
    return res.status(500).json({ error: 'Failed to create post' });
  }
};

export const toggleLikePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId } = req.params;

    const existingLike = await prisma.like.findFirst({
      where: { userId, postId }
    });

    if (existingLike) {
      await prisma.like.delete({ where: { id: existingLike.id } });
      return res.json({ isLiked: false });
    } else {
      await prisma.like.create({
        data: { userId, postId }
      });

      const post = await prisma.post.findUnique({ where: { id: postId } });
      if (post && post.authorId !== userId) {
        const actor = await prisma.user.findUnique({ where: { id: userId } });
        await prisma.notification.create({
          data: {
            userId: post.authorId,
            actorId: userId,
            type: 'LIKE',
            title: 'New Like',
            body: `${actor.fullName} liked your post.`,
            link: `/feed`
          }
        });
      }

      return res.json({ isLiked: true });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Failed to toggle like' });
  }
};

export const addCommentPost = async (req, res) => {
  try {
    const authorId = req.user.id;
    const { postId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Comment content cannot be empty' });
    }

    const comment = await prisma.comment.create({
      data: {
        authorId,
        postId,
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

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (post && post.authorId !== authorId) {
      const actor = await prisma.user.findUnique({ where: { id: authorId } });
      await prisma.notification.create({
        data: {
          userId: post.authorId,
          actorId,
          type: 'COMMENT',
          title: 'New Comment',
          body: `${actor.fullName} commented: "${content.slice(0, 40)}..."`,
          link: `/feed`
        }
      });
    }

    return res.status(201).json(comment);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to add comment' });
  }
};

export const toggleSavePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId } = req.params;

    const existingSave = await prisma.savedPost.findFirst({
      where: { userId, postId }
    });

    if (existingSave) {
      await prisma.savedPost.delete({ where: { id: existingSave.id } });
      return res.json({ isSaved: false });
    } else {
      await prisma.savedPost.create({
        data: { userId, postId }
      });
      return res.json({ isSaved: true });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Failed to toggle save post' });
  }
};
