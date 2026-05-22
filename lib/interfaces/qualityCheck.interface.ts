import type { Severity } from "@/lib/enums";

export interface IQualityCheck {
  passed: boolean;
  message: string;
  severity: Severity;
}

export interface IQualityReport {
  score: number;
  checks: IQualityCheck[];
}
