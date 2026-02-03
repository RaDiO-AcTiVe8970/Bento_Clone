# Instagram Integration Guide

This guide explains how to set up Instagram photo/post display in Bento Clone.

## Features

- Display Instagram profile picture
- Show Instagram posts in a beautiful grid layout
- Support for both authenticated (real posts) and unauthenticated (placeholder) modes
- Responsive grid that adapts to different card sizes
- Hover effects to view post captions
- Modal view for detailed post information

## Setup Instructions

### Option 1: With Real Instagram Posts (Recommended)

To display actual Instagram posts from a profile, you need to set up Instagram Graph API credentials.

#### Step 1: Create a Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "Create App" and select "Business" as the app type
3. Fill in the app name and select a category
4. Complete the app setup

#### Step 2: Add Instagram Basic Display

1. In your app dashboard, go to "Products"
2. Click "Add Product" and search for "Instagram Basic Display"
3. Click "Set Up" to add it to your app
4. Complete the setup wizard

#### Step 3: Get Your Access Token and User ID

1. Go to "Instagram Basic Display" settings
2. In the "User Tokens" section, generate a test token
   - Select your Instagram account
   - Choose permissions: `instagram_basic`, `instagram_graph_user_media`
   - Generate token
3. Copy the access token
4. Note your Instagram User ID (usually displayed in the interface, or you can find it from the Instagram API docs)

#### Step 4: Add to Environment Variables

In your `.env` file, add:

```env
INSTAGRAM_ACCESS_TOKEN="your-generated-access-token"
INSTAGRAM_USER_ID="your-instagram-user-id"
```

#### Step 5: Prepare for Production

⚠️ **Important**: The test token expires after a short period. For production:

1. Submit your app for review on the Meta App Review page
2. Once approved, you can generate long-lived user access tokens
3. Implement token refresh logic if needed

### Option 2: Without Real Posts (Default)

If you don't set up Instagram Graph API credentials, the component will:
- Display a placeholder grid with Instagram brand colors
- Still show the profile picture
- Provide a link to the actual Instagram profile

No additional configuration needed - it works out of the box!

## Component Usage

### SocialBlock with Instagram

```tsx
<SocialBlock
  platform="instagram"
  username="your-username"
  url="https://instagram.com/your-username"
  isLarge
/>
```

### InstagramGrid Component (Advanced)

For custom layouts, use the `InstagramGrid` component directly:

```tsx
import { InstagramGrid } from "@/components/bento/InstagramGrid"

<InstagramGrid
  posts={profile?.posts}
  username="your-username"
  profileUrl="https://instagram.com/your-username"
  isLarge
/>
```

## Available Props

### SocialBlock (Instagram)

- `platform`: `"instagram"` (required)
- `username`: Instagram username (required)
- `url`: Link to Instagram profile (required)
- `title`: Custom display name (optional)
- `isSmall`: 40x40px display
- `isMedium`: Medium card size
- `isLarge`: Large card with full post grid
- `isWide`: Wide card layout
- `isTall`: Tall card layout

### InstagramGrid

- `posts`: Array of `InstagramPost` objects
- `username`: Instagram username for display
- `profileUrl`: Link to Instagram profile
- `isSmall`, `isMedium`, `isLarge`, `isWide`, `isTall`: Size variants

## Data Structure

The Instagram posts are returned with this structure:

```typescript
interface InstagramPost {
  id: string
  imageUrl?: string          // Post image URL
  caption?: string           // Post caption/text
  permalink?: string         // Direct link to post
  mediaType?: string         // "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM"
  timestamp?: string         // ISO 8601 timestamp
  isPlaceholder?: boolean    // True for placeholder posts
}
```

## Troubleshooting

### Posts not showing

1. **Check token validity**: Instagram test tokens expire after ~1 hour
2. **Verify User ID**: Make sure `INSTAGRAM_USER_ID` matches the account
3. **Check permissions**: Ensure the token has `instagram_basic` and `instagram_graph_user_media` permissions
4. **Check browser console**: Look for API errors in the Network tab

### "Failed to fetch profile" error

- Verify both `INSTAGRAM_ACCESS_TOKEN` and `INSTAGRAM_USER_ID` are set
- Check that the token hasn't expired
- Ensure the account associated with the token is active

### Only showing placeholder posts

This is expected if:
- No Instagram credentials are configured (fallback behavior)
- Token is invalid or expired
- The Instagram account is private or has API access disabled

## Privacy & Security

- **Never commit tokens to git** - use `.env` files
- Instagram tokens should be treated as secrets
- Consider implementing token rotation for production
- The API endpoint caches results for 1 hour to minimize API calls

## Future Enhancements

Potential features to add:
- Instagram Stories support
- Like/comment counts
- Hashtag display
- Reel/Video playback
- User follower count integration
- Instagram bio/description display
- Carousel post swiper

## Resources

- [Instagram Basic Display API Docs](https://developers.facebook.com/docs/instagram-basic-display)
- [Instagram Graph API Explorer](https://developers.facebook.com/tools/explorer)
- [Facebook App Dashboard](https://developers.facebook.com/apps)
