# 🚀 GitHub Pages Hosting Guide

## Steps to Deploy on GitHub Pages

### Step 1: Build the project
```bash
npm run build
```

### Step 2: Install gh-pages package
```bash
npm install -D gh-pages
```

### Step 3: Add deploy script in package.json
```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

### Step 4: Deploy
```bash
npm run deploy
```

### Step 5: GitHub Settings
- Go to your repo → Settings → Pages
- Source: `gh-pages` branch → `/ (root)`
- Save!

## ✅ Your site will be live at:
`https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`
