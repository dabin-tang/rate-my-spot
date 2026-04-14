export interface ReportCreateDTO {
  targetType: 'POST' | 'COMMENT' | 'REVIEW';
  targetId: number;
  reason: string;
}
