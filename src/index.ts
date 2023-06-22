import { NativeModules } from 'react-native';
import scanHost from './internal/scanhost';
import asyncPool from 'tiny-async-pool';
import type * as Types from './internal/types';

const { LanPortScannerModule } = NativeModules;

const sip = require('shift8-ip-func');
const ipaddr = require('ipaddr.js');

const getNetworkInfo = (): Promise<Types.LSNetworkInfo> => {
  return new Promise<Types.LSNetworkInfo>((resolve, reject) => {
    LanPortScannerModule.getNetworkInfo()
      .then((result: Types.LSNetworkInfo) => {
        resolve(result);
      })
      .catch((e: any) => {
        reject(e);
      });
  });
};

const generateIPRange = (
  info: Types.LSNetworkInfo
): Types.LSNetworkInfoExtra => {
  const { subnetMask, ipAddress } = info;

  const subconv = ipaddr.IPv4.parse(subnetMask).prefixLengthFromSubnetMask();

  const firstHost = ipaddr.IPv4.networkAddressFromCIDR(
    ipAddress + '/' + subconv
  );
  const lastHost = ipaddr.IPv4.broadcastAddressFromCIDR(
    ipAddress + '/' + subconv
  );
  const firstHostHex = sip.convertIPtoHex(firstHost);
  const lastHostHex = sip.convertIPtoHex(lastHost);
  let ipRange = sip.getIPRange(firstHostHex, lastHostHex);
  ipRange = ipRange.slice(1);

  return {
    subnetConv: subconv,
    firstHost: firstHost,
    lastHost: lastHost,
    firstHostHex: firstHostHex,
    lastHostHex: lastHostHex,
    ipRange: ipRange,
    ipAddress: ipAddress,
    subnetMask: subnetMask,
  };
};

const startScan = (
  config: Types.LSConfig,
  onProgress: (totalHosts: number, hostScanned: number) => void,
  onHostFound: (host: Types.LSSingleScanResult | null) => void,
  onFinish: (result: Types.LSSingleScanResult[]) => void
): void => {
  if (!config.networkInfo) {
    if(config.logging) {
      console.warn('Input networkInfo is required.');
    }
    return;
  }

  const ipRangeInfo = generateIPRange(config.networkInfo);

  const logging = config.logging || false;
  const ipRange = ipRangeInfo.ipRange;
  const ports = config.ports ? config.ports : [80, 443];
  const timeout = config.timeout ? config.timeout : 1000;
  const threads = config.threads ? config.threads : 50;

  const allIPs: Types.LSSingleScanConfig[] = [];

  const totalHosts = ipRange.length * ports.length;
  let hostScanned = 0;

  for (let i = 0; i < ipRange.length; i++) {
    for (let j = 0; j < ports.length; j++) {
      allIPs.push({ ip: ipRange[i], port: ports[j] });
    }
  }

  const scanSingleHost = (info: Types.LSSingleScanConfig) => {
    return new Promise((resolve) => {
      scanHost(info.ip, info.port, timeout, logging)
        .then((result) => {
          resolve(result);
          hostScanned += 1;
          onProgress(totalHosts, hostScanned);
          onHostFound(result);
        })
        .catch(() => {
          resolve(null);
          hostScanned += 1;
          onProgress(totalHosts, hostScanned);
          onHostFound(null);
        });
    });
  };

  asyncPool(threads, allIPs, scanSingleHost)
    .then((results) => {
      onFinish(results.filter((v) => v) as Types.LSSingleScanResult[]);
    })
    .catch((v) => {
      if(logging) {
        console.log(v);
      }
    });
};

export * from './internal/types';

export default {
  getNetworkInfo,
  generateIPRange,
  startScan,
  scanHost,
};
