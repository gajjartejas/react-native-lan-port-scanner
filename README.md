![logo](docs/logo.png 'react-native-lan-port-scanner')

# react-native-lan-port-scanner

A simple port scanner for react native.

[![npm version](https://badge.fury.io/js/react-native-lan-port-scanner.svg)](https://www.npmjs.org/package/react-native-lan-port-scanner)
[![npm](https://img.shields.io/npm/dt/react-native-lan-port-scanner.svg)](https://www.npmjs.org/package/react-native-lan-port-scanner)
[![MIT](https://img.shields.io/dub/l/vibe-d.svg)](https://opensource.org/licenses/MIT)
<br>
[![Platform - Android](https://img.shields.io/badge/platform-Android-3ddc84.svg?style=flat&logo=android)](https://www.android.com)
[![Platform - iOS](https://img.shields.io/badge/platform-iOS-000.svg?style=flat&logo=apple)](https://developer.apple.com/ios)

## Installation

This package requires [react-native-tcp](https://github.com/gajjartejas/react-native-tcp) as dependency. Please follow below steps to install:

```sh
yarn add gajjartejas/react-native-tcp react-native-lan-port-scanner
```

or

```sh
npm install gajjartejas/react-native-tcp react-native-lan-port-scanner
```

after you have to install pods

```sh
npx pod-install
```

## Usage

### Scan network's hosts with specific ports

```js
import LanPortScanner, { LSConfig } from 'react-native-lan-port-scanner';

//Returns `LSNetworkInfo`
const networkInfo = await LanPortScanner.getNetworkInfo();

let config: LSConfig = {
  networkInfo: networkInfo,
  ports: [80, 8085], //Specify port here
  timeout: 1000, //Timeout for each thread in ms
  threads: 150, //Number of threads
};
LanPortScanner.startScan(
  config,
  (totalHosts: number, hostScanned: number) => {
    console.log(hostScanned / totalHosts); //Show progress
  },
  (result) => {
    console.log(result); //This will call after new ip/port found.
  },
  (results) => {
    console.log(results); // This will call after scan end.
  }
);
```

### To scan specific host with port

```js
//Returns `LSSingleScanResult`
let result = await LanPortScanner.scanHost('192.168.1.1', 80, 1000);
```

### To get network info

```js
//Returns `LSNetworkInfo`
const networkInfo = await LanPortScanner.getNetworkInfo();
```

## API

- **Types:**

  - [`LSNetworkInfo`](#lsnetworkinfo)
  - [`LSNetworkInfoExtra`](#lsnetworkinfoextra)
  - [`LSSingleScanResult`](#lssinglescanresult)
  - [`LSScanResult`](#lsscanresult)
  - [`LSConfig`](#lsconfig)

- **Methods:**
  - [`getNetworkInfo()`](#getnetworkinfo)
  - [`generateIPRange()`](#generateiprange)
  - [`startScan()`](#startscan)
  - [`scanHost()`](#scanhost)

### Types

#### `LSConfig`

Used to scan multiple hosts/ports.

| Property      | Type                      | Description                                       |
| ------------- | ------------------------- | ------------------------------------------------- |
| `networkInfo` | `LSNetworkInfo`           | Contains ip address and subnet mask to scan.      |
| `ports`       | `number[]` or `undefined` | Ports to scan, default: `[80, 443]`               |
| `timeout`     | `number` or `undefined`   | Timeout for each thread in ms, default: `1000 ms` |
| `threads`     | `number` or `undefined`   | Number of threads, default: `150`                 |
| `logging`     | `boolean`                 | Enable or disable logging, default: `false`       |

#### `LSNetworkInfo`

Used to generate ip ranges for scanning.

| Property     | Type     | Description |
| ------------ | -------- | ----------- |
| `ipAddress`  | `string` | IP Address  |
| `subnetMask` | `string` | Subnet mask |

#### `LSNetworkInfoExtra`

Contains ip ranges for scanning purpose.

| Property       | Type       | Description                                                                        |
| -------------- | ---------- | ---------------------------------------------------------------------------------- |
| `ipAddress`    | `string`   | IP Address                                                                         |
| `subnetMask`   | `string`   | Subnet mask.                                                                       |
| `subnetConv`   | `string`   | A CIDR prefix length for a valid IPv4 netmask or null if the netmask is not valid. |
| `firstHost`    | `string`   | The network address for a given IPv4 interface and netmask in CIDR notation.       |
| `lastHost `    | `string`   | The broadcast address for a given IPv4 interface and netmask in CIDR notation.     |
| `firstHostHex` | `string`   | First host address in hex representation.                                          |
| `lastHostHex`  | `string`   | Last host address in hex representation.                                           |
| `ipRange`      | `string[]` | Array of ip addresses.                                                             |

#### `LSSingleScanResult`

Returns after host/port found.

| Property | Type     | Description |
| -------- | -------- | ----------- |
| `ip`     | `string` | IP Address  |
| `port`   | `number` | Subnet mask |

#### `LSScanResult`

Returns after scan complete.

| Property | Type       | Description |
| -------- | ---------- | ----------- |
| `ip`     | `string`   | IP Address  |
| `ports`  | `number[]` | Subnet mask |

### Methods

#### `getNetworkInfo()`

Returns `LSNetworkInfo` object.

**Example:**

```javascript
const networkInfo = await LanPortScanner.getNetworkInfo();
```

#### `getNetworkInfo()`

Takes `LSNetworkInfo` and scan all hosts for specified ports.

#### `generateIPRange()`

Takes `LSNetworkInfo`, generates ip address, ports array and return `LSNetworkInfoExtra` object.

**Example:**

```javascript
const networkInfo = await LanPortScanner.getNetworkInfo();
const ipRangeInfo = generateIPRange(config.networkInfo);
```

#### `scanHost()`

Scan single host with port, returns `LSSingleScanResult`

**Example:**

```javascript
let result = await LanPortScanner.scanHost('192.168.1.1', 80, 1000);
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

## Credits

[Shift8 Web](https://shift8web.ca/2019/03/how-to-build-a-port-scanner-with-javascript-using-react-native/) for awsome tutorial.

[react-native-netinfo](https://github.com/react-native-netinfo/react-native-netinfo) by [The React Native Community
](https://reactnative.dev/help)

<a href="https://www.flaticon.com/free-icons/local-area" title="local area icons">Local area icons created by Eucalyp - Flaticon</a>
