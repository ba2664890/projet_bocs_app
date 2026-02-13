// ============================================
// FATI - Types TypeScript
// Fond d'Analyse Territoriale Intégrée
// ============================================

// ----- Utilisateurs & Authentification -----

export type UserRole =
  | 'admin'
  | 'institution'
  | 'sector_health'
  | 'sector_education'
  | 'local_manager'
  | 'annonceur'
  | 'viewer';

export type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  phone?: string;
  organization?: string;
  department?: string;
  regionId?: string;
  departmentId?: string;
  communeId?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  permissions: Permission[];
}

export interface Permission {
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete' | 'validate' | 'export')[];
}

// ----- Géographie & Territoires -----

export type AdministrativeLevel = 'national' | 'region' | 'regional' | 'department' | 'commune' | 'facility';

export interface GeographicEntity {
  id: string;
  code: string;
  name: string;
  level: AdministrativeLevel;
  parentId?: string;
  geometry?: GeoJSON.Geometry;
  centroid?: [number, number];
  population?: number;
  areaKm2?: number;
  metadata?: Record<string, unknown>;
}

export interface Region extends GeographicEntity {
  level: 'region';
  departmentsCount: number;
  communesCount: number;
}

export interface Department extends GeographicEntity {
  level: 'department';
  regionId: string;
  regionName: string;
  communesCount: number;
}

export interface Commune extends GeographicEntity {
  level: 'commune';
  departmentId: string;
  departmentName: string;
  regionId: string;
}

// ----- Secteurs -----

export type Sector = 'health' | 'education';

// ----- Indicateurs -----

export type IndicatorCategory =
  | 'access'
  | 'quality'
  | 'resources'
  | 'outcomes'
  | 'infrastructure'
  | 'personnel'
  | 'finance';

export type IndicatorType = 'number' | 'percentage' | 'ratio' | 'currency' | 'count';

export type ValidationStatus = 'draft' | 'pending' | 'validated' | 'rejected';

export interface Indicator {
  id: string;
  code: string;
  name: string;
  description: string;
  sector: Sector;
  category: IndicatorCategory;
  type: IndicatorType;
  unit?: string;
  formula?: string;
  denominator?: string;
  targetValue?: number;
  alertThreshold?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IndicatorValue {
  id: string;
  indicatorId: string;
  indicatorCode: string;
  indicatorName: string;
  geographicId: string;
  geographicLevel: AdministrativeLevel;
  geographicName: string;
  year: number;
  period?: string;
  value: number;
  valueFormatted: string;
  previousValue?: number;
  variation?: number;
  targetValue?: number;
  achievementRate?: number;
  status: ValidationStatus;
  validatedBy?: string;
  validatedAt?: string;
  source?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ----- Données Sectorielles Santé -----

export interface HealthFacility {
  id: string;
  code: string;
  name: string;
  sector: 'health';
  type: 'hospital' | 'health_center' | 'health_post' | 'clinic' | 'other';
  category?: 'reference' | 'district' | 'regional' | 'university';
  communeId: string;
  communeName: string;
  departmentId: string;
  departmentName: string;
  regionId: string;
  regionName: string;
  coordinates?: [number, number];
  address?: string;
  phone?: string;
  email?: string;
  managerName?: string;
  bedCapacity?: number;
  isActive: boolean;
  services: string[];
  equipment: Equipment[];
  staff: Staff[];
}

export interface Equipment {
  id: string;
  name: string;
  category: string;
  quantity: number;
  functional: number;
  nonFunctional: number;
  lastUpdated: string;
}

export interface Staff {
  id: string;
  category: string;
  total: number;
  filled: number;
  vacant: number;
  lastUpdated: string;
}

export interface HealthIndicator extends IndicatorValue {
  sector: 'health';
  disease?: string;
  ageGroup?: string;
  gender?: string;
}

// ----- Données Sectorielles Éducation -----

export interface EducationFacility {
  id: string;
  code: string;
  name: string;
  sector: 'education';
  type: 'primary' | 'secondary' | 'high_school' | 'university' | 'vocational' | 'preschool';
  level: 'basic' | 'secondary' | 'superior';
  communeId: string;
  communeName: string;
  departmentId: string;
  departmentName: string;
  regionId: string;
  regionName: string;
  coordinates?: [number, number];
  address?: string;
  phone?: string;
  email?: string;
  principalName?: string;
  studentCapacity?: number;
  isActive: boolean;
  infrastructure: InfrastructureStatus;
  teachers: TeacherStats;
  students: StudentStats;
}

export interface InfrastructureStatus {
  classrooms: number;
  usableClassrooms: number;
  toilets: number;
  functionalToilets: number;
  waterAccess: boolean;
  electricityAccess: boolean;
  internetAccess: boolean;
  lastUpdated: string;
}

export interface TeacherStats {
  total: number;
  trained: number;
  female: number;
  male: number;
  studentTeacherRatio: number;
  lastUpdated: string;
}

export interface StudentStats {
  total: number;
  female: number;
  male: number;
  repeaters: number;
  dropouts: number;
  completionRate: number;
  lastUpdated: string;
}

export interface EducationIndicator extends IndicatorValue {
  sector: 'education';
  grade?: string;
  subject?: string;
  gender?: string;
}

// ----- Tableaux de bord -----

export interface DashboardWidget {
  id: string;
  type: 'kpi' | 'chart' | 'map' | 'table' | 'alert' | 'trend';
  title: string;
  subtitle?: string;
  position: { x: number; y: number; w: number; h: number };
  config: Record<string, unknown>;
  data?: unknown;
}

export interface Dashboard {
  id: string;
  name: string;
  description?: string;
  sector?: Sector;
  isDefault: boolean;
  isPublic: boolean;
  widgets: DashboardWidget[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface KPIData {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  previousValue?: number;
  variation?: number;
  variationType?: 'positive' | 'negative' | 'neutral';
  target?: number;
  achievementRate?: number;
  unit?: string;
  icon?: string;
  color?: string;
  trend?: number[];
}

// ----- Alertes & Notifications -----

export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export type AlertType = 'threshold' | 'trend' | 'anomaly' | 'delay' | 'validation';

export interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  sector?: Sector;
  indicatorId?: string;
  indicatorName?: string;
  geographicId?: string;
  geographicName?: string;
  value?: number;
  threshold?: number;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
}

// ----- Workflows & Validation -----

export type WorkflowStatus = 'draft' | 'submitted' | 'under_review' | 'validated' | 'rejected' | 'published';

export interface WorkflowStep {
  id: string;
  name: string;
  order: number;
  assignedRole: UserRole;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  completedBy?: string;
  completedAt?: string;
  comments?: string;
}

export interface WorkflowInstance {
  id: string;
  entityType: 'indicator_value' | 'facility' | 'report';
  entityId: string;
  currentStatus: WorkflowStatus;
  steps: WorkflowStep[];
  createdAt: string;
  updatedAt: string;
}

// ----- Collections de données -----

export interface DataCollection {
  id: string;
  name: string;
  description?: string;
  sector: Sector;
  year: number;
  period: string;
  startDate: string;
  endDate: string;
  status: 'planned' | 'ongoing' | 'completed' | 'closed';
  indicators: string[];
  geographicScope: AdministrativeLevel;
  geographicIds: string[];
  responseRate: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// ----- Rapports & Exports -----

export type ExportFormat = 'pdf' | 'excel' | 'csv' | 'geojson' | 'shapefile';

export interface Report {
  id: string;
  name: string;
  description?: string;
  type: 'standard' | 'custom' | 'analytical';
  sector?: Sector;
  template?: string;
  parameters: Record<string, unknown>;
  format: ExportFormat;
  fileUrl?: string;
  fileSize?: number;
  createdBy: string;
  createdAt: string;
  expiresAt?: string;
}

// ----- Journal d'audit -----

export type AuditAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'validate'
  | 'reject'
  | 'export'
  | 'login'
  | 'logout'
  | 'view';

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: AuditAction;
  entityType: string;
  entityId: string;
  entityName?: string;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

// ----- Filtres & Recherche -----

export interface FilterState {
  sectors: Sector[];
  regions: string[];
  departments: string[];
  communes: string[];
  years: number[];
  indicators: string[];
  categories: IndicatorCategory[];
  status: ValidationStatus[];
  search?: string;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// ----- Cartographie -----

export interface MapLayer {
  id: string;
  name: string;
  type: 'choropleth' | 'points' | 'heatmap' | 'cluster';
  visible: boolean;
  opacity: number;
  data?: GeoJSON.FeatureCollection;
  style?: Record<string, unknown>;
  legend?: MapLegend;
}

export interface MapLegend {
  title: string;
  items: {
    label: string;
    color: string;
    value?: number;
  }[];
}

export interface MapViewport {
  center: [number, number];
  zoom: number;
  bounds?: [[number, number], [number, number]];
}

// ----- Configuration -----

export interface AppConfig {
  theme: 'light' | 'dark' | 'system';
  language: string;
  dateFormat: string;
  numberFormat: string;
  currency: string;
  defaultDashboard?: string;
  notifications: {
    email: boolean;
    push: boolean;
    alerts: boolean;
  };
}

// ----- Réponses API -----

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface ApiError {
  code: string;
  message: string;
  status: number;
}
