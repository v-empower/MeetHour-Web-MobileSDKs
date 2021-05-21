//
//  ViewController.m
//  MeetHourSDKTest
//
//  Created by Saúl Ibarra Corretgé on 03/04/2019.
//  Copyright © 2019 Saúl Ibarra Corretgé. All rights reserved.
//

#import "ViewController.h"
#import "ConferenceViewController.h"

@interface ViewController ()

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    _isAudio = YES;
    _isVideoOn = YES;
    self.txtServerURL.text = @"https://meethour.io";
    self.room = nil;
}

- (IBAction)aMethodAudio:(UISwitch *)sender {
        self.isAudio = !self.isAudio;
}
- (IBAction)aMethodVideo:(UISwitch *)sender {
    self.isVideoOn = !self.isVideoOn;
}

- (BOOL)shouldPerformSegueWithIdentifier:(NSString *)identifier sender:(id)sender {
    // Don't present the ConferenceViewController if no room was specified.
    if ([identifier isEqualToString:@"joinConference"]) {
        self.room = self.textField.text;
        if (self.room == nil || [self.room length] == 0) {
            return NO;
        }
    }
    
    return YES;
}

- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    if ([[segue identifier] isEqualToString:@"joinConference"]) {
        // Attach the room to the new controller.
        ConferenceViewController *vc = [segue destinationViewController];
        vc.room = self.room;
        vc.serverUrl = self.txtServerURL.text;
        vc.subject = self.txtSubject.text;
        vc.displayName = self.txtDisplayName.text;
        vc.email = self.txtEmail.text;
        vc.isVideoOn = _isVideoOn;
        vc.isAudioMuted = _isAudio;
    }
}

@end
