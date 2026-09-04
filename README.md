![Stock Tracker Architecture & Tech Stack](./public/assets/stock-tracker.jpg)


# 📈 Stock Tracker Platform

A modern, full-stack financial dashboard designed to track stock markets in real-time, search for equities, monitor personalized watchlists, and manage secure user authentication. Built with Next.js 15, TypeScript, Tailwind CSS, Better Auth, Finnhub Financial API, and Inngest for background workflows.

---

## 🚀 Key Features | المميزات الرئيسية

- **Secure Authentication:** Complete sign-in, sign-up, and sign-out flows powered by **Better Auth** with session-based route protection.
- **Real-Time Stock Search:** Fast symbol and company search powered by Finnhub API with query debouncing.
- **Popular Stocks Overview:** Instant dashboard display for trending market equities with server-side caching.
- **Personalized Watchlists:** Track favorite stocks and monitor performance across user sessions.
- **Background Event Processing:** Automated tasks and background workflow queues powered by Inngest.
- **Optimized Performance:** Built with React Server Components (RSC) and caching layers for minimal latency.
- **Clean Responsive UI:** Fully responsive design built using Tailwind CSS for seamlessly tracking assets on mobile and desktop.

---

## 🛠️ Tech Stack | التقنيات المستخدمة

### **Frontend & Framework**
- **[Next.js 15 (App Router)](https://nextjs.org/):** React framework for Server-Side Rendering (SSR), Server Actions, and React Server Components.
- **[TypeScript](https://www.typescriptlang.org/):** End-to-end type safety for rock-solid application stability.
- **[Tailwind CSS](https://tailwindcss.com/):** Utility-first CSS framework for modern, high-performance UI components.
- **[Lucide React](https://lucide.dev/):** Lightweight, customizable icons.

### **Authentication & Security**
- **[Better Auth](https://www.better-auth.com/):** Modern, type-safe authentication library for TypeScript & Next.js to handle session management, user credentials, and route guards securely.

### **Backend, APIs & Workflows**
- **[Finnhub Stock API](https://finnhub.io/):** Real-time REST API for market prices, company profiles, and stock ticker searches.
- **[Inngest](https://www.inngest.com/):** Serverless background jobs, scheduled functions, and event-driven workflow engine.
- **React `cache` & Server Actions:** Secure server-side execution and API key isolation.

---
