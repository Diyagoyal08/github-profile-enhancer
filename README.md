<<<<<<< HEAD
# GitHub Profile Enhancer 🚀

> A developer analytics dashboard built with React, Redux Toolkit, and the GitHub REST API.

![Tech Stack](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![Redux](https://img.shields.io/badge/Redux_Toolkit-2.0-764ABC?style=flat&logo=redux)
![Recharts](https://img.shields.io/badge/Recharts-2.10-22B5BF?style=flat)
![License](https://img.shields.io/badge/license-MIT-green?style=flat)

## ✨ Features

- 🔍 **Live GitHub API** — Search any public GitHub profile and fetch real data
- 📊 **Analytics Dashboard** — Stars, forks, repos, follower metrics at a glance
- 📈 **Interactive Charts** — Bar, pie, and line charts built with Recharts
- ⚔️ **Profile Comparison** — Compare two developers side-by-side with a radar chart
- 🌙 **Dark / Light Mode** — Theme toggle with localStorage persistence
- ⚡ **Redux Toolkit** — Global state with async thunks for all API calls
- 💀 **Skeleton Loaders** — Graceful loading states during API fetch
- 🔑 **Token Support** — Add a GitHub PAT to avoid rate limits

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI components & hooks |
| Redux Toolkit | Global state management |
| Recharts | Data visualization charts |
| Axios | HTTP requests to GitHub API |
| GitHub REST API v3 | Live developer data |

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/github-profile-enhancer.git
cd github-profile-enhancer
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run locally
```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. (Optional) Add GitHub Token

To avoid API rate limits (60 req/hr unauthenticated → 5000/hr with token):

1. Go to **GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)**
2. Click **Generate new token** — only `public_repo` scope needed
3. Click the 🔐 icon in the app and paste your token

The token is stored in memory only — never persisted or sent anywhere except GitHub's API.

## 📁 Project Structure

```
src/
├── components/
│   ├── Sidebar.jsx       # Profile info, language breakdown, activity grid
│   ├── MetricCards.jsx   # Stars, forks, repos, followers cards
│   ├── RepoGrid.jsx      # Top repositories with stats
│   ├── Charts.jsx        # Bar, pie, and line charts (Recharts)
│   ├── Compare.jsx       # Side-by-side profile comparison + radar chart
│   └── TokenModal.jsx    # GitHub PAT input modal
├── store/
│   ├── index.js          # Redux store configuration
│   ├── githubSlice.js    # GitHub data state + async thunks
│   └── themeSlice.js     # Dark/light theme state
├── utils/
│   └── helpers.js        # Language colors, number formatting, time ago
├── styles/
│   └── global.css        # CSS variables, theme, all component styles
└── App.jsx               # Root component, layout, tab navigation
```

## 🧠 What I Learned

- **Redux Toolkit async thunks** — handling `pending`, `fulfilled`, `rejected` states cleanly
- **Real API integration** — error handling for 404s, rate limits, and network failures
- **Recharts** — composing `BarChart`, `PieChart`, `RadarChart` with custom tooltips
- **CSS custom properties** — building a complete dark/light theme system with one toggle
- **Component reusability** — designing metric cards and repo cards as generic, data-driven components

## 📦 Deployment

Deploy to Vercel (recommended):

```bash
npm install -g vercel
vercel
```

Or GitHub Pages:

```bash
npm run build
# then push the /build folder to gh-pages branch
```

## 📄 License

MIT © 2024
=======
 git