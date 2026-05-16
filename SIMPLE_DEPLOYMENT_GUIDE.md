# ✅ SIMPLE DEPLOYMENT GUIDE - GitHub Pages

## The Problem
Your `node_modules` folder is too large for GitHub (175MB file). 

## ✅ SOLUTION: Deploy Only Source Code

### Step 1: Open a NEW terminal and run these commands:

```bash
# Go to your project folder
cd C:\Users\Asus\Documents\CRM-testout1

# Remove the .git folder to start fresh
Remove-Item -Recurse -Force .git

# Initialize git again
git init

# Add only source files (node_modules is already in .gitignore)
git add .

# Create commit
git commit -m "Initial commit - source code only"

# Rename branch
git branch -M main

# Connect to GitHub
git remote add origin https://github.com/vatsalvarma/Resort-Trail-CRM--test-.git

# Push to GitHub
git push -u origin main --force
```

### Step 2: Enable GitHub Pages

1. Go to: https://github.com/vatsalvarma/Resort-Trail-CRM--test-/settings/pages
2. Under "Build and deployment":
   - Source: Select **"GitHub Actions"**
3. Click Save

### Step 3: Wait for Deployment

1. Go to: https://github.com/vatsalvarma/Resort-Trail-CRM--test-/actions
2. Wait for the green checkmark (2-5 minutes)
3. Your site will be live at:
   **https://vatsalvarma.github.io/Resort-Trail-CRM--test-/**

### Step 4: Login to Your Site

Use these credentials:
- **Email**: `admin@villagetrails.in`
- **Password**: `admin123`

OR

- **Email**: `manager@villagetrails.in`
- **Password**: `manager123`

---

## ⚠️ Important Notes

1. **This deploys ONLY the frontend** with mock data
2. **No backend or database** - it's just a demo
3. **GitHub Pages is FREE** but only for static sites
4. **For full app** (with backend), you need services like:
   - Vercel (frontend) + Railway (backend + database)
   - Render (all-in-one)
   - AWS / DigitalOcean

---

## 🎉 That's It!

Your frontend will be live on GitHub Pages with mock data for demonstration purposes.
