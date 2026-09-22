//  ConferenceViewController.m
//  Created by MeetHour, LLC.
//  Copyright © Meet Hour, LLC. All rights reserved.

#import "ConferenceViewController.h"
#import "MeetHourSDK/MeetHourSDK-Swift.h"

@interface ConferenceViewController ()

@end

@implementation ConferenceViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    if (self.room == nil) {
        NSLog(@"Room is nil!");
        
        dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.5 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
            [self dismissViewControllerAnimated:YES completion:nil];
        });
        
        return;
    }

    // Initialize MeetHourView and attach this controller as the delegate.
    self.MHView = [[MeetHourView alloc] initWithFrame:self.view.bounds];
    self.MHView.delegate = self;
    self.MHView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
    [self.view addSubview:self.MHView];

    MeetHourUserInfo *info = [[MeetHourUserInfo alloc] init];
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
            builder.prejoinPageEnabled = YES; // Set to NO if you want to skip prejoin
            builder.disableInviteFunctions = YES;
            
            // Settings for audio and video
            builder.audioMuted = self.isAudioMuted;
            builder.videoMuted = self.isVideoOn;
            [builder setFeatureFlag:@"ios.recording.enabled" withBoolean:YES];
            // PiP needs a host-side PiPViewCoordinator, which is Swift-only. See above.
            [builder setFeatureFlag:@"pip.enabled" withBoolean:NO];
    }];
    
    [self.MHView join:options];

    // Animate in
    self.MHView.alpha = 0;
    [UIView animateWithDuration:0.3 animations:^{
        self.MHView.alpha = 1.0;
    }];
}

- (void)cleanUp {
    [self.MHView removeFromSuperview];
    self.MHView = nil;
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)conferenceWillJoin:(NSDictionary *)data {
    NSLog(@"About to join conference %@", self.room);
}

- (void)enterPictureInPicture:(NSDictionary *)data {
    // Picture-in-Picture is driven by PiPViewCoordinator, which the SDK does not
    // expose to Objective-C (it is a plain Swift class, not @objc). See the Swift
    // sample (swift/MeetHourSDKTest/ViewController.swift) for the PiP integration.
    NSLog(@"Picture-in-Picture requested; not available from Objective-C.");
}

- (void)conferenceJoined:(NSDictionary *)data {
    NSLog(@"Conference %@ joined", self.room);
}

- (void)conferenceTerminated:(NSDictionary *)data {
    NSLog(@"Conference %@ terminated", self.room);
    [self dismissViewControllerAnimated:YES completion:nil];
}

@end
