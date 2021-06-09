//
//  ViewController.h
//  MeetHourSDKTest
//
//  Created by Bharat Raj (VEMP) on 03/06/21.
//

#import <UIKit/UIKit.h>
#import "MHTextField.h"

@interface ViewController : UIViewController<UITextFieldDelegate>
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

