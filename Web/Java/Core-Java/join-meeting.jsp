<%@ page import="go.meethour.io.javasdk.types.GenerateJwt" %>
<%@ page import="go.meethour.io.javasdk.types.ViewMeeting" %>
<%@ page import="go.meethour.io.javasdk.services.ApiServices" %>
<%@ page import="go.meethour.io.javasdk.constants.ApiConstants" %>
<%@ page import="org.json.JSONObject" %>
<%@ page import="org.json.JSONArray" %>
<%@ page import="jakarta.servlet.http.HttpServletResponse" %> 
<%@ page import="java.util.Map" %>
<%@ page import="java.util.HashMap" %>
<%@ page import="java.util.ArrayList" %>
<%@ page import="java.util.List" %>

 <%
    String meeting_id = null;
    String jwt_token = null;
    Map<String, Object> meetingAttendees = null;
    String pCode = null;
    JSONObject jwt_response = null;
    List<Map<String, Object>> hosts = null;
    List<Map<String, Object>> attendees = null;
    boolean success = false;
    boolean error = false;
    String message = null;
    ApiConstants Constants = new ApiConstants();
    String access_token = (String) session.getAttribute("access_token");
    
  
    try {
    	 if (request.getMethod().equals("POST")) {
            meeting_id = request.getParameter("meeting_id");
            pCode = request.getParameter("pcode");
            GenerateJwt jwt = new GenerateJwt(meeting_id);  // Generate Jwt Token
            ApiServices apiServices = new ApiServices();
            String jwtObject = apiServices.generatejwt(jwt, access_token);
          
           
            jwt_response = new JSONObject(jwtObject);
            if (jwt_response != null && jwt_response.optBoolean("success") && jwt_response.has("jwt")) {
                jwt_token = (String) jwt_response.get("jwt");
                success = true;
            } else {
                error = true;
                message = "Error in Generating JWT Token\n" + jwt_response.toString();
            }
            
        } 
    	 else {
             meeting_id = request.getParameter("meeting_id");
             pCode = request.getParameter("pcode");
             if (meeting_id != null) {
                 ViewMeeting view_meetings_object = new ViewMeeting(meeting_id);
                 ApiServices apiServices = new ApiServices();
                 String viewObject = apiServices.viewmeeting(view_meetings_object, access_token);
              
                 JSONObject apiresponse = new JSONObject(viewObject);
                 JSONObject meeting_details = apiresponse.getJSONObject("meeting");
              
            
                 JSONObject organizer = null;
                 pCode = (String) meeting_details.get("pcode");
                 if (apiresponse.has("organizer")) {
                     organizer = apiresponse.getJSONObject("organizer");
                   
                 }
                
                 JSONArray  hostsArray = null;
                 String host_email = null;
                if (meeting_details.get("hosts") != null && meeting_details.get("hosts").equals("[]")==false) {
                	
                	
                	  hostsArray = meeting_details.getJSONArray("hosts");
                	  hosts = new ArrayList<>();
                	  Map<String, Object> single_host = null;
                      for (int i = 0; i < hostsArray.length(); i++) {
                    	  single_host = hostsArray.getJSONObject(i).toMap();
                    	
                    	  host_email = single_host.get("email").toString();
                    	  hosts.add(single_host);
                          
                      }
                 
                 }

                
                 if (apiresponse.get("meeting_attendees") != null) {
                     JSONArray attendeesArray = (JSONArray) apiresponse.get("meeting_attendees");
                 
                     attendees = new ArrayList<>();
                     for (int i = 0; i < attendeesArray.length(); i++) {
                    	
                    	 if(host_email.equals(attendeesArray.getJSONObject(i).toMap().get("email").toString())==false)
                        	 attendees.add(attendeesArray.getJSONObject(i).toMap());
                         
                     }
                   
                 }
                  meetingAttendees=new HashMap<>();
                 if (organizer != null) {
                	 meetingAttendees.put("organizer", organizer.toMap());
                 }
 				 if (hosts != null) {
                    meetingAttendees.put("hosts", hosts);
                 } 
 			
 			    if (attendees != null) {
                    meetingAttendees.put("attendees", attendees);
                 }
 			    
                 request.setAttribute("meetingAttendees", meetingAttendees);
             }
         }
    } catch (Exception e) {
        error = true;
        message = e.getMessage();
      
    }
%> 
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <title>Meet Hour Java Example (Join Meeting)</title>
    <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=0" />
    <link href="https://portal.meethour.io/dist/images/favicon.png" rel="shortcut icon" />
    <link href="css/style.css" rel="stylesheet">
    <link href="css/loader.css" rel="stylesheet">
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
    <script type="text/JavaScript" src="https://MomentJS.com/downloads/moment.js"></script>
    <script type="text/javascript" src="https://api.meethour.io/libs/<%= Constants.API_RELEASE %>/external_api.min.js?apiKey=<%= Constants.API_KEY %>"></script>
        </head>
</head>

<body>
    <div>
      <%@ include file="header.jsp"%>
     </div>
      <div class="relative top-16">
        <% if (error) { %> 
        <div id="error">
            <div class="flex fixed top-20 justify-center items-center text-lg font-medium w-96 rounded-md h-16 border border-red-600 bg-red-50 text-red-600">
                <p><%= message %></p>
            </div>
        </div>
        <% } %>
       <% if (meeting_id != null && jwt_token == null) { %>
    	<div id="moderator-selection-parent">
        <div class="relative top-16 h-screen w-screen flex justify-center">
            <div id="moderator-selection" class="rounded-md opacity-100 h-auto p-5 w-96 bg-white">
                <div class="flex justify-center w-full"></div>
                <h1 class="text-xl font-semibold">Whom would you like to join as?</h1>
                <div id="loader" class="flex justify-center"></div>
                           <form method="POST" action="join-meeting.jsp?meeting_id=<%= meeting_id %>&pcode=<%= pCode %>">
                                <input name="id" type="hidden" value="organizer" />
                                <h1><%= ((Map<String, Object>) meetingAttendees.get("organizer")).get("email") %></h1>
                                <button type="submit" class="flex my-4 gap-2 px-4 py-2 border cursor-pointer text-black hover:text-white hover:bg-blue-600 border-blue-600 rounded-md">
                                    
                                    (Organizer / Account Owner)
                            </button>  
                      </form>
                      <% if (meetingAttendees != null && meetingAttendees.get("hosts") != null) { %>
		                <%
		                   hosts = (List<Map<String, Object>>) meetingAttendees.get("hosts");
		                    for (Map<String, Object> host : hosts) {
		                %>
		                    <form method="POST" action="join-meeting.jsp?meeting_id=<%= meeting_id %>&pcode=<%= pCode %>">
		                        <input name="id" type="hidden" value="<%= host.get("email") %>" />
		                          <h1><%= host.get("first_name") %> <%= host.get("last_name") %></h1>
		                        <button type="submit" class="flex my-4 gap-2 px-4 py-2 border cursor-pointer text-black hover:text-white hover:bg-blue-600 border-blue-600 rounded-md">
		                          
		                            (Moderator / Host)
		                        </button>
		                    </form>
		              
		            <% } %>
					  <% } %>
		            <% if (meetingAttendees != null && meetingAttendees.get("attendees") != null) { %>
		                <%
		                     attendees = (List<Map<String, Object>>) meetingAttendees.get("attendees");
		                    for (Map<String, Object> attendee : attendees) {
		                %>
		                    <form method="POST" action="join-meeting.jsp?meeting_id=<%= meeting_id %>&pcode=<%= pCode %>">
		                        <input name="id" type="hidden" value="<%= attendee.get("email") %>" />
		                         <h1><%= attendee.get("first_name") %> <%= attendee.get("last_name") %></h1>
		                        <button type="submit" class="flex my-4 gap-2 px-4 py-2 border cursor-pointer text-black hover:text-white hover:bg-blue-600 border-blue-600 rounded-md">
		                           
		                            (Attendee)
		                        </button>
		                    </form>
		               
		            <% } %>
		             <% } %>
		             </div>
		             </div>
		          </div>
		            <% } %>
		         	<% if (meeting_id == null) { %>
		            <div id="meeting-id-input" class="grid gap-3 p-5 relative top-16">
		                <h1 class="text-slate-600 text-2xl">Join a Meeting</h1>
		              <form method="POST" action="join-meeting.jsp">
		                  <input id="meeting-id-input-field" name="meeting_id" placeholder="Enter Meeting Id or link here." class="w-64 h-10 border border-slate-400 focus:outline-none rounded-md pl-3" type="text"> <a id="meeting-id-input-button-anchor">
		                    <button id="meeting-id-input-button" class="w-28 h-8 text-white font-semibold text-sm bg-green-600 rounded-md">Join Meeting</button>
		                     </a>
		                  </form>
		                  </div>
		             <% } %>
		        </div>
		        <% if (meeting_id != null && jwt_token != null) { %>
    
			    <div class="relative top-16 h-screen" id="conference-parent"></div>
				<script type="text/javascript">
			    var access_token = "<%= (access_token != null ? access_token : "") %>";
			    if (access_token === null || access_token === "") {
			        alert("First generate the access token and then try to join a meeting.");
			        window.location.href = "index.jsp";
			    }
			
			    if (window.location.search?.split("&")[0]?.split("?")[1]?.split("=")[1]) {
			          document.querySelector("#meeting-id-input").remove()
			      }
			      $(document).ready(function() {
			          $("#meeting-id-input-field").change((event) => {
			              const meetingIdInputButton = document.querySelector("#meeting-id-input-button-anchor");
			              if (event.target.value.includes(`https:/`)) {
			                  const id = event.target.value.slice(20, 34);
			                  meetingIdInputButton.setAttribute("href", `join-meeting.jsp?meeting_id=${id}`)
			                  return;
			              }
			              meetingIdInputButton.setAttribute("href", `join-meeting.jsp?meeting_id=${event.target.value}`)
			          })
			      })
			     
			    </script>
			
		 <div class="relative" id="conference-parent"></div>
			
			            <script type="text/javascript">
			                try {
			                    const conferencePanel = document.createElement("div");
			                    conferencePanel.setAttribute("id", "conference");
			                    conferencePanel.setAttribute("style", "height: 100%;");
			                    const meetingPanel = document.querySelector("#conference-parent");
			                    meetingPanel.appendChild(conferencePanel);
			
			                    var domain = "<%= Constants.CONFERENCE_URL %>";
			                    var options = {
			                        roomName: "<%= meeting_id %>", 
			                        parentNode: document.querySelector("#conference"),
			                        jwt: "<%= jwt_token %>",
			                        apiKey: "<%= Constants.API_KEY %>",
			                        pcode: "<%= pCode %>",
			                        interfaceConfigOverwrite: {
			                            applyMeetingSettings: true, // This is managed from this page - https://portal.meethour.io/customer/ui_settings
			                            disablePrejoinHeader: true,
			                            disablePrejoinFooter: true,
			                            SHOW_MEET_HOUR_WATERMARK: false,
			                            ENABLE_DESKTOP_DEEPLINK: false,
			                            HIDE_DEEP_LINKING_LOGO: true,
			                            MOBILE_APP_PROMO: false,
			                            ENABLE_MOBILE_BROWSER: true,
			                        }
			                    };
			
			                    if (options.jwt !== "" && options.jwt !== "None") {
			                        // Initialization of MeetHour External API
			                        var api = new MeetHourExternalAPI(domain, options);
			                        // api variable can be used to run other event listeners mentioned in the documentation.
			                    }
			
			                } catch (error) {
			                    console.log(error);
			                }
			            </script> 
			            
			            
			             <% } %> 
			            
			    
</body>
</html>
