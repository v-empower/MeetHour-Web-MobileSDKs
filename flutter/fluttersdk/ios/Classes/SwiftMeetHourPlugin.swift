import Flutter
import UIKit
import MeetHourSDK

public class SwiftMeetHourPlugin: NSObject, FlutterPlugin, FlutterStreamHandler {
    var window: UIWindow?

    var uiVC : UIViewController

    var eventSink : FlutterEventSink?

    var meetHourViewController: MeetHourViewController?

    init(uiViewController: UIViewController) {
        self.uiVC = uiViewController
    }

    public static func register(with registrar: FlutterPluginRegistrar) {
        let channel = FlutterMethodChannel(name: "meet_hour", binaryMessenger: registrar.messenger())

        let viewController: UIViewController =
            (UIApplication.shared.delegate?.window??.rootViewController)!

        let instance = SwiftMeetHourPlugin(uiViewController: viewController)

        registrar.addMethodCallDelegate(instance, channel: channel)

        // Set up event channel for conference events
        let eventChannelName = "meet_hour_events"

        let eventChannel = FlutterEventChannel(name: eventChannelName, binaryMessenger: registrar.messenger())
        eventChannel.setStreamHandler(instance)
    }

    public func handle(_ call: FlutterMethodCall, result: @escaping FlutterResult) {

        if (call.method == "joinMeeting") {

            self.meetHourViewController = MeetHourViewController.init()
            self.meetHourViewController?.eventSink = eventSink;
            // text = call.argument("text");

            guard let args = call.arguments else {
                return
            }

            if let myArgs = args as? [String: Any]
            {
                if let roomName = myArgs["room"] as? String {
                    if let serverURL = myArgs["serverURL"] as? String {
                        //                        print("serverUrl: ", serverURL);
                        self.meetHourViewController?.serverUrl = URL(string: serverURL);
                    }
                    let subject = myArgs["subject"] as? String
                    let displayName = myArgs["userDisplayName"] as? String
                    let email = myArgs["userEmail"] as? String
                    let token = myArgs["token"] as? String


                    self.meetHourViewController?.roomName = roomName;
                    self.meetHourViewController?.subject = subject;
                    self.meetHourViewController?.meetHourUserInfo.displayName = displayName;
                    self.meetHourViewController?.meetHourUserInfo.email = email;
                    self.meetHourViewController?.token = token;


                    if let avatarURL = myArgs["userAvatarURL"] as? String {
                        self.meetHourViewController?.meetHourUserInfo.avatar = URL(string: avatarURL);
                    }
                    //                    let avatar = myArgs["userAvatarURL"] as? String,
                    //                    let avatarURL  = URL(string: avatar)
                    //                    meetHourViewController?.meetHourUserInfo.avatar = avatarURL;

                    if let audioOnly = myArgs["audioOnly"] as? Int {
                        let audioOnlyBool = audioOnly > 0 ? true : false
                        self.meetHourViewController?.audioOnly = audioOnlyBool;
                    }

                    if let audioMuted = myArgs["audioMuted"] as? Int {
                        let audioMutedBool = audioMuted > 0 ? true : false
                        self.meetHourViewController?.audioMuted = audioMutedBool;
                    }

                    if let videoMuted = myArgs["videoMuted"] as? Int {
                        let videoMutedBool = videoMuted > 0 ? true : false
                        self.meetHourViewController?.videoMuted = videoMutedBool;
                    }

                    if let featureFlags = myArgs["featureFlags"] as? Dictionary<String, Any>
                    {
                        self.meetHourViewController?.featureFlags = featureFlags;
                    }

                } else {
                    result(FlutterError.init(code: "400", message: "room is null in arguments for method: (joinMeeting)", details: "room is null in arguments for method: (joinMeeting)"))
                }
            } else {
                result(FlutterError.init(code: "400", message: "arguments are null for method: (joinMeeting)", details: "arguments are null for method: (joinMeeting)"))
            }

            let navigationController = UINavigationController(rootViewController: (self.meetHourViewController)!)
            navigationController.setNavigationBarHidden(true, animated: false)
            navigationController.modalPresentationStyle = .fullScreen
            navigationController.navigationBar.barTintColor = UIColor.black
            self.uiVC.present(navigationController, animated: true)
            result(nil)

        }else if (call.method == "closeMeeting") {


            var dictClosingServerInfo : Dictionary = Dictionary<AnyHashable,Any>()
            let serverURL : String = self.meetHourViewController?.serverUrl?.absoluteString ?? ""
            let roomName : String = self.meetHourViewController?.roomName ?? ""

            dictClosingServerInfo["url"] = "\(serverURL)/\(roomName)";

            self.meetHourViewController?.closeMeetHourMeeting();
            self.meetHourViewController?.conferenceTerminated(dictClosingServerInfo);

        }

    }

    /**
     # FlutterStreamHandler methods
     */

    public func onListen(withArguments arguments: Any?, eventSink events: @escaping FlutterEventSink) -> FlutterError? {
        eventSink = events
        return nil
    }

    public func onCancel(withArguments arguments: Any?) -> FlutterError? {
        eventSink = nil
        return nil
    }
}
