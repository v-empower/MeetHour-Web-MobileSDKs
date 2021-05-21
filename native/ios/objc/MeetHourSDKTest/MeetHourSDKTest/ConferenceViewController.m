
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
    
    // Join the room.
    MeetHourConferenceOptions *options
        = [MeetHourConferenceOptions fromBuilder:^(MeetHourConferenceOptionsBuilder *builder) {
            NSURL *url = [NSURL URLWithString:self.serverUrl];
            builder.serverURL = url;
            builder.subject = self.subject;
            builder.userInfo.displayName = self.displayName;
            builder.userInfo.email = self.email;
            builder.room = self.room;
            
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

