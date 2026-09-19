# Docket

A daily task ledger, built as a small, focused React app rather than a generic to-do list. Entries are logged like ledger lines — filed with a priority tab, marked closed with a stamp, and cleared from the docket when done.

**Live demo:**https://docket-seven-rosy.vercel.app/

## Features

- Add tasks with a priority (Low / Normal / High), shown as a colored tab
- Mark tasks open/closed with a single click
- Filter by Open / Closed / All entries
- Persistent storage via `localStorage` — your docket survives a refresh
- Fully responsive, no external UI library — hand-built CSS design system

## Tech stack

- React 18 + Vite
- Plain CSS (custom design tokens, no framework)
- Fraunces + IBM Plex Sans (Google Fonts)

## Running locally

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

## Build for production

```bash
npm run build
npm run preview
```

## Deploying

This is a static Vite app — drop the repo into [Vercel](https://vercel.com) or [Netlify](https://netlify.com), both auto-detect the Vite build settings. No environment variables needed.

## Why this project

Built as a portfolio piece to demonstrate: component state management, controlled forms, derived/filtered lists, localStorage persistence, and a from-scratch visual design (not a UI-kit default).
