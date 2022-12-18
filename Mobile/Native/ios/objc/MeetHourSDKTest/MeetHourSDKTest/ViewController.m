//
//  ViewController.m
//  MeetHourSDKTest
//
//  Created by MeetHour, LLC.
//  Copyright © Meet Hour, LLC. All rights reserved.//

#import "ViewController.h"
#import "ConferenceViewController.h"

@interface ViewController ()

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    _avatarUrl = @"https://st.depositphotos.com/1787196/1330/i/950/depositphotos_13301967-stock-photo-furry-blue-monster.jpg";
    
    UITapGestureRecognizer *gestureRecognizer = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(dismissKeyboard)];
       [self.view addGestureRecognizer:gestureRecognizer];
       gestureRecognizer.cancelsTouchesInView = NO;
    _isAudio = YES;
    _isVideoOn = YES;
    self.txtServerURL.text = @"https://meethour.io";
    self.room = nil;
    
    dispatch_async(dispatch_get_global_queue(0,0), ^{
        NSData * data = [[NSData alloc] initWithContentsOfURL: [NSURL URLWithString: self->_avatarUrl]];
            if ( data == nil )
                return;
            dispatch_async(dispatch_get_main_queue(), ^{
                self.imgAvatar.image = [UIImage imageWithData: data];
            });

        });
    
}
- (void)dismissKeyboard
{
     [self.view endEditing:YES];
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
        [[self view] endEditing:YES];
        // Attach the room to the new controller.
        ConferenceViewController *vc = [segue destinationViewController];
        vc.room = self.room;
        vc.pcode = @"5b40602cfea7708895781a8cad71be5b"; // Dynamically pass Encrypted Meeting Password.
        vc.serverUrl = self.txtServerURL.text;
        vc.subject = self.txtSubject.text;
        vc.displayName = self.txtDisplayName.text;
        vc.email = self.txtEmail.text;
        vc.isVideoOn = _isVideoOn;
        vc.isAudioMuted = _isAudio;
    }
}

- (BOOL)textFieldShouldReturn:(UITextField *)textField{
    [textField resignFirstResponder];
    return  YES;
}

@end
