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

        const scanResult: LSSingleScanResult = {
          ip: hostIP,
          port: hostPort,
        };
        resolve(scanResult);
        client.end();
      }
    );

    client.on('error', (error: any) => {
      if (logging) {
        console.log(
          'scanHost->on error->host: ${hostIP} port: ${hostPort} error:',
          error
        );
      }

      client.end();
      reject();
    });

    client.on('close', () => {
      if (logging) {
        console.log(`scanHost->on close->host: ${hostIP} port: ${hostPort}`);
      }
      reject();
    });

    setTimeout(() => {
      if (logging) {
        console.log(
          `scanHost->force timeout->host: ${hostIP} port: ${hostPort}`
        );
      }

      client.destroy();
      reject();
    }, timeout + 10);
  });
};

export default scanHost;
