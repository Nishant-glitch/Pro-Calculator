# 🧮 Pro Calculator

A **professional, fully functional calculator** built with **React + TypeScript + Tailwind CSS**.

![Calculator Preview](https://img.shields.io/badge/React-19-blue?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-teal?logo=tailwindcss) ![Vite](https://img.shields.io/badge/Vite-7.0-purple?logo=vite)

---

## 🌐 Live Demo

👉 **[Click here to open the calculator](https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/)**

> Replace `YOUR-USERNAME` and `YOUR-REPO-NAME` with your actual GitHub username and repository name.

---

## ✨ Features

- ✅ **Basic Operations** — Addition, Subtraction, Multiplication, Division
- ✅ **Percentage (%)** support
- ✅ **+/- Toggle** (positive/negative numbers)
- ✅ **Decimal point** support
- ✅ **Division by zero** error handling
- ✅ **Chained calculations**
- ✅ **Calculation History** (last 10 entries)
- ✅ **Full Keyboard Support** — (0-9, +, -, *, /, Enter, Esc, Backspace)
- ✅ **Responsive Design** — works on mobile & desktop
- ✅ **Dark Glassmorphism UI** — professional look

---

## 🚀 GitHub Pages Deployment (Automatic)

This project is configured with **GitHub Actions** for automatic deployment.

### Steps to Deploy:

**Step 1:** Push your code to GitHub
```bash
git init
git add .
git commit -m "Initial commit - Pro Calculator"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git push -u origin main
```

**Step 2:** Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** tab
3. Click **Pages** in the left sidebar
4. Under **"Build and deployment"**, select **Source: GitHub Actions**
5. Save

**Step 3:** GitHub Actions will automatically build and deploy!
- Go to **Actions** tab to see the deployment progress
- Your app will be live at: `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `0-9` | Number input |
| `+` | Addition |
| `-` | Subtraction |
| `*` | Multiplication |
| `/` | Division |
| `Enter` or `=` | Calculate result |
| `Esc` | Clear / Reset |
| `Backspace` | Delete last digit |
| `.` | Decimal point |
| `%` | Percentage |

---

## 🛠️ Tech Stack

| Technology | Version |
|-----------|---------|
| React | 19.x |
| TypeScript | 5.9.x |
| Tailwind CSS | 4.x |
| Vite | 7.x |
| vite-plugin-singlefile | 2.x |

---

## 📁 Project Structure

```
pro-calculator/
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions auto-deploy
├── src/
│   ├── App.tsx               # Main calculator component
│   ├── main.tsx              # React entry point
│   └── index.css             # Global styles
├── index.html                # HTML entry point
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript config
└── package.json              # Dependencies
```

---

## 📄 License

MIT License — Free to use and modify.

---

**Built with ❤️ using React + Tailwind CSS**
