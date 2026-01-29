import { ImageResponse } from 'next/og'

export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #ec4899 100%)',
          borderRadius: '6px',
        }}
      >
        {/* Simple bento grid icon */}
        <svg
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Top left large block */}
          <rect x="1" y="1" width="9" height="9" rx="2" fill="white" fillOpacity="0.95" />
          {/* Top right block */}
          <rect x="12" y="1" width="9" height="4" rx="1" fill="white" fillOpacity="0.95" />
          {/* Middle right block */}
          <rect x="12" y="6" width="9" height="4" rx="1" fill="white" fillOpacity="0.95" />
          {/* Bottom left block */}
          <rect x="1" y="12" width="4" height="9" rx="1" fill="white" fillOpacity="0.95" />
          {/* Bottom center top */}
          <rect x="6" y="12" width="9" height="4" rx="1" fill="white" fillOpacity="0.95" />
          {/* Bottom right block */}
          <rect x="17" y="12" width="4" height="9" rx="1" fill="white" fillOpacity="0.95" />
          {/* Bottom center bottom */}
          <rect x="6" y="17" width="9" height="4" rx="1" fill="white" fillOpacity="0.95" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
