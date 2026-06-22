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
  } as Record<string, string>,
  labels: ["Common", "Uncommon", "Rare", "Epic", "Legendary"] as const,
};
