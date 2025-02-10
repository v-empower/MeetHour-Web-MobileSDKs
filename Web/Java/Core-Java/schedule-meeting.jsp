<%@ page import="go.meethour.io.javasdk.services.ApiServices" %>
<%@ page import="go.meethour.io.javasdk.types.LoginType" %>
<%@ page import="go.meethour.io.javasdk.types.ScheduleMeetingType" %>
<%@ page import="go.meethour.io.javasdk.types.TimeZone" %>
<%@ page import="go.meethour.io.javasdk.types.ContactsType" %>
<%@ page import="go.meethour.io.javasdk.types.AddContactType" %>
<%@ page import="java.util.Map" %>
<%@ page import="java.util.HashMap" %>
<%@ page import="java.text.SimpleDateFormat" %>
<%@ page import="java.util.List" %>
<%@ page import="java.util.Calendar" %>
<%@ page import="java.util.Date" %>
<%@ page import="org.json.JSONException" %>
<%@ page import="java.util.stream.Collectors" %>
<%@ page import="org.json.JSONObject" %>
<%@ page import="org.json.JSONArray" %>
<%@ page import="java.util.ArrayList" %>
<%@ page import="java.time.ZonedDateTime" %>
<%@ page import="java.time.ZoneOffset" %>
<%@ page import="java.util.Arrays" %>
<%@ page import="jakarta.servlet.http.HttpServletResponse" %>

<%@ page import="java.time.LocalDateTime" %>
<%@ page import="java.time.format.DateTimeFormatter" %>
<%
    String message = null;
    boolean error = false;
    boolean success = false;
    JSONObject meeting_response = null;
    JSONObject contactObject=null;
    String email=null;
    String first_name=null;
    String last_name=null;

    String access_token = (String) session.getAttribute("access_token");

    ApiServices apiServices = new ApiServices();
    JSONObject responsesObject = new JSONObject();


    TimeZone timeZoneObj = new TimeZone();
    String timezoneResponse = apiServices.timeZone(timeZoneObj, access_token);
    responsesObject = new JSONObject(timezoneResponse);
    JSONArray timezonesArray = responsesObject.getJSONArray("timezones");


    ContactsType contactObjects = new ContactsType(null, null, null);
    String contactResponse = apiServices.contacts(contactObjects, access_token);
    responsesObject = new JSONObject(contactResponse);
    JSONArray contactsArray = responsesObject.getJSONArray("contacts");

    if (request.getMethod().equals("POST"))
    {

        String instantMeeting = request.getParameter("instantmeeting");
        String scheduleMeeting = request.getParameter("schedule-meeting");


        String timezone=request.getParameter("timezone");

        List<String> mySelectParticipants = new ArrayList<>();
       	if (request.getParameter("mySelectParticipants") != null && !request.getParameter("mySelectParticipants").equals("0"))
        {
        	 mySelectParticipants.add(request.getParameter("mySelectParticipants"));

       	}

       	if (request.getParameter("myParticipant_Id") != null && !request.getParameter("myParticipant_Id").equals("0"))
        {
        	 mySelectParticipants.add(request.getParameter("myParticipant_Id"));

       	}

       	List<String> mySelectModerators = new ArrayList<>();
       	if (request.getParameter("mySelectModerators") != null && !request.getParameter("mySelectModerators").equals("0"))
       	{
        	mySelectModerators.add(request.getParameter("mySelectModerators"));

        }
      	try {
        	   if (instantMeeting != null && instantMeeting.equals("true"))
        	   {

        		  	timezone = ZonedDateTime.now(ZoneOffset.UTC).getZone().getId();

        		   	SimpleDateFormat timeFormat = new SimpleDateFormat("hh:mm");
        		    SimpleDateFormat meetingTimeFormat = new SimpleDateFormat("HH:mm");
        		    String meeting_date = new SimpleDateFormat("yyyy-MM-dd").format(new Date());


        	        String meeting_time = new SimpleDateFormat("hh:mm").format(new Date());
        	        String meeting_meridiem = new SimpleDateFormat("a").format(new Date());
        	      	ScheduleMeetingType meeting = new ScheduleMeetingType("Instant Meeting", "123456789", meeting_time, meeting_meridiem, meeting_date, timezone,1,1,Arrays.asList("ALLOW_GUEST"),mySelectParticipants, mySelectModerators);
                	String scheduleObject = apiServices.schedulemeeting(meeting, access_token);
                	JSONObject apiResponse = new JSONObject(scheduleObject);


                	if (apiResponse.getBoolean("success"))
                	{
                    	success = true;
                    	meeting_response = apiResponse;
                	} else
                	{
                    	success = false;
                    	error = true;
                    	message = "Instant Meeting has failed \n " + apiResponse.toString(1);
                	}
        	   }
        	   else if (scheduleMeeting != null && scheduleMeeting.equals("true"))
        	   {
        		   String meeting_name = request.getParameter("meeting_name");
        	        String passcode = request.getParameter("passcode");
        	        String meeting_date = request.getParameter("meeting_date");
        	        String meeting_time_str = request.getParameter("meeting_time");
        	        SimpleDateFormat meetingTimeFormat = new SimpleDateFormat("HH:mm");
        	       	Date meetingTime = meetingTimeFormat.parse(meeting_time_str);
        	        String meeting_time = new SimpleDateFormat("hh:mm").format(meetingTime);
        	        String meeting_meridiem = new SimpleDateFormat("a").format(meetingTime);
        	        ScheduleMeetingType meeting = new ScheduleMeetingType( meeting_name, passcode, meeting_time,meeting_meridiem, meeting_date,timezone, 1, 1, Arrays.asList("ALLOW_GUEST"),mySelectParticipants,mySelectModerators);

        	        String scheduleObject = apiServices.schedulemeeting(meeting, access_token);
                	JSONObject apiresponse = new JSONObject(scheduleObject);

                	if (apiresponse.getBoolean("success"))
                	{
                    	success = true;
                    	meeting_response = apiresponse;
                	} else 
                	{
                    	success = false;
                    	error = true;
                    	message = "Schedule Meeting has failed \n " + apiresponse.toString();
                	}

        	    } else {
        	        error = true;
        	        message = "Something went wrong. Make sure you post the true value in getaccesstoken";
        	    }
        } catch (Exception e) {
            error = true;
            message = e.getMessage();

        }

        }

%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <title>Meet Hour Java Example (Schedule Meeting Page)</title>
    <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=0" />
    <link href="https://portal.meethour.io/dist/images/favicon.png" rel="shortcut icon" />
    <link href="css/style.css" rel="stylesheet">
    <link href="css/loader.css" rel="stylesheet">
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
     <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script type="text/javascript" src="https://MomentJS.com/downloads/moment.js"></script>

</head>
<body>
  <div>
    <div>
	    <%@ include file="header.jsp" %>

	    </div>
	    <div class="relative top-16">
			<%
			    if (request.getAttribute("error") != null && (boolean) request.getAttribute("error")) {
			%>
			    <div id="error">
			        <div class="flex fixed top-20 justify-center items-center text-lg font-medium w-96 rounded-md h-16 border border-red-600 bg-red-50 text-red-600">
			            <p><%= request.getAttribute("message") %></p>
			        </div>
			    </div>
			<%
			    }
			%>

   			<div class="lg:flex w-screen relative top-16 justify-between overflow-x-hidden">
                <div class="lg:w-[60%] overflow-hidden bg-white shadow sm:rounded-lg">
                <div class="px-4 py-5 sm:px-6">
                    <h3 class="text-lg font-medium leading-6 text-gray-900">How to Schedule a Meeting</h3>
                    <p class="mt-1 text-sm text-gray-500">Steps given below - </p>
                </div>
                <div class="border-t border-gray-200">
                    <dl>
                        <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-gray-500">Step One</dt>
                            <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">Fill the required fields like
                                meeting name, pass code, meeting date, meeting time, meeting meridian and time zone in the
                                Schedule a Meeting Form.<br><span class="text-xs">Note: You have to set a moderator to
                                    start the meeting. If you do not set a moderator, meeting can not start.</span></dd>
                        </div>
                         <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-gray-500">Step Two</dt>
                            <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">After adding all the necessary
                                fields, now add participants and moderators. Note: To start a meeting, at least one
                                moderator is required.</dd>
                        </div>
                        <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-gray-500">Step Three</dt>
                            <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">You can choose general options
                                according to your requirements.</dd>
                        </div>
                        <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-gray-500">Step Four</dt>
                            <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">After filling all the fields,
                                now you can click on Schedule a Meeting button which will take you to the joining page.</dd>
                        </div>
                        <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-gray-500">Step Five</dt>
                            <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">In joining page you will be
                                asked,whom do you want to join as. Choose and go ahead to the meeting.</dd>
                        </div>
                        <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-gray-500">Step Six</dt>
                            <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">When clicked on Instant
                                Meeting, a quick meeting will be scheduled. </dd>
                        </div>
                    </dl>
                </div>
            </div>
            <div class="flex min-h-full items-center justify-center lg:w-[40%] pb-6 px-4 sm:px-3 lg:px-4 ml-3">
                <div class="w-full max-w-sm space-y-8">
                    <div>
                        <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Schedule a meeting
                        </h2>
                    </div>
                      <div class="mt-8 space-y-6"><input type="hidden" name="remember" value="true">
                        <form action="schedule-meeting.jsp" id="form" method="POST">
                            <div class="-space-y-px rounded-md shadow-sm grid gap-5">
                                <div>
                                	<label 	for="meeting_name" class="sr-only">Meeting Name</label>
                                	<input 	 name="meeting_name" type="text"
                                			class="appearance-none rounded-none relative block
                                			w-full px-3 py-2 border border-gray-300
                                			placeholder-gray-500 text-gray-900 rounded-b-md
                                			focus:outline-none focus:ring-indigo-500
                                			focus:border-indigo-500 focus:z-10 sm:text-sm"
                                			placeholder="Meeting Name">
                                </div>
                                <div>
                                	<label 	for="passcode" class="sr-only">Pass code</label>
                                	<input 	 name="passcode" type="text"
                                			class="appearance-none rounded-none relative block
                                			w-full px-3 py-2 border border-gray-300
                                			placeholder-gray-500 text-gray-900 rounded-b-md
                                			focus:outline-none focus:ring-indigo-500
                                			focus:border-indigo-500 focus:z-10 sm:text-sm"
                                			placeholder="Passcode">
                               </div>
                                <div>
                                	<label  for="meeting_date" class="sr-only">Meeting Date</label>
                                	<input   name="meeting_date" type="date"
                                			class="appearance-none rounded-none relative block
                                			w-full px-3 py-2 border border-gray-300
                                			placeholder-gray-500 text-gray-900 rounded-b-md
                                			focus:outline-none focus:ring-indigo-500
                                			focus:border-indigo-500 focus:z-10 sm:text-sm"
                                			placeholder="Passcode">
                                </div>
                                <div>
                                	<label  for="meeting_time" class="sr-only">Meeting Time</label>
                                	<input   name="meeting_time" type="time"
                                			class="appearance-none rounded-none relative block
                                			w-full px-3 py-2 border border-gray-300
                                			placeholder-gray-500 text-gray-900 rounded-b-md
                                			focus:outline-none focus:ring-indigo-500
                                			focus:border-indigo-500 focus:z-10 sm:text-sm"
                                			placeholder="Meeting Time">
                                </div>
                                <h2 style="margin-top: 15px;">Time zone</h2>
                                <div class='w-full h-10 rounded-md'>
                                 <select class='w-full h-full rounded-md focus:outline-none bg-slate-50 border border-slate-300' name="timezone" id="timezone">
                                   <option key="0" class="w-96" value="" >Select Time zone</option>

							  <%
							  for (int i = 0; i < timezonesArray.length(); i++) {
						            JSONObject timezoneObject = timezonesArray.getJSONObject(i);
						            String name = timezoneObject.getString("name");
						             String value = timezoneObject.getString("value");

						            
						            if (name != null && !name.isEmpty() && value != null && !value.isEmpty()) {
								%>
								    <option class="w-96" value="<%= value %>"> - <%= name %> </option>
								<%
						            }
						        } 
								  %>
							</select>
                               </div>
                                <div class="relative inline-block text-left" data-headlessui-state=""
                                    style="margin-bottom: 35px;">
                                    <div>
                                        <h2 style="margin-top: 15px;">Choose Participants</h2>
                                        <select name="mySelectParticipants"  id="mySelectParticipants"
                                            class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transform opacity-100 scale-100 inline-flex w-full justify-between rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
                                            style="width: 100%;">
                                           <option key="0" class="w-96" value="">Select Participants</option>
					                         <%
					                         for (int i = 0; i < contactsArray.length(); i++) {
					                        	 contactObject = contactsArray.getJSONObject(i);
											     email = contactObject.getString("email");
											     first_name = contactObject.getString("first_name");
										
										        if (email != null && !email.isEmpty() && first_name != null && !first_name.isEmpty()) {

										%>
										          <option class="w-96" value="<%=contactObject.getInt("id") %>"><%= email %> - <%= first_name %> </option>
										<%
										        }
										    }
										%>

										</select>
                                    </div>
                                </div>

                                <div id="participants-display" class="grid gap-2"></div>
                                 <div>
									<h1 class="text-lg font-semibold">Add participant manually</h1>
                                    <%
								       
								         first_name = request.getParameter("firstName");
								         last_name = request.getParameter("lastName");
								         email = request.getParameter("email");
								         AddContactType contactDetails = new AddContactType( email,first_name, last_name,"","","",true);
						                 String addparticipants = apiServices.addcontact(contactDetails, access_token);
						                 JSONObject jsonresponse = new JSONObject(addparticipants);
								            if (first_name != null && last_name != null && email != null)
								            {
								               
								                if (first_name.isEmpty() || last_name.isEmpty() || email.isEmpty())
								                {
								                    error = true;
								                    success = true;
								                    message = "add contact failed \n " + addparticipants.toString();
								                    
								                    
								                } else
								                {
								                	  error = true;
									                  success = true;

								                    
								                    out.println("<p style='color:green;'>Participant added successfully! \n</p>");
								                    out.println(email);
								                    out.println("<input type='hidden' name='myParticipant_Id' value= '" + jsonresponse.getJSONObject("data").getString("id") + "' >");

								                }
								            }
								        %>
								        <div class="grid gap-2 mt-2">
								            <div>
								                <label for="first_name" class="sr-only">First Name</label>
								                <input type="text"  name="firstName"
								                       class="appearance-none rounded-none relative block
								                       w-full px-3 py-2 border border-gray-300
								                       placeholder-gray-500 text-gray-900 rounded-b-md
								                       focus:outline-none focus:ring-indigo-500
								                       focus:border-indigo-500 focus:z-10 sm:text-sm"
								                       placeholder="First Name">
								            </div>
								            <div>
								                <label for="last_name" class="sr-only">Last Name</label>
								                <input type="text" name="lastName"
								                       class="appearance-none rounded-none relative block
								                       w-full px-3 py-2 border border-gray-300
								                       placeholder-gray-500 text-gray-900 rounded-b-md
								                       focus:outline-none focus:ring-indigo-500
								                       focus:border-indigo-500 focus:z-10 sm:text-sm"
								                       placeholder="Last Name">
								            </div>
								            <div>
								                <label for="email" class="sr-only">Email</label>
								                <input type="email" name="email"
								                       class="appearance-none rounded-none relative block
								                       w-full px-3 py-2 border border-gray-300
								                       placeholder-gray-500 text-gray-900 rounded-b-md
								                       focus:outline-none focus:ring-indigo-500
								                       focus:border-indigo-500 focus:z-10 sm:text-sm"
								                       placeholder="Email">
								            </div>
								            <button type="submit"  class="px-5 py-2 border border-blue-500 rounded-md">Add</button>
								       </div>
								 </div> 
                                <div class="relative inline-block text-left" data-headlessui-state="" style="margin-bottom: 35px;">
                                    <div>
                                        <h2 style="margin-top: 15px;">Choose Moderators</h2>
                                        <select name="mySelectModerators" id="mySelectModerators"
                                            class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transform opacity-100 scale-100 inline-flex w-full justify-between rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
                                            style="width: 100%;">
                                              <option key="0" class="w-96" value="">Select Moderators</option>
                                             <%
					                         for (int i = 0; i < contactsArray.length(); i++) {
					                        	 contactObject = contactsArray.getJSONObject(i);
											     email = contactObject.getString("email");
											     first_name = contactObject.getString("first_name");
										        if (email != null && !email.isEmpty() && first_name != null && !first_name.isEmpty()) {

										%>
										          <option class="w-96" value="<%=contactObject.getInt("id") %>"><%= email %> - <%= first_name %> </option>
										<%
										        }
										    }
										%>
                                        </select>
                                    </div>
                                </div>
                                <input type="hidden" id="attendArray" name="attendArray" value="[]">
                                <input type="hidden" id="hostusersArray" name="hostusersArray" value="[]">
                                <div id="moderators-display" class="grid gap-2"></div>
                               <div class="">
                                    <p class="mt-3 text-sm">General Options</p>
                                    <div class="flex items-start mt-2">
                                        <div class="flex h-5 items-center"><input type="checkbox" id="options" name="options" class="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500" value="ALLOW_GUEST"></div>
                                        <div class="ml-3 text-sm"><label for="options" class="font-medium text-gray-700">Guest user can join meeting</label></div>
                                    </div>
                                </div>
                            </div>
                            <div id="manual-meeting-loader" class="flex justify-center"></div>
                            <input type="hidden" name="schedule-meeting" value="true" />
                            <div class="mt-3">
                            <button type="submit" id="schedule-meeting-button"
                                    class="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"><span
                                    class="absolute inset-y-0 left-0 flex items-center pl-3"></span>Schedule a meeting</button>
                                <div class="flex justify-center"><h1 class="my-3">Or</h1></div>
                            </div>
                      </form>

                        <div id="instant-meeting-loader" class="flex justify-center"></div>
                          <form action="schedule-meeting.jsp" class="flex justify-center gap-1 mt-3" method="POST">
                           <input type="hidden" name="instantmeeting" value="true" />
                        <button type="submit"
                            class="group relative flex w-full justify-center rounded-md border border-transparent bg-violet-600 py-2 px-4 text-sm font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2">Start
                            Instant Meeting</button>
                            </form>
                    </div>
              	</div>
        	</div>
        </div>
		</div>

	<%
		if (success && meeting_response != null) {

		%>

        <div id="modal">
                <div>
                    <div class="relative z-10" id="headlessui-dialog-5" role="dialog" aria-modal="true" data-headlessui-state="open">
                        <div class="fixed inset-0 bg-gray-700 bg-opacity-75 transition-opacity opacity-100"></div>
                        <div class="fixed inset-0 z-10 overflow-y-auto">
                            <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg opacity-100 translate-y-0 sm:scale-100" id="headlessui-dialog-panel-6" data-headlessui-state="open">
                                    <div style="position: absolute;right: 1rem;">
                                        <button type="button" class="close-modal text-black-600 text-3xl" data-dismiss="alert" aria-label="Close" onclick="closeModal()"><span aria-hidden="true">&times;</span></button>
                                    </div>
							<div class="p-8 grid gap-2">
							<div class="h-14 flex justify-center items-center w-full rounded-lg bg-green-100 text-green-600">Your meeting has been created successfully!</div>
								<div class="font-semibold text-gray-600">
                                    Meeting_id: <span class="font-normal text-gray-700"><%= meeting_response.getJSONObject("data").getString("meeting_id") %></span>
                                </div>
                                <div class="font-semibold text-gray-600">
                                    Meeting password: <span class="font-normal text-gray-700"> <%= meeting_response.getJSONObject("data").getString("passcode")  %></span>
                                </div>
                                <div class="font-semibold text-gray-600">
                                    Meeting URL: <span class="font-normal text-gray-700"><%= meeting_response.getJSONObject("data").getString("joinURL")  %></span>
                                </div>
                                <div class="flex justify-center">
                            <a href="join-meeting.jsp?meeting_id=<%= meeting_response.getJSONObject("data").getString("meeting_id") %>&pCode=<%= meeting_response.getJSONObject("data").getString("pcode") %>" tabindex="0">
                                <button class="bg-emerald-600 font-semibold px-4 py-2 mt-1 text-white rounded-md">Start Meeting</button>
                            </a>
							</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<script>
        function closeModal() {
        var modal = document.getElementById("modal");
        modal.style.display = "none";
		}
	</script>
<%
}

	%>
	</div>
	<script>
	 //schedule meeting manually
        $(document).ready(function() {
			$("#mySelectParticipants").change((event) => {
                addParticipant(event)
            })
            $("#mySelectModerators").change((event) => {
                addModerator(event)
            })

        })
        $(document).ready(function() {
            localStorage.setItem("attendees", JSON.stringify([]))
            localStorage.setItem("hostusers", JSON.stringify([]))
        })
        $(document).ready(function() {
            $("#close-modal").click(() => {
                document.querySelector("#modal").removeChild('div')
            })
        })
    </script>
</body>
</html>
