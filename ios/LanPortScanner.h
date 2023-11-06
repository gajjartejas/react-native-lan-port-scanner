
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNLanPortScannerSpec.h"

@interface LanPortScanner : NSObject <NativeLanPortScannerSpec>
#else
#import <React/RCTBridgeModule.h>

@interface LanPortScanner : NSObject <RCTBridgeModule>
#endif

@end
