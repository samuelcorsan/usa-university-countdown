# 🎓 USA University Countdown

A modern, responsive web application that helps students track countdown timers to university admission decision dates.

## Features

- **Real-time Countdown Timers**: Track days, hours, minutes, and seconds until university decision dates
- **Comprehensive University Database**: Pre-loaded with 50+ top US universities including Ivy League, MIT, Stanford, and more
- **Custom University Support**: Add your own universities with custom notification dates
- **PWA Support**: Install as a native app with offline functionality
- **Dark/Light Theme**: Automatic theme switching with system preference detection
- **Calendar Integration**: Add decision dates to your calendar (Google, Apple, Outlook)

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **PWA**: Next-PWA with Workbox
- **Analytics**: Vercel Analytics

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/usa-university-countdown.git
   cd usa-university-countdown
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Add your Discord webhook URL for university suggestions:

   ```env
   DISCORD_WEBHOOK_URL=your_discord_webhook_url_here
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Build & Deployment

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Built with ❤️ for students everywhere**
