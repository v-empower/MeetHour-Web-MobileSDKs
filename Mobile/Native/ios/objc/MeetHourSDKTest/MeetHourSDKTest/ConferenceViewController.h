
#import <UIKit/UIKit.h>

@import MeetHourSDK;

@interface ConferenceViewController : UIViewController<MeetHourViewDelegate>

@property (nonatomic, weak) NSString *room;
@property (nonatomic, copy) NSString *serverUrl;
@property (nonatomic, copy) NSString *subject;
@property (nonatomic, copy) NSString *displayName;
@property (nonatomic, copy) NSString *email;
@property (nonatomic, copy) NSString *pcode;
@property (nonatomic, assign) BOOL isAudioMuted;
@property (nonatomic, assign) BOOL isVideoOn;
@property (nonatomic, strong) PiPViewCoordinator *pipViewCoordinator;
@property (nonatomic, strong) MeetHourView *MHView;

@end
