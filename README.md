# 🍱 Bento Clone

A modern, customizable link-in-bio platform inspired by [Bento.me](https://bento.me). Create beautiful, personalized profile pages with a drag-and-drop grid layout.

![Next.js](https://img.shields.io/badge/Next.js-16.1.4-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)

## ✨ Features

### 🎨 Customizable Profiles
- **Drag & Drop Grid Layout** - Arrange your blocks in a beautiful bento-style grid
- **Resizable Blocks** - Choose from multiple sizes (1x1, 2x1, 1x2, 2x2)
- **Animated Backgrounds** - Mesh gradients with dynamic animations
- **Custom Themes** - Personalize colors and styles

### 🔗 Social Media Integration
- **GitHub** - Display your profile with avatar and stats
- **Twitter/X** - Show your Twitter profile
- **Instagram** - Connect your Instagram account
- **LinkedIn** - Professional profile integration
- **YouTube** - Embed videos and channel info
- **Spotify** - Share your music with embedded players
- **Facebook** - Link your Facebook profile
- **Steam** - Gaming profile with avatar and username
- **Discord** - Server invite links

### 📦 Block Types
- **Links** - Custom URL blocks with icons
- **Text** - Rich text content blocks
- **Images** - Photo galleries and images
- **Maps** - Google Maps embeds for location
- **Embeds** - YouTube, Spotify, and more

### 🔐 Authentication
- **GitHub OAuth** - Sign in with GitHub
- **Google OAuth** - Sign in with Google
- Secure session management with NextAuth.js

### 📥 Bento Import
- Import your existing Bento.me profile via ZIP export
- Automatic block type detection
- Preserves layout and styling

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/RaDiO-AcTiVe8970/Bento_Clone.git
   cd Bento_Clone/bento_frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your credentials (see [Environment Variables](#environment-variables))

4. **Set up the database**
   ```bash
   npx prisma migrate dev
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## ⚙️ Environment Variables

Create a `.env` file in the `bento_frontend` directory with the following variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js sessions | ✅ |
| `NEXTAUTH_URL` | Your app's URL (e.g., `http://localhost:3000`) | ✅ |
| `GITHUB_CLIENT_ID` | GitHub OAuth App Client ID | ✅ |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App Client Secret | ✅ |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | ✅ |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | ✅ |
| `STEAM_API_KEY` | Steam Web API Key (for Steam profiles) | ❌ |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps API Key (for map embeds) | ❌ |

### Getting API Keys

- **GitHub OAuth**: [GitHub Developer Settings](https://github.com/settings/developers)
- **Google OAuth**: [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
- **Steam API**: [Steam Web API Key](https://steamcommunity.com/dev/apikey)
- **Google Maps**: [Google Maps Platform](https://console.cloud.google.com/apis/credentials)

## 📁 Project Structure

```
bento_frontend/
├── prisma/
│   └── schema.prisma      # Database schema
├── src/
│   ├── app/               # Next.js App Router pages
│   │   ├── api/           # API routes
│   │   ├── dashboard/     # Dashboard pages
│   │   ├── login/         # Authentication pages
│   │   └── [username]/    # Dynamic profile pages
│   ├── components/
│   │   ├── bento/         # Bento grid components
│   │   └── ui/            # Reusable UI components
│   ├── hooks/             # Custom React hooks
│   └── lib/               # Utility functions
├── public/                # Static assets
└── .env.example           # Environment template
```

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Drag & Drop**: [@dnd-kit](https://dndkit.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

## 📝 Usage

### Creating Your Profile

1. Sign in with GitHub or Google
2. Set your unique username
3. Add blocks to your profile grid
4. Customize block sizes and positions
5. Share your profile link: `yoursite.com/username`

### Importing from Bento.me

1. Export your Bento profile as a ZIP file
2. Go to Dashboard → Import
3. Upload your ZIP file
4. Review and save imported blocks

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [Bento.me](https://bento.me)
- Built with amazing open-source tools

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/RaDiO-AcTiVe8970">RaDiO-AcTiVe8970</a>
</p>