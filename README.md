# Nextvista-POS-Inventory

A multi-part point-of-sale and inventory management solution.

This repository contains three main projects:

- `POS/` — Vue.js frontend application for inventory and sales management
- `POS Backend/` — Node.js / Express backend API for POS data, authentication, and inventory history
- `POS Billing/` — billing frontend application built with Vite

## Getting Started

Each project is managed independently. Install dependencies and run commands inside the appropriate folder.

### POS frontend

```powershell
cd "POS"
npm install
npm run dev
```

### POS Backend

```powershell
cd "POS Backend"
npm install
npm start
```

### POS Billing

```powershell
cd "POS Billing"
npm install
npm run dev
```

## Repository structure

- `POS/` — primary Vue application and frontend source code
- `POS Backend/` — backend server, API routes, models, middleware, and documentation
- `POS Billing/` — billing UI and related assets

## Notes

- This repository was imported from a local workspace on May 20, 2026
- Keep `node_modules/` directories excluded from version control using the root `.gitignore`
