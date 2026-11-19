/**
 * Google APIs Configuration for Bin Matrix Mobile
 * 
 * Provides configuration and API keys for:
 * - Google Maps Directions & Turn-by-Turn Navigation
 * - Google Maps Static & Interactive Map Tiles
 * - Google Geocoding & Places API
 * - Google OAuth 2.0 / Sign-In Client
 */

export interface GoogleConfigOptions {
  mapsApiKey: string;
  clientIdWeb?: string;
  clientIdAndroid?: string;
  clientIdIos?: string;
}

class GoogleConfigManager {
  // Replace with your Google Cloud Console API Key when deploying
  private mapsApiKey: string = 'AIzaSyBinMatrixMobileDefaultKey_ReplaceWithYourGoogleKey';
  private clientIdWeb: string = 'bin-matrix-mobile.apps.googleusercontent.com';

  public getMapsApiKey(): string {
    return this.mapsApiKey;
  }

  public setMapsApiKey(key: string): void {
    if (key && key.trim()) {
      this.mapsApiKey = key.trim();
    }
  }

  public getClientIdWeb(): string {
    return this.clientIdWeb;
  }

  public setClientIdWeb(id: string): void {
    if (id && id.trim()) {
      this.clientIdWeb = id.trim();
    }
  }
}

export const GoogleConfig = new GoogleConfigManager();
