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

The project was completely re-architected to follow modern software development practices. 

| Feature | Details |
| --- | --- |
| **Frontend** | Single Page Application (SPA) built with React and Vite. |
| **Backend** | Express.js server following the MVC (Model-View-Controller) design pattern. |
| **Database** | MongoDB for storing user data securely. |
| **Authentication** | Secure JSON Web Tokens (JWT) for stateless sessions. |
| **Security** | Industry-standard bcrypt password hashing. |

---

## Features

### Frontend (React + Vite)
- **Component-Based:** Reusable UI components like Navbars, Footers, and Modals.
- **Client-Side Routing:** Lightning-fast navigation using React Router without full page reloads.
- **Modern Styling:** Customized, responsive CSS tailored for RMJ Groups.

### Backend (Express + MVC)
- **Models:** Mongoose schemas defining database structures.
- **Controllers:** Clean, isolated business logic for authentication and data management.
- **Routes:** Modular API endpoints.
- **Security:** Passwords are never stored in plain text. Secure token generation for API access.

---

## Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/) (or npm/yarn)
- MongoDB instance (local or Atlas)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Mohammed0572/rmj-groups-website.git
   cd rmj-groups-website
   ```

2. **Install Root Dependencies:**
   ```bash
   pnpm install
   ```

3. **Install Frontend Dependencies:**
   ```bash
   cd frontend
   pnpm install
   cd ..
   ```

4. **Environment Setup:**
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_key
   ```

### Running the Application

To run both the backend server and the frontend client simultaneously:

```bash
pnpm run dev
```

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5000](http://localhost:5000)

---

## Contact & Support

- **Email:** rohithmj@rmjgroups.in
- **Phone:** +91 733 844 5987
- **Location:** Bengaluru, Karnataka

---

## License

© 2026 RMJ Groups. All Rights Reserved.
