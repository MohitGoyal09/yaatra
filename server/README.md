# Spacebar Server Integration for Yaatra

This directory contains the Spacebar Discord server backend integration with your Yaatra project.

## 🚀 Quick Setup

### Prerequisites
- Node.js 18+ 
- At least 2GB free disk space
- Git

### 1. Copy Spacebar Source Code
```bash
# Copy source files (run from yaatra root directory)
xcopy "C:\Users\Asus\Downloads\server-master\server-master\src" "server\src" /E /I
xcopy "C:\Users\Asus\Downloads\server-master\server-master\assets" "server\assets" /E /I
xcopy "C:\Users\Asus\Downloads\server-master\server-master\scripts" "server\scripts" /E /I
xcopy "C:\Users\Asus\Downloads\server-master\server-master\patches" "server\patches" /E /I

# Copy additional config files
copy "C:\Users\Asus\Downloads\server-master\server-master\tsconfig.json" "server\"
copy "C:\Users\Asus\Downloads\server-master\server-master\eslint.config.mjs" "server\"
```

### 2. Install and Setup
```bash
# From yaatra root directory
npm run server:install
npm run server:build
npm run server:setup
```

### 3. Configure Environment
```bash
# Copy environment template
copy "server\.env.example" "server\.env"

# Edit server/.env with your settings
```

### 4. Run the Server
```bash
# Run complete Spacebar server
npm run server:start

# Or run specific components
npm run server:api      # REST API only (port 3001)
npm run server:gateway  # WebSocket Gateway only
npm run server:cdn      # CDN/File server only
```

## 🔧 Configuration

### Environment Variables (`server/.env`)
```env
# Server Configuration
PORT=3001
HOST=0.0.0.0

# Database (SQLite for development)
DATABASE_URL=sqlite://database.db

# For production with your Neon DB:
# DATABASE_URL=postgresql://user:password@host:port/database

# Security
JWT_SECRET=your-super-secret-jwt-key-here
ENCRYPT_KEY=your-32-character-encryption-key

# CORS (allow your Yaatra frontend)
CORS_ORIGIN=http://localhost:3000
```

## 🏗️ Architecture Integration

### Yaatra (Frontend) - Port 3000
- Next.js application
- Your existing Prisma schema with Neon DB
- UI components and pages

### Spacebar (Backend) - Port 3001  
- Discord-compatible API server
- WebSocket Gateway for real-time chat
- CDN for file/media serving
- Separate SQLite database (or can share Neon DB)

### Communication Flow
```
[Yaatra Frontend] ←→ [Yaatra API Routes] ←→ [Neon DB]
        ↓
[Spacebar Server] ←→ [Discord Clients] ←→ [SQLite/Neon DB]
```

## 🚀 Available Commands (from yaatra root)

```bash
# Server Management
npm run server:install    # Install server dependencies
npm run server:build      # Build TypeScript to JavaScript
npm run server:setup      # Build + generate schemas
npm run server:start      # Run complete server

# Individual Components
npm run server:api        # API server only
npm run server:gateway    # WebSocket gateway only  
npm run server:cdn        # CDN server only

# Development
npm run server:watch      # Watch mode (auto-rebuild)
npm run server:lint       # Lint server code

# Database
npm run server:sync       # Sync database schema
```

## 🔌 Client Connection

Your Yaatra frontend can connect to Spacebar server at:
- **Local Development**: `http://localhost:3001`
- **Network Access**: `http://[your-ip]:3001`
- **Production**: Configure with your domain

## 🗃️ Database Options

### Option 1: Separate Databases (Recommended)
- Yaatra: Neon PostgreSQL (your existing setup)
- Spacebar: SQLite (simple, local)

### Option 2: Shared Database
- Both use your Neon PostgreSQL
- Configure `DATABASE_URL` in `server/.env`

## 🛡️ Security Notes

- Change default JWT secrets in production
- Configure proper CORS origins
- Set up firewall rules for port 3001
- Use HTTPS in production

## 🐛 Troubleshooting

### Common Issues
1. **Port conflicts**: Change PORT in `server/.env`
2. **Missing dependencies**: Run `npm run server:install`
3. **Build errors**: Check Node.js version (18+)
4. **Database errors**: Verify DATABASE_URL format

### Logs
Server logs will show in terminal when running. Check for:
- Database connection status
- Port binding
- Any error messages

## 📚 Documentation

- [Spacebar Documentation](https://docs.spacebar.chat)
- [Discord API Reference](https://discord.com/developers/docs)
- [TypeORM Documentation](https://typeorm.io) (for database)