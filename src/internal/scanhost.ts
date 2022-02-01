// import TcpSocket from 'react-native-tcp-socket';
// import type { ConnectionOptions } from 'react-native-tcp-socket/lib/types/Socket';
import type { LSSingleScanResult } from './types';
var net = require('react-native-tcp');

const scanHost = (
  hostIP: string,
  hostPort: number,
  timeout: number
): Promise<LSSingleScanResult> => {
  return new Promise<LSSingleScanResult>((resolve, reject) => {
    let client: Object = net.createConnection(
      { host: hostIP, port: hostPort, timeout },
      () => {
        console.log('Connect -> Connected successfully.');

        var scan_result: LSSingleScanResult = {
          ip: hostIP,
          port: hostPort,
        };
        resolve(scan_result);
        //@ts-ignore
        client.end();
      }
    );
    //@ts-ignore
    client.on('error', (error) => {
      console.log('error-> ', error);
      //@ts-ignore
      client.end();
      reject();
    });

    //@ts-ignore
    client.on('close', () => {
      console.log('close -> Connection closed');
      reject();
    });

    setTimeout(() => {
      console.log('Timeout', hostIP);
      //@ts-ignore
      client.destroy();
      reject();
    }, timeout + 10);
  });
};

export default scanHost;
