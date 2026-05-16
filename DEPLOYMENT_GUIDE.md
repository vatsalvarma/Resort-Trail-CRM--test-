# 🚀 Deployment Guide for Village Trails CRM

## ⚠️ Important: GitHub Pages Limitations

**GitHub Pages can ONLY host the frontend** (static files). It CANNOT run:
- Spring Boot backend (Java server)
- PostgreSQL database
- WebSocket connections

## Option 1: GitHub Pages (Frontend Only - Demo Mode)

This deploys the frontend with **mock data only** (no real backend).

### Steps:

1. **Push code to GitHub**:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git push -u origin main
```

2. **Update next.config.ts**:
   - Open `frontend/next.config.ts`
   - Uncomment the `basePath` and `assetPrefix` lines
   - Replace `'your-repo-name'` with your actual GitHub repository name

3. **Enable GitHub Pages**:
   - Go to your GitHub repository
   - Click **Settings** → **Pages**
   - Under "Build and deployment":
     - Source: **GitHub Actions**
   - Save

4. **Trigger deployment**:
   - Push any commit to `main` branch
   - GitHub Actions will automatically build and deploy
   - Check the **Actions** tab to monitor progress

5. **Access your site**:
   - URL: `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`

### Demo Login Credentials:
- **Admin**: admin@villagetrails.in / admin123
- **Manager**: manager@villagetrails.in / manager123
- **Reception**: reception@villagetrails.in / reception123

---

## Option 2: Full Deployment (Recommended)

For the **complete application** with backend + database, use:

### A. **Vercel (Frontend) + Railway/Render (Backend + Database)**

**Frontend on Vercel**:
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set root directory: `frontend`
4. Deploy

**Backend + Database on Railway**:
1. Go to [railway.app](https://railway.app)
2. Create new project
3. Add PostgreSQL database
4. Add Spring Boot service (connect to your GitHub repo)
5. Set environment variables:
   - `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`
   - `JWT_SECRET`
   - `CORS_ORIGINS` (your Vercel URL)
6. Deploy

### B. **Render (All-in-One)**

1. Go to [render.com](https://render.com)
2. Create PostgreSQL database
3. Create Web Service for backend:
   - Build command: `cd backend && ./mvnw clean package`
   - Start command: `java -jar backend/target/*.jar`
4. Create Static Site for frontend:
   - Build command: `cd frontend && npm install && npm run build`
   - Publish directory: `frontend/out`

### C. **AWS / DigitalOcean / Heroku**

Deploy using Docker Compose:
```bash
docker-compose up -d
```

---

## Option 3: Local Development

```bash
# Start all services
docker-compose up -d

# Access:
# Frontend: http://localhost
# Backend API: http://localhost/api
# Database: localhost:5432
```

---

## 📝 Notes

- **GitHub Pages = Frontend only** (mock data, no real functionality)
- **Full deployment = Frontend + Backend + Database** (real application)
- Choose based on your needs:
  - Demo/Portfolio → GitHub Pages
  - Production use → Vercel + Railway / Render / AWS
