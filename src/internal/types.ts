export interface LSNetworkInfo {
  ipAddress: string;
  subnetMask: string;
}

export interface LSNetworkInfoExtra extends LSNetworkInfo {
  subnetConv: string;
  firstHost: string;
  lastHost: string;
  firstHostHex: string;
  lastHostHex: string;
  ipRange: string[];
}

export interface LSSingleScanResult {
  ip: string;
  port: number;
}

export interface LSScanConfig {
  networkInfo?: LSNetworkInfo;
  ipRange?: string[];
  ports?: number[];
  timeout?: number;
  threads?: number;
  logging?: boolean;
}

export interface LSSingleScanConfig {
  ip: string;
  port: number;
}
