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

export interface LSConfig {
  networkInfo: LSNetworkInfo;
  ports?: number[];
  timeout?: number;
  threads?: number;
  logging?: boolean;
}

export interface LSConfigExtra {
  networkInfo: LSNetworkInfoExtra;
  ports?: number[];
  timeout?: number;
  threads?: number;
  logging?: boolean;
}

export interface LSSingleScanConfig {
  ip: string;
  port: number;
}
