import React, {useRef, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
  TouchableOpacity,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import LanPortScanner, {
  LSConfig,
  LSSingleScanResult,
} from 'react-native-lan-port-scanner';

const Section: React.FC<{
  title: string;
  children: any;
}> = ({children, title}) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const resultsRef = useRef<LSSingleScanResult[]>([]);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  const [ipAddress, setIPAddress] = useState('');
  const [subnetMask, setSubnetMask] = useState('');
  const [ports, setPorts] = useState('80, 443, 21, 22, 110, 995, 143, 993');
  const [progress, setProgress] = useState('');
  const [resultItems, setResultItems] = useState<LSSingleScanResult[]>([]);

  const validateIPAddresses = (ipaddress: string): boolean => {
    return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
      ipaddress,
    );
  };

  const getInfo = async () => {
    //Returns `LSNetworkInfo`
    const networkInfo = await LanPortScanner.getNetworkInfo();

    //Set values
    setIPAddress(networkInfo.ipAddress);
    setSubnetMask(networkInfo.subnetMask);
  };

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

    let config: LSConfig = {
      networkInfo: networkInfo,
      ports: portArray, //Specify port here
      timeout: 1000, //Timeout for each thread in ms
      threads: 150, //Number of threads
      logging: true, //Enable logging
    };
    LanPortScanner.startScan(
      config,
      (totalHosts: number, hostScanned: number) => {
        setProgress(`${((hostScanned * 100) / totalHosts).toFixed(2)}`);
      },
      result => {
        if (result) {
          resultsRef.current.push(result);
          setResultItems([...resultsRef.current]);
          console.log(result); //This will call after new ip/port found.
        }
      },
      results => {
        console.log(results); // This will call after scan end.
        setProgress('');
      },
    );
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
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
          <TouchableOpacity style={styles.button} onPress={getInfo}>
            <Text style={styles.buttonText}>{'Get Info'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={startScan}>
            <Text style={styles.buttonText}>{'Start Scan'}</Text>
          </TouchableOpacity>

          {!!progress && (
            <Text style={styles.progress}>{`Prgoress: ${progress}`}</Text>
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
