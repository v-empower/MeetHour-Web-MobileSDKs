
#import "ConferenceViewController.h"

@interface ConferenceViewController ()

@end

@implementation ConferenceViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    if (self.room == nil) {
        NSLog(@"Room is nul!");

        dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.5 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
            [self dismissViewControllerAnimated:YES completion:nil];
        });

        return;
    }

    // Attach this controller as the delegate.
    MeetHourView *MHView = (MeetHourView*)self.view;
    MHView.delegate = self;
    
    MeetHourUserInfo *info = [[MeetHourUserInfo alloc]init];
    info.displayName = self.displayName;
    info.email = self.email;
    
    // Join the room.
    MeetHourConferenceOptions *options
        = [MeetHourConferenceOptions fromBuilder:^(MeetHourConferenceOptionsBuilder *builder) {
            NSURL *url = [NSURL URLWithString:self.serverUrl];
            builder.serverURL = url;
            builder.subject = self.subject;
            builder.userInfo = info;
            builder.room = self.room;
            builder.pcode = self.pcode;
            builder.prejoinPageEnabled = true; // Set to false if you want to skip prejoin
            builder.disableInviteFunctions = true;
            
            // Settings for audio and video
            builder.audioMuted = self.isAudioMuted;
            builder.videoMuted = self.isVideoOn;
            [builder setFeatureFlag:@"ios.recording.enabled" withBoolean:YES];
            // Set different feature flags
            // [builder setFeatureFlag:@"toolbox.enabled" withBoolean:NO];
            // [builder setFeatureFlag:@"filmstrip.enabled" withBoolean:NO];
        }];
    [MHView join:options];
}

- (void)conferenceWillJoin:(NSDictionary *)data {
    NSLog(@"About to join conference %@", self.room);
}

- (void)conferenceJoined:(NSDictionary *)data {
    NSLog(@"Conference %@ joined", self.room);
}

- (void)conferenceTerminated:(NSDictionary *)data {
    NSLog(@"Conference %@ terminated", self.room);
    [self dismissViewControllerAnimated:YES completion:nil];
}
@end

