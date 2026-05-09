![logo](docs/logo.png 'react-native-lan-port-scanner')

# react-native-lan-port-scanner

A simple port scanner for react native.

[![npm version](https://badge.fury.io/js/react-native-lan-port-scanner.svg)](https://www.npmjs.org/package/react-native-lan-port-scanner)
[![npm](https://img.shields.io/npm/dt/react-native-lan-port-scanner.svg)](https://www.npmjs.org/package/react-native-lan-port-scanner)
[![MIT](https://img.shields.io/dub/l/vibe-d.svg)](https://opensource.org/licenses/MIT)
<br>
[![Platform - Android](https://img.shields.io/badge/platform-Android-3ddc84.svg?style=flat&logo=android)](https://www.android.com)
[![Platform - iOS](https://img.shields.io/badge/platform-iOS-000.svg?style=flat&logo=apple)](https://developer.apple.com/ios)
[![New Architecture](https://img.shields.io/badge/new%20architecture-supported-brightgreen)](https://github.com/reactwg/react-native-new-architecture)

## Installation

This package requires [react-native-tcp](https://github.com/gajjartejas/react-native-tcp) as a peer dependency.

```sh
yarn add react-native-lan-port-scanner react-native-tcp
```

or

```sh
npm install react-native-lan-port-scanner react-native-tcp
```

### iOS Setup

After installing the packages, you need to install the pods:

```sh
npx pod-install
```

Make sure you have added `NSExceptionAllowsInsecureHTTPLoads` to `localhost` in your `info.plist` in case of insecure connections:

```xml
<key>NSAppTransportSecurity</key>
<dict>
  <key>NSExceptionDomains</key>
  <dict>
    <key>localhost</key>
    <dict>
      <key>NSExceptionAllowsInsecureHTTPLoads</key>
      <true/>
    </dict>
  </dict>
</dict>
```

## Usage

### Scan network's hosts with specific ports

```js
import LanPortScanner, { LSScanConfig } from 'react-native-lan-port-scanner';

// Get current network info
const networkInfo = await LanPortScanner.getNetworkInfo();

const config1: LSScanConfig = {
  networkInfo: networkInfo,
  ports: [80, 8085], // Specify ports here
  timeout: 1000,    // Timeout for each thread in ms
  threads: 150,     // Number of threads
};

// OR provide a specific IP range

const ipRange = ['192.168.1.1', '192.168.1.112'];
const config2: LSScanConfig = {
  ipRange: ipRange,  // It will only scan provided ipRange
  ports: [80, 8085],
  timeout: 1000,
  threads: 150,
};

// Start the scan
const cancelScanHandle = LanPortScanner.startScan(
  config1, // or config2
  (totalHosts: number, hostScanned: number) => {
    console.log(`Progress: ${hostScanned / totalHosts}`);
  },
  (result) => {
    // result is LSSingleScanResult or null
    if (result) {
      console.log('Host found:', result);
    }
  },
  (results) => {
    // results is LSSingleScanResult[]
    console.log('Scan finished. All found hosts:', results);
  }
);

// You can cancel scan later
setTimeout(() => {
  cancelScanHandle();
}, 5000);
```

### Scan specific host with port

```js
// Returns `LSSingleScanResult`
const result = await LanPortScanner.scanHost('192.168.1.1', 80, 1000);
```

### Get network info

```js
// Returns `LSNetworkInfo`
const networkInfo = await LanPortScanner.getNetworkInfo();
```

## API

- **Types:**
  - [`LSScanConfig`](#LSScanConfig)
  - [`LSNetworkInfo`](#lsnetworkinfo)
  - [`LSNetworkInfoExtra`](#lsnetworkinfoextra)
  - [`LSSingleScanResult`](#lssinglescanresult)

- **Methods:**
  - [`getNetworkInfo()`](#getnetworkinfo)
  - [`generateIPRange()`](#generateiprange)
  - [`startScan()`](#startscan)
  - [`scanHost()`](#scanhost)

### Types

#### `LSScanConfig`

Used to configure the network scan.

| Property      | Type                      | Description                                                  |
| ------------- | ------------------------- | ------------------------------------------------------------ |
| `networkInfo` | `LSNetworkInfo`           | Optional. Contains IP address and subnet mask to scan.       |
| `ipRange`     | `string[]`                | Optional. Array of IP addresses to scan directly.            |
| `ports`       | `number[]` or `undefined` | Ports to scan, default: `[80, 443]`                          |
| `timeout`     | `number` or `undefined`   | Timeout for each connection attempt in ms, default: `1000 ms`|
| `threads`     | `number` or `undefined`   | Number of concurrent threads, default: `50`                  |
| `logging`     | `boolean`                 | Enable or disable logging, default: `false`                  |

#### `LSNetworkInfo`

Basic network information.

| Property     | Type     | Description |
| ------------ | -------- | ----------- |
| `ipAddress`  | `string` | IP Address  |
| `subnetMask` | `string` | Subnet mask |

#### `LSNetworkInfoExtra`

Detailed network information including generated IP range.

| Property       | Type             | Description                                                                        |
| -------------- | ---------------- | ---------------------------------------------------------------------------------- |
| `ipAddress`    | `string`         | IP Address                                                                         |
| `subnetMask`   | `string`         | Subnet mask                                                                        |
| `subnetConv`   | `number or null` | A CIDR prefix length for a valid IPv4 netmask or null if the netmask is not valid. |
| `firstHost`    | `string`         | The network address for a given IPv4 interface and netmask.                        |
| `lastHost`     | `string`         | The broadcast address for a given IPv4 interface and netmask.                      |
| `firstHostHex` | `string`         | First host address in hex representation.                                          |
| `lastHostHex`  | `string`         | Last host address in hex representation.                                           |
| `ipRange`      | `string[]`       | Array of generated IP addresses.                                                   |

#### `LSSingleScanResult`

Result of a successful port scan on a host.

| Property | Type     | Description |
| -------- | -------- | ----------- |
| `ip`     | `string` | IP Address  |
| `port`   | `number` | Port number |

### Methods

#### `getNetworkInfo()`

Returns current network information.

```javascript
const networkInfo = await LanPortScanner.getNetworkInfo();
```

#### `startScan(config, onProgress, onHostFound, onFinish)`

Starts scanning multiple hosts and ports based on the configuration.

#### `generateIPRange(info)`

Generates an array of IP addresses based on network info.

```javascript
const networkInfo = await LanPortScanner.getNetworkInfo();
const ipRangeInfo = LanPortScanner.generateIPRange(networkInfo);
```

#### `scanHost(ip, port, timeout)`

Scans a single host for a specific port.

```javascript
const result = await LanPortScanner.scanHost('192.168.1.1', 80, 1000);
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

## Credits

- [Shift8 Web](https://shift8web.ca/2019/03/how-to-build-a-port-scanner-with-javascript-using-react-native/) for the original tutorial.
- [react-native-netinfo](https://github.com/react-native-netinfo/react-native-netinfo) by [The React Native Community](https://reactnative.dev/help).
- [Local area icons](https://www.flaticon.com/free-icons/local-area) created by Eucalyp - Flaticon.

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)

