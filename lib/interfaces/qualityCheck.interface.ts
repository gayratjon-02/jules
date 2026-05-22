import type { QualityCheckId, Severity } from "@/lib/enums";

export interface IQualityCheck {
  id: QualityCheckId;
  label: string;
  passed: boolean;
  severity: Severity;
  message: string;
}

export interface IQualityReport {
  checks: IQualityCheck[];
  totalPassed: number;
  totalFailed: number;
  totalWarnings: number;
  overallPassed: boolean;
}
