export interface GoogleApiAuthStorage {
  saveAPIGoogleAuthTokens(tokens: {
    accessToken: string;
    refreshToken: string;
    expiryDate: number;
    email: string;
  }): Promise<any>;

  getAPIGoogleAuthTokens(): Promise<any | null>;
}
