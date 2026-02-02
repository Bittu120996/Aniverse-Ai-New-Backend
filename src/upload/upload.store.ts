interface TempImage {
  base64: string;
  mimeType: string;
  createdAt: number;
}

const EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

export class UploadStore {
  private static store = new Map<string, TempImage>();

  static set(userId: string, data: TempImage) {
    this.store.set(userId, data);
  }

  static get(userId: string): TempImage | undefined {
    const data = this.store.get(userId);

    if (!data) return undefined;

    // ⏱ Auto-expire
    if (Date.now() - data.createdAt > EXPIRY_MS) {
      this.store.delete(userId);
      return undefined;
    }

    return data;
  }

  static delete(userId: string) {
    this.store.delete(userId);
  }

  static cleanupExpired() {
    const now = Date.now();

    for (const [userId, data] of this.store.entries()) {
      if (now - data.createdAt > EXPIRY_MS) {
        this.store.delete(userId);
      }
    }
  }
}
