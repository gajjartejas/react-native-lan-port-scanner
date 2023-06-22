import type { LSSingleScanResult } from './types';

import TcpSocket from 'react-native-tcp-socket';

const scanHost = (
  hostIP: string,
  hostPort: number,
  timeout: number,
  logging: boolean
): Promise<LSSingleScanResult> => {
  return new Promise<LSSingleScanResult>((resolve, reject) => {
    const client = TcpSocket.createConnection(
      { host: hostIP, port: hostPort },
      () => {
        if(logging) {
          console.log('Connect -> Connected successfully.');
        }

        const scan_result: LSSingleScanResult = {
          ip: hostIP,
          port: hostPort,
        };
        resolve(scan_result);
        client.end();
      }
    );

    client.on('error', (error: any) => {
      if(logging) {
        console.log('error-> ', error);
      }

      client.end();
      reject();
    });

    client.on('close', () => {
      if(logging) {
        console.log('close -> Connection closed');
      }
      reject();
    });

    setTimeout(() => {
      if(logging) {
        console.log('Timeout', hostIP);
      }

      client.destroy();
      reject();
    }, timeout + 10);
  });
};

export default scanHost;
