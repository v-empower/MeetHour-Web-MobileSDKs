//
//  AppDelegate.swift
//  Created by MeetHour, LLC.
//  Copyright © Meet Hour, LLC. All rights reserved.
//

import UIKit
import MeetHourSDK


@main
class AppDelegate: UIResponder, UIApplicationDelegate {


    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        guard let launchOptions = launchOptions else { return false }
        return MeetHour.sharedInstance().application(application, didFinishLaunchingWithOptions: launchOptions)
    }
    
    // MARK: - Linking delegate methods

    func application(_ application: UIApplication,
                     continue userActivity: NSUserActivity,
                     restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        return MeetHour.sharedInstance().application(application, continue: userActivity, restorationHandler: restorationHandler)
    }

    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
        return MeetHour.sharedInstance().application(app, open: url, options: options)
    }
}

