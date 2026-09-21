import prisma from '../prisma.js';

export const getProfileByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const currentUserId = req.user ? req.user.id : null;

    const user = await prisma.user.findUnique({
      where: { username: username.toLowerCase() },
      include: {
        skills: true,
        projects: {
          orderBy: { createdAt: 'desc' },
        },
        followers: {
          select: { followerId: true }
        },
        following: {
          select: { followingId: true }
        },
        teamMemberships: {
          include: {
            team: {
              include: {
                hackathon: true
              }
            }
          }
        },
        _count: {
          select: {
            followers: true,
            following: true,
            projects: true,
            posts: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Developer profile not found' });
    }

    const { passwordHash, ...userProfile } = user;

    const isFollowing = currentUserId
      ? user.followers.some(f => f.followerId === currentUserId)
      : false;

    return res.json({
      ...userProfile,
      isFollowing,
      followersCount: user._count.followers,
      followingCount: user._count.following,
      projectsCount: user._count.projects,
    });
  } catch (error) {
    console.error('Get Profile Error:', error);
    return res.status(500).json({ error: 'Server error loading profile' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fullName, bio, college, location, githubUsername, experience, avatarUrl, coverUrl, skills } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        fullName: fullName || undefined,
        bio: bio !== undefined ? bio : undefined,
        college: college !== undefined ? college : undefined,
        location: location !== undefined ? location : undefined,
        githubUsername: githubUsername !== undefined ? githubUsername : undefined,
        experience: experience || undefined,
        avatarUrl: avatarUrl || undefined,
        coverUrl: coverUrl || undefined,
      }
    });

    // Update skills if provided
    if (skills && Array.isArray(skills)) {
      await prisma.userSkill.deleteMany({ where: { userId } });
      for (const skillName of skills) {
        if (skillName.trim()) {
          await prisma.userSkill.create({
            data: { userId, skillName: skillName.trim() }
          });
        }
      }
    }

    const fullUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { skills: true }
    });

    const { passwordHash, ...resUser } = fullUser;
    return res.json(resUser);
  } catch (error) {
    console.error('Update Profile Error:', error);
    return res.status(500).json({ error: 'Failed to update profile' });
  }
};

export const toggleFollow = async (req, res) => {
  try {
    const followerId = req.user.id;
    const { targetUserId } = req.body;

    if (followerId === targetUserId) {
      return res.status(400).json({ error: 'You cannot follow yourself' });
    }

    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId: targetUserId
        }
      }
    });

    if (existingFollow) {
      // Unfollow
      await prisma.follow.delete({
        where: { id: existingFollow.id }
      });
      return res.json({ message: 'Unfollowed user', isFollowing: false });
    } else {
      // Follow
      await prisma.follow.create({
        data: {
          followerId,
          followingId: targetUserId
        }
      });

      // Notification
      const followerUser = await prisma.user.findUnique({ where: { id: followerId } });
      await prisma.notification.create({
        data: {
          userId: targetUserId,
          actorId: followerId,
          type: 'FOLLOW',
          title: 'New Follower',
          body: `${followerUser.fullName} started following you.`,
          link: `/profile/${followerUser.username}`
        }
      });

      return res.json({ message: 'Followed user', isFollowing: true });
    }
  } catch (error) {
    console.error('Toggle Follow Error:', error);
    return res.status(500).json({ error: 'Error toggling follow' });
  }
};

export const findTeammates = async (req, res) => {
  try {
    const { skill, college, experience, query } = req.query;

    let whereClause = {};

    if (college) {
      whereClause.college = { contains: college };
    }

    if (experience) {
      whereClause.experience = experience;
    }

    if (query) {
      whereClause.OR = [
        { fullName: { contains: query } },
        { username: { contains: query } },
        { bio: { contains: query } },
        { college: { contains: query } }
      ];
    }

    if (skill) {
      whereClause.skills = {
        some: {
          skillName: { contains: skill }
        }
      };
    }

    const developers = await prisma.user.findMany({
      where: whereClause,
      include: {
        skills: true,
        projects: {
          take: 2,
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: {
            projects: true,
            followers: true
          }
        }
      },
      take: 30
    });

    const result = developers.map(dev => {
      const { passwordHash, ...devData } = dev;
      return devData;
    });

    return res.json(result);
  } catch (error) {
    console.error('Find Teammates Error:', error);
    return res.status(500).json({ error: 'Failed to find teammates' });
  }
};
