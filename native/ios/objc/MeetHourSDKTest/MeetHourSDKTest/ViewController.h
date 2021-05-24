//
//  ViewController.h
//  MeetHourSDKTest
//
//  Created by MeetHour, LLC.
//  Copyright © Meet Hour, LLC. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "MHTextField.h"

@interface ViewController : UIViewController

@property (nonatomic, weak) IBOutlet MHTextField *textField;
@property (weak, nonatomic) IBOutlet MHTextField *txtServerURL;
@property (weak, nonatomic) IBOutlet MHTextField *txtSubject;
@property (weak, nonatomic) IBOutlet MHTextField *txtDisplayName;
@property (weak, nonatomic) IBOutlet MHTextField *txtEmail;
@property (nonatomic, weak) IBOutlet UIButton *button;
@property (weak, nonatomic) IBOutlet UISwitch *audioSwitch;
@property (weak, nonatomic) IBOutlet UISwitch *videoSwitch;
@property (nonatomic, assign) BOOL isAudio;
@property (nonatomic, assign) BOOL isVideoOn;
@property (nonatomic, copy) NSString *room;


@end
