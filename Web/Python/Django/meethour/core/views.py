import json
import datetime
from django.shortcuts import render
from meethour.core.constants import CLIENT_ID, CLIENT_SECRET, GRANT_TYPE, EMAIL, PASSWORD, API_RELEASE, API_KEY, CONFERENCE_URL
from pymeethour.type import LoginType, ScheduleMeetingType, time_zone, ContactsType, GenerateJwtType, ViewMeetings
import pymeethour.services.apiServices as apiServices

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
    login_object = LoginType.LoginType(
        CLIENT_ID, CLIENT_SECRET, GRANT_TYPE, EMAIL, PASSWORD)
    apiservice = apiServices.MHApiService()
    response = apiservice.login(login_object)
    if response.get('access_token') is not None:
        access_token = response.get('access_token')
        return access_token
    else:
        raise Exception('Failed to retrieve access token')


def index(request):
    error = False
    message = None
    access_token = None

    try:
        if request.method == 'POST':
            get_access_token_value = request.POST.get('getaccesstoken')

            if get_access_token_value == "true":
                # getting access token from sessions
                access_token = request.session.get('access_token')
                if access_token is None:
                    access_token = get_access_token()
                    request.session["access_token"] = access_token
    except Exception as e:
        error = True
        message = str(e)
    
    return render(request, 'index.html', {'error': error, 'message': message, 'access_token': access_token})

#Schedule Meeting

def schedulemeeting(request):
    success = False
    error = False
    message = None
    meeting_response = None
    contacts_response = None
    timezone_response = None
    timezone = None

    try:
        access_token = request.session.get('access_token')
        
        time_zone_object = time_zone.time_zone(0, 0, 0)
        apiservice = apiServices.MHApiService()
        timezone_response = apiservice.time_zone(access_token, time_zone_object)

        contacts_object = ContactsType.ContactsType(0, 0, 0)
        apiservice = apiServices.MHApiService()
        contacts_response = apiservice.contacts(access_token, contacts_object)

        if request.method == "POST":
            instant_meeting = request.POST.get("instantmeeting")
            schedule_meeting = request.POST.get("schedulemeeting")
            timezone = request.POST.get("timezone_response")

            if instant_meeting is not None and instant_meeting == 'true':
                timezone = datetime.datetime.now(
                    datetime.timezone.utc).astimezone().tzname()
                schedule_meeting_object = ScheduleMeetingType.ScheduleMeeting(
                    "Instant Meeting", "123456789", datetime.datetime.now().strftime('%I:%M'), 'PM', datetime.datetime.now().strftime('%d-%m-%Y'), timezone, is_show_portal=1, send_calendar_invite=1)
                apiservice = apiServices.MHApiService()
                response = apiservice.schedule_meeting(
                    access_token, schedule_meeting_object)

                if response.get("success"):
                    meeting_response = response
                    success = True
                else:
                    success = False
                    error = True
                    message = 'Instant Meeting has failed. \n' + json.dumps(response)

            elif schedule_meeting is not None and schedule_meeting == 'true':
                meeting_name = request.POST.get("meeting_name")
                pcode = request.POST.get("passcode")
                meeting_date = request.POST.get("meeting_date")
                meeting_time = datetime.datetime.strptime(
                    request.POST.get("meeting_time"), '%H:%M').strftime('%I:%M')
                meeting_ampm = datetime.datetime.strptime(
                    request.POST.get("meeting_time"), '%H:%M').strftime('%p')
                timezone = request.POST.get("timezone")
                
                mySelectParticipants = []
                if (request.POST.get("mySelectParticipants") != 0):
                    mySelectParticipants = [
                        request.POST.get("mySelectParticipants")]

                mySelectModerators = []
                if (request.POST.get("mySelectModerators") != 0):
                    mySelectModerators = [request.POST.get("mySelectModerators")]

                schedule_meeting_object = ScheduleMeetingType.ScheduleMeeting(
                    meeting_name, pcode, meeting_time, meeting_ampm, meeting_date, timezone, is_show_portal=1, send_calendar_invite=1, options=["ALLOW_GUEST"], attend=mySelectParticipants, hostusers=mySelectModerators)

                schedule_meeting_object.apiservice = apiServices.MHApiService()
                response = apiservice.schedule_meeting(
                    access_token, schedule_meeting_object)
   
                if response.get("success"):
                    meeting_response = response
                    success = True
                else:
                    success = False
                    error = True
                    message = 'Scheduling Meeting has failed. \n' + json.dumps(response)
            else:
                error = True
                message = 'Something went wrong. Make sure you post the true value in getaccesstoken'

    except Exception as e:
        error = True
        message = str(e)

    if meeting_response is not None:
        meeting_response = meeting_response.get('data')
    return render(request, 'scheduleMeeting.html', {
        'success': success,
        'error': error,
        'message': message,
        'access_token': access_token,
        'MeetingResponse': meeting_response,
        'ContactsResponse': contacts_response,
        'timezone_response': timezone_response["timezones"],
        'contacts_response': contacts_response["contacts"],
    })

#Join Meeting
def joinmeeting(request):
    meeting_id = None
    jwt_token = None
    meeting_attendees = None
    pCode = None
    jwt_response = None
    success = False
    error = False
    message = None
    pCode = None
    access_token = request.session.get('access_token')  # Make sure to set the access_token in the session

    try:
        if request.method == "POST":
            meeting_id = request.GET.get('meeting_id')
            pCode = request.GET.get('pcode')
            # Add these debug statements to your view
            print("meeting_id:", meeting_id)
            print("pCode:", pCode)  

            generate_jwt_object = GenerateJwtType.GenerateJwt(meeting_id)
            apiservice = apiServices.MHApiService()  # Instantiate your MHApiService
            jwt_response = apiservice.generate_jwt(access_token, generate_jwt_object)

            if jwt_response.get("success") is True and "jwt" in jwt_response:
                jwt_token = jwt_response["jwt"]
                success = True
            else:
                error = True
                message = 'Error in Generating JWT Token \n' + json.dumps(jwt_response)
        else:
            meeting_id = request.GET.get("meeting_id")
            pCode = request.GET.get('pcode')
            if meeting_id:
                view_meetings_object = ViewMeetings.ViewMeeting(meeting_id)
                attendees = []
                if view_meetings_object.meeting_id:
                    apiservice = apiServices.MHApiService()  # Instantiate your MHApiService
                    view_meeting_response = apiservice.view_meetings(access_token, view_meetings_object)
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
                meeting_attendees = {
                    'organizer': organizer,
                    'hosts': hosts,
                    'attendee': attendee
                }
    except Exception as e:
        error = True
        message = str(e)

    return render(request, 'joinmeeting.html', {
        'meeting_id': meeting_id,
        'meeting_attendees': meeting_attendees,
        'jwt_token': jwt_token,
        'pCode': pCode,
        'API_KEY': API_KEY,
        'API_RELEASE': API_RELEASE,
        'jwt_response': jwt_response,
        'CONFERENCE_URL': CONFERENCE_URL,
        'success': success,
        'error': error,
        'message': message,
        'access_token': access_token
    })

