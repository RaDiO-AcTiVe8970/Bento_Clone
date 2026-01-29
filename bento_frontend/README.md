# 🍱 BentoPortfolioThis is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).



A beautiful, customizable link-in-bio page builder inspired by [bento.me](https://bento.me). Built with Next.js 14, Tailwind CSS, and PostgreSQL.## Getting Started



![Bento Clone](https://img.shields.io/badge/Next.js-14-black?logo=next.js)First, run the development server:

![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)

![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)```bash

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)npm run dev

# or

## ✨ Featuresyarn dev

# or

- 🎨 **Fully Customizable** - Drag-and-drop blocks, custom colors, fonts, and layoutspnpm dev

- ⚡ **Lightning Fast** - Optimized for speed, even on slow connections# or

- 📱 **Mobile First** - Responsive design that looks great on any devicebun dev

- 🔍 **SEO Optimized** - Meta tags, Open Graph, structured data```

- 🌙 **Dark Mode** - Automatic theme switching

- 🔐 **Secure Auth** - GitHub & Google OAuth with NextAuth.jsOpen [http://localhost:3000](http://localhost:3000) with your browser to see the result.

- 📊 **Multiple Block Types** - Links, text, images, social embeds, maps, and more

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## 🏗️ Architecture

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

```

┌─────────────────────────────────────────────────────────┐## Learn More

│                    Vercel (Frontend)                     │

│  ┌─────────────────────────────────────────────────┐   │To learn more about Next.js, take a look at the following resources:

│  │              Next.js 14 App Router               │   │

│  │  • Server Components (SSR/SSG)                  │   │- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.

│  │  • API Routes                                    │   │- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

│  │  • Image Optimization                            │   │

│  └─────────────────────────────────────────────────┘   │You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

└─────────────────────────┬───────────────────────────────┘

                          │## Deploy on Vercel

                          ▼

┌─────────────────────────────────────────────────────────┐The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

│              Your Server (Bangladesh)                    │

│  ┌─────────────────────────────────────────────────┐   │Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

│  │              PostgreSQL Database                 │   │
│  │  • Users, Blocks, Social Links                  │   │
│  │  • Profile Customization                        │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/bento-clone.git
   cd bento-clone/bento_frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your values:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@your-server:5432/bento_db"
   
   # NextAuth
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   
   # OAuth Providers
   GITHUB_CLIENT_ID="your-github-client-id"
   GITHUB_CLIENT_SECRET="your-github-client-secret"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)**

## 🗄️ Database Setup (Your Server)

### Windows Server (PostgreSQL)

1. **Download PostgreSQL** from [postgresql.org](https://www.postgresql.org/download/windows/)

2. **Install and configure**
   - Remember your password during installation
   - Default port: 5432

3. **Create database**
   ```sql
   CREATE DATABASE bento_db;
   ```

4. **Open firewall port**
   ```powershell
   New-NetFirewallRule -DisplayName "PostgreSQL" -Direction Inbound -LocalPort 5432 -Protocol TCP -Action Allow
   ```

5. **Enable remote connections**
   Edit `pg_hba.conf`:
   ```
   host    all    all    0.0.0.0/0    md5
   ```

6. **Update connection string**
   ```env
   DATABASE_URL="postgresql://postgres:yourpassword@your-server-ip:5432/bento_db"
   ```

## 📁 Project Structure

```
bento_frontend/
├── prisma/
│   └── schema.prisma      # Database schema
├── public/
│   └── manifest.json      # PWA manifest
├── src/
│   ├── app/
│   │   ├── api/           # API routes
│   │   ├── dashboard/     # Dashboard pages
│   │   ├── login/         # Auth pages
│   │   ├── [username]/    # Dynamic profile pages
│   │   ├── layout.tsx     # Root layout
│   │   └── page.tsx       # Home page
│   ├── components/
│   │   ├── bento/         # Bento grid components
│   │   ├── profile/       # Profile components
│   │   ├── providers/     # Context providers
│   │   └── ui/            # UI components
│   ├── lib/
│   │   ├── auth.ts        # NextAuth configuration
│   │   ├── prisma.ts      # Prisma client
│   │   └── utils.ts       # Utility functions
│   └── types/
│       └── next-auth.d.ts # Type extensions
├── .env.example
├── next.config.ts
├── package.json
└── tailwind.config.ts
```

## 🎨 Block Types

| Type | Description |
|------|-------------|
| `LINK` | Custom link with optional icon |
| `TEXT` | Text block with title and content |
| `IMAGE` | Image display block |
| `MAP` | Google Maps embed |
| `SPOTIFY` | Spotify track/playlist embed |
| `YOUTUBE` | YouTube video embed |
| `GITHUB` | GitHub profile link |
| `TWITTER` | Twitter/X profile link |
| `INSTAGRAM` | Instagram profile link |
| `LINKEDIN` | LinkedIn profile link |

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Self-Hosted

```bash
npm run build
npm start
```

Or with PM2:
```bash
pm2 start npm --name "bento" -- start
```

## 🔧 Performance Optimizations

- ✅ Server-side rendering (SSR) for profile pages
- ✅ Static generation (SSG) for known profiles
- ✅ Image optimization with next/image
- ✅ Font optimization with next/font
- ✅ CSS minification
- ✅ Gzip compression
- ✅ Lazy loading for embeds
- ✅ Reduced motion support

## 📱 PWA Support

The app includes PWA capabilities:
- Installable on mobile devices
- Offline support (coming soon)
- App-like experience

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- Inspired by [bento.me](https://bento.me)
- UI components based on [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)
