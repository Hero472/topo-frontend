export interface CreateGameResponse {
  game_id: string;
}

export class GameApi {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    // SAFETY: Remove any trailing slash to prevent "//api/games"
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  async createGame(data: { duration_seconds: number }) {
    // If baseUrl is "", this safely becomes exactly "/api/games"
    const url = `${this.baseUrl}/api/games`;
    
    console.log("[API] Fetching URL:", url);
    console.log("[API] Payload:", data);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      // IMPROVEMENT: Grab the actual error text from the server instead of a generic message
      const errorText = await response.text();
      throw new Error(`Failed to create game: HTTP ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  async checkGameExists(inviteCode: string): Promise<boolean> {
    const url = `${this.baseUrl}/api/games/${inviteCode}`;
    const response = await fetch(url, {
      method: "GET",
    });
    // Returns true for 200 OK, false for 404 or 410
    return response.ok; 
  }
}

// If VITE_API_URL is not set in .env, it defaults to "" (empty string).
// This makes the fetch URL exactly "/api/games", which Cloudflare will proxy!
const PROD_API_URL = import.meta.env.VITE_API_URL || "";

export const gameApi = new GameApi(PROD_API_URL);