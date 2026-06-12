# RMJ Groups Website

[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg?style=flat-square)]()
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat-square&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=flat-square)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat-square&logo=mongodb&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=flat-square&logo=vite&logoColor=FFD62E)

A modern, full-stack web application built for RMJ Groups. It features a scalable architecture designed to handle digital marketing, sports events, construction, real estate, and social media branding.

> _"Grand Vision, Global Reach."_

---

## Architecture Overview

The project follows a decoupled, full-stack architecture separated into two distinct environments:

| Area | Location | Tech Stack | Details |
| --- | --- | --- | --- |
| **Frontend** | `/` (Root) | React, Vite | Single Page Application (SPA) with React Router and custom CSS. |
| **Backend** | `/server` | Express.js, MongoDB | REST API following the MVC pattern. Uses bcrypt and JWT for security. |

---

## Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/) (or npm/yarn)
- MongoDB instance (local or Atlas)

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Mohammed0572/rmj-groups-website.git
   cd rmj-groups-website
   ```

2. **Install Frontend Dependencies:**
   The root directory acts as the frontend React application.
   ```bash
   pnpm install
   ```

3. **Install Backend Dependencies:**
   The backend API lives inside the `server/` folder.
   ```bash
   cd server
   pnpm install
   cd ..
   ```

4. **Environment Setup:**
   Copy the example environment file in the root directory:
   ```bash
   cp .env.example .env
   ```
   Then fill in your MongoDB URI and a strong JWT secret in the newly created `.env` file.

### Running the Application (Development)

You can run both the Vite React frontend and the Express backend simultaneously from the root directory using:

```bash
pnpm run dev:all
```

- **Frontend Application:** [http://localhost:5173](http://localhost:5173)
- **Backend API Server:** [http://localhost:5000](http://localhost:5000)

---

## Deployment Configuration

- **Frontend:** Pre-configured for deployment on **Netlify**. The `netlify.toml` file in the root handles the Vite build (`pnpm run build`) and SPA routing redirects automatically.
- **Backend:** The `server/` directory is isolated and ready to be deployed on platforms like Render, Railway, or Heroku.

---

## Contact & Support

- **Email:** rohithmj@rmjgroups.in
- **Phone:** +91 733 844 5987
- **Location:** Bengaluru, Karnataka

---

## License

This project is licensed under the [MIT License](LICENSE).
