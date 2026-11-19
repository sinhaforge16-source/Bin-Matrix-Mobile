export type WasteCategoryType = 'Plastic' | 'Paper' | 'Organic waste';

export interface User {
  _id: string;
  username: string;
  role: 'admin' | 'manager' | 'driver' | 'user';
  email?: string;
  fullName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

export interface Bin {
  _id: string;
  binId: string;
  category: WasteCategoryType;
  status: 'Online' | 'Offline';
  fillLevel: number;
  batteryLevel: number;
  capacityStatus: 'Normal' | 'Almost Full' | 'Overflowing';
  isPriority: boolean;
  location: string;
  latitude?: number;
  longitude?: number;
  lastUpdated?: string;
}

export interface Driver {
  _id: string;
  name: string;
  driverId: string;
  category: WasteCategoryType;
  isPresentToday: boolean;
  isAllocated: boolean;
  phone: string;
  email: string;
}

export interface Truck {
  _id: string;
  truckNumber: string;
  category: WasteCategoryType;
  status: 'Online' | 'Offline';
  isIdle: boolean;
  totalDistanceKm: number;
  fuelConsumption: number;
  currentDriver?: Driver | string | null;
  currentRoute?: Route | string | null;
}

export interface RouteWaypoint {
  name: string;
  latitude: number;
  longitude: number;
  sequenceOrder: number;
}

export interface Route {
  _id: string;
  routeName: string;
  area: string;
  category: WasteCategoryType;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  assignedTruck?: Truck | null;
  assignedDriver?: Driver | null;
  bins: Bin[];
  waypoints?: RouteWaypoint[];
}

export interface BucketStats {
  title: string;
  subtitle: string;
  online: number;
  offline: number;
  total: number;
}

export interface BinMonitoringData {
  summary: {
    normal: BucketStats;
    almostFull: BucketStats;
    overflowing: BucketStats;
    priority: BucketStats;
  };
  mapPins: Bin[];
}

export interface DashboardCategoryFill {
  Plastic: number;
  Paper: number;
  'Organic waste': number;
}

export interface DashboardSummaryData {
  bins: {
    total: number;
    online: number;
    offline: number;
    lowBattery: number;
    fillLevels: DashboardCategoryFill;
  };
  drivers: Record<string, any>;
  trucks: Record<string, any>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  count?: number;
  total?: number;
  totalPages?: number;
  currentPage?: number;
  data?: T;
  message?: string;
  token?: string;
  user?: User;
}

