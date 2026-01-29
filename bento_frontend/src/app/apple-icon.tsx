import { ImageResponse } from 'next/og'

export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #ec4899 100%)',
          borderRadius: '35px',
        }}
      >
        <svg
          width="140"
          height="140"
          viewBox="0 0 140 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Bento grid pattern */}
          {/* Top left large block */}
          <rect x="8" y="8" width="52" height="52" rx="8" fill="rgba(255, 255, 255, 0.95)" />
          {/* Top right block */}
          <rect x="68" y="8" width="64" height="23" rx="6" fill="rgba(255, 255, 255, 0.95)" />
          {/* Middle right block */}
          <rect x="68" y="37" width="64" height="23" rx="6" fill="rgba(255, 255, 255, 0.95)" />
          {/* Bottom left block */}
          <rect x="8" y="68" width="24" height="64" rx="6" fill="rgba(255, 255, 255, 0.95)" />
          {/* Bottom center block */}
          <rect x="40" y="68" width="50" height="28" rx="6" fill="rgba(255, 255, 255, 0.95)" />
          {/* Bottom right block */}
          <rect x="98" y="68" width="34" height="64" rx="6" fill="rgba(255, 255, 255, 0.95)" />
          {/* Bottom center lower block */}
          <rect x="40" y="104" width="50" height="28" rx="6" fill="rgba(255, 255, 255, 0.95)" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
