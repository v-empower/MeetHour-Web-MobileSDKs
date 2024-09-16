<%@ page import="go.meethour.io.javasdk.services.ApiServices"%>
<%@ page import="go.meethour.io.javasdk.types.LoginType"%>
<%@ page import="go.meethour.io.javasdk.constants.ApiConstants" %>
<%@ page import="org.json.*"%>

<% 
    boolean success = false;
    boolean error = false;
    String message = null;
    String accessToken = null; 

    try {
        if (request.getMethod().equals("POST")) 
        {
            String getAccessToken = request.getParameter("getaccesstoken");
            
            if (getAccessToken != null && getAccessToken.equals("true")) {
            	ApiServices apiServices = new ApiServices();
            	ApiConstants Constants = new ApiConstants();
            	
                if (Constants.CLIENT_ID != null && !Constants.CLIENT_ID.isEmpty() && Constants.CLIENT_SECRET != null && !Constants.CLIENT_SECRET.isEmpty()
                        && Constants.EMAIL != null && !Constants.EMAIL.isEmpty() && Constants.PASSWORD != null && !Constants.PASSWORD.isEmpty()) {
                    LoginType login = new LoginType(Constants.CLIENT_ID, Constants.CLIENT_SECRET, Constants.GRANT_TYPE, Constants.EMAIL, Constants.PASSWORD);
                    String  loginResponse = apiServices.login(login);
        			JSONObject responsesObject = new JSONObject(loginResponse);
        			if (responsesObject != null && responsesObject.has("access_token")) {
        				
        				 try {
        					 String access_token = responsesObject.getString("access_token");
        					
							session.setAttribute("access_token", access_token);  
        				 
        	            	if (access_token != null && !access_token.isEmpty()) {
        	                
        	                 	accessToken = access_token;
        	                	success = true;
        	                	
        	            	}
        	            
                        } catch (Exception e) {
                            e.printStackTrace();
                            error = true;
                            message = "Failed to get access token.";
                        }
                    } else {
                        error = true;
                        message = "Login response does not contain access token";
                    }
                } else {
                    error = true;
                    message = "Something went wrong. Make sure you set the credentials.";
                }
            } else {
                error = true;
                message = "Something went wrong. Make sure you post true value in getAccessToken";
            }
        }
    }catch (Exception e) {
            e.printStackTrace();
            error = true;
            message = e.getMessage();
        }
    %>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
<link href="https://portal.meethour.io/dist/images/favicon.png" rel="shortcut icon" />
<link href="css/style.css" rel="stylesheet">
<link href="css/loader.css" rel="stylesheet">
<title>Meet Hour - Java Example</title>
</head>
<body>
	<div>
		<div>
			<%@ include file="header.jsp"%>
		</div>
		<div class="relative top-16">
			<% if (error) { %> 
			<div id="error">
				<div
					class="flex fixed top-20 justify-center items-center text-lg font-medium w-96 rounded-md h-16 border border-red-600 bg-red-50 text-red-600">
					<p><%= message %></p>
				</div>
			</div>
			<% } %>
			<div class="text-3xl flex justify-center font-bold mt-5 text-sky-500">
				<h1>Welcome to Meet Hour Java - Example</h1>
			</div>
			<div
				class="md:mx-40 mx-5 overflow-hidden bg-white shadow sm:rounded-lg">
				<div class="px-4 py-5 sm:px-6">
					<h3 class="text-lg font-medium leading-6 text-gray-900">Steps
						to Authorize Meet Hour Developer account and get access token.</h3>
					<p class="mt-1 text-sm text-gray-500">Steps given below -</p>
				</div>
				<div class="border-t border-gray-200">
				
					<dl id="steps">
					<div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
						<dt class="text-sm font-medium text-gray-500">Step One</dt>
						<dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">Go to <a target="_blank" class="text-blue-500" href="https://meethour.io">meethour.io</a> and sign up for Developer or Higher plan. Currently we offer 28 days free trial.</dd>
					</div>
					<div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
						<dt class="text-sm font-medium text-gray-500">Step Two</dt>
						<dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">Go to the <a target="_blank" class="text-blue-500" href="https://portal.meethour.io">dashboard</a> and then click on <a class="text-blue-500" target="_blank" href="https://portal.meethour.io/customer/developers">developers</a>menu.</dd>
					</div>
					<div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
						<dt class="text-sm font-medium text-gray-500">Step Three</dt>
						<dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">Copy your Client ID, Client Secret and API Key. After copying, paste each copied text to the respective constant in the source code constants.java</dd>
					</div>
					<div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
						<dt class="text-sm font-medium text-gray-500">Step Four</dt>
						<dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">After completing all the steps given above, now click on Get Access Token given below.</dd>
					</div>
					<div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
						<dt class="text-sm font-medium text-gray-500">Step Five</dt>
						<dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">As you click, your access token will be received and stored it in local storage. The received access token is then used for making Meet Hour REST API calls.</dd>
					</div>
					<% if (accessToken != null) { %>
						<div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
							<dt class="text-sm font-medium text-gray-500">Step Six</dt>
							<dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">Token successfully got generated. Now you can schedule a meeting. <a class="text-blue-500 underline" href='schedule-meeting.jsp'>Schedule a Meeting</a></dd>
						</div>
						<div class="bg-white px-4  py-5 sm:grid  m:grid-cols-12 sm:gap-4 sm:px-12"><textarea  class=" "  disabled ><%= accessToken %></textarea></div>
						<% } %>
					</dl>
				</div>
			</div>
			<div class="grid w-screen justify-center mt-2">
				<div id="loader" class="flex justify-center"></div>
				<form action="index.jsp" class="flex justify-center gap-1 mt-3" method="POST">
					<input type="hidden" name="getaccesstoken" value="true" />
					<button type="submit" id="getaccesstoken"
						class="bg-sky-600 flex justify-center items-center text-white rounded-md h-9 w-40">Get
						Access Token</button>
				</form>
			</div>
		</div>
	</div>
</body>
</html>

