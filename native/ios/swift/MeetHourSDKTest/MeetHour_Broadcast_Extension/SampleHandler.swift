//
//  SampleHandler.swift
//  MeetHour_Broadcast_Extension
//
//  Created by Bharat Raj (VEMP) on 19/05/21.
//  Copyright © 2021 Atlassian Inc. All rights reserved.
//

import ReplayKit


class SampleHandler: RPBroadcastSampleHandler {
    
    var clientConnection = SocketConnection()
    var uploader = SampleUploader()
    
    
    override init() {
        super.init()
            clientConnection = SocketConnection(filePath: socketFilePath()!)
            setupConnection()
            uploader = SampleUploader(connection: clientConnection)
    }
    
    
    override func broadcastStarted(withSetupInfo setupInfo: [String : NSObject]?) {
        DarwinNotificationCenter.sharedInstance().postNotification(withName: NSNotification.Name.broadcastStarted)
    }
    
    override func broadcastPaused() {
        // User has requested to pause the broadcast. Samples will stop being delivered.
    }
    
    override func broadcastResumed() {
        // User has requested to resume the broadcast. Samples delivery will resume.
    }
    
    override func broadcastFinished() {
        // User has requested to finish the broadcast.
        DarwinNotificationCenter.sharedInstance().postNotification(withName: NSNotification.Name.broadcastStopped)
        self.clientConnection.close()
    }
    
    override func processSampleBuffer(_ sampleBuffer: CMSampleBuffer, with sampleBufferType: RPSampleBufferType) {
        let frameCount = 0
        switch sampleBufferType {
        case RPSampleBufferType.video:
            // Handle video sample buffer
            print("Sending Sample Buffer here")
            if ((frameCount+1)%3 == 0 && self.uploader.isReady) {
                self.uploader.sendSample(sampleBuffer)
            }
            break
        case RPSampleBufferType.audioApp:
            // Handle audio sample buffer for app audio
            break
        case RPSampleBufferType.audioMic:
            // Handle audio sample buffer for mic audio
            break
        @unknown default:
            // Handle other sample buffer types
            fatalError("Unknown type of sample buffer")
        }
    }
    
    // MARK: Private Methods
    func socketFilePath() -> String? {
        let appGroupIdentifier = "group.go.meethour.io.ios.sdk.broadextension"
        let sharedContainer = FileManager.default.containerURL(forSecurityApplicationGroupIdentifier: appGroupIdentifier)
        let socketFilePath = sharedContainer?.appendingPathComponent("rtc_SSFD").path
        return socketFilePath
    }

    func setupConnection(){
        weak var weakSelf = self
        clientConnection.didClose = { error in
            if let error = error as? Error {
                weakSelf?.finishBroadcastWithError(error)
            }else{
                let JMScreenSharingStopped = 10001
                let customError = NSError(domain: RPRecordingErrorDomain, code: JMScreenSharingStopped, userInfo: [
                    NSLocalizedDescriptionKey: "Screen sharing stopped"])
                weakSelf?.finishBroadcastWithError(customError)
            }
        }
    }
    

    func openConnection() {
        let queue = DispatchQueue(label: "go.meethour.io.ios.sdk.connectTimer")
        let timer = DispatchSource.makeTimerSource(queue: queue)
        timer.schedule(deadline: DispatchTime.now() + .seconds(1), repeating: 0.1 * Double(NSEC_PER_SEC), leeway: .nanoseconds(100))
        timer.setEventHandler(handler:  {
            let success = self.clientConnection.open()
            if success{
                timer.cancel()
            }
        })
        timer.resume()
    }
}
