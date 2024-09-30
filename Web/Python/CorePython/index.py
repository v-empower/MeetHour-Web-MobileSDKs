import datetime
import json
from http.server import BaseHTTPRequestHandler
from http.server import HTTPServer

import pymeethour.services.apiServices as apiServices
from constants import API_KEY
from constants import API_RELEASE
from constants import CLIENT_ID
from constants import CLIENT_SECRET
from constants import CONFERENCE_URL
from constants import EMAIL
from constants import GRANT_TYPE
from constants import PASSWORD
from constants import SECRET_KEY
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives import hmac as CryptoHMAC
from flask import Flask
from flask import render_template
from flask import request
from flask import session
from pymeethour.type import AddContactType
from pymeethour.type import ContactsType
from pymeethour.type import GenerateJwtType
from pymeethour.type import LoginType
from pymeethour.type import ScheduleMeetingType
from pymeethour.type import time_zone
from pymeethour.type import ViewMeetings
from pymeethour.webhook import webhooks

webhook_handler = webhooks.WebhookHandler(SECRET_KEY)

app = Flask(__name__, template_folder="template", static_url_path="/static")
app.secret_key = "password"  # need to change secert key to run session
# Constants
CLIENT_ID = CLIENT_ID
CLIENT_SECRET = CLIENT_SECRET
EMAIL = EMAIL
PASSWORD = PASSWORD
GRANT_TYPE = GRANT_TYPE
API_RELEASE = API_RELEASE
API_KEY = API_KEY

# Get access token


def get_access_token():
    """ """
    login_object = LoginType.LoginType(
        CLIENT_ID, CLIENT_SECRET, GRANT_TYPE, EMAIL, PASSWORD
    )
    apiservice = apiServices.MHApiService()  # importing the API serives from sdk
    response = apiservice.login(login_object)
    if response.get("access_token") != None:
        access_token = response.get("access_token")
        return access_token
    else:
        raise Exception("Failed to retrieve access token")


@app.route("/", methods=["GET", "POST"])
def index():
    """ """
    error = False
    message = None
    access_token = None

    try:
        if request.method == "POST":

            get_access_token_value = request.form.get("getaccesstoken")

            if get_access_token_value == "true":
                access_token = get_access_token()
                session["access_token"] = access_token
    except Exception as e:
        error = True
        message = str(e)
    return render_template(
        "index.html", error=error, message=message, access_token=access_token
    )


# /addcontact
@app.route("/addcontact", methods=["GET", "POST"])
def addcontact():
    """ """
    try:
        # getting access token from sessions
        access_token = session.get("access_token")
        # print (access_token)
        firstname = request.form.get("firstname")
        lastname = request.form.get("lastname")
        email = request.form.get("email")
        addcontacts = AddContactType.AddContactType(email, firstname, lastname)
        apiservice = apiServices.MHApiService()
        response = apiservice.add_contact(access_token, addcontacts)
        # print(response)

    except Exception as e:
        return "{'message':'" + e + "'}"
    return response


# /instant meeting and /schedule meeting


@app.route("/schedulemeeting", methods=["GET", "POST"])
def schedulemeeting():
    """ """
    success = False
    error = False
    message = None
    meeting_response = None
    contacts_response = None
    timezone_response = None
    timezone = None
    contacts_response = None
    try:
        pcode = request.args.get("pcode")
        # getting access token from sessions
        access_token = session.get("access_token")

        time_zone_object = time_zone.time_zone(0, 0, 0)  # getting timezone from sdk
        apiservice = apiServices.MHApiService()
        timezone_response = apiservice.time_zone(access_token, time_zone_object)

        contacts_object = ContactsType.ContactsType(
            0, 0, 0
        )  # getting contact details from sdk
        apiservice = apiServices.MHApiService()
        contacts_response = apiservice.contacts(access_token, contacts_object)

        # /instant meeting
        if request.method == "POST":
            instant_meeting = request.form.get("instantmeeting")
            schedule_meeting = request.form.get("schedulemeeting")
            timezone = request.form.get("timezone_response")

            if instant_meeting is not None and instant_meeting == "true":

                timezone = (
                    datetime.datetime.now(datetime.timezone.utc).astimezone().tzname()
                )
                schedule_meeting_object = ScheduleMeetingType.ScheduleMeeting(
                    "Instant  Meeting",
                    "password",
                    datetime.datetime.now().strftime("%I:%M"),
                    "PM",
                    datetime.datetime.now().strftime("%d-%m-%Y"),
                    timezone,
                    is_show_portal=1,
                    send_calendar_invite=1,
                )
                # "password" is password should change according to the meeting requirement
                # Initialization of apiServices from SDK
                apiservice = apiServices.MHApiService()
                response = apiservice.schedule_meeting(
                    access_token, schedule_meeting_object
                )

                if response.get("success"):
                    meeting_response = response
                    success = True
                else:
                    success = False
                    error = True
                    message = "Instant Meeting has failed. \n" + json.dumps(response)
            # /Schedule meeting
            elif schedule_meeting is not None and schedule_meeting == "true":
                meeting_name = request.form.get("meeting_name")
                pcode = request.form.get("passcode")
                meeting_date = request.form.get("meeting_date")
                meeting_time = datetime.datetime.strptime(
                    request.form.get("meeting_time"), "%H:%M"
                ).strftime("%I:%M")
                meeting_ampm = datetime.datetime.strptime(
                    request.form.get("meeting_time"), "%H:%M"
                ).strftime("%p")
                timezone = request.form.get("timezone")

                mySelectParticipants = []
                if request.form.get("mySelectParticipants") != 0:
                    mySelectParticipants = [request.form.get("mySelectParticipants")]

                mySelectModerators = []
                if request.form.get("mySelectModerators") != 0:
                    mySelectModerators = [request.form.get("mySelectModerators")]

                schedule_meeting_object = ScheduleMeetingType.ScheduleMeeting(
                    meeting_name,
                    pcode,
                    meeting_time,
                    meeting_ampm,
                    meeting_date,
                    timezone,
                    is_show_portal=1,
                    send_calendar_invite=1,
                    options=["ALLOW_GUEST"],
                    attend=mySelectParticipants,
                    hostusers=mySelectModerators,
                )
                schedule_meeting_object.apiservice = apiServices.MHApiService()
                response = apiservice.schedule_meeting(
                    access_token, schedule_meeting_object
                )
                if response.get("success"):
                    meeting_response = response
                    success = True

                else:
                    success = False
                    error = True
                    message = "Scheduling Meeting has failed. \n" + json.dumps(response)
            else:
                error = True
                message = "Something went wrong. Make sure you post the true value in getaccesstoken"
    except Exception as e:
        error = True
        message = str(e)
    if meeting_response != None:
        meeting_response = meeting_response.get("data")
    return render_template(
        "scheduleMeeting.html",
        success=success,
        error=error,
        message=message,
        access_token=access_token,
        MeetingResponse=meeting_response,
        ContactsResponse=contacts_response,
        timezone_response0=timezone_response["timezones"],
        timezone_response1=range(len(timezone_response["timezones"])),
        contacts_response0=contacts_response["contacts"],
        contacts_response1=range(len(contacts_response["contacts"])),
    )


# /Joinmeeting
@app.route("/joinmeeting", methods=["GET", "POST"])
def join_meeting():
    """ """
    meeting_id = None
    jwt_token = None
    meetingAttendees = None
    pCode = None
    jwt_response = None
    success = False
    error = False
    message = None
    pCode = None
    access_token = session.get("access_token")
    try:
        if request.method == "POST":
            meeting_id = request.args.get("meeting_id")
            pCode = request.args.get("pcode")
            generate_jwt_object = GenerateJwtType.GenerateJwt(
                meeting_id
            )  # Generate Jwt oken
            apiservice = apiServices.MHApiService()
            jwt_response = apiservice.generate_jwt(access_token, generate_jwt_object)

            if jwt_response.get("success") is True and "jwt" in jwt_response:
                jwt_token = jwt_response["jwt"]
                success = True
            else:
                error = True
                message = "Error in Gene  rating JWT Token \n" + json.dumps(
                    jwt_response
                )
        else:
            meeting_id = request.args.get("meeting_id")
            pCode = request.args.get("pcode")
            if meeting_id:
                view_meetings_object = ViewMeetings.ViewMeeting(meeting_id)
                attendees = []
                if view_meetings_object.meeting_id:
                    apiservice = apiServices.MHApiService()
                    view_meeting_response = apiservice.view_meetings(
                        access_token, view_meetings_object
                    )
                if attendees is None:
                    attendees = []
                meeting_details = view_meeting_response["meeting"]
                organizer = None
                pCode = meeting_details["pcode"]
                if "organizer" in view_meeting_response:
                    organizer = view_meeting_response["organizer"]
                hosts = None
                if "hosts" in meeting_details:
                    hosts = meeting_details["hosts"]
                attendee = None
                if "meeting_attendees" in view_meeting_response:
                    attendee = view_meeting_response["meeting_attendees"]
                meetingAttendees = {
                    "organizer": organizer,
                    "hosts": hosts,
                    "attendee": attendee,
                }
    except Exception as e:
        error = True
        message = str(e)
    return render_template(
        "joinmeeting.html",
        meeting_id=meeting_id,
        meetingAttendees=meetingAttendees,
        jwt_token=jwt_token,
        pCode=pCode,
        API_KEY=API_KEY,
        API_RELEASE=API_RELEASE,
        jwt_response=jwt_response,
        CONFERENCE_URL=CONFERENCE_URL,
        success=success,
        error=error,
        message=message,
        access_token=access_token,
    )


def compute_signature(secret_key, payload):
    """

    :param secret_key: param payload:
    :param payload: 

    """
    h = CryptoHMAC.HMAC(secret_key.encode(), hashes.SHA256(), backend=default_backend())
    h.update(payload)
    return h.finalize().hex()


# /Webhooks


@app.route("/webhooks", methods=["GET", "POST"])
def webhooks_start():
    """ """

    data = request.get_data(as_text=True)

    # For Meet Hour
    response = webhook_handler.handle_request(data, request.headers)

    # Log the incoming data using WebhookHandler's log_data method
    webhook_handler.log_data(request)

    session["meethour_webhook"] = response

    # Print server response (optional)
    print(f"Server response: {response}")
    return json.dumps(response), 200


if __name__ == "__main__":
    try:
        app.run()  # app.run(host='192.168.0.175')
    except Exception as e:
        print("An error occurred: ", str(e))
