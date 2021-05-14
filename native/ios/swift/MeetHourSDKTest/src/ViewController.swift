/*
 * Copyright @ 2017-present 8x8, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import UIKit
import MeetHourSDK

class ViewController: UIViewController {

    @IBOutlet weak var videoButton: UIButton?

    fileprivate var pipViewCoordinator: PiPViewCoordinator?
    fileprivate var MHView: MeetHourView?

    override func viewDidLoad() {
        super.viewDidLoad()
    }

    override func viewWillTransition(to size: CGSize,
                                     with coordinator: UIViewControllerTransitionCoordinator) {
        super.viewWillTransition(to: size, with: coordinator)

        let rect = CGRect(origin: CGPoint.zero, size: size)
        pipViewCoordinator?.resetBounds(bounds: rect)
    }

    // MARK: - Actions

    @IBAction func openMeetHour(sender: Any?) {
        cleanUp()

        // create and configure Meet Hour view
        let MHView = MeetHourView()
        MHView.delegate = self
        self.MHView = MHView
        let options = MeetHourConferenceOptions.fromBuilder { (builder) in
            builder.welcomePageEnabled = false
            builder.serverURL = URL(string: "https://meethour.io")
            builder.room = "MeetHourSDKiOS"
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
