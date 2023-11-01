import React, {useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';

import LanPortScanner, {
  CancelScan,
  LSScanConfig,
  LSSingleScanResult,
} from 'react-native-lan-port-scanner';

const Section: React.FC<{
  title: string;
  children: any;
}> = ({children, title}) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle]}>{title}</Text>
      <Text style={[styles.sectionDescription]}>{children}</Text>
    </View>
  );
};

const validateIPAddresses = (ipaddress: string): boolean => {
  return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
    ipaddress,
  );
};

const backgroundStyle = {
  backgroundColor: 'white',
  flex: 1,
};

const App = () => {
  const resultsRef = useRef<LSSingleScanResult[]>([]);
  const cancelScanRef = useRef<CancelScan | null>(null);

  const [ipAddress, setIPAddress] = useState('');
  const [subnetMask, setSubnetMask] = useState('');
  const [ports, setPorts] = useState('80, 443, 21, 22, 110, 995, 143, 993');
  const [progress, setProgress] = useState('');
  const [resultItems, setResultItems] = useState<LSSingleScanResult[]>([]);
  const [scanning, setScanning] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const networkInfo = await LanPortScanner.getNetworkInfo();

      //Set values
      setIPAddress(networkInfo.ipAddress);
      setSubnetMask(networkInfo.subnetMask);
    })();
  }, []);

  const resetScan = () => {
    resultsRef.current = [];
    setResultItems([]);
  };

  const startScan = async () => {
    resetScan();

    if (!validateIPAddresses(ipAddress)) {
      // @ts-ignore
      // eslint-disable-next-line no-alert
      alert('You have entered an invalid IP address!');
      return;
    }
    if (!validateIPAddresses(ipAddress)) {
      // @ts-ignore
      // eslint-disable-next-line no-alert
      alert('You have entered an invalid subnet mask!');
      return;
    }
    let portArray = ports
      .split(',')
      .map(v => v.trim())
      .filter(v => !!v)
      // eslint-disable-next-line radix
      .map(v => parseInt(v))
      .filter(v => !isNaN(v));

    console.log(portArray);
    if (!portArray || portArray.length < 1) {
      // @ts-ignore
      // eslint-disable-next-line no-alert
      alert('At least one port required');
      return;
    }

    const networkInfo = {
      ipAddress: ipAddress,
      subnetMask: subnetMask,
    };

    //Either provide networkInfo or ipRange
    let config: LSScanConfig = {
      networkInfo: networkInfo,
      //ipRange: ['192.168.1.1'],
      ports: portArray, //Specify port here
      timeout: 1000, //Timeout for each thread in ms
      threads: 150, //Number of threads
      logging: true, //Enable logging
    };
    setScanning(true);
    cancelScanRef.current = LanPortScanner.startScan(
      config,
      (totalHosts: number, hostScanned: number) => {
        setProgress(`${((hostScanned * 100) / totalHosts).toFixed(2)}`);
      },
      (result: LSSingleScanResult | null) => {
        if (result) {
          resultsRef.current.push(result);
          setResultItems([...resultsRef.current]);
          console.log(result); //This will call after new ip/port found.
        }
      },
      (results: LSSingleScanResult[]) => {
        console.log(results); // This will call after scan end.
        setProgress('Finished!');
        setScanning(false);
      },
    );
  };

  const cancelScan = () => {
    if (cancelScanRef.current) {
      cancelScanRef.current();
    }
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View style={backgroundStyle}>
          <Text style={styles.inputHeader}>{'Local IP:'}</Text>
          <TextInput
            onChangeText={setIPAddress}
            value={ipAddress}
            style={styles.textinput}
          />
          <Text style={styles.inputHeader}>{'Subnet mask:'}</Text>
          <TextInput
            onChangeText={setSubnetMask}
            value={subnetMask}
            style={styles.textinput}
          />
          <Text style={styles.inputHeader}>
            {'Enter ports comma seperated:'}
          </Text>
          <TextInput
            onChangeText={setPorts}
            value={ports}
            style={styles.textinput}
          />

          {!scanning && (
            <TouchableOpacity style={styles.button} onPress={startScan}>
              <Text style={styles.buttonText}>{'Start Scan'}</Text>
            </TouchableOpacity>
          )}

          {scanning && (
            <TouchableOpacity style={styles.button} onPress={cancelScan}>
              <Text style={styles.buttonText}>{'Cancel Scan'}</Text>
            </TouchableOpacity>
          )}

          {!!progress && (
            <Text style={styles.progress}>{`Progress: ${progress}`}</Text>
          )}

          {resultItems.map(item => {
            return (
              <Section key={`${item.ip}${item.port}`} title={item.ip}>
                {item.port}
              </Section>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  textinput: {
    height: 40,
    borderWidth: 1,
    padding: 10,
    marginHorizontal: 20,
    marginTop: 4,
    borderColor: '#cccccc',
    borderRadius: 8,
  },
  inputHeader: {
    marginHorizontal: 20,
    fontSize: 16,
    fontWeight: '400',
    marginTop: 16,
  },
  progress: {
    alignSelf: 'center',
  },
  button: {
    backgroundColor: '#cc6555',
    padding: 8,
    marginHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginVertical: 8,
    height: 50,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default App;
