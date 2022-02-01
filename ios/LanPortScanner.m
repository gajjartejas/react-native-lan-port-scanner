#import "LanPortScanner.h"
#import <CoreTelephony/CTTelephonyNetworkInfo.h>
#import <CoreTelephony/CTCarrier.h>
#include <ifaddrs.h>
#include <arpa/inet.h>
@implementation LanPortScanner

NSString * const TYPE_ANY = @"any";
NSString * const TYPE_CONFIGURATION = @"config";
NSString * const TYPE_TELEPHONY = @"telephony";

RCT_EXPORT_MODULE(LanPortScannerModule);

RCT_EXPORT_METHOD(
                  getNetworkInfo:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{

    NSString *address = @"0.0.0.0";
    NSString *subnet = @"0.0.0.0";

    NSMutableDictionary *networkInfo = [[NSMutableDictionary alloc] init];

    struct ifaddrs *interfaces = NULL;
    struct ifaddrs *temp_addr = NULL;
    int success = 0;
    // retrieve the current interfaces - returns 0 on success
    success = getifaddrs(&interfaces);
    if (success == 0) {
      // Loop through linked list of interfaces
      temp_addr = interfaces;
      while (temp_addr != NULL) {
        if (temp_addr->ifa_addr->sa_family == AF_INET) {
          NSString* ifname = [NSString stringWithUTF8String:temp_addr->ifa_name];
          if (
            // Check if interface is en0 which is the wifi connection on the iPhone
            // and the ethernet connection on the Apple TV
            [ifname isEqualToString:@"en0"] ||
            // Check if interface is en1 which is the wifi connection on the Apple TV
            [ifname isEqualToString:@"en1"]
          ) {
            // Get NSString from C String
            char str[INET_ADDRSTRLEN];
            inet_ntop(AF_INET, &((struct sockaddr_in *)temp_addr->ifa_addr)->sin_addr, str, INET_ADDRSTRLEN);
            address = [NSString stringWithUTF8String:str];
           
              char str1[INET_ADDRSTRLEN];
                       inet_ntop(AF_INET, &((struct sockaddr_in *)temp_addr->ifa_netmask)->sin_addr, str1, INET_ADDRSTRLEN);
                       subnet = [NSString stringWithUTF8String:str1];
              
              [networkInfo setObject:address forKey:@"localIPAddress"];
              [networkInfo setObject:subnet forKey:@"localNetMask"];
          }
        }

        temp_addr = temp_addr->ifa_next;
      }
    }
    // Free memory
    freeifaddrs(interfaces);
      resolve(networkInfo);
}


@end
