# Kundankumar A - Portfolio Website

A modern, responsive, high-performance portfolio website built with React, Vite, and CSS3, faithfully reproducing the original design, animations, and interactive features.

## 🚀 Features

- **Interactive macOS-Style Floating Dock**: Spring-physics magnification on hover with scroll-spy active state highlighting.
- **Interactive 3D Skill Doors**: 3D perspective doors with brass plaques, keyhole details, open animation, and smooth scroll into the projects section.
- **Dynamic Role Switcher**: Flip typography with 12 rotating concentric background rings and dynamic counter.
- **Interactive Story Timeline**: Dual-column layout featuring an SVG orbital clock decoration, rolling year counter, and sticky timeline tracker synchronized via IntersectionObserver.
- **Custom Theme Switcher**: Interactive pull-rope toggle supporting light, dark, and system preference modes.
- **Interactive Hire Me Modal**: Accessible dialog with focus trapping, backdrop click-to-close, Escape key handler, and mailto generation.
- **Contact Form**: Form validation and automatic email preparation.
- **Scroll Progress & Back to Top**: Real-time reading progress bar and circular SVG progress ring for the back-to-top button.
- **Cursor Glow**: Subtle radial cursor-following lighting effect.
- **Responsive Design**: Flawless visual presentation across mobile, tablet, laptop, and ultra-wide screens.

## 🛠️ Technology Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Vanilla CSS3 (Custom Properties, CSS Grid, Flexbox, 3D Transforms, Media Queries)
- **Icons**: Lucide React & Custom SVGs
- **Deployment**: Ready for Vercel, Netlify, or GitHub Pages

## 📁 Project Structure

```
simple portfolio/
├── public/
│   ├── favicon.svg
│   └── images/
│       └── profile.jpg
├── src/
│   ├── components/
│   │   ├── CursorGlow.jsx
│   │   ├── Dock.jsx
│   │   ├── HireModal.jsx
│   │   ├── Loader.jsx
│   │   ├── Navbar.jsx
│   │   ├── ScrollProgress.jsx
│   │   ├── ScrollToTop.jsx
│   │   └── ThemeToggle.jsx
│   ├── data/
│   │   └── portfolioData.js
│   ├── hooks/
│   │   ├── useScrollReveal.js
│   │   └── useTheme.js
│   ├── sections/
│   │   ├── Contact.jsx
│   │   ├── Footer.jsx
│   │   ├── Hero.jsx
│   │   ├── Marquee.jsx
│   │   ├── Projects.jsx
│   │   ├── SkillsDoors.jsx
│   │   └── StoryTimeline.jsx
│   ├── styles/
│   │   └── portfolio.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 💻 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Run the development server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for production
```bash
npm run build
```

The production output will be generated in the `dist` directory.

