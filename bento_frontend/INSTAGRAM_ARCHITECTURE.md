# Instagram Integration - Architecture & Flow Diagrams

## 🏗️ Component Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    SocialBlock Component                │
│  (Handles all social platforms: GitHub, Twitter, etc)  │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ├─ Platform === "instagram"
                       │
                       ▼
        ┌──────────────────────────────┐
        │    Instagram Rendering       │
        │  (Enhanced with real posts)  │
        └──────────────┬───────────────┘
                       │
        ┌──────────────▼───────────────┐
        │   InstagramGrid Component    │
        │  (NEW - Dedicated Grid UI)   │
        │  - Post Grid Display         │
        │  - Hover Effects             │
        │  - Modal View                │
        └──────────────┬───────────────┘
                       │
        ┌──────────────▼───────────────┐
        │  useSocialProfile Hook       │
        │  - Fetches profile data      │
        │  - Client-side caching       │
        └──────────────┬───────────────┘
                       │
        ┌──────────────▼───────────────────────┐
        │   /api/social Endpoint (Backend)    │
        │  - Calls fetchInstagramProfile()    │
        │  - Server-side caching (1 hour)     │
        │  - Returns posts or placeholders    │
        └──────────────┬───────────────────────┘
                       │
           ┌───────────┴────────────────┐
           │                            │
    ┌──────▼────────┐          ┌────────▼──────────┐
    │  With Creds   │          │   Without Creds   │
    │               │          │                   │
    │ Instagram     │          │ Placeholder       │
    │ Graph API ───────►Data   │ Posts             │
    │               │          │ (Default)         │
    └───────────────┘          └───────────────────┘
```

## 🔄 Data Flow - With Credentials

```
┌─────────────┐
│   Profile   │
│    Page     │
└──────┬──────┘
       │ Render SocialBlock
       │
┌──────▼────────────────────────────────┐
│ SocialBlock with platform="instagram"  │
└──────┬─────────────────────────────────┘
       │ Check if instagram
       │
┌──────▼──────────────────────────┐
│ Call useSocialProfile hook       │
│ ("instagram", "username")        │
└──────┬──────────────────────────┘
       │
       ├─ Check client cache (30 min)
       │
       ├─ Not cached? Fetch from API
       │
┌──────▼────────────────────────────────┐
│ GET /api/social                       │
│ ?platform=instagram&username=...      │
└──────┬─────────────────────────────────┘
       │
       ├─ Check server cache (1 hour)
       │
       ├─ Not cached? Call fetchInstagramProfile()
       │
┌──────▼────────────────────────────────┐
│ fetchInstagramProfile()               │
│ - Check for credentials               │
│ - Call Instagram Graph API            │
│ - Get posts array                     │
└──────┬─────────────────────────────────┘
       │
       ├─ Process & validate posts
       │
┌──────▼────────────────────────────────┐
│ Return Response                       │
│ {                                    │
│   platform: "instagram",             │
│   username: "...",                   │
│   avatar: "...",                     │
│   posts: [ {...}, {...}, ... ],      │
│   url: "..."                         │
│ }                                    │
└──────┬─────────────────────────────────┘
       │
       ├─ Cache on client (30 min)
       │
┌──────▼────────────────────────────────┐
│ Update Profile State                 │
│ profile = response                   │
└──────┬─────────────────────────────────┘
       │
┌──────▼────────────────────────────────┐
│ Render InstagramGrid                 │
│ - Pass posts array                   │
│ - Map to grid layout                 │
│ - Handle interactions                │
└──────┬─────────────────────────────────┘
       │
┌──────▼────────────────────────────────┐
│ Display:                             │
│ ┌─┬─┬─┐                              │
│ │P│P│P│  ← Real Instagram posts      │
│ ├─┼─┼─┤                              │
│ │P│P│P│  ← With captions & links     │
│ ├─┼─┼─┤                              │
│ │P│P│P│  ← Interactive hover & modal │
│ └─┴─┴─┘                              │
└──────────────────────────────────────┘
```

## 🔄 Data Flow - Without Credentials

```
┌─────────────┐
│   Profile   │
│    Page     │
└──────┬──────┘
       │
┌──────▼──────────────────────────┐
│ GET /api/social                 │
│ ?platform=instagram&username... │
└──────┬──────────────────────────┘
       │
┌──────▼──────────────────────────┐
│ fetchInstagramProfile()          │
│ - No credentials in .env?        │
│ - Skip Instagram Graph API       │
│ - Generate placeholder posts     │
└──────┬──────────────────────────┘
       │
┌──────▼──────────────────────────┐
│ Return Response                 │
│ {                              │
│   platform: "instagram",       │
│   username: "...",             │
│   avatar: "..." (from unavatar),
│   posts: [                     │
│     { isPlaceholder: true },   │
│     { isPlaceholder: true },   │
│     ...                        │
│   ],                           │
│   url: "..."                   │
│ }                              │
└──────┬──────────────────────────┘
       │
┌──────▼──────────────────────────┐
│ Render InstagramGrid            │
│ - Display placeholder gradient  │
│ - Show Instagram icon           │
│ - Link to real profile          │
└──────┬──────────────────────────┘
       │
┌──────▼──────────────────────────┐
│ Display:                        │
│ ┌──┬──┬──┐                      │
│ │🔵│🔵│🔵│ ← Beautiful gradients │
│ ├──┼──┼──┤     with emoji icon  │
│ │🔵│🔵│🔵│                      │
│ ├──┼──┼──┤     Link to real     │
│ │🔵│🔵│🔵│     Instagram profile│
│ └──┴──┴──┘                      │
└──────────────────────────────────┘
```

## 🎯 User Interaction Flow

### Hover Interaction
```
User hovers over post
         ↓
Caption appears (opacity 0→100)
         ↓
Post slightly scales up (hover:scale-105)
         ↓
Background darkens for contrast
         ↓
Cursor changes to pointer
         ↓
All transitions smooth (300ms)
```

### Click Interaction
```
User clicks post
         ↓
preventDefault() if real post
         ↓
Modal opens with full-screen overlay
         ↓
Display:
  - Large post image
  - Post caption
  - Username & date
  - "View on Instagram" button
         ↓
User can close by:
  - Clicking overlay
  - Clicking close button
  - Pressing ESC (future enhancement)
```

## 📊 State Management

### SocialBlock Component
```tsx
const { profile, loading, error } = useSocialProfile(
  platform,    // "instagram"
  username     // from props
)

// Derives:
- avatarUrl (from profile or fallback)
- displayName (from profile.name or formatted username)
- posts (from profile.posts array)
- loading state (for spinner)
```

### InstagramGrid Component
```tsx
const [selectedPost, setSelectedPost] = useState<InstagramPost | null>(null)

// Manages:
- Which post is selected (for modal)
- Modal open/close state
- Responsive grid sizing
```

## 📈 Caching Strategy

### Multi-Layer Caching

```
Browser Memory
      ↑
      │ (Client-side cache - 30 min)
      │
   Hook
      ↑
      │ (Server-side cache - 1 hour)
      │
API Route /api/social
      ↑
      │ (API call if no cache)
      │
Instagram Graph API
```

### Cache Keys
- **Client**: `instagram:${username}`
- **Server**: `instagram:${username}`

### Cache Duration
- **Client**: 30 minutes (user's browser)
- **Server**: 1 hour (Next.js cache)

## 🔐 Security Model

```
Environment Variables (.env)
         │
         ├─ INSTAGRAM_ACCESS_TOKEN
         │  └─ Server-side only
         │     (Next.js internals)
         │
         └─ INSTAGRAM_USER_ID
            └─ Server-side only
               (Next.js internals)
              
              ↓
              
        API Route
   /api/social (Backend)
              │
              ├─ Access tokens
              ├─ Make API calls
              └─ Return data
              
              ↓
              
        Response to Client
   (NO credentials exposed)
              │
              └─ Safe: Only JSON data
                  with posts info
                  
              ↓
              
        Browser / Client
   (Can see profile & posts,
    cannot see credentials)
```

## 📐 Responsive Layout

### Grid Columns by Size
```
Small  │ Medium │ Large  │ Wide   │ Tall
───────┼────────┼────────┼────────┼─────
Icon   │  3x2   │  3x3   │  4x2   │ 3x3
only   │ grid   │ grid   │ grid   │ grid
│      │ 6 posts│ 9 posts│ 8 posts│9 posts
└─ No grid

isSmall: shows icon + username
isMedium: shows 6 posts in 3-column grid
isLarge: shows 9 posts in 3-column grid
isWide: shows 8 posts in 4-column grid
isTall: shows 9 posts in 3-column grid
```

## 🎨 UI States

```
Empty State        Loading State        Loaded State
──────────        ─────────────        ────────────
┌─┬─┬─┐           ┌─┬─┬─┐              ┌──┬──┬──┐
│?│?│?│ (icon)    │⏳│⏳│⏳│ (spinner)    │📸│📸│📸│ (image)
├─┼─┼─┤           ├─┼─┼─┤              ├──┼──┼──┤
│?│?│?│           │⏳│⏳│⏳│              │📸│📸│📸│
├─┼─┼─┤           ├─┼─┼─┤              ├──┼──┼──┤
│?│?│?│           │⏳│⏳│⏳│              │📸│📸│📸│
└─┴─┴─┘           └─┴─┴─┘              └──┴──┴──┘

No Credentials      Error State          Modal Open
──────────────     ────────────          ──────────
┌─┬─┬─┐             ┌─┬─┬─┐             ┌─────────────┐
│🔵│🔵│🔵│ (gradient) │❌│?│?│ (mixed)    │ Post Image  │
├─┼─┼─┤             ├─┼─┼─┤             ├─────────────┤
│🔵│🔵│🔵│ (animated) │?│❌│?│ + fallback │ Caption     │
├─┼─┼─┤             ├─┼─┼─┤             │ Link Button │
│🔵│🔵│🔵│ (pulsing) │?│?│❌│             └─────────────┘
└─┴─┴─┘             └─┴─┴─┘             (Full screen)
```

## 🔄 Request/Response Cycle

### API Request
```
GET /api/social
  ?platform=instagram
  &username=example_user
```

### API Response (With Posts)
```json
{
  "platform": "instagram",
  "username": "example_user",
  "name": "Example User",
  "avatar": "https://unavatar.io/instagram/example_user",
  "avatarFallbacks": ["https://i.pravatar.cc/..."],
  "url": "https://instagram.com/example_user",
  "posts": [
    {
      "id": "17999...",
      "imageUrl": "https://...",
      "caption": "Amazing photo!",
      "permalink": "https://instagram.com/p/...",
      "mediaType": "IMAGE",
      "timestamp": "2024-01-15T10:30:00Z"
    },
    ... (more posts)
  ]
}
```

### API Response (Placeholder)
```json
{
  "platform": "instagram",
  "username": "example_user",
  "name": "Example User",
  "avatar": "https://unavatar.io/instagram/example_user",
  "avatarFallbacks": ["https://i.pravatar.cc/..."],
  "url": "https://instagram.com/example_user",
  "posts": [
    {
      "id": "placeholder-0",
      "caption": "Post 1",
      "isPlaceholder": true
    },
    ... (6 total)
  ]
}
```

---

This architecture ensures:
- ✅ Smooth user experience
- ✅ Efficient caching
- ✅ Security (no credential leaks)
- ✅ Graceful degradation (works without API)
- ✅ Responsive on all devices
- ✅ Accessible interactions
