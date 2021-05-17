package go.meethour.io.flutter.sdk

import android.util.Log
import go.meethour.io.flutter.sdk.MeetHourPlugin.Companion.MEETHOUR_PLUGIN_TAG
import io.flutter.plugin.common.EventChannel
import java.io.Serializable

/**
 * StreamHandler to listen to conference events and broadcast it back to Flutter
 */
class MeetHourEventStreamHandler private constructor(): EventChannel.StreamHandler, Serializable {
    companion object {
        val instance = MeetHourEventStreamHandler()
    }

    private var eventSink: EventChannel.EventSink? = null

    override fun onListen(arguments: Any?, eventSink: EventChannel.EventSink?) {
        Log.d(MEETHOUR_PLUGIN_TAG, "MeetHourEventStreamHandler.onListen")
        this.eventSink = eventSink
    }

    override fun onCancel(arguments: Any?) {
        Log.d(MEETHOUR_PLUGIN_TAG, "MeetHourEventStreamHandler.onCancel")
        eventSink = null
    }

    fun onConferenceWillJoin(data: MutableMap<String, Any>?) {
        Log.d(MEETHOUR_PLUGIN_TAG, "MeetHourEventStreamHandler.onConferenceWillJoin")
        data?.put("event", "onConferenceWillJoin")
        eventSink?.success(data)
    }

    fun onConferenceJoined(data: MutableMap<String, Any>?) {
        Log.d(MEETHOUR_PLUGIN_TAG, "MeetHourEventStreamHandler.onConferenceJoined")
        data?.put("event", "onConferenceJoined")
        eventSink?.success(data)
    }

    fun onConferenceTerminated(data: MutableMap<String, Any>?) {
        Log.d(MEETHOUR_PLUGIN_TAG, "MeetHourEventStreamHandler.onConferenceTerminated")
        data?.put("event", "onConferenceTerminated")
        eventSink?.success(data)
    }

    fun onPictureInPictureWillEnter() {
        Log.d(MEETHOUR_PLUGIN_TAG, "MeetHourEventStreamHandler.onPictureInPictureWillEnter")
        var data : HashMap<String, String>
                = HashMap<String, String> ()
        data?.put("event", "onPictureInPictureWillEnter")
        eventSink?.success(data)
    }

    fun onPictureInPictureTerminated() {
        Log.d(MEETHOUR_PLUGIN_TAG, "MeetHourEventStreamHandler.onPictureInPictureTerminated")
        var data : HashMap<String, String>
                = HashMap<String, String> ()
        data?.put("event", "onPictureInPictureTerminated")
        eventSink?.success(data)
    }

}