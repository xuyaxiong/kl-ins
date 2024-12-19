export interface TCPConfig {
  host: string;
  port: number;
}

export interface ReportData {
  modNum: number;
  insNum: number;
  data: number[];
}

export interface ReportDataHandler {
  (data: ReportData): Promise<void>;
}

export interface OnSuccess {
  (): void;
}

export interface OnFailed {
  (): void;
}
