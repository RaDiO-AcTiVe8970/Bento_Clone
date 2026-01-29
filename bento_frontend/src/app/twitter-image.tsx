import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'BentoPortfolio - Your Link in Bio'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
          position: 'relative',
        }}
      >
        {/* Background gradient orbs */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            left: '-100px',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-100px',
            right: '-100px',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />

        {/* Logo Icon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '120px',
            height: '120px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #ec4899 100%)',
            borderRadius: '28px',
            marginBottom: '40px',
            boxShadow: '0 25px 50px -12px rgba(139, 92, 246, 0.4)',
          }}
        >
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Top left large block */}
            <rect x="4" y="4" width="30" height="30" rx="5" fill="rgba(255, 255, 255, 0.95)" />
            {/* Top right block */}
            <rect x="38" y="4" width="38" height="13" rx="4" fill="rgba(255, 255, 255, 0.95)" />
            {/* Middle right block */}
            <rect x="38" y="21" width="38" height="13" rx="4" fill="rgba(255, 255, 255, 0.95)" />
            {/* Bottom left block */}
            <rect x="4" y="38" width="14" height="38" rx="4" fill="rgba(255, 255, 255, 0.95)" />
            {/* Bottom center block */}
            <rect x="22" y="38" width="30" height="17" rx="4" fill="rgba(255, 255, 255, 0.95)" />
            {/* Bottom right block */}
            <rect x="56" y="38" width="20" height="38" rx="4" fill="rgba(255, 255, 255, 0.95)" />
            {/* Bottom center lower block */}
            <rect x="22" y="59" width="30" height="17" rx="4" fill="rgba(255, 255, 255, 0.95)" />
          </svg>
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            fontSize: '72px',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #ec4899 100%)',
            backgroundClip: 'text',
            color: 'transparent',
            marginBottom: '20px',
            letterSpacing: '-2px',
          }}
        >
          BentoPortfolio
        </div>

        {/* Tagline */}
        <div
          style={{
            display: 'flex',
            fontSize: '32px',
            color: 'rgba(255, 255, 255, 0.7)',
            fontWeight: 500,
          }}
        >
          Your Link in Bio, Beautifully Designed
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
