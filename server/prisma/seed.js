import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Reseed Database with Requested Developer Names (Srinitha, Srinivas, Tharun, Sailu, Lavanya, Nitha, Nivas)...');

  // Clear existing tables
  await prisma.notification.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.teamRequest.deleteMany({});
  await prisma.teamMember.deleteMany({});
  await prisma.team.deleteMany({});
  await prisma.hackathon.deleteMany({});
  await prisma.follow.deleteMany({});
  await prisma.savedPost.deleteMany({});
  await prisma.like.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.userSkill.deleteMany({});
  await prisma.user.deleteMany({});

  const defaultPassword = await bcrypt.hash('password123', 10);

  // 1. Create Requested Developer Users
  const usersData = [
    {
      email: 'srinitha@projecthub.dev',
      username: 'srinitha',
      fullName: 'Srinitha',
      bio: 'Full-stack React & Node.js Developer. Passionate about developer tooling, open-source productivity apps, and clean UI.',
      college: 'MIT - Massachusetts Institute of Technology',
      location: 'Cambridge, MA',
      githubUsername: 'octocat',
      experience: 'Expert',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      coverUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
      skills: ['React', 'Node.js', 'TypeScript', 'Python', 'PostgreSQL', 'Tailwind CSS', 'Docker']
    },
    {
      email: 'srinivas@projecthub.dev',
      username: 'srinivas',
      fullName: 'Srinivas',
      bio: 'Machine Learning Researcher & AI Engineer. Specializing in computer vision, PyTorch, and NLP neural pipelines.',
      college: 'Stanford University',
      location: 'Palo Alto, CA',
      githubUsername: 'torvalds',
      experience: 'Expert',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      coverUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
      skills: ['Python', 'PyTorch', 'TensorFlow', 'AI/ML', 'FastAPI', 'Data Science', 'Docker']
    },
    {
      email: 'tharun@projecthub.dev',
      username: 'tharun',
      fullName: 'Tharun',
      bio: 'Cybersecurity Analyst & Rust Systems Programmer. Offensive CTF player and kernel security architect.',
      college: 'UC Berkeley',
      location: 'Berkeley, CA',
      githubUsername: 'gaearon',
      experience: 'Advanced',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      coverUrl: 'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=1200&q=80',
      skills: ['Cybersecurity', 'Rust', 'C++', 'Linux', 'Network Security', 'Python', 'Cloud']
    },
    {
      email: 'sailu@projecthub.dev',
      username: 'sailu',
      fullName: 'Sailu',
      bio: 'UI/UX Designer & Design Systems Engineer. Crafting beautiful developer-focused components and micro-interactions.',
      college: 'Carnegie Mellon University',
      location: 'Pittsburgh, PA',
      githubUsername: 'sindresorhus',
      experience: 'Advanced',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
      coverUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
      skills: ['React', 'Tailwind CSS', 'Figma', 'TypeScript', 'Next.js', 'UI/UX Design']
    },
    {
      email: 'lavanya@projecthub.dev',
      username: 'lavanya',
      fullName: 'Lavanya',
      bio: 'Cloud Architect & Microservices Specialist. Kubernetes clusters, Go backend systems, and AWS serverless.',
      college: 'University of Waterloo',
      location: 'Waterloo, ON',
      githubUsername: 'tj',
      experience: 'Expert',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      coverUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
      skills: ['Go', 'Cloud', 'Kubernetes', 'Docker', 'AWS', 'PostgreSQL', 'Node.js']
    },
    {
      email: 'nitha@projecthub.dev',
      username: 'nitha',
      fullName: 'Nitha',
      bio: 'Blockchain & Smart Contract Developer. Building decentralized protocols, Solidity contracts, and Web3 apps.',
      college: 'IIT Bombay',
      location: 'Mumbai, India',
      githubUsername: 'yyx990803',
      experience: 'Intermediate',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
      coverUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80',
      skills: ['Blockchain', 'Solidity', 'Ethereum', 'Web3', 'React', 'JavaScript', 'Node.js']
    },
    {
      email: 'nivas@projecthub.dev',
      username: 'nivas',
      fullName: 'Nivas',
      bio: 'Java Enterprise Solutions & Spring Boot Engineer. Distributed task queues and high-concurrency systems builder.',
      college: 'University of Oxford',
      location: 'Oxford, UK',
      githubUsername: 'mrdoob',
      experience: 'Advanced',
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
      coverUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      skills: ['Java', 'Spring Boot', 'Microservices', 'PostgreSQL', 'Docker', 'REST APIs']
    },
    {
      email: 'ananya@projecthub.dev',
      username: 'ananya',
      fullName: 'Ananya',
      bio: 'Mobile App Developer (React Native & Swift). Lover of responsive design and smooth mobile UI animations.',
      college: 'New York University',
      location: 'New York, NY',
      githubUsername: 'swyx',
      experience: 'Intermediate',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
      coverUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
      skills: ['React Native', 'React', 'Swift', 'JavaScript', 'Node.js', 'Tailwind CSS']
    },
    {
      email: 'vikram@projecthub.dev',
      username: 'vikram',
      fullName: 'Vikram',
      bio: 'DevOps & Terraform Infrastructure Specialist. Automated CI/CD pipelines and zero-downtime cluster deploys.',
      college: 'Georgia Tech',
      location: 'Atlanta, GA',
      githubUsername: 'antirez',
      experience: 'Expert',
      avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
      coverUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80',
      skills: ['Cloud', 'Docker', 'AWS', 'Kubernetes', 'Python', 'Linux', 'Terraform']
    },
    {
      email: 'rahul@projecthub.dev',
      username: 'rahul',
      fullName: 'Rahul',
      bio: 'Data Scientist & Python Analytics Engineer. Data visualization, statistical modeling, and AI ethics.',
      college: 'UT Austin',
      location: 'Austin, TX',
      githubUsername: 'hadley',
      experience: 'Intermediate',
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
      coverUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      skills: ['Python', 'AI/ML', 'Data Science', 'Pandas', 'SQL', 'React']
    },
    {
      email: 'divya@projecthub.dev',
      username: 'divya',
      fullName: 'Divya',
      bio: 'Competitive Programmer & C++ Developer. High-performance graph traversal algorithms and data structures.',
      college: 'UCLA',
      location: 'Los Angeles, CA',
      githubUsername: 'bjarne',
      experience: 'Advanced',
      avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
      coverUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
      skills: ['C++', 'Algorithms', 'Java', 'Python', 'Linux', 'Backend']
    },
    {
      email: 'kavya@projecthub.dev',
      username: 'kavya',
      fullName: 'Kavya',
      bio: 'Full-stack Web Dev & Developer Community Organizer. Empowering student coders through hackathons and workshops.',
      college: 'Harvard University',
      location: 'Cambridge, MA',
      githubUsername: 'sophia',
      experience: 'Intermediate',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
      coverUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
      skills: ['React', 'Node.js', 'Tailwind CSS', 'PostgreSQL', 'JavaScript', 'GraphQL']
    }
  ];

  const createdUsers = [];
  for (const u of usersData) {
    const { skills, ...userData } = u;
    const user = await prisma.user.create({
      data: {
        ...userData,
        passwordHash: defaultPassword,
      }
    });

    for (const skillName of skills) {
      await prisma.userSkill.create({
        data: {
          userId: user.id,
          skillName
        }
      });
    }
    createdUsers.push(user);
  }

  console.log(`✅ Created ${createdUsers.length} Users with Requested Names.`);

  const [srinitha, srinivas, tharun, sailu, lavanya, nitha, nivas, ananya, vikram, rahul, divya, kavya] = createdUsers;

  // 2. Create Follow Relationships
  const follows = [
    { followerId: srinitha.id, followingId: srinivas.id },
    { followerId: srinitha.id, followingId: tharun.id },
    { followerId: srinitha.id, followingId: sailu.id },
    { followerId: srinivas.id, followingId: srinitha.id },
    { followerId: srinivas.id, followingId: rahul.id },
    { followerId: tharun.id, followingId: vikram.id },
    { followerId: sailu.id, followingId: kavya.id },
    { followerId: lavanya.id, followingId: nivas.id },
    { followerId: nitha.id, followingId: srinitha.id },
    { followerId: nivas.id, followingId: srinitha.id },
  ];

  for (const f of follows) {
    await prisma.follow.create({ data: f });
  }

  // 3. Create Projects
  const projectsData = [
    {
      creatorId: srinitha.id,
      title: 'DevSync - Real-time Collaborative Code Editor',
      description: 'A WebSockets-powered collaborative coding workspace supporting live cursor tracking, instant execution, and integrated voice channels.',
      status: 'IN_DEVELOPMENT',
      technologies: JSON.stringify(['React', 'Node.js', 'Socket.IO', 'Monaco Editor', 'Tailwind CSS']),
      imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
      githubLink: 'https://github.com/octocat/devsync',
      liveDemoLink: 'https://devsync-demo.vercel.app'
    },
    {
      creatorId: srinivas.id,
      title: 'NeuroVision - Medical Image Diagnostics AI',
      description: 'Convolutional Neural Network model designed for fast MRI and X-ray scan segmentation with automated confidence scoring.',
      status: 'COMPLETED',
      technologies: JSON.stringify(['Python', 'PyTorch', 'FastAPI', 'AI/ML', 'Docker']),
      imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
      githubLink: 'https://github.com/torvalds/neuro-vision',
      liveDemoLink: 'https://neurovision-ai.org'
    },
    {
      creatorId: tharun.id,
      title: 'SentinelGuard - Zero-Trust Network Monitor',
      description: 'High-performance packet inspector built in Rust. Analyzes network traffic in real-time to detect anomaly signatures and zero-day probes.',
      status: 'IN_DEVELOPMENT',
      technologies: JSON.stringify(['Rust', 'Cybersecurity', 'Linux', 'C++', 'Python']),
      imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
      githubLink: 'https://github.com/gaearon/sentinel-guard',
      liveDemoLink: ''
    },
    {
      creatorId: sailu.id,
      title: 'GlassUI Design System & Component Kit',
      description: 'Modern glassmorphism React component library with built-in dark mode, accessible keyboard controls, and Tailwind support.',
      status: 'COMPLETED',
      technologies: JSON.stringify(['React', 'Tailwind CSS', 'TypeScript', 'UI/UX Design']),
      imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
      githubLink: 'https://github.com/sindresorhus/glass-ui',
      liveDemoLink: 'https://glass-ui-kit.netlify.app'
    },
    {
      creatorId: lavanya.id,
      title: 'KubeCraft - Kubernetes Infrastructure Automation',
      description: 'CLI tool to dynamically synthesize multi-region Kubernetes clusters with automated ingress SSL and Prometheus monitoring.',
      status: 'COMPLETED',
      technologies: JSON.stringify(['Go', 'Cloud', 'Kubernetes', 'Docker', 'AWS']),
      imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
      githubLink: 'https://github.com/tj/kubecraft',
      liveDemoLink: ''
    },
    {
      creatorId: nitha.id,
      title: 'DeFiPay - Zero-Gas Micropayments Protocol',
      description: 'Layer-2 Ethereum payment channel allowing instant micro-transactions with batch settlement for open source developers.',
      status: 'COMPLETED',
      technologies: JSON.stringify(['Blockchain', 'Solidity', 'Ethereum', 'React', 'Web3']),
      imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80',
      githubLink: 'https://github.com/yyx990803/defipay',
      liveDemoLink: 'https://defipay.io'
    },
    {
      creatorId: nivas.id,
      title: 'EnterpriseFlow - Microservices Task Engine',
      description: 'Distributed event-driven task processing system with high fault tolerance, built with Spring Boot and Kafka message queues.',
      status: 'IN_DEVELOPMENT',
      technologies: JSON.stringify(['Java', 'Spring Boot', 'PostgreSQL', 'Docker', 'Cloud']),
      imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      githubLink: 'https://github.com/mrdoob/enterprise-flow',
      liveDemoLink: ''
    }
  ];

  const createdProjects = [];
  for (const p of projectsData) {
    const proj = await prisma.project.create({ data: p });
    createdProjects.push(proj);
  }

  console.log(`✅ Created ${createdProjects.length} Projects.`);

  // 4. Create Hackathons
  const hackathonsData = [
    {
      name: 'Global DevHack 2026',
      organizer: 'ProjectHub & OpenSource Foundation',
      date: 'Oct 15 - Oct 18, 2026',
      registrationDeadline: 'Oct 10, 2026',
      mode: 'ONLINE',
      location: 'Virtual / Worldwide',
      technologies: JSON.stringify(['AI/ML', 'React', 'Node.js', 'Cloud', 'Blockchain']),
      description: 'Build innovative web, AI, and cloud solutions over 72 hours. Top prize includes $25,000 cash, AWS credits, and seed mentorship.',
      bannerUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1000&q=80',
      prizePool: '$25,000 Pool'
    },
    {
      name: 'AI Innovation Summit 2026',
      organizer: 'Stanford AI Lab & OpenAI Community',
      date: 'Nov 5 - Nov 7, 2026',
      registrationDeadline: 'Oct 30, 2026',
      mode: 'HYBRID',
      location: 'Palo Alto, CA & Remote',
      technologies: JSON.stringify(['Python', 'PyTorch', 'TensorFlow', 'AI/ML', 'FastAPI']),
      description: 'Challenge: Create groundbreaking generative AI or computer vision applications that solve real-world healthcare problems.',
      bannerUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80',
      prizePool: '$50,000 Pool'
    },
    {
      name: 'CyberShield CTF & Hackathon',
      organizer: 'DEF CON College Alliance',
      date: 'Dec 1 - Dec 3, 2026',
      registrationDeadline: 'Nov 25, 2026',
      mode: 'OFFLINE',
      location: 'MIT Stata Center, Cambridge, MA',
      technologies: JSON.stringify(['Cybersecurity', 'Rust', 'Linux', 'C++', 'Python']),
      description: 'Combine offensive CTF challenges with defensive tool engineering. Test your security mettle against top hacker teams.',
      bannerUrl: 'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=1000&q=80',
      prizePool: '$18,000 Pool'
    }
  ];

  const createdHackathons = [];
  for (const h of hackathonsData) {
    const hack = await prisma.hackathon.create({ data: h });
    createdHackathons.push(hack);
  }

  console.log(`✅ Created ${createdHackathons.length} Hackathons.`);

  // 5. Create Teams
  const team1 = await prisma.team.create({
    data: {
      leaderId: srinitha.id,
      name: 'Team DevSync AI',
      description: 'Building an AI pair programmer extension inside DevSync editor for Global DevHack 2026.',
      requiredSkills: JSON.stringify(['React', 'Python', 'AI/ML', 'Node.js']),
      maxMembers: 4,
      status: 'RECRUITING',
      hackathonId: createdHackathons[0].id,
      projectId: createdProjects[0].id,
    }
  });

  await prisma.teamMember.create({
    data: { teamId: team1.id, userId: srinitha.id, role: 'Team Leader & Fullstack Dev' }
  });
  await prisma.teamMember.create({
    data: { teamId: team1.id, userId: srinivas.id, role: 'AI / Model Engineer' }
  });
  await prisma.teamMember.create({
    data: { teamId: team1.id, userId: sailu.id, role: 'Frontend & UI Specialist' }
  });

  await prisma.task.createMany({
    data: [
      { teamId: team1.id, title: 'Finalize WebSocket event schema', status: 'DONE', assignedToId: srinitha.id },
      { teamId: team1.id, title: 'Fine-tune code completion prompt pipeline', status: 'IN_PROGRESS', assignedToId: srinivas.id },
      { teamId: team1.id, title: 'Design collaborative editor toolbar buttons', status: 'TODO', assignedToId: sailu.id },
    ]
  });

  const team2 = await prisma.team.create({
    data: {
      leaderId: tharun.id,
      name: 'Binary Breakers',
      description: 'Competitive CTF team targeting low-level exploit analysis and kernel hardening.',
      requiredSkills: JSON.stringify(['Rust', 'Cybersecurity', 'C++', 'Linux']),
      maxMembers: 4,
      status: 'RECRUITING',
      hackathonId: createdHackathons[2].id,
    }
  });

  await prisma.teamMember.create({
    data: { teamId: team2.id, userId: tharun.id, role: 'Team Captain & Kernel Specialist' }
  });
  await prisma.teamMember.create({
    data: { teamId: team2.id, userId: vikram.id, role: 'Infrastructure Analyst' }
  });

  await prisma.teamRequest.create({
    data: {
      teamId: team2.id,
      userId: divya.id,
      message: 'Hey Tharun! I have strong C++ and algorithms experience, would love to help on binary reversing.',
      status: 'PENDING'
    }
  });

  // 6. Create Feed Posts
  const postsData = [
    {
      authorId: srinitha.id,
      content: '🚀 Super excited to announce DevSync v0.8! We just added real-time cursor tracking and web-based terminal execution. Check out the project page below and let me know your thoughts!',
      imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
      projectTitle: 'DevSync - Real-time Collaborative Code Editor',
      projectDesc: 'WebSockets-powered collaborative coding workspace.',
      technologies: 'React, Node.js, Socket.IO, Monaco Editor',
      githubLink: 'https://github.com/octocat/devsync',
      liveDemoLink: 'https://devsync-demo.vercel.app'
    },
    {
      authorId: srinivas.id,
      content: '🧠 Just published our benchmark results for NeuroVision MRI classification. Achieved 98.4% precision on standard test sets! Thanks Srinitha and team for the support.',
      imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
      projectTitle: 'NeuroVision - Medical Image AI',
      projectDesc: 'Convolutional Neural Network for MRI segmentation.',
      technologies: 'Python, PyTorch, FastAPI, AI/ML',
      githubLink: 'https://github.com/torvalds/neuro-vision'
    },
    {
      authorId: tharun.id,
      content: '🛡️ Looking for 2 developers with Rust or C++ background for the upcoming CyberShield CTF! Drop me a message or request to join team "Binary Breakers".',
      technologies: 'Rust, Cybersecurity, C++',
    },
    {
      authorId: sailu.id,
      content: '✨ GlassUI component library v2.0 is live! Featuring accessible dark mode, custom scrollbars, and Tailwind CSS v4 support.',
      projectTitle: 'GlassUI Design System',
      technologies: 'React, Tailwind CSS, TypeScript, Figma',
      liveDemoLink: 'https://glass-ui-kit.netlify.app'
    },
    {
      authorId: nitha.id,
      content: '💎 DeFiPay is live on Ethereum Sepolia testnet! Zero-gas micropayments for open-source developer bounties.',
      projectTitle: 'DeFiPay Protocol',
      technologies: 'Blockchain, Solidity, Web3, React',
      liveDemoLink: 'https://defipay.io'
    }
  ];

  for (const p of postsData) {
    const post = await prisma.post.create({ data: p });

    await prisma.like.create({
      data: { userId: srinivas.id, postId: post.id }
    });
    await prisma.like.create({
      data: { userId: tharun.id, postId: post.id }
    });

    await prisma.comment.create({
      data: {
        authorId: sailu.id,
        postId: post.id,
        content: 'This looks incredible! The UI polish is top notch.'
      }
    });

    // Save first post for Srinitha
    if (p.authorId !== srinitha.id) {
      await prisma.savedPost.create({
        data: { userId: srinitha.id, postId: post.id }
      });
    }
  }

  // 7. Seed Direct Messages
  await prisma.message.create({
    data: {
      senderId: srinivas.id,
      receiverId: srinitha.id,
      content: 'Hey Srinitha! Loved your post on DevSync. Are you interested in pairing up for Global DevHack 2026?',
      isRead: true
    }
  });

  await prisma.message.create({
    data: {
      senderId: srinitha.id,
      receiverId: srinivas.id,
      content: 'Hey Srinivas! Absolutely! I already created Team DevSync AI. Let me send you a team invite.',
      isRead: false
    }
  });

  // 8. Seed Notifications
  await prisma.notification.create({
    data: {
      userId: srinitha.id,
      actorId: srinivas.id,
      type: 'FOLLOW',
      title: 'New Follower',
      body: 'Srinivas started following you.',
      isRead: false
    }
  });

  await prisma.notification.create({
    data: {
      userId: srinitha.id,
      actorId: sailu.id,
      type: 'COMMENT',
      title: 'New Comment',
      body: 'Sailu commented on your post: "This looks incredible..."',
      isRead: false
    }
  });

  console.log('🎉 Database reseeded successfully with requested developer names!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
