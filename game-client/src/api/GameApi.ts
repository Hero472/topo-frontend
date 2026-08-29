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
}

export const gameApi = new GameApi(""); // done by the proxy
