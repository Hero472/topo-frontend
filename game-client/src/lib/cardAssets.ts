import type { Card } from "../types/types";

type Resolution = "x1" | "x2";

const imageModules = import.meta.glob<{ default: string }>(
  "../assets/cards/x*/*.png",
  {
    eager: true,
    query: "url",
  }
);

const imageMapX1: Record<string, string> = {};
const imageMapX2: Record<string, string> = {};

for (const [filePath, module] of Object.entries(imageModules)) {
  const parts = filePath.replace(".png", "").split("/");
  const fileName = parts.at(-1);
  const folder = parts.at(-2);

  if (!fileName || !folder) continue;

  const url = (module as { default: string }).default;

  if (folder === "x1") {
    imageMapX1[fileName] = url;
  } else if (folder === "x2") {
    imageMapX2[fileName] = url;
  }
}

function rankToFileName(value: number): string {
  switch (value) {
    case 1:  return "ace";
    case 11: return "jack";
    case 12: return "queen";
    case 13: return "king";
    default: return value.toString();
  }
}

export function getCardBackUrl(
  color: string,
  resolution: Resolution = "x1"
): string | undefined {
  const fileName = `back-${color}`;
  return resolution === "x2"
    ? imageMapX2[fileName]
    : imageMapX1[fileName];
}

export function getCardImageUrl(
  card: Card,
  resolution: Resolution = "x1"
): string | undefined {
  const rank = rankToFileName(card.value);
  const fileName = `${card.suit}_${rank}`;
  return resolution === "x2"
    ? imageMapX2[fileName]
    : imageMapX1[fileName];
}