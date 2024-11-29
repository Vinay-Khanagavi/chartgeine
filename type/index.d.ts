// // Types for Election Data Visualization Project

// // Chart Data Point Interface
// export interface ChartDataPoint {
//     name: string;
//     value: number;
//     color: string;
// }

// // Chart Customization Options
// export interface ChartCustomizationOptions {
//     title?: string;
//     subtitle?: string;
//     fontSize?: number;
//     fontFamily?: string;
// }

// // Export Options
// export interface ExportOptions {
//     format: 'png' | 'svg' | 'code';
//     quality?: 'low' | 'medium' | 'high';
// }

// // User Authentication Interface
// export interface UserProfile {
//     id: string;
//     email: string;
//     name: string;
//     profileImage?: string;
//     createdAt: Date;
// }

// // AI Generation Configuration
// export interface AIChartGenerationConfig {
//     dataPrompt: string;
//     chartType: 'pie' | 'bar' | 'line' | 'scatter';
//     complexity?: 'simple' | 'moderate' | 'advanced';
// }

// // Visualization State
// export interface VisualizationState {
//     data: ChartDataPoint[];
//     customization: ChartCustomizationOptions;
//     generatedAt: Date;
// }

// // Error Handling
// export interface ApiError {
//     code: string;
//     message: string;
//     timestamp: Date;
// }

// // Chart Component Props
// export interface PieChartProps {
//     data: ChartDataPoint[];
//     title?: string;
//     subtitle?: string;
//     onExport?: (options: ExportOptions) => void;
// }

// // Authentication Context
// export interface AuthContextType {
//     user: UserProfile | null;
//     login: () => Promise<void>;
//     logout: () => Promise<void>;
//     isAuthenticated: boolean;
// }

// // Visualization History Entry
// export interface VisualizationHistoryEntry extends VisualizationState {
//     id: string;
//     userId: string;
// }