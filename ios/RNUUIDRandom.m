#import <React/RCTBridgeModule.h>
#import <Security/Security.h>

// Supplies cryptographically secure random bytes to react-native-uuid when
// the JS runtime has no crypto.getRandomValues (e.g. Hermes without a polyfill).
@interface RNUUIDRandom : NSObject <RCTBridgeModule>
@end

@implementation RNUUIDRandom

RCT_EXPORT_MODULE(RNUUIDRandom)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

// Returns `length` random bytes as base64, or nil on failure.
RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getRandomBase64 : (nonnull NSNumber *)length)
{
  NSUInteger count = [length unsignedIntegerValue];
  if (count == 0 || count > 65536) {
    return nil;
  }

  NSMutableData *data = [NSMutableData dataWithLength:count];
  if (SecRandomCopyBytes(kSecRandomDefault, count, data.mutableBytes) != errSecSuccess) {
    return nil;
  }

  return [data base64EncodedStringWithOptions:0];
}

@end
