import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getTeams = async (req, res) => {
  try {
    const { hackathonId, query, skill } = req.query;

    let whereClause = {};

    if (hackathonId) {
      whereClause.hackathonId = hackathonId;
    }

    if (skill) {
      whereClause.requiredSkills = { contains: skill };
    }

    if (query) {
      whereClause.OR = [
        { name: { contains: query } },
        { description: { contains: query } },
        { requiredSkills: { contains: query } }
      ];
    }

    const teams = await prisma.team.findMany({
      where: whereClause,
      include: {
        leader: {
          select: {
            id: true,
            fullName: true,
            username: true,
            avatarUrl: true,
            college: true
          }
        },
        hackathon: {
          select: {
            id: true,
            name: true,
            organizer: true,
            date: true
          }
        },
        project: {
          select: {
            id: true,
            title: true,
            status: true
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
        },
        requests: {
          select: { userId: true, status: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formatted = teams.map(t => {
      let parsedSkills = [];
      try {
        parsedSkills = JSON.parse(t.requiredSkills);
      } catch (e) {
        parsedSkills = t.requiredSkills.split(',').map(s => s.trim());
      }
      return {
        ...t,
        requiredSkillsList: parsedSkills,
        membersCount: t.members.length
      };
    });

    return res.json(formatted);
  } catch (error) {
    console.error('Get Teams Error:', error);
    return res.status(500).json({ error: 'Failed to fetch teams' });
  }
};

export const getTeamById = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user ? req.user.id : null;

    const team = await prisma.team.findUnique({
      where: { id },
      include: {
        leader: {
          select: {
            id: true,
            fullName: true,
            username: true,
            avatarUrl: true,
            college: true,
            email: true
          }
        },
        hackathon: true,
        project: true,
        members: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                username: true,
                avatarUrl: true,
                college: true
              }
            }
          }
        },
        requests: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                username: true,
                avatarUrl: true,
                college: true,
                bio: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        tasks: {
          include: {
            assignedTo: {
              select: {
                id: true,
                fullName: true,
                avatarUrl: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    let parsedSkills = [];
    try {
      parsedSkills = JSON.parse(team.requiredSkills);
    } catch (e) {
      parsedSkills = team.requiredSkills.split(',').map(s => s.trim());
    }

    const isLeader = currentUserId ? team.leaderId === currentUserId : false;
    const isMember = currentUserId ? team.members.some(m => m.userId === currentUserId) : false;
    const userRequest = currentUserId ? team.requests.find(r => r.userId === currentUserId) : null;

    return res.json({
      ...team,
      requiredSkillsList: parsedSkills,
      isLeader,
      isMember,
      userRequestStatus: userRequest ? userRequest.status : null
    });
  } catch (error) {
    console.error('Get Team By ID Error:', error);
    return res.status(500).json({ error: 'Error fetching team details' });
  }
};

export const createTeam = async (req, res) => {
  try {
    const leaderId = req.user.id;
    const { name, description, requiredSkills, maxMembers, hackathonId, projectId, leaderRole } = req.body;

    if (!name || !description || !requiredSkills) {
      return res.status(400).json({ error: 'Name, description, and required skills are required' });
    }

    let skillsString = '';
    if (Array.isArray(requiredSkills)) {
      skillsString = JSON.stringify(requiredSkills);
    } else {
      skillsString = JSON.stringify(requiredSkills.split(',').map(s => s.trim()));
    }

    const team = await prisma.team.create({
      data: {
        leaderId,
        name: name.trim(),
        description: description.trim(),
        requiredSkills: skillsString,
        maxMembers: maxMembers ? parseInt(maxMembers) : 4,
        hackathonId: hackathonId || null,
        projectId: projectId || null,
        status: 'RECRUITING'
      }
    });

    // Add leader as first member
    await prisma.teamMember.create({
      data: {
        teamId: team.id,
        userId: leaderId,
        role: leaderRole || 'Team Leader'
      }
    });

    return res.status(201).json(team);
  } catch (error) {
    console.error('Create Team Error:', error);
    return res.status(500).json({ error: 'Failed to create team' });
  }
};

export const requestToJoinTeam = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id: teamId } = req.params;
    const { message } = req.body;

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: { members: true }
    });

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    if (team.members.some(m => m.userId === userId)) {
      return res.status(400).json({ error: 'You are already a member of this team' });
    }

    const existingReq = await prisma.teamRequest.findUnique({
      where: {
        teamId_userId: { teamId, userId }
      }
    });

    if (existingReq) {
      return res.status(400).json({ error: 'You have already requested to join this team' });
    }

    const request = await prisma.teamRequest.create({
      data: {
        teamId,
        userId,
        message: message || '',
        status: 'PENDING'
      }
    });

    // Notify team leader
    const requestingUser = await prisma.user.findUnique({ where: { id: userId } });
    await prisma.notification.create({
      data: {
        userId: team.leaderId,
        actorId: userId,
        type: 'TEAM_REQUEST',
        title: 'Team Join Request',
        body: `${requestingUser.fullName} requested to join your team "${team.name}".`,
        link: `/teams/${teamId}`
      }
    });

    return res.status(201).json(request);
  } catch (error) {
    console.error('Request Join Team Error:', error);
    return res.status(500).json({ error: 'Failed to submit join request' });
  }
};

export const handleJoinRequest = async (req, res) => {
  try {
    const leaderId = req.user.id;
    const { id: teamId, requestId } = req.params;
    const { action, role } = req.body; // action: 'ACCEPT' or 'REJECT'

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: { members: true }
    });

    if (!team || team.leaderId !== leaderId) {
      return res.status(403).json({ error: 'Only team leader can manage join requests' });
    }

    const joinRequest = await prisma.teamRequest.findUnique({
      where: { id: requestId }
    });

    if (!joinRequest) {
      return res.status(404).json({ error: 'Join request not found' });
    }

    if (action === 'ACCEPT') {
      if (team.members.length >= team.maxMembers) {
        return res.status(400).json({ error: 'Team is already at maximum capacity' });
      }

      await prisma.teamRequest.update({
        where: { id: requestId },
        data: { status: 'ACCEPTED' }
      });

      await prisma.teamMember.create({
        data: {
          teamId,
          userId: joinRequest.userId,
          role: role || 'Member'
        }
      });

      // Update status if full
      if (team.members.length + 1 >= team.maxMembers) {
        await prisma.team.update({
          where: { id: teamId },
          data: { status: 'FULL' }
        });
      }

      // Notify accepted user
      await prisma.notification.create({
        data: {
          userId: joinRequest.userId,
          actorId: leaderId,
          type: 'TEAM_ACCEPT',
          title: 'Request Accepted!',
          body: `You have been accepted into team "${team.name}".`,
          link: `/teams/${teamId}`
        }
      });

      return res.json({ message: 'Request accepted' });
    } else {
      await prisma.teamRequest.update({
        where: { id: requestId },
        data: { status: 'REJECTED' }
      });

      return res.json({ message: 'Request rejected' });
    }
  } catch (error) {
    console.error('Handle Join Request Error:', error);
    return res.status(500).json({ error: 'Error handling join request' });
  }
};

export const createTeamTask = async (req, res) => {
  try {
    const { id: teamId } = req.params;
    const { title, assignedToId } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Task title is required' });
    }

    const task = await prisma.task.create({
      data: {
        teamId,
        title: title.trim(),
        assignedToId: assignedToId || null,
        status: 'TODO'
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true
          }
        }
      }
    });

    return res.status(201).json(task);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create task' });
  }
};

export const updateTeamTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body; // 'TODO', 'IN_PROGRESS', 'DONE'

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { status }
    });

    return res.json(updatedTask);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update task status' });
  }
};
