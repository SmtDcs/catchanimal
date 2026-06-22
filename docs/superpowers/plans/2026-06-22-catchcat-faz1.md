# CatchCat Faz 1: Expo Setup + Theme + Navigation

> **For agentic workers:** Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold Expo project with Neko Atsume theme, tab navigation, and reusable UI components.

**Architecture:** Expo SDK 52 + expo-router (file-based routing) + NativeWind (Tailwind CSS for RN). Theme uses warm Neko Atsume color palette. Tab navigator with 3 tabs: Catch, Collection, Profile.

**Tech Stack:** expo, expo-router, nativewind, tailwindcss, zustand, expo-font, @expo/vector-icons

---

### Task 1: Cleanup + Scaffold Expo project

**Files:**
- Delete: `frontend/`
- Create: `mobile/` directory
- Create: `mobile/package.json`
- Create: `mobile/app.json`
- Create: `mobile/tsconfig.json`
- Create: `mobile/babel.config.js`
- Create: `mobile/metro.config.js`
- Create: `mobile/index.js` (entry point)

- [ ] **Step 1: Remove old frontend, create mobile dir**

```bash
cd /home/samet/Projeler/catchcat-monad
rm -rf frontend/
mkdir -p mobile/app mobile/components/ui mobile/lib mobile/assets
```

- [ ] **Step 2: Create mobile/package.json**

```json
{
  "name": "catchcat-mobile",
  "version": "0.1.0",
  "private": true,
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "build": "expo export"
  },
  "dependencies": {
    "expo": "~52.0.0",
    "expo-router": "~4.0.0",
    "expo-status-bar": "~2.0.0",
    "expo-linking": "~7.0.0",
    "expo-constants": "~17.0.0",
    "react": "18.3.1",
    "react-native": "0.76.7",
    "react-native-safe-area-context": "4.12.0",
    "react-native-screens": "~4.4.0",
    "react-native-reanimated": "~3.16.0",
    "@expo/vector-icons": "^14.0.0",
    "nativewind": "~4.1.0",
    "tailwindcss": "^3.4.0",
    "zustand": "^5.0.0",
    "@react-native-async-storage/async-storage": "2.1.0"
  },
  "devDependencies": {
    "@types/react": "~18.3.0",
    "typescript": "^5.3.0"
  }
}
```

- [ ] **Step 3: Create mobile/app.json**

```json
{
  "expo": {
    "name": "CatchCat",
    "slug": "catchcat",
    "version": "0.1.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "scheme": "catchcat",
    "userInterfaceStyle": "light",
    "splash": {
      "backgroundColor": "#F5E6D3"
    },
    "ios": {
      "supportsTablet": false,
      "bundleIdentifier": "xyz.catchcat.app"
    },
    "android": {
      "package": "xyz.catchcat.app",
      "adaptiveIcon": {
        "backgroundColor": "#F5E6D3"
      }
    },
    "plugins": [
      "expo-router"
    ]
  }
}
```

- [ ] **Step 4: Create mobile/tsconfig.json**

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts", "expo-env.d.ts"]
}
```

- [ ] **Step 5: Create mobile/babel.config.js**

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
    ],
    plugins: ["react-native-reanimated/plugin"],
  };
};
```

- [ ] **Step 6: Create mobile/metro.config.js**

```js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: "./app/global.css" });
```

- [ ] **Step 7: Install dependencies**

```bash
cd /home/samet/Projeler/catchcat-monad/mobile
npm install
```

---

### Task 2: NativeWind + Neko Atsume Theme

**Files:**
- Create: `mobile/tailwind.config.js`
- Create: `mobile/app/global.css`
- Create: `mobile/nativewind-env.d.ts`
- Create: `mobile/lib/theme.ts`

- [ ] **Step 1: Create tailwind.config.js**

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Neko Atsume inspired palette
        cream: "#F5E6D3",
        wood: "#C4956A",
        "wood-dark": "#A07850",
        "wood-light": "#D4B896",
        primary: "#E8A87C",
        "primary-dark": "#D4906A",
        "primary-light": "#F0C4A0",
        success: "#A8D5BA",
        "success-dark": "#8CBF9E",
        coin: "#F7DC6F",
        "coin-dark": "#E0C450",
        rare: "#E8B4B4",
        "rare-dark": "#D49A9A",
        "text-primary": "#4A3728",
        "text-secondary": "#8B7355",
        "text-muted": "#B8A08A",
        "card-bg": "#FFF8F0",
        "card-border": "#E8DDD0",
      },
      fontFamily: {
        display: ["System"],
        body: ["System"],
      },
    },
  },
};
```

- [ ] **Step 2: Create global.css for NativeWind**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 3: Create nativewind-env.d.ts**

```ts
/// <reference types="nativewind/types" />
```

- [ ] **Step 4: Create lib/theme.ts**

```ts
export const colors = {
  cream: "#F5E6D3",
  wood: "#C4956A",
  woodDark: "#A07850",
  woodLight: "#D4B896",
  primary: "#E8A87C",
  primaryDark: "#D4906A",
  primaryLight: "#F0C4A0",
  success: "#A8D5BA",
  successDark: "#8CBF9E",
  coin: "#F7DC6F",
  coinDark: "#E0C450",
  rare: "#E8B4B4",
  rareDark: "#D49A9A",
  textPrimary: "#4A3728",
  textSecondary: "#8B7355",
  textMuted: "#B8A08A",
  cardBg: "#FFF8F0",
  cardBorder: "#E8DDD0",
};

export const rarityConfig = {
  colors: {
    Common: "#A8B5A0",
    Uncommon: "#A8D5BA",
    Rare: "#85C1E8",
    Epic: "#C9A8E8",
    Legendary: "#F7DC6F",
  },
  labels: ["Common", "Uncommon", "Rare", "Epic", "Legendary"] as const,
};
```

---

### Task 3: Reusable UI Components

**Files:**
- Create: `mobile/components/ui/Card.tsx`
- Create: `mobile/components/ui/Button.tsx`
- Create: `mobile/components/ui/Badge.tsx`
- Create: `mobile/components/ui/StatBar.tsx`

- [ ] **Step 1: Create Card component**

```tsx
import { View, Text, TouchableOpacity, ViewStyle } from "react-native";
import { cn } from "../../lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
  onPress?: () => void;
}

export function Card({ children, className, style, onPress }: CardProps) {
  const Component = onPress ? TouchableOpacity : View;
  return (
    <Component
      onPress={onPress}
      style={style}
      className={cn(
        "bg-card-bg border border-card-border rounded-2xl p-4 shadow-sm",
        className
      )}
    >
      {children}
    </Component>
  );
}
```

- [ ] **Step 2: Create Button component**

```tsx
import { TouchableOpacity, Text, ActivityIndicator, ViewStyle } from "react-native";
import { cn } from "../../lib/utils";

interface ButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  style?: ViewStyle;
}

export function Button({
  children,
  onPress,
  variant = "primary",
  disabled,
  loading,
  className,
  style,
}: ButtonProps) {
  const variants = {
    primary: "bg-primary active:bg-primary-dark",
    secondary: "bg-wood active:bg-wood-dark",
    outline: "border border-primary bg-transparent",
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={style}
      className={cn(
        "px-6 py-3 rounded-full flex-row items-center justify-center gap-2",
        variants[variant],
        disabled && "opacity-50",
        className
      )}
    >
      {loading ? (
        <ActivityIndicator color={variant === "outline" ? "#E8A87C" : "#FFF"} />
      ) : (
        <Text
          className={cn(
            "font-display text-base",
            variant === "outline" ? "text-primary" : "text-white"
          )}
        >
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
}
```

- [ ] **Step 3: Create Badge component**

```tsx
import { View, Text } from "react-native";
import { cn } from "../../lib/utils";

interface BadgeProps {
  label: string;
  variant?: "rarity" | "species" | "level";
  className?: string;
}

const variantStyles = {
  rarity: {
    Common: "bg-[#A8B5A0]",
    Uncommon: "bg-success",
    Rare: "bg-[#85C1E8]",
    Epic: "bg-[#C9A8E8]",
    Legendary: "bg-coin",
  },
  species: "bg-wood-light",
  level: "bg-primary-light",
};

export function Badge({ label, variant = "species", className }: BadgeProps) {
  const bgClass =
    variant === "rarity" && label in variantStyles.rarity
      ? variantStyles.rarity[label as keyof typeof variantStyles.rarity]
      : variantStyles[variant];

  return (
    <View className={cn("px-3 py-1 rounded-full", bgClass, className)}>
      <Text className="text-xs font-body text-text-primary text-center">
        {label}
      </Text>
    </View>
  );
}
```

- [ ] **Step 4: Create StatBar component**

```tsx
import { View, Text } from "react-native";
import { cn } from "../../lib/utils";

interface StatBarProps {
  label: string;
  value: number;
  maxValue?: number;
  color?: string;
  className?: string;
}

export function StatBar({
  label,
  value,
  maxValue = 100,
  color = "#A8D5BA",
  className,
}: StatBarProps) {
  const pct = Math.min((value / maxValue) * 100, 100);

  return (
    <View className={cn("flex-row items-center gap-2", className)}>
      <Text className="w-8 text-xs font-body text-text-secondary">{label}</Text>
      <View className="flex-1 h-3 bg-card-border rounded-full overflow-hidden">
        <View
          style={{ width: `${pct}%`, backgroundColor: color }}
          className="h-full rounded-full"
        />
      </View>
      <Text className="w-8 text-xs font-body text-text-primary text-right">
        {value}
      </Text>
    </View>
  );
}
```

- [ ] **Step 5: Create lib/utils.ts**

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

### Task 4: Zustand Store

**Files:**
- Create: `mobile/lib/store.ts`

- [ ] **Step 1: Create Zustand store**

```ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Animal {
  id: string;
  species: string;
  breedVariant: string;
  funnyName: string;
  photoUri: string;
  stats: {
    hp: number;
    atk: number;
    def: number;
    spd: number;
    rarity: 1 | 2 | 3 | 4 | 5;
  };
  xp: number;
  level: number;
  caughtAt: string;
  location?: { lat: number; lng: number };
}

export interface Player {
  xp: number;
  level: number;
  coins: number;
  catches: number;
}

interface AppState {
  player: Player;
  collection: Animal[];
  addAnimal: (animal: Animal) => void;
  addXp: (amount: number) => void;
  addCoins: (amount: number) => void;
}

const XP_PER_LEVEL = 100;

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      player: { xp: 0, level: 1, coins: 0, catches: 0 },
      collection: [],

      addAnimal: (animal) =>
        set((state) => {
          const newXp = state.player.xp + 25;
          const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1;
          return {
            collection: [animal, ...state.collection],
            player: {
              ...state.player,
              xp: newXp,
              level: newLevel,
              catches: state.player.catches + 1,
              coins: state.player.coins + (newLevel > state.player.level ? 50 : 10),
            },
          };
        }),

      addXp: (amount) =>
        set((state) => {
          const newXp = state.player.xp + amount;
          const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1;
          return {
            player: {
              ...state.player,
              xp: newXp,
              level: newLevel,
              coins:
                state.player.coins + (newLevel > state.player.level ? 50 : 0),
            },
          };
        }),

      addCoins: (amount) =>
        set((state) => ({
          player: { ...state.player, coins: state.player.coins + amount },
        })),
    }),
    {
      name: "catchcat-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

---

### Task 5: Tab Navigation + Screens

**Files:**
- Create: `mobile/app/global.css`
- Create: `mobile/app/_layout.tsx`
- Create: `mobile/app/(tabs)/_layout.tsx`
- Create: `mobile/app/(tabs)/catch.tsx`
- Create: `mobile/app/(tabs)/collection.tsx`
- Create: `mobile/app/(tabs)/profile.tsx`

- [ ] **Step 1: Create app/_layout.tsx (root layout)**

```tsx
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "./global.css";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}
```

- [ ] **Step 2: Create app/(tabs)/_layout.tsx (tab bar)**

```tsx
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, Text } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#FFF8F0",
          borderTopColor: "#E8DDD0",
          borderTopWidth: 1,
          height: 70,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarActiveTintColor: "#E8A87C",
        tabBarInactiveTintColor: "#B8A08A",
        tabBarLabelStyle: {
          fontFamily: "Nunito-Bold",
          fontSize: 11,
        },
      }}
    >
      <Tabs.Screen
        name="catch"
        options={{
          title: "Yakala",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="camera" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="collection"
        options={{
          title: "Koleksiyon",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
```

- [ ] **Step 3: Create catch screen (placeholder)**

```tsx
import { View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../../components/ui/Button";
import { useStore } from "../../lib/store";

export default function CatchScreen() {
  const player = useStore((s) => s.player);

  return (
    <SafeAreaView className="flex-1 bg-cream">
      {/* Header */}
      <View className="px-6 pt-4 pb-2">
        <Text className="font-display text-3xl text-text-primary">CatchCat</Text>
        <Text className="font-body text-sm text-text-secondary">
          Kameranı aç, hayvanları yakala!
        </Text>
      </View>

      {/* Camera placeholder */}
      <View className="flex-1 mx-4 bg-wood-light rounded-3xl items-center justify-center border-2 border-wood/30">
        <Ionicons name="camera-outline" size={64} color="#C4956A" />
        <Text className="font-body text-text-secondary mt-3">
          Kamerayı açmak için dokun
        </Text>
      </View>

      {/* Bottom info */}
      <View className="px-6 py-4 flex-row justify-between items-center">
        <View className="flex-row items-center gap-2">
          <View className="bg-coin rounded-full px-3 py-1">
            <Text className="font-body text-xs text-text-primary">
              🪙 {player.coins}
            </Text>
          </View>
          <View className="bg-success rounded-full px-3 py-1">
            <Text className="font-body text-xs text-text-primary">
              ⚡ Lv.{player.level}
            </Text>
          </View>
        </View>
        <Text className="font-body text-xs text-text-muted">
          {player.catches} yakalama
        </Text>
      </View>
    </SafeAreaView>
  );
}
```

- [ ] **Step 4: Create collection screen (placeholder)**

```tsx
import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { useStore } from "../../lib/store";

export default function CollectionScreen() {
  const collection = useStore((s) => s.collection);

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="px-6 pt-4 pb-2">
        <Text className="font-display text-3xl text-text-primary">Koleksiyon</Text>
        <Text className="font-body text-sm text-text-secondary">
          {collection.length} hayvan
        </Text>
      </View>

      {collection.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="albums-outline" size={64} color="#D4B896" />
          <Text className="font-body text-text-secondary mt-4 text-center">
            Henüz hiçbir şey yakalamadın.{'\n'}
            Yakala sekmesine git ve ilkini bul!
          </Text>
        </View>
      ) : (
        <FlatList
          data={collection}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerClassName="p-4 gap-4"
          columnWrapperClassName="gap-4"
          renderItem={({ item }) => (
            <Card className="flex-1">
              {item.photoUri ? (
                <Image
                  source={{ uri: item.photoUri }}
                  className="w-full aspect-square rounded-xl"
                />
              ) : (
                <View className="w-full aspect-square bg-wood-light rounded-xl items-center justify-center">
                  <Ionicons name="paw" size={32} color="#C4956A" />
                </View>
              )}
              <Text className="font-display text-sm text-text-primary mt-2">
                {item.funnyName}
              </Text>
              <Badge
                label={["Common", "Uncommon", "Rare", "Epic", "Legendary"][item.stats.rarity - 1]}
                variant="rarity"
                className="mt-1 self-start"
              />
            </Card>
          )}
        />
      )}
    </SafeAreaView>
  );
}
```

- [ ] **Step 5: Create profile screen (placeholder)**

```tsx
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../../components/ui/Card";
import { useStore } from "../../lib/store";

export default function ProfileScreen() {
  const player = useStore((s) => s.player);
  const collection = useStore((s) => s.collection);

  const rarityCount = collection.reduce(
    (acc, a) => {
      const label = ["Common", "Uncommon", "Rare", "Epic", "Legendary"][a.stats.rarity - 1];
      acc[label] = (acc[label] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const xpProgress = (player.xp % 100) / 100;

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="px-6 pt-4 pb-2">
        <Text className="font-display text-3xl text-text-primary">Profil</Text>
      </View>

      <View className="px-6 gap-4">
        {/* Level card */}
        <Card>
          <Text className="font-display text-lg text-text-primary">
            Seviye {player.level}
          </Text>
          <View className="h-2 bg-card-border rounded-full mt-2 overflow-hidden">
            <View
              style={{ width: `${xpProgress * 100}%` }}
              className="h-full bg-primary rounded-full"
            />
          </View>
          <Text className="font-body text-xs text-text-secondary mt-1">
            {player.xp % 100} / 100 XP
          </Text>
        </Card>

        {/* Stats */}
        <Card>
          <Text className="font-display text-base text-text-primary mb-2">İstatistikler</Text>
          <View className="flex-row justify-between">
            <StatItem icon="paw" label="Yakalama" value={player.catches} />
            <StatItem icon="star" label="Koleksiyon" value={collection.length} />
            <StatItem icon="cash" label="Coin" value={player.coins} />
          </View>
        </Card>

        {/* Rarity breakdown */}
        {Object.keys(rarityCount).length > 0 && (
          <Card>
            <Text className="font-display text-base text-text-primary mb-2">Nadirlik Dağılımı</Text>
            {Object.entries(rarityCount).map(([label, count]) => (
              <View key={label} className="flex-row justify-between py-1">
                <Text className="font-body text-sm text-text-secondary">{label}</Text>
                <Text className="font-body text-sm text-text-primary">{count}</Text>
              </View>
            ))}
          </Card>
        )}
      </View>
    </SafeAreaView>
  );
}

function StatItem({ icon, label, value }: { icon: string; label: string; value: number }) {
  return (
    <View className="items-center">
      <Ionicons name={icon as any} size={24} color="#C4956A" />
      <Text className="font-display text-lg text-text-primary mt-1">{value}</Text>
      <Text className="font-body text-xs text-text-secondary">{label}</Text>
    </View>
  );
}
```

---

### Task 6: Verify It Runs

- [ ] **Step 1: Run npx expo export --platform android to verify build**

```bash
cd /home/samet/Projeler/catchcat-monad/mobile
npx expo export --platform android 2>&1
```

Expected: Successfully exports with no errors.

- [ ] **Step 2: Commit everything**

```bash
cd /home/samet/Projeler/catchcat-monad
git add -A
git commit -m "feat: Expo projesini başlat, Neko Atsume temalı tab navigasyonu ve UI bileşenleri"
git push
```
