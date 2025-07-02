package go.meethour.io.sdktest;

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.Bundle
import android.view.View
import android.widget.EditText
import androidx.appcompat.app.AppCompatActivity
import androidx.localbroadcastmanager.content.LocalBroadcastManager
import go.meethour.io.MeetHourSDK.android.BroadcastEvent
import go.meethour.io.MeetHourSDK.android.BroadcastIntentHelper
import go.meethour.io.MeetHourSDK.android.MeetHour
import go.meethour.io.MeetHourSDK.android.MeetHourActivity
import go.meethour.io.MeetHourSDK.android.MeetHourConferenceOptions
import go.meethour.io.MeetHourSDK.android.MeetHourUserInfo
import go.meethour.io.android.sdktest.R
import timber.log.Timber
import java.net.MalformedURLException
import java.net.URL

class MainActivity : AppCompatActivity() {

    private val broadcastReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            onBroadcastReceived(intent)
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // Initialize default options for Meet Hour conferences.
        val serverURL: URL
        serverURL = try {
            // When using JaaS, replace "https://meethour.io" with the proper serverURL
            URL("https://meethour.io")
        } catch (e: MalformedURLException) {
            e.printStackTrace()
            throw RuntimeException("Invalid server URL!")
        }
        val defaultOptions = MeetHourConferenceOptions.Builder()
                .setServerURL(serverURL)
                //.setToken("MyJWT")
                //.setPcode("") // Dynamically pass Encrypted meeting password.
                // Different features flags can be set
                //.setFeatureFlag("toolbox.enabled", false)
                //.setFeatureFlag("filmstrip.enabled", false)
                .setFeatureFlag("recording.enabled", true)
                .setWelcomePageEnabled(false)
//                .setPrejoinPageEnabled(true) // set it to false to disable prejoin page.
//                .setDisableInviteFunctions(true) // To disable invite functions in sdk.
                .build()
        MeetHour.setDefaultConferenceOptions(defaultOptions)

        registerForBroadcastMessages()
    }

    override fun onDestroy() {
        LocalBroadcastManager.getInstance(this).unregisterReceiver(broadcastReceiver)
        super.onDestroy()
    }


    fun onButtonClick(v: View?) {
        val editText = findViewById<EditText>(R.id.conferenceName)
        val text = editText.text.toString()

//        val bundle = Bundle()
//        bundle.putString("displayName", "John Doe")
//        bundle.putString("email", "hello2@meethour.io")
//
//        val userInfo = MeetHourUserInfo(bundle)

        if (text.length > 0) {
            // Build options object for joining the conference. The SDK will merge the default
            // one we set earlier and this one when joining.
            val options = MeetHourConferenceOptions.Builder()
                    .setRoom(text)
                    .setPcode("5b40602cfea7708895781a8cad71be5b")
                    .setPrejoinPageEnabled(false) // set it to false to disable prejoin page.
                    .setDisableInviteFunctions(true) // To disable invite functions in sdk.
//                  .setUserInfo(userInfo)
                    // Settings for audio and video
                    //.setAudioMuted(true)
                    //.setVideoMuted(true)
                    .build()
            // Launch the new activity with the given options. The launch() method takes care
            // of creating the required Intent and passing the options.
            MeetHourActivity.launch(this, options)
        }
    }


    private fun registerForBroadcastMessages() {
        val intentFilter = IntentFilter()

        /* This registers for every possible event sent from MeetHourSDK
           If only some of the events are needed, the for loop can be replaced
           with individual statements:
           ex:  intentFilter.addAction(BroadcastEvent.Type.AUDIO_MUTED_CHANGED.action);
                intentFilter.addAction(BroadcastEvent.Type.CONFERENCE_TERMINATED.action);
                ... other events
         */
        for (type in BroadcastEvent.Type.values()) {
            intentFilter.addAction(type.action)
        }

        LocalBroadcastManager.getInstance(this).registerReceiver(broadcastReceiver, intentFilter)
    }

    // Example for handling different MeetHourSDK events
    private fun onBroadcastReceived(intent: Intent?) {
        if (intent != null) {
            val event = BroadcastEvent(intent)
            when (event.getType()) {
                BroadcastEvent.Type.CONFERENCE_JOINED -> Timber.i("Conference Joined with url%s", event.getData().get("url"))
                BroadcastEvent.Type.PARTICIPANT_JOINED -> Timber.i("Participant joined%s", event.getData().get("name"))
                else -> {}
            }
        }
    }

    // Example for sending actions to MeetHourSDK
    private fun hangUp() {
        val hangupBroadcastIntent: Intent = BroadcastIntentHelper.buildHangUpIntent()
        LocalBroadcastManager.getInstance(org.webrtc.ContextUtils.getApplicationContext()).sendBroadcast(hangupBroadcastIntent)
    }
}
