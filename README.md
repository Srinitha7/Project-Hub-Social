# ProjectHub Social ⚡

ProjectHub Social is a modern full-stack web application engineered specifically for **students, developers, and tech enthusiasts**. Unlike traditional social networks, ProjectHub focuses on software projects, programming skills, hackathon team formation, developer networking, real-time messaging, and collaborative learning.

---

## 🌟 Key Features

1. **Developer-Focused Home Feed** (`/feed`)
   - Share code updates, project releases, and hackathon news.
   - Interactive Like, Comment, Share, Save, and Follow actions.
   - Attach rich project cards with live demo and repository links.

2. **Project Showcase & Filtering** (`/projects`)
   - Dedicated portfolio gallery with status badges (**Idea**, **In Development**, **Completed**).
   - Filter by tech stack: Java, Python, React, Node.js, AI/ML, Cybersecurity, Cloud, Blockchain.
   - Direct repository links and live demo preview modal.

3. **Find Teammates** (`/teammates`)
   - Multi-criteria developer search by programming language, college, experience level, and project interests.
   - Send instant team recruitment invites and direct messages.

4. **Hackathons & Team Formation** (`/hackathons`, `/teams`)
   - Discover online and offline hackathons with date countdowns and prize pools.
   - Create recruiting teams, specify required skills and max capacity.
   - Manage pending join requests with leader approval/rejection.
   - Interactive **Team Dashboard** with Kanban task management (TODO, IN_PROGRESS, DONE).

5. **GitHub Integration & Developer Profiles** (`/profile/:username`)
   - Customizable profile featuring skills badges, college, bio, and achievements.
   - **Live GitHub Integration**: Displays public repositories, stars, language stats, and forks via GitHub REST API.

6. **Real-time Messaging & Notifications** (`/messages`, `/notifications`)
   - 1-on-1 real-time direct messaging powered by **Socket.IO**.
   - Notifications center with unread badge counter for followers, likes, comments, team requests, and messages.

7. **Developer Analytics Dashboard** (`/dashboard`)
   - High-level statistics on projects built, network reach, active collaborations, and skill badges.

8. **Theme Options & Developer Styling**
   - Sleek Dark Mode (default) & Light Mode options.
   - Responsive sidebar and top navbar layout.

---

## 🛠️ Technology Stack

* **Frontend**: React.js 19, Vite, Tailwind CSS v4, React Router DOM v7, Lucide React Icons.
* **Backend**: Node.js, Express.js REST APIs, Socket.IO WebSockets.
* **Database & ORM**: PostgreSQL / SQLite, Prisma ORM 6.
* **Authentication**: JWT authentication with bcryptjs password hashing.
* **External Integration**: GitHub REST API.

---

## 🚀 Installation & Setup

### Prerequisites
* Node.js v18+ and npm installed.

### 1. Clone Repository & Install Dependencies

```bash
# Clone repository
git clone https://github.com/your-username/projecthub-social.git
cd projecthub-social

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

---

## 🗄️ Database Setup & Seeding

The application uses **Prisma ORM** with SQLite for local development out-of-the-box (zero external database server required).

```bash
cd server

# Synchronize Prisma schema with local database
npx prisma db push

# Populate realistic demo seed data (12 developers, 12 projects, 3 hackathons, teams, posts, messages)
node prisma/seed.js
```

---

## 🔑 Environment Variables

Server configuration file located at `server/.env`:

```env
PORT=5000
JWT_SECRET=projecthub_secret_key_dev_2026_super_secure
DATABASE_URL="file:./dev.db"
```

---

## 🏃 Running the Application

### Start Backend API Server
```bash
cd server
npm run dev
# Server running at http://localhost:5000
```

### Start Frontend Vite Client
```bash
cd client
npm run dev
# App running at http://localhost:3000
```

---

## 🔌 API Route Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new developer account |
| `POST` | `/api/auth/login` | Authenticate user & issue JWT token |
| `GET` | `/api/auth/me` | Fetch authenticated developer details |
| `GET` | `/api/users/profile/:username` | Fetch developer profile by username |
| `PUT` | `/api/users/profile` | Update profile bio, college, skills, links |
| `GET` | `/api/users/teammates` | Search developers by skill, college, experience |
| `POST` | `/api/users/follow` | Toggle follow/unfollow developer |
| `GET` | `/api/posts` | Fetch home feed posts (all or following) |
| `POST` | `/api/posts` | Publish a developer post / project update |
| `POST` | `/api/posts/:id/like` | Like / unlike a post |
| `POST` | `/api/posts/:id/comment` | Add comment to a post |
| `GET` | `/api/projects` | Filter & search projects by stack & status |
| `POST` | `/api/projects` | Publish a new project card |
| `GET` | `/api/hackathons` | Fetch hackathons list & recruiting teams |
| `GET` | `/api/teams` | Directory of teams recruiting members |
| `POST` | `/api/teams` | Create a new team |
| `POST` | `/api/teams/:id/request` | Submit a request to join a team |
| `PUT` | `/api/teams/:id/request/:reqId` | Accept or reject team join request |
| `GET` | `/api/messages/conversations` | List active chat conversations |
| `GET` | `/api/messages/:partnerId` | Get 1-on-1 message history |
| `POST` | `/api/messages` | Send direct message |
| `GET` | `/api/notifications` | Fetch unread & read notifications |
| `GET` | `/api/github/:username/repos` | Fetch GitHub public repositories |
