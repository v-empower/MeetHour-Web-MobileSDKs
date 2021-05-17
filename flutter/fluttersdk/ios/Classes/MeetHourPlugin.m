#import "MeetHourPlugin.h"
#if __has_include(<meet_hour/meet_hour-Swift.h>)
#import <meet_hour/meet_hour-Swift.h>
#else
// Support project import fallback if the generated compatibility header
// is not copied when this plugin is created as a library.
// https://forums.swift.org/t/swift-static-libraries-dont-copy-generated-objective-c-header/19816
#import "meet_hour-Swift.h"
#endif

@implementation MeetHourPlugin
+ (void)registerWithRegistrar:(NSObject<FlutterPluginRegistrar>*)registrar {
  [SwiftMeetHourPlugin registerWithRegistrar:registrar];
}
@end
