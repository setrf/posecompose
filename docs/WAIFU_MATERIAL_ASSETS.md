# Waifu Material - Visual Asset Requirements

## Brand Assets

### Logos & Icons
- **Primary Logo**: "Waifu Material" text in neon pink/purple gradient with glow effect
  - Horizontal version (full text)
  - Stacked version (for mobile/avatar use)
  - Monogram version (WM initials)
- **Favicon**: Neon pink/purple gradient icon with anime aesthetic
- **App Icon**: 512x512px version for mobile app stores
- **Social Media Avatars**: Circular versions for Twitter, Instagram, TikTok

## Costume Presets Assets

### Halloween Costume Reference Images (6-9 launch costumes)
Each costume requires:
- **Main Reference Image**: High-quality anime/Halloween costume photo
- **Background Scene**: Themed setting that matches the costume
- **Detail Shots**: 2-3 close-ups showing costume textures and details
- **Style Guide**: Color palette and transformation examples

### Suggested Costume Categories:
1. **Gothic Lolita**
   - Reference: Elegant gothic dress with ribbons and lace
   - Scene: Victorian mansion interior or misty graveyard
2. **Cyberpunk Samurai**
   - Reference: Futuristic samurai armor with neon lights
   - Scene: Tokyo night street with holographic ads
3. **Magical Girl**
   - Reference: Sailor Moon-style magical transformation
   - Scene: Sparkling cosmic background with stars
4. **Vampire Noble**
   - Reference: Elegant vampire outfit with cape
   - Scene: Gothic castle interior at moonlight
5. **Kawaii Ghost**
   - Reference: Cute pastel ghost costume
   - Scene: Enchanted forest with glowing mushrooms
6. **Dark Witch**
   - Reference: Modern witch aesthetic with crystals
   - Scene: Misty forest circle with magical energy
7. **Steampunk Adventurer**
   - Reference: Victorian steampunk with goggles and gears
   - Scene: Airship deck at sunset
8. **Anime Knight**
   - Reference: Clean fantasy knight armor
   - Scene: Castle battlements with fantasy landscape

## UI Graphics & Icons

### Navigation Icons (Neon Style)
- Camera Upload icon (pulsing glow)
- Person/User icons with anime styling
- Settings/Gear icon
- Download/Export icons
- Loading spinners (neon circle animation)
- Success/Check marks
- Warning/Error icons
- Social share icons (Twitter, Instagram, TikTok)

### Progress & Step Indicators
- Step bubbles with neon glow
- Progress bars with gradient fills
- Loading skeleton screens with gradient animation

### Interactive Elements
- Button hover states with neon ripple effects
- Input field borders with glow
- Toggle switches with neon accent
- Dropdown menus with glassmorphic background

## Background Assets

### Hero Section
- **Animated Background**: Subtle particle effects with neon colors
- **Gradient Overlays**: Moving color gradients in pink/purple/cyan
- **Pattern Overlays**: Subtle anime-style patterns

### Loading/Processing States
- **Processing Animation**: Transforming silhouette animation
- **Generation Effects**: Magical particle effects
- **Success Animation**: Costume reveal with sparkle effects

## Marketing & Social Assets

### Social Media Templates
- **Twitter Header**: 1500x500px neon anime theme
- **Instagram Posts**: 1080x1080 costume showcases
- **TikTok Templates**: 9:16 aspect ratio costume transformations
- **Facebook Cover**: 851x315px brand showcase

### Web Banners
- **Hero Banners**: 1920x1080 for homepage
- **Feature Cards**: 400x300 costume preview cards
- **Testimonial Cards**: User results showcase
- **CTA Banners**: Download/engage calls-to-action

### Video Assets
- **Intro Animation**: 5-10 second brand intro
- **Tutorial Videos**: How-to costume transformation
- **Before/After Showcases**: User transformation examples
- **Social Media Ads**: 15-30 second promotional clips

## Technical Specifications

### File Formats
- **Icons**: SVG (scalable), PNG fallbacks
- **Photos**: WebP (modern), JPEG backup
- **Animations**: CSS/JSON (Lottie), MP4 backup
- **Vectors**: SVG for all logos and icons

### Color Palette
- **Primary Pink**: `hsl(320, 100%, 60%)`
- **Neon Purple**: `hsl(270, 100%, 60%)`
- **Electric Cyan**: `hsl(180, 100%, 65%)`
- **Background Dark**: `hsl(280, 35%, 5%)`
- **Card Glass**: `hsl(280, 25%, 10%)` with transparency

### Animation Guidelines
- **Glow Effects**: CSS box-shadow with layered glows
- **Particle Systems**: Subtle floating elements
- **Transitions**: Smooth cubic-bezier animations
- **Loading States**: Progressive loading with skeleton screens

## Costume Metadata Template

```typescript
interface CostumeAsset {
  id: string;
  name: string;
  description: string;
  category: string;
  images: {
    main: string;
    background: string;
    details: string[];
    examples: string[];
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  metadata: {
    difficulty: 'easy' | 'medium' | 'hard';
    tags: string[];
    compatibleModels: string[];
  };
  marketing: {
    displayName: string;
    shortDescription: string;
    socialPreview: string;
  };
}
```

## File Structure

```
public/
├── assets/
│   ├── brand/
│   │   ├── logos/
│   │   ├── icons/
│   │   └── gradients/
│   ├── costumes/
│   │   ├── gothic-lolita/
│   │   ├── cyberpunk-samurai/
│   │   └── ...
│   ├── ui/
│   │   ├── icons/
│   │   ├── backgrounds/
│   │   └── animations/
│   └── social/
│       ├── templates/
│       └── banners/
```

## Implementation Priority

### Phase 1 (Launch - MVP)
1. Basic logo and favicon
2. 3-4 core costume presets
3. Essential UI icons
4. Basic hero background

### Phase 2 (Expansion)
1. Additional costume presets (6-9 total)
2. Advanced animations
3. Video tutorials
4. Social media templates

### Phase 3 (Growth)
1. User showcase assets
2. Advanced editing tools
3. Premium costume packs
4. Brand partnership assets

## Accessibility Notes
- Ensure high contrast ratios for text (WCAG AA compliance)
- Provide alternative text descriptions for all visual assets
- Support reduced motion preferences
- Include dark/light mode contrast considerations

## Legal & Licensing
- Verify license rights for all stock imagery
- Document usage rights for user-generated content
- Include proper attribution for licensed assets
- Consider trademark implications for brand assets
