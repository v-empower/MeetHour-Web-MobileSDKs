
#import <UIKit/UIKit.h>

@import MeetHourSDK;


@interface ConferenceViewController : UIViewController<MeetHourViewDelegate>


@property (nonatomic, weak) NSString *room;
@property (nonatomic, copy) NSString *serverUrl;
@property (nonatomic, copy) NSString *subject;
@property (nonatomic, copy) NSString *displayName;
@property (nonatomic, copy) NSString *email;
@property (nonatomic, assign) BOOL isAudioMuted;
@property (nonatomic, assign) BOOL isVideoOn;

@end
