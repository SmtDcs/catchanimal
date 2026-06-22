# CatchCat MVP Design

## Overview
Turn real-world animals into collectible cards via camera detection + minigame. React Native (Expo) mobile app with Android-first approach.

## Tech Stack
- **Framework**: Expo SDK 52 + expo-router (file-based)
- **Styling**: NativeWind (Tailwind CSS for RN) + custom theme
- **Camera**: react-native-vision-camera
- **ML**: expo-mlkit (on-device animal detection)
- **State**: Zustand (lightweight, simple)
- **Navigation**: expo-router tabs

## Design System (Neko Atsume Inspired)

### Color Palette
- Background: #F5E6D3 (warm cream)
- Wood/Accent: #C4956A (warm brown)
- Primary: #E8A87C (soft orange)
- Success/XP: #A8D5BA (mint green)
- Coin/Reward: #F7DC6F (soft yellow)
- Rare accent: #E8B4B4 (dusty pink)
- Text primary: #4A3728 (dark brown)
- Text secondary: #8B7355 (medium brown)

### Typography
- Rounded, friendly system font (Nunito or similar via Google Fonts)
- Hand-drawn feel for badges and labels

### UI Elements
- Rustic wood-grain backgrounds (gradient-based)
- Rounded cards with soft shadows (trading card feel)
- Hand-drawn style SVG icons (custom)
- Soft, cozy animations (fade, scale, gentle bounce)

## Architecture

### Phases

**Faz 1 — Expo Setup + Theme + Navigation**
- Scaffold Expo project in `mobile/`
- Install all dependencies
- NativeWind + theme config
- Tab navigation: Catch, Collection, Profile
- Reusable UI components (Card, Button, Badge, StatBar)
- Empty state screens for each tab

**Faz 2 — Camera + ML Detection**
- Vision Camera setup with live preview
- MLKit animal classification integration
- Auto-detect animals without button press
- Photo capture on successful detection

**Faz 3 — Minigame System**
- 2-3 different minigames:
  1. Tap-to-throw (food can)
  2. Quick-tap target
  3. Balance mini-game
- Random selection on catch attempt
- Success = animal captured

**Faz 4 — Game Mechanics**
- 5 stats: HP, ATK, DEF, SPD, RARITY
- Rarity tiers: Common → Uncommon → Rare → Epic → Legendary
- XP + Level system
- Coin rewards on level up

**Faz 5 — Collection + Details**
- Grid/list view with filters
- Animal detail screen (photo, stats, location, timestamp)
- Sort/filter by rarity, type, power

**Faz 6+ — Future**
- World map / GPS spawns
- Trading system
- Battle mode (Alley Clash)
- NFT mint (CatNFT.sol)
- iOS port

### Data Models

```typescript
interface Animal {
  id: string;
  species: string;       // "cat", "dog", "bird", "horse", etc.
  breedVariant: string;  // randomized breed/style
  funnyName: string;
  photoUri: string;      // local file path
  stats: {
    hp: number;
    atk: number;
    def: number;
    spd: number;
    rarity: 1 | 2 | 3 | 4 | 5;  // 1=Common, 5=Legendary
  };
  xp: number;
  level: number;
  caughtAt: string;      // ISO timestamp
  location?: {
    lat: number;
    lng: number;
  };
}

interface Player {
  xp: number;
  level: number;
  coins: number;
  catches: number;
}
```

### Storage
- AsyncStorage for local persistence (MVP)
- Zustand store for app state
- Photos saved to app's document directory
