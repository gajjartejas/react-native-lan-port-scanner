import type { LSSingleScanResult } from './types';
const net = require('react-native-tcp');

const scanHost = (
  hostIP: string,
  hostPort: number,
  timeout: number
): Promise<LSSingleScanResult> => {
  return new Promise<LSSingleScanResult>((resolve, reject) => {
    const client = net.createConnection(
      { host: hostIP, port: hostPort, timeout },
      () => {
        console.log('Connect -> Connected successfully.');

        const scan_result: LSSingleScanResult = {
          ip: hostIP,
          port: hostPort,
        };
        resolve(scan_result);
        client.end();
      }
    );

    client.on('error', (error: any) => {
      console.log('error-> ', error);

      client.end();
      reject();
    });

    client.on('close', () => {
      console.log('close -> Connection closed');
      reject();
    });

    setTimeout(() => {
      console.log('Timeout', hostIP);

      client.destroy();
      reject();
    }, timeout + 10);
  });
};

export default scanHost;
