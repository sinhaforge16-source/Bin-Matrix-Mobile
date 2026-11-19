import { Platform } from 'react-native';

/**
 * Default API Host resolution:
 * - Android Emulator maps the host machine's localhost to 10.0.2.2
 * - iOS Simulator / macOS / Web maps directly to localhost:5000
 */
const DEFAULT_HOST = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';

class ApiConfigManager {
  private baseUrl: string = `${DEFAULT_HOST}/api`;
  private serverRootUrl: string = DEFAULT_HOST;

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public getServerRoot(): string {
    return this.serverRootUrl;
  }

  public setHost(host: string): void {
    // Clean trailing slash
    const sanitized = host.replace(/\/+$/, '');
    this.serverRootUrl = sanitized;
    this.baseUrl = sanitized.endsWith('/api') ? sanitized : `${sanitized}/api`;
  }

  /**
   * Quick check to verify if the backend server is reachable
   */
  public async checkHealth(): Promise<{ online: boolean; message?: string }> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const response = await fetch(`${this.serverRootUrl}/`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        return { online: true, message: data.system || 'Connected to backend' };
      }
      return { online: false, message: `Server returned status ${response.status}` };
    } catch (err: any) {
      return { online: false, message: err.message || 'Cannot connect to backend server' };
    }
  }
}

export const ApiConfig = new ApiConfigManager();

