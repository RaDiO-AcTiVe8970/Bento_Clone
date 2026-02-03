# Instagram Integration - Quick Start Guide

## 🚀 Quick Setup

### Option A: Use It Right Now (No Setup Required)
Instagram posts will show as beautiful placeholder cards with a link to the actual profile.

### Option B: Show Real Instagram Posts (5 minutes)

1. **Get Instagram Credentials**
   - Visit [Facebook Developers](https://developers.facebook.com/)
   - Create a Business App
   - Add "Instagram Basic Display" product
   - Generate a test access token
   - Copy your Instagram User ID

2. **Add to Your `.env` File**
   ```env
   INSTAGRAM_ACCESS_TOKEN="your-token-here"
   INSTAGRAM_USER_ID="your-user-id-here"
   ```

3. **Done!** Your Instagram posts will now display automatically

For detailed setup, see [INSTAGRAM_SETUP.md](INSTAGRAM_SETUP.md)

## 💡 What You Get

### Without Credentials
- ✅ Instagram profile picture
- ✅ Beautiful gradient grid
- ✅ Link to real profile

### With Credentials  
- ✅ Real Instagram posts
- ✅ Post captions on hover
- ✅ Click to view full details
- ✅ Direct links to posts
- ✅ Post timestamps

## 📝 Usage

Add Instagram to any profile:

```tsx
<SocialBlock
  platform="instagram"
  username="your_username"
  url="https://instagram.com/your_username"
  isLarge  // Shows full post grid
/>
```

## 🎨 How It Looks

**Large Card** (3x3 Grid of Posts)
- Full profile picture
- Username display
- 9 Instagram posts in grid
- Hover to see captions
- Click for full view

**Medium Card** (3x2 Grid)
- Compact layout
- Profile picture + name
- 6 posts visible
- Same hover effects

**Small Card**
- Icon only
- Link to profile

## ⚙️ Configuration

See full configuration options in:
- [INSTAGRAM_SETUP.md](INSTAGRAM_SETUP.md) - Detailed setup guide
- [INSTAGRAM_IMPLEMENTATION.md](INSTAGRAM_IMPLEMENTATION.md) - Technical details

## ❓ Troubleshooting

**Posts not showing?**
- Check that tokens are valid in `.env`
- Verify Instagram account is public
- See [INSTAGRAM_SETUP.md](INSTAGRAM_SETUP.md) for troubleshooting

**Only seeing placeholder grid?**
- This is normal! Credentials are optional
- To enable real posts, follow Option B above

## 🔐 Security

- Store tokens in `.env` files (never in code)
- Treat access tokens as secrets
- See [INSTAGRAM_SETUP.md](INSTAGRAM_SETUP.md) for security tips
