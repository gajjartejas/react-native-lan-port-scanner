#import "LanPortScanner.h"
#include <arpa/inet.h>
#include <ifaddrs.h>
#include <net/if.h>

@implementation LanPortScanner

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(getNetworkInfo : (RCTPromiseResolveBlock)
                      resolve reject : (RCTPromiseRejectBlock)reject) {
  NSString *address = nil;
  NSString *subnet = nil;

  NSMutableDictionary *networkInfo = [[NSMutableDictionary alloc] init];

  struct ifaddrs *interfaces = NULL;
  struct ifaddrs *temp_addr = NULL;

  int success = getifaddrs(&interfaces);

  if (success == 0) {
    temp_addr = interfaces;

    NSString *fallbackAddress = nil;
    NSString *fallbackSubnet = nil;

    while (temp_addr != NULL) {
      if (temp_addr->ifa_addr != NULL && temp_addr->ifa_addr->sa_family == AF_INET) {
        // Skip loopback interfaces and only consider active interfaces
        if (!(temp_addr->ifa_flags & IFF_LOOPBACK) && (temp_addr->ifa_flags & IFF_UP)) {
          char addrBuf[INET_ADDRSTRLEN];
          inet_ntop(AF_INET,
                    &((struct sockaddr_in *)temp_addr->ifa_addr)->sin_addr,
                    addrBuf, INET_ADDRSTRLEN);
          NSString *currentAddress = [NSString stringWithUTF8String:addrBuf];

          char maskBuf[INET_ADDRSTRLEN] = "255.255.255.0";
          if (temp_addr->ifa_netmask != NULL) {
            inet_ntop(AF_INET,
                      &((struct sockaddr_in *)temp_addr->ifa_netmask)->sin_addr,
                      maskBuf, INET_ADDRSTRLEN);
          }
          NSString *currentSubnet = [NSString stringWithUTF8String:maskBuf];

          if (![currentAddress isEqualToString:@"0.0.0.0"] && ![currentAddress isEqualToString:@"127.0.0.1"]) {
            NSString *ifname = [NSString stringWithUTF8String:temp_addr->ifa_name];

            // Prioritize en0 (WiFi) or en1
            if ([ifname isEqualToString:@"en0"] || [ifname isEqualToString:@"en1"]) {
              address = currentAddress;
              subnet = currentSubnet;
              break;
            } else if (fallbackAddress == nil) {
              // Keep first active interface (e.g. Simulator, Ethernet, bridge) as fallback
              fallbackAddress = currentAddress;
              fallbackSubnet = currentSubnet;
            }
          }
        }
      }

      temp_addr = temp_addr->ifa_next;
    }

    if (address == nil && fallbackAddress != nil) {
      address = fallbackAddress;
      subnet = fallbackSubnet;
    }
  }

  if (interfaces != NULL) {
    freeifaddrs(interfaces);
  }

  if (address != nil && subnet != nil) {
    [networkInfo setObject:address forKey:@"ipAddress"];
    [networkInfo setObject:subnet forKey:@"subnetMask"];
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
