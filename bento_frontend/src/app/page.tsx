import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Zap, Palette, Share2, Grid3X3, MousePointerClick } from "lucide-react"
import { Navbar } from "@/components/Navbar"
import { WebsiteJsonLd, OrganizationJsonLd, SoftwareApplicationJsonLd } from "@/components/seo/JsonLd"

export default function HomePage() {
  return (
    <main className="min-h-screen mesh-gradient noise">
      {/* Structured Data for SEO */}
      <WebsiteJsonLd />
      <OrganizationJsonLd />
      <SoftwareApplicationJsonLd />
      
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-float animation-delay-200" />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl animate-float animation-delay-400" />
        
        <div className="relative container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-sm font-medium mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              <span>Your personal space on the internet</span>
            </div>
            
            {/* Heading */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight animate-slide-up">
              Create Your
              <br />
              <span className="text-gradient">Beautiful</span> Portfolio
            </h1>
            
            {/* Subheading */}
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 animate-slide-up animation-delay-200">
              Build a stunning, customizable link-in-bio page to share all your 
              important links and content. Fast, beautiful, and free.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up animation-delay-400">
              <Link href="/login">
                <Button size="lg" className="h-14 px-8 text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all group">
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/radio-active">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-2 hover:bg-secondary">
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Preview Section */}
      <section className="py-20 md:py-32 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Mockup bento grid */}
            <div className="relative p-8 rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-3xl" />
              <div className="relative grid grid-cols-4 gap-4">
                {/* Mock blocks */}
                <div className="col-span-2 row-span-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                  <div className="w-16 h-16 rounded-full bg-white/20 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Your Name</h3>
                  <p className="text-white/80">Your bio goes here</p>
                </div>
                <div className="bg-gradient-to-br from-pink-400 to-pink-500 rounded-2xl p-4 flex items-center justify-center shadow-lg">
                  <span className="text-3xl">📸</span>
                </div>
                <div className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl p-4 flex items-center justify-center shadow-lg">
                  <span className="text-3xl">🐦</span>
                </div>
                <div className="col-span-2 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl p-4 flex items-center gap-4 shadow-lg">
                  <span className="text-3xl">🎵</span>
                  <div>
                    <p className="font-semibold text-white">Now Playing</p>
                    <p className="text-white/80 text-sm">Your favorite song</p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl p-4 flex items-center justify-center shadow-lg">
                  <span className="text-3xl">📍</span>
                </div>
                <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl p-4 flex items-center justify-center shadow-lg">
                  <span className="text-3xl">⭐</span>
                </div>
                <div className="col-span-2 bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-2xl p-4 flex items-center justify-center shadow-lg">
                  <span className="text-lg font-semibold text-white">Your Link Here</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Everything you need to
              <br />
              <span className="text-gradient">stand out</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Create a personalized page that represents you perfectly
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="group bg-card rounded-3xl p-8 border border-border hover:border-purple-500/50 card-hover-glow">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Lightning Fast</h3>
              <p className="text-muted-foreground text-lg">
                Optimized for speed. Your page loads instantly, even on slow connections.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="group bg-card rounded-3xl p-8 border border-border hover:border-pink-500/50 card-hover-glow">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Palette className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Fully Customizable</h3>
              <p className="text-muted-foreground text-lg">
                Drag-and-drop blocks, custom colors, fonts, and layouts to match your style.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="group bg-card rounded-3xl p-8 border border-border hover:border-orange-500/50 card-hover-glow">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Share2 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Easy Sharing</h3>
              <p className="text-muted-foreground text-lg">
                One link to share everywhere. Perfect for social media bios.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="group bg-card rounded-3xl p-8 border border-border hover:border-green-500/50 card-hover-glow">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Grid3X3 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Portfolio Grid Layout</h3>
              <p className="text-muted-foreground text-lg">
                Unique grid layouts that make your profile stand out from the crowd.
              </p>
            </div>
            
            {/* Feature 5 */}
            <div className="group bg-card rounded-3xl p-8 border border-border hover:border-blue-500/50 card-hover-glow">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MousePointerClick className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Drag & Drop</h3>
              <p className="text-muted-foreground text-lg">
                Intuitive editor that makes customization a breeze. No coding required.
              </p>
            </div>
            
            {/* Feature 6 */}
            <div className="group bg-card rounded-3xl p-8 border border-border hover:border-indigo-500/50 card-hover-glow">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Import from Bento.me</h3>
              <p className="text-muted-foreground text-lg">
                Already have a Bento.me profile? Import it with one click.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="relative max-w-4xl mx-auto text-center p-12 md:p-20 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            
            <div className="relative">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to create your portfolio?
              </h2>
              <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                Join thousands of creators who use BentoPortfolio to share their links beautifully.
              </p>
              <Link href="/login">
                <Button size="lg" className="h-14 px-10 text-lg bg-white text-purple-600 hover:bg-white/90 shadow-xl">
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="font-bold text-2xl text-gradient">BentoPortfolio</div>
            <p className="text-muted-foreground text-sm">
              © 2026 BentoPortfolio. Made with ❤️
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
