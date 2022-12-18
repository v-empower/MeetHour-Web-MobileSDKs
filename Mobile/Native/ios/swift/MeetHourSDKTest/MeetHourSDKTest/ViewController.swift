//  Created by MeetHour, LLC.
//  Copyright © Meet Hour, LLC. All rights reserved.

import UIKit
import MeetHourSDK

class ViewController: UIViewController {
    
    var isAudioMute : Bool = true
    var isVideoOn : Bool = true


    @IBOutlet weak var txtServerURL: UITextField!{
        didSet{
            txtServerURL.setLeftPaddingPoints(10)
        }
    }
    @IBOutlet weak var txtRoomName: UITextField!{
        didSet{
            txtRoomName.setLeftPaddingPoints(10)
        }
    }
    @IBOutlet weak var txtSubject: UITextField!{
        didSet{
            txtSubject.setLeftPaddingPoints(10)
        }
    }
    @IBOutlet weak var txtDisplayName: UITextField!{
        didSet{
            txtDisplayName.setLeftPaddingPoints(10)
        }
    }
    @IBOutlet weak var txtEmail: UITextField!{
        didSet{
            txtEmail.setLeftPaddingPoints(10)
        }
    }
    
    @IBOutlet weak var videoButton: UIButton?
    @IBOutlet weak var imgAvatar: UIImageView!
    
    
    let imgUrl : String = "https://st.depositphotos.com/1787196/1330/i/950/depositphotos_13301967-stock-photo-furry-blue-monster.jpg"
    
    fileprivate var pipViewCoordinator: PiPViewCoordinator?
    fileprivate var MHView: MeetHourView?

    override func viewDidLoad() {
        super.viewDidLoad()
        
        let url = URL(string: imgUrl)!
            DispatchQueue.global().async {
                if let data = try? Data(contentsOf: url) {
                    DispatchQueue.main.async {
                        self.imgAvatar.image = UIImage(data: data)
                    }
                }
            }
        let gestureRecognizer = UITapGestureRecognizer(target: self, action: #selector(self.dismissKeyboard))
            view.addGestureRecognizer(gestureRecognizer)
            gestureRecognizer.cancelsTouchesInView = false
        self.txtServerURL.text = "https://meethour.io"
    }

    @objc func dismissKeyboard() {
        view.endEditing(true)
    }
    
    override func viewWillTransition(to size: CGSize,
                                     with coordinator: UIViewControllerTransitionCoordinator) {
        super.viewWillTransition(to: size, with: coordinator)

        let rect = CGRect(origin: CGPoint.zero, size: size)
        pipViewCoordinator?.resetBounds(bounds: rect)
    }


    
    @IBAction func aMethodAudio(_ sender: UISwitch) {
        isAudioMute = !isAudioMute

    }
    
    
    @IBAction func aMethodVideoOn(_ sender: UISwitch) {
        isVideoOn = !isVideoOn
    }
    
    // MARK: - Actions

    @IBAction func openMeetHour(sender: Any?) {
        
        view.endEditing(true)
        cleanUp()
        
        let info: MeetHourUserInfo = MeetHourUserInfo()
        info.displayName = self.txtDisplayName.text
        info.email = self.txtEmail.text
        info.avatar = URL(string: imgUrl)
        
        if txtRoomName.text!.count > 0{
            // create and configure Meet Hour view
            let MHView = MeetHourView()
            MHView.delegate = self
            self.MHView = MHView
            let options = MeetHourConferenceOptions.fromBuilder { (builder) in
                builder.welcomePageEnabled = false
                builder.subject = self.txtSubject.text
                builder.audioMuted = self.isAudioMute
                builder.videoMuted = self.isVideoOn
                builder.serverURL = URL(string: self.txtServerURL.text!)
                builder.userInfo = info
                builder.room = self.txtRoomName.text
                builder.pcode = "@5b40602cfea7708895781a8cad71be5b"
                builder.setFeatureFlag("ios.recording.enabled", withBoolean: true)
            }
            MHView.join(options)

            // Enable meet hour view to be a view that can be displayed
            // on top of all the things, and let the coordinator to manage
            // the view state and interactions
            pipViewCoordinator = PiPViewCoordinator(withView: MHView)
            pipViewCoordinator?.configureAsStickyView(withParentView: view)

            // animate in
            MHView.alpha = 0
            pipViewCoordinator?.show()
        }else{
            let alert = UIAlertController(title: "Alert", message: "Please enter room name.", preferredStyle: .alert)
            alert.addAction(UIAlertAction(title: "Okay", style: .cancel, handler: nil))
            self.present(alert, animated: true)
        }
    }

    fileprivate func cleanUp() {
        MHView?.removeFromSuperview()
        MHView = nil
        pipViewCoordinator = nil
    }
}

extension ViewController: MeetHourViewDelegate {
    func conferenceTerminated(_ data: [AnyHashable : Any]!) {
        DispatchQueue.main.async {
            self.pipViewCoordinator?.hide() { _ in
                self.cleanUp()
            }
        }
    }

    func enterPicture(inPicture data: [AnyHashable : Any]!) {
        DispatchQueue.main.async {
            self.pipViewCoordinator?.enterPictureInPicture()
        }
    }
}

extension ViewController: UITextFieldDelegate{
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        textField.resignFirstResponder()
        return true
    }
}


extension UITextField {
    func setLeftPaddingPoints(_ amount:CGFloat){
        let paddingView = UIView(frame: CGRect(x: 0, y: 0, width: amount, height: self.frame.size.height))
        self.leftView = paddingView
        self.leftViewMode = .always
    }
    func setRightPaddingPoints(_ amount:CGFloat) {
        let paddingView = UIView(frame: CGRect(x: 0, y: 0, width: amount, height: self.frame.size.height))
        self.rightView = paddingView
        self.rightViewMode = .always
    }
}
