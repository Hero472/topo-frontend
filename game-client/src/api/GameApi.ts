export interface CreateGameResponse {
  game_id: string;
}

export class GameApi {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async createGame(data: { duration_seconds: number }) {
    const response = await fetch(`${this.baseUrl}/api/games`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to create game");
    }

    return response.json();
  }

  async checkGameExists(inviteCode: string): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/api/games/${inviteCode}`, {
      method: "GET",
    });
    // Returns true for 200 OK, false for 404 or 410
    return response.ok; 
  }
}

const PROD_API_URL = import.meta.env.VITE_API_URL || "";

export const gameApi = new GameApi(PROD_API_URL);
