import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  getNetworkInfo(): Promise<{ ipAddress: string; subnetMask: string }>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('LanPortScanner');
