
#import <UIKit/UIKit.h>

@import MeetHourSDK;


@interface ConferenceViewController : UIViewController<MeetHourViewDelegate>

@property (nonatomic, weak) NSString *room;

@end
