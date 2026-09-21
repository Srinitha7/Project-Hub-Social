import prisma from '../prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const getJwtSecret = () => process.env.JWT_SECRET || 'projecthub_secret_key_dev_2026_super_secure';

const generateToken = (userId) => {
  return jwt.sign({ userId }, getJwtSecret(), { expiresIn: '7d' });
};

export const register = async (req, res) => {
  try {
    const { fullName, username, email, password, confirmPassword, skills, college } = req.body;

    if (!fullName || !username || !email || !password) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { username: username.toLowerCase() }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User with this email or username already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        fullName,
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        passwordHash,
        college: college || '',
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
      }
    });

    // Add skills
    if (skills && Array.isArray(skills)) {
      for (const skillName of skills) {
        if (skillName.trim()) {
          await prisma.userSkill.create({
            data: {
              userId: newUser.id,
              skillName: skillName.trim()
            }
          });
        }
      }
    }

    const token = generateToken(newUser.id);
    const { passwordHash: _, ...userWithoutPassword } = newUser;

    return res.status(201).json({
      message: 'Registration successful',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({ error: 'Server error during registration' });
  }
};

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier can be email or username

    if (!identifier || !password) {
      return res.status(400).json({ error: 'Please enter email/username and password' });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier.toLowerCase() },
          { username: identifier.toLowerCase() }
        ]
      },
      include: {
        skills: true
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email/username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email/username or password' });
    }

    const token = generateToken(user.id);
    const { passwordHash: _, ...userWithoutPassword } = user;

    return res.json({
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ error: 'Server error during login' });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        skills: true,
        _count: {
          select: {
            followers: true,
            following: true,
            projects: true,
            teamMemberships: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { passwordHash: _, ...userWithoutPassword } = user;
    return res.json(userWithoutPassword);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching current user' });
  }
};
