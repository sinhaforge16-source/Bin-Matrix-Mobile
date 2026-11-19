import { ApiConfig } from './apiConfig';
import {
  ApiResponse,
  AuthResponse,
  Bin,
  BinMonitoringData,
  DashboardSummaryData,
  Driver,
  Route,
  Truck,
  User,
} from '../types/apiTypes';

class ApiService {
  private authToken: string | null = null;

  public setAuthToken(token: string | null) {
    this.authToken = token;
  }

  public getAuthToken(): string | null {
    return this.authToken;
  }

  public clearAuth() {
    this.authToken = null;
  }

  /**
   * Internal HTTP Request Dispatcher
   */
  private async request<T = any>(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
      body?: any;
      queryParams?: Record<string, any>;
      timeoutMs?: number;
    } = {}
  ): Promise<T> {
    const { method = 'GET', body, queryParams, timeoutMs = 8000 } = options;

    let url = `${ApiConfig.getBaseUrl()}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    if (queryParams) {
      const definedParams = Object.entries(queryParams)
        .filter(([_, v]) => v !== undefined && v !== null && v !== '')
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
      if (definedParams.length > 0) {
        url += `${url.includes('?') ? '&' : '?'}${definedParams.join('&')}`;
      }
    }

    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    if (this.authToken) {
      headers.Authorization = `Bearer ${this.authToken}`;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timer);

      const responseText = await response.text();
      let responseJson: any;
      try {
        responseJson = responseText ? JSON.parse(responseText) : {};
      } catch {
        responseJson = { message: responseText };
      }

      if (!response.ok) {
        const errorMsg =
          responseJson?.message ||
          `Request failed with status ${response.status} (${response.statusText})`;
        const error = new Error(errorMsg);
        (error as any).status = response.status;
        (error as any).data = responseJson;
        throw error;
      }

      return responseJson as T;
    } catch (err: any) {
      clearTimeout(timer);
      if (err.name === 'AbortError') {
        throw new Error('Connection timed out. Please check if the backend server is running.');
      }
      throw err;
    }
  }

  // ==========================================
  // 1. AUTH APIS
  // ==========================================

  public async register(params: {
    username: string;
    password: string;
    role?: 'admin' | 'manager' | 'driver' | 'user';
    email?: string;
    fullName?: string;
  }): Promise<AuthResponse> {
    const res = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: params,
    });
    if (res.token) {
      this.setAuthToken(res.token);
    }
    return res;
  }

  public async login(username: string, password: string): Promise<AuthResponse> {
    const res = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: { username, password },
    });
    if (res.token) {
      this.setAuthToken(res.token);
    }
    return res;
  }

  public async getMe(): Promise<{ success: boolean; user: User }> {
    return this.request<{ success: boolean; user: User }>('/auth/me', {
      method: 'GET',
    });
  }

  // ==========================================
  // 2. DASHBOARD APIS
  // ==========================================

  public async getDashboardSummary(): Promise<ApiResponse<DashboardSummaryData>> {
    return this.request<ApiResponse<DashboardSummaryData>>('/dashboard/summary', {
      method: 'GET',
    });
  }

  // ==========================================
  // 3. SMART BIN APIS
  // ==========================================

  public async getBins(params?: {
    category?: string;
    capacityStatus?: string;
    isPriority?: boolean;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<Bin[]>> {
    return this.request<ApiResponse<Bin[]>>('/bins', {
      method: 'GET',
      queryParams: params,
    });
  }

  public async getBinById(idOrBinId: string): Promise<ApiResponse<Bin>> {
    return this.request<ApiResponse<Bin>>(`/bins/${idOrBinId}`, {
      method: 'GET',
    });
  }

  public async getBinMonitoringSummary(category: string = 'All'): Promise<{
    success: boolean;
    category: string;
    data: BinMonitoringData;
  }> {
    return this.request<{
      success: boolean;
      category: string;
      data: BinMonitoringData;
    }>('/bins/monitoring-summary', {
      method: 'GET',
      queryParams: { category },
    });
  }

  public async updateBin(
    idOrBinId: string,
    updates: Partial<Bin>
  ): Promise<ApiResponse<Bin>> {
    return this.request<ApiResponse<Bin>>(`/bins/${idOrBinId}`, {
      method: 'PUT',
      body: updates,
    });
  }

  public async createBin(binData: Partial<Bin>): Promise<ApiResponse<Bin>> {
    return this.request<ApiResponse<Bin>>('/bins', {
      method: 'POST',
      body: binData,
    });
  }

  // ==========================================
  // 4. DRIVER APIS
  // ==========================================

  public async getDrivers(params?: {
    category?: string;
    isPresentToday?: boolean;
    isAllocated?: boolean;
    search?: string;
    limit?: number;
  }): Promise<ApiResponse<Driver[]>> {
    return this.request<ApiResponse<Driver[]>>('/drivers', {
      method: 'GET',
      queryParams: params,
    });
  }

  public async getDriverById(idOrDriverId: string): Promise<ApiResponse<Driver>> {
    return this.request<ApiResponse<Driver>>(`/drivers/${idOrDriverId}`, {
      method: 'GET',
    });
  }

  public async updateDriver(
    idOrDriverId: string,
    updates: Partial<Driver>
  ): Promise<ApiResponse<Driver>> {
    return this.request<ApiResponse<Driver>>(`/drivers/${idOrDriverId}`, {
      method: 'PUT',
      body: updates,
    });
  }

  // ==========================================
  // 5. TRUCK APIS
  // ==========================================

  public async getTrucks(params?: {
    category?: string;
    status?: string;
    isIdle?: boolean;
  }): Promise<ApiResponse<Truck[]>> {
    return this.request<ApiResponse<Truck[]>>('/trucks', {
      method: 'GET',
      queryParams: params,
    });
  }

  public async getTruckById(idOrTruckNumber: string): Promise<ApiResponse<Truck>> {
    return this.request<ApiResponse<Truck>>(`/trucks/${idOrTruckNumber}`, {
      method: 'GET',
    });
  }

  // ==========================================
  // 6. ROUTE APIS
  // ==========================================

  public async getRoutes(params?: {
    category?: string;
    status?: string;
    area?: string;
    search?: string;
  }): Promise<ApiResponse<Route[]>> {
    return this.request<ApiResponse<Route[]>>('/routes', {
      method: 'GET',
      queryParams: params,
    });
  }

  public async getRouteById(id: string): Promise<ApiResponse<Route>> {
    return this.request<ApiResponse<Route>>(`/routes/${id}`, {
      method: 'GET',
    });
  }

  public async updateRoute(
    id: string,
    updates: Partial<Route>
  ): Promise<ApiResponse<Route>> {
    return this.request<ApiResponse<Route>>(`/routes/${id}`, {
      method: 'PUT',
      body: updates,
    });
  }

  // ==========================================
  // 7. REPORTS APIS
  // ==========================================

  public async getAnalytics(category: string = 'Plastic'): Promise<ApiResponse<any>> {
    return this.request<ApiResponse<any>>('/reports/analytics', {
      method: 'GET',
      queryParams: { category },
    });
  }

  public async createReport(reportData: any): Promise<ApiResponse<any>> {
    return this.request<ApiResponse<any>>('/reports', {
      method: 'POST',
      body: reportData,
    });
  }
}

export const apiService = new ApiService();

