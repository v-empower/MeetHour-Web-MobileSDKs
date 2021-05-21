//
//  ViewController.h
//  MeetHourSDKTest
//
//  Created by Saúl Ibarra Corretgé on 03/04/2019.
//  Copyright © 2019 Saúl Ibarra Corretgé. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "CBRTextField.h"

@interface ViewController : UIViewController

@property (nonatomic, weak) IBOutlet CBRTextField *textField;
@property (weak, nonatomic) IBOutlet CBRTextField *txtServerURL;
@property (weak, nonatomic) IBOutlet CBRTextField *txtSubject;
@property (weak, nonatomic) IBOutlet CBRTextField *txtDisplayName;
@property (weak, nonatomic) IBOutlet CBRTextField *txtEmail;
@property (nonatomic, weak) IBOutlet UIButton *button;
@property (weak, nonatomic) IBOutlet UISwitch *audioSwitch;
@property (weak, nonatomic) IBOutlet UISwitch *videoSwitch;
@property (nonatomic, assign) BOOL isAudio;
@property (nonatomic, assign) BOOL isVideoOn;
@property (nonatomic, copy) NSString *room;


@end
