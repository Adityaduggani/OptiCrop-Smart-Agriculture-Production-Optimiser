export interface FarmZone {
  id: string;
  name: string;
  crop: string;
  growthStage: "Seeding" | "Vegetative" | "Flowering" | "Ripening";
  moisture: number; // %
  nitrogen: number; // ppm
  phosphorus: number; // ppm
  potassium: number; // ppm
  temperature: number; // °C
  irrigationActive: boolean;
  fertilizerRate: number; // L/ha/hr
  shadeCover: boolean;
  healthIndex: number; // 0-100
}

export interface SoilReport {
  healthStatus: "Optimized" | "Good" | "Warning" | "Critical";
  healthScore: number;
  soilAnalysis: string;
  npkAnalysis: {
    nitrogen: string;
    phosphorus: string;
    potassium: string;
  };
  irrigationOptimization: string;
  estimatedYieldImpact: string;
  recommendations: string[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
}

export interface MetricTrend {
  label: string;
  value: number;
}

export interface PrimaryRecommendation {
  cropName: string;
  scientificName: string;
  confidenceScore: number;
  suitabilityReason: string;
  growthDuration: string;
  waterRequirement: string;
  nutritionalIntakeDetails: string;
}

export interface SecondaryRecommendation {
  cropName: string;
  suitabilityReason: string;
  growthDuration: string;
}

export interface EnvironmentalContext {
  temperatureStatus: string;
  humidityStatus: string;
  phClassification: string;
}

export interface CropRecommendationReport {
  primaryRecommendation: PrimaryRecommendation;
  secondaryRecommendations: SecondaryRecommendation[];
  environmentalContext: EnvironmentalContext;
  cultivationGuide: string[];
}

export interface PolicyAction {
  phase: string;
  action: string;
  subsidyRecommendation: string;
}

export interface HistoricalYieldPoint {
  year: number;
  baseline: number;
  projected: number;
  underPolicy: number;
}

export interface ResourceEfficiencyMetric {
  name: string;
  before: number;
  after: number;
}

export interface PolicyAnalyticsReport {
  insights: string[];
  chartsData: {
    historicalYield: HistoricalYieldPoint[];
    resourceEfficiency: ResourceEfficiencyMetric[];
  };
  policyImpactScore: number;
  sustainabilityIndex: number;
  economicViability: string;
  recommendedActionPlan: PolicyAction[];
}

export type UserRole = "Farmer" | "Researcher" | "Policymaker" | "Administrator";

export interface User {
  uid: string;
  email: string;
  name?: string;
  displayName: string;
  role: UserRole;
  organization?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: UserRole;
  action: string;
  status: "Success" | "Info" | "Warning" | "Security";
}

export interface YieldProgressionPoint {
  period: string;
  projectedYield: number;
  soilVitality: number;
  moistureStability: number;
}

export interface YieldPredictionReport {
  projectedYield: number;
  yieldChangePercent: number;
  confidenceScore: number;
  growthRate: string;
  growthDurationRemaining: string;
  insights: string[];
  recommendations: string[];
  progressionData: YieldProgressionPoint[];
}



