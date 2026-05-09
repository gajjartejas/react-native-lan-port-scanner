#import "LanPortScanner.h"
#include <arpa/inet.h>
#include <ifaddrs.h>

@implementation LanPortScanner

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(getNetworkInfo : (RCTPromiseResolveBlock)
                      resolve reject : (RCTPromiseRejectBlock)reject) {
  NSString *address = @"0.0.0.0";
  NSString *subnet = @"0.0.0.0";

  NSMutableDictionary *networkInfo = [[NSMutableDictionary alloc] init];

  struct ifaddrs *interfaces = NULL;
  struct ifaddrs *temp_addr = NULL;

  int success = getifaddrs(&interfaces);

  if (success == 0) {
    temp_addr = interfaces;

    while (temp_addr != NULL) {
      if (temp_addr->ifa_addr == NULL) {
        temp_addr = temp_addr->ifa_next;
        continue;
      }

      if (temp_addr->ifa_addr->sa_family == AF_INET) {
        NSString *ifname = [NSString stringWithUTF8String:temp_addr->ifa_name];

        if ([ifname isEqualToString:@"en0"] || // iPhone WiFi
            [ifname isEqualToString:@"en1"]    // Apple TV WiFi
        ) {
          char addrBuf[INET_ADDRSTRLEN];
          inet_ntop(AF_INET,
                    &((struct sockaddr_in *)temp_addr->ifa_addr)->sin_addr,
                    addrBuf, INET_ADDRSTRLEN);
          address = [NSString stringWithUTF8String:addrBuf];

          char maskBuf[INET_ADDRSTRLEN];
          inet_ntop(AF_INET,
                    &((struct sockaddr_in *)temp_addr->ifa_netmask)->sin_addr,
                    maskBuf, INET_ADDRSTRLEN);
          subnet = [NSString stringWithUTF8String:maskBuf];

          [networkInfo setObject:address forKey:@"ipAddress"];
          [networkInfo setObject:subnet forKey:@"subnetMask"];

          break;
        }
      }

      temp_addr = temp_addr->ifa_next;
    }
  }

  if (interfaces != NULL) {
    freeifaddrs(interfaces);
  }

  resolve(networkInfo);
}

#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeLanPortScannerSpecJSI>(params);
}

#endif

@end
