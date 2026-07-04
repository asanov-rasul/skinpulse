export type Rarity =
  | "CONSUMER"
  | "INDUSTRIAL"
  | "MIL_SPEC"
  | "RESTRICTED"
  | "CLASSIFIED"
  | "COVERT"
  | "CONTRABAND"
  | "GOLD";

export const RARITY_LABEL: Record<Rarity, string> = {
  CONSUMER: "Consumer Grade",
  INDUSTRIAL: "Industrial Grade",
  MIL_SPEC: "Mil-Spec",
  RESTRICTED: "Restricted",
  CLASSIFIED: "Classified",
  COVERT: "Covert",
  CONTRABAND: "Contraband",
  GOLD: "★ Extraordinary",
};

export const RARITY_COLOR: Record<Rarity, string> = {
  CONSUMER: "#b0c3d9",
  INDUSTRIAL: "#5e98d9",
  MIL_SPEC: "#4b69ff",
  RESTRICTED: "#8847ff",
  CLASSIFIED: "#d32ce6",
  COVERT: "#eb4b4b",
  CONTRABAND: "#e4ae39",
  GOLD: "#e4ae39",
};

export const RARITY_GLOW_CLASS: Record<Rarity, string> = {
  CONSUMER: "",
  INDUSTRIAL: "",
  MIL_SPEC: "",
  RESTRICTED: "",
  CLASSIFIED: "shadow-glow-classified",
  COVERT: "shadow-glow-covert",
  CONTRABAND: "shadow-glow-gold",
  GOLD: "shadow-glow-gold",
};

/**
 * Best-effort mapping from Steam's rarity strings (as returned in item
 * listings / community market tags) to our internal enum. Steam doesn't
 * expose a clean rarity field on priceoverview (only on the full item
 * listing/tag data), so this is used when ingesting catalog data.
 */
export function normalizeRarity(steamTag: string | undefined | null): Rarity {
  if (!steamTag) return "MIL_SPEC";
  const tag = steamTag.toLowerCase();
  if (tag.includes("consumer")) return "CONSUMER";
  if (tag.includes("industrial")) return "INDUSTRIAL";
  if (tag.includes("mil-spec") || tag.includes("mil spec")) return "MIL_SPEC";
  if (tag.includes("restricted")) return "RESTRICTED";
  if (tag.includes("classified")) return "CLASSIFIED";
  if (tag.includes("covert")) return "COVERT";
  if (tag.includes("contraband")) return "CONTRABAND";
  if (tag.includes("extraordinary") || tag.includes("knife") || tag.includes("gloves"))
    return "GOLD";
  return "MIL_SPEC";
}
