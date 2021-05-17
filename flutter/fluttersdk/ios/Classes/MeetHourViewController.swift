import UIKit
import MeetHourSDK

class MeetHourViewController: UIViewController {
    
    @IBOutlet weak var videoButton: UIButton?
    
    fileprivate var pipViewCoordinator: PiPViewCoordinator?
    fileprivate var meetHourView: MeetHourView?
    
    var eventSink:FlutterEventSink? = nil
    var roomName:String? = nil
    var serverUrl:URL? = nil
    var subject:String? = nil
    var audioOnly:Bool? = false
    var audioMuted: Bool? = false
    var videoMuted: Bool? = false
    var token:String? = nil
    var featureFlags: Dictionary<String, Any>? = Dictionary();
    
    
    var meetHourUserInfo = MeetHourUserInfo()
    
    override func loadView() {
        
        super.loadView()
    }
    
    @objc func openButtonClicked(sender : UIButton){
        
        //openMeetHourWithOptions();
    }
    
    @objc func closeButtonClicked(sender : UIButton){
        cleanUp();
        self.dismiss(animated: true, completion: nil)
    }
    
    override func viewDidLoad() {
        
        //print("VIEW DID LOAD")
        self.view.backgroundColor = .black
        super.viewDidLoad()
    }
    
    override func viewDidAppear(_ animated: Bool) {
        openMeetHour();
    }
    
    override func viewWillTransition(to size: CGSize,
                                     with coordinator: UIViewControllerTransitionCoordinator) {
        super.viewWillTransition(to: size, with: coordinator)
        let rect = CGRect(origin: CGPoint.zero, size: size)
        pipViewCoordinator?.resetBounds(bounds: rect)
    }
    
    func openMeetHour() {
        cleanUp()
        // create and configure meetHour view
        let meetHourView = MeetHourView()
        
        
        meetHourView.delegate = self
        self.meetHourView = meetHourView
        let options = MeetHourConferenceOptions.fromBuilder { (builder) in
            builder.welcomePageEnabled = true
            builder.room = self.roomName
            builder.serverURL = self.serverUrl
            builder.subject = self.subject
            builder.userInfo = self.meetHourUserInfo
            builder.audioOnly = self.audioOnly ?? false
            builder.audioMuted = self.audioMuted ?? false
            builder.videoMuted = self.videoMuted ?? false
            builder.token = self.token
            
            self.featureFlags?.forEach{ key,value in
                builder.setFeatureFlag(key, withValue: value);
            }
            
        }
        
        meetHourView.join(options)
        
        // Enable meetHour view to be a view that can be displayed
        // on top of all the things, and let the coordinator to manage
        // the view state and interactions
        pipViewCoordinator = PiPViewCoordinator(withView: meetHourView)
        pipViewCoordinator?.configureAsStickyView(withParentView: view)
        
        // animate in
        meetHourView.alpha = 0
        pipViewCoordinator?.show()
    }
    
    func closeMeetHourMeeting(){
        meetHourView?.leave()
    }
    
    fileprivate func cleanUp() {
        meetHourView?.removeFromSuperview()
        meetHourView = nil
        pipViewCoordinator = nil
        //self.dismiss(animated: true, completion: nil)
    }
}

extension MeetHourViewController: MeetHourViewDelegate {
    
    func conferenceWillJoin(_ data: [AnyHashable : Any]!) {
        //        print("CONFERENCE WILL JOIN")
        var mutatedData = data
        mutatedData?.updateValue("onConferenceWillJoin", forKey: "event")
        self.eventSink?(mutatedData)
    }
    
    func conferenceJoined(_ data: [AnyHashable : Any]!) {
        //        print("CONFERENCE JOINED")
        var mutatedData = data
        mutatedData?.updateValue("onConferenceJoined", forKey: "event")
        self.eventSink?(mutatedData)
    }
    
    func conferenceTerminated(_ data: [AnyHashable : Any]!) {
        //        print("CONFERENCE TERMINATED")
        var mutatedData = data
        mutatedData?.updateValue("onConferenceTerminated", forKey: "event")
        self.eventSink?(mutatedData)
        
        DispatchQueue.main.async {
            self.pipViewCoordinator?.hide() { _ in
                self.cleanUp()
                self.dismiss(animated: true, completion: nil)
            }
        }
    }
    
    func enterPicture(inPicture data: [AnyHashable : Any]!) {
        //        print("CONFERENCE PIP IN")
        var mutatedData = data
        mutatedData?.updateValue("onPictureInPictureWillEnter", forKey: "event")
        self.eventSink?(mutatedData)
        DispatchQueue.main.async {
            self.pipViewCoordinator?.enterPictureInPicture()
        }
    }
    
    func exitPictureInPicture() {
        //        print("CONFERENCE PIP OUT")
        var mutatedData : [AnyHashable : Any]
        mutatedData = ["event":"onPictureInPictureTerminated"]
        self.eventSink?(mutatedData)
    }
}

