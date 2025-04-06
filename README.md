# 💰 Crypto Portfolio Tracker

A responsive and feature-rich cryptocurrency portfolio tracker built with **Next.js**, **TypeScript**, **Redux**, and **Material UI**. Users can search, filter, and view live cryptocurrency data and add coins to a personal portfolio.

## 🚀 Features

- 🔍 **Live Cryptocurrency List** with sorting, filtering, and search.
- 📄 **Coin Detail Pages** with real-time data and smooth UI transitions.
- 🧾 **Add to Portfolio** functionality with Redux state management.
- 💡 **Client-Side & Server-Side Rendering** using Next.js App Router.
- 🎨 **Dark Mode Toggle** for improved UX.
- 📱 **Mobile-Responsive** and accessible design with Material UI.
- ✅ **Unit Tests** for key components using Jest and React Testing Library.

## 🛠️ Tech Stack

- **Next.js** (App Router with SSR + CSR)
- **TypeScript**
- **Redux Toolkit** for global state
- **React Query** for efficient data fetching
- **Native fetch API** for HTTP requests
- **CoinGecko API** for crypto data
- **Material UI (MUI)** for sleek UI
- **Jest + React Testing Library** for testing
- **ESLint + Prettier** for code quality

## 🧩 Folder Structure

```
src/
├── app/                    # Next.js App Router pages
│   └── crypto/             # Crypto list and detail pages
├── components/             # Reusable UI components
│   └── Buttons, Details, Search, Header, Footer
├── redux/                  # Redux slices and store
├── services/               # API handler (CoinGecko)
public/                     # Static assets
```

## 📦 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. Open `http://localhost:3000` to view the app.

## 🧪 Running Tests

```bash
npm run test
```

Tested components include:
- `CryptoList`
- `CryptoDetail`

## 🌐 Live Demo

Deployed: [https://crypto-portfolio-teal.vercel.app/](https://crypto-portfolio-teal.vercel.app/)


## 📚 Resources & Credits

- ✅ **Project Management**:
   - [Trello Board](https://trello.com/invite/b/67eae946517db130a8e7ab33/ATTIb72a00415428661f58065c1b7578ac9697ECAE1C/crypto-project)

- 🔗 **Useful Libraries & Docs**:
   - [Framer Motion Docs](https://motion.dev/docs/framer)
   - [MUI Components](https://mui.com/components/)

- 🎨 **Design Inspiration**:
   - [Crypto Planet Figma Template](https://www.figma.com/design/RAtUpq4CnOrfQtYsZqL7Cr/Crypto-Planet---Crypto-Trading-Exchange-UI-Template-In-Figma-(Community)?node-id=2-3&p=f&t=e3QFUEsL0MHZN5sO-0)

