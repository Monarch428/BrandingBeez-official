// src/server/storage-google-auth.ts

export interface GoogleAuthStorage {
  saveGoogleAuthTokens(tokens: {
    accessToken: string;
    refreshToken: string;
    expiryDate: number;
    email: string;
    calendarId?: string;
  }): Promise<any>;

  getGoogleAuthTokens(): Promise<any | null>;
}
