<?php

require('./vendor/autoload.php');
require('./vendor/meethour/php-sdk/src/autoload.php');
require('constants.php');
include 'db_connect.php';


use MeetHourApp\Services\MHApiService;
use MeetHourApp\Types\Login;
use MeetHourApp\Types\ContactsList;
use MeetHourApp\Types\ScheduleMeeting;


$success = false;
$error = false;
$message = null;
$accessToken = null;
$MeetingResponse = null;
$timezoneResponse = null;
$timezonesList = null;
$contactsResponse = null;
$contacts = null;


try {
    $conn = OpenCon();
} catch (\Exception) {
    $error = true;
    $message = 'Could not connect to database. Check db_connect.php file';
}


if (!$conn) {
    $error = true;
    $message = 'Could not connect to database. Check db_connect.php file';
}

if ($conn) {
    $meetHourApiService = new MHApiService();
    
    $sql = "SELECT `access_token` FROM `credentials` WHERE 1";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $accessToken = $row["access_token"];
            $success = true;

            $timezoneResponse = $meetHourApiService->timezone($accessToken);
            
            $timezonesList = $timezoneResponse->timezones;
            
            $contactsListBody = new ContactsList();
            $contactsResponse = $meetHourApiService->contactsList($accessToken, $contactsListBody);
            $contacts = $contactsResponse->contacts;
        }
    } else {
        $success = false;
        $error = true;
        $message = 'Some issue in querying access token from database';
    }

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
  

        $instantMeeting = $_POST["instantmeeting"];
        $ScheduleMeeting = $_POST["schedulemeeting"];

        if (isset($instantMeeting) && $instantMeeting === 'true') {
            $timezone  = date_default_timezone_get();

            $scheduleBody = new ScheduleMeeting("Instant Meeting", "123456", date('h:i'), 'PM', date('d-m-Y'), $timezone);  // You can give 

            $MeetingResponse = $meetHourApiService->scheduleMeeting($accessToken, $scheduleBody);
        } else if (isset($ScheduleMeeting) && $ScheduleMeeting === 'true') {
            $meetingName = $_POST["meeting_name"];
            $passcode = $_POST["passcode"];
            $meetingDate = $_POST["meeting_date"];
            $time12 = date("g:i a", strtotime($_POST["meeting_time"]));
            $timeArray = explode(" ", $time12);
            $timeString = $timeArray[0]; // "04:56"
            $timeStamp = strtotime($timeString);
            $meetingTime = date("H:i", $timeStamp);
            $meetingMeridiem = $timeArray[1];
            $timezone = $_POST["timezone"];
            $hostUsersArray = $_POST["hostusersArray"];
            $hostUsersString = json_decode($hostUsersArray);
            $hostUsers = array_map('intval', $hostUsersString);
            $attendeesArray = $_POST["attendArray"];
            $attendeesString = json_decode($attendeesArray);
            $attendees = array_map('intval', $attendeesString);
            if (isset($CLIENT_ID) && !empty($CLIENT_ID) && isset($CLIENT_SECRET) && !empty($CLIENT_SECRET) && isset($USERNAME) && !empty($USERNAME) && isset($PASSWORD) && !empty($PASSWORD)) {
                $login = new Login($CLIENT_ID, $CLIENT_SECRET, $GRANT_TYPE, $USERNAME, $PASSWORD);
                $loginResponse = $meetHourApiService->login($login);
                if (isset($loginResponse->access_token) && !empty($loginResponse->access_token)) {
                    $sql = "UPDATE `credentials` SET `access_token`='" . $loginResponse->access_token . "' WHERE 1";
                    $sql2 = "SELECT `access_token` FROM `credentials` WHERE 1";
                    $data = $conn->query($sql);
                    if ($data === TRUE) {
                        $result = $conn->query($sql2);
                        if ($result->num_rows > 0) {
                            while ($row = $result->fetch_assoc()) {
                                $accessToken = $row["access_token"];
                                $success = true;
                            }
                            $scheduleBody = new ScheduleMeeting($meetingName, $passcode, $meetingTime, $meetingMeridiem, $meetingDate, $timezone);
                            $scheduleBody->attend = $attendees; 
                            $scheduleBody->hostusers = $hostUsers; 
                            $scheduleBody->options = ["ALLOW_GUEST"]; 
            $MeetingResponse = $meetHourApiService->scheduleMeeting($accessToken, $scheduleBody);
                        } else {
                            $success = false;
                            $error = true;
                            $message = 'Some issue in querying access token from database';
                        }
                    } else {
                        $success = false;
                        $error = true;
                        $message = 'Some issue in inserting token in database';
                    }
                }
            } else {
                $error = true;
                $message = 'Something went wrong. Make sure you set the credentials.';
            }
        } else {
            $error = true;
            $message = 'Something went wrong. Make sure you post true value in getaccesstoken';
        }
    }

    CloseCon($conn);
}


?>

<!doctype html>
<html>

<head>
    <meta charset="UTF-8" />
    <title>Meet Hour Javascript Example (Schedule Meeting Page)</title>
    <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=0" />
    <link href="https://portal.meethour.io/dist/images/favicon.png" rel="shortcut icon" />
    <link href="css/style.css" rel="stylesheet">
    <link href="css/loader.css" rel="stylesheet">
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
    <script type="text/JavaScript" src=" https://MomentJS.com/downloads/moment.js"></script>
    <script src="js/navbar.js"></script>
    <script src="js/scheduleMeeting.js"></script>
</head>

<body>
    <div>
        <div>
            <?php echo require('./header.php') ?>
        </div>
        <div class="lg:flex w-screen relative top-16 justify-between overflow-x-hidden">
            <?php if (isset($error) && $error === true) { ?>
                <div id="error">
                    <div class="flex fixed top-20 justify-center items-center text-lg font-medium w-96 rounded-md h-16 border border-red-600 bg-red-50 text-red-600">
                        <p><?php echo $message ?></p>
                    </div>
                </div>
            <?php } ?>
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
                                meeting name, passcode, meeting date, meeting time, meeting meridiem and timezone in the
                                Schedule a Meeting Form.<br><span class="text-xs">Note: You have to set a moderator to
                                    start
                                    the meeting. If you do not set a moderator, meeting can not start.</span></dd>
                        </div>
                        <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-gray-500">Step Two</dt>
                            <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">After adding all the necessary
                                fields, now add participants and moderators. Note: To start a meeting, atleast one
                                moderator
                                is required.</dd>
                        </div>
                        <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-gray-500">Step Three</dt>
                            <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">You can choose general options
                                according to your requirements.</dd>
                        </div>
                        <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-gray-500">Step Four</dt>
                            <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">After filling all the fields,
                                now
                                you can click on Schedule a Meeting button which will take you to the joining page.</dd>
                        </div>
                        <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-gray-500">Step Five</dt>
                            <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">In joining page you will be
                                asked,
                                whom do you want to join as. Choose and go ahead to the meeting.</dd>
                        </div>
                        <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-gray-500">Step Six</dt>
                            <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">When clicked on Instant
                                Meeting, a
                                quick meeting will be scheduled. </dd>
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
                        <form action="schedule-meeting.php" id="form" method="POST">
                            <div class="-space-y-px rounded-md shadow-sm grid gap-5">
                                <div><label for="meeting_name" class="sr-only">Meeting Name</label><input id="meeting_name" name="meeting_name" type="text" class="appearance-none rounded-none relative block
                      w-full px-3 py-2 border border-gray-300
                      placeholder-gray-500 text-gray-900 rounded-b-md
                      focus:outline-none focus:ring-indigo-500
                      focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Meeting Name"></div>
                                <div><label for="passcode" class="sr-only">Passcode</label><input id="passcode" name="passcode" type="text" class="appearance-none rounded-none relative block
                      w-full px-3 py-2 border border-gray-300
                      placeholder-gray-500 text-gray-900 rounded-b-md
                      focus:outline-none focus:ring-indigo-500
                      focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Passcode"></div>
                                <div><label for="meeting_date" class="sr-only">Meeting Date</label><input id="meeting_date" name="meeting_date" type="date" class="appearance-none rounded-none relative block
                      w-full px-3 py-2 border border-gray-300
                      placeholder-gray-500 text-gray-900 rounded-b-md
                      focus:outline-none focus:ring-indigo-500
                      focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Passcode"></div>
                                <div><label for="meeting_time" class="sr-only">Meeting Time</label><input id="meeting_time" name="meeting_time" type="time" class="appearance-none rounded-none relative block
                      w-full px-3 py-2 border border-gray-300
                      placeholder-gray-500 text-gray-900 rounded-b-md
                      focus:outline-none focus:ring-indigo-500
                      focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Meeting Time"></div>
                                <div class='w-full h-10 rounded-md'>
                                    <select class='w-full h-full rounded-md focus:outline-none bg-slate-50 border border-slate-300' name="timezone" id="timezone">
                                        <?php foreach ($timezonesList as $item) { ?>
                                            <option key=<?php $item->value; ?> class='w-96' value=<?php echo $item->value; ?>><?php echo $item->name; ?></option>
                                        <?php } ?>
                                    </select>
                                </div>
                                <div class="relative inline-block text-left" data-headlessui-state="" style="margin-bottom: 35px;">
                                    <div>
                                        <h2 style="margin-top: 15px;">Choose Participants</h2>
                                        <select name="mySelectParticipants" id="mySelectParticipants" onchange="addParticipant(this)" class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transform opacity-100 scale-100 inline-flex w-full justify-between rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100" style="width: 100%;">
                                        </select>
                                    </div>
                                </div>
                                <div id="participants-display" class="grid gap-2">

                                </div>
                                <div class="relative inline-block text-left" data-headlessui-state="" style="margin-bottom: 35px;">
                                    <div>
                                        <h2 style="margin-top: 15px;">Choose Moderators</h2>
                                        <select name="mySelectModerators" id="mySelectModerators" class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transform opacity-100 scale-100 inline-flex w-full justify-between rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100" style="width: 100%;">
                                            
                                        </select>
                                    </div>
                                </div>
                                <input type="hidden" id="attendArray" name="attendArray" value="[]">
                                <input type="hidden"  id="hostusersArray" name="hostusersArray" value="[]">
                                <div id="moderators-display" class="grid gap-2">

                                </div>
                                <div class="">
                                    <p class="mt-3 text-sm">General Options</p>
                                    <div class="flex items-start mt-2">
                                        <div class="flex h-5 items-center"><input disabled checked id="options" name="options" type="checkbox" class="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500" value="ALLOW_GUEST"></div>
                                        <div class="ml-3 text-sm"><label for="options" class="font-medium text-gray-700">Guest
                                                user can join meeting</label></div>
                                    </div>
                                </div>
                            </div>
                            <div id="manual-meeting-loader" class="flex justify-center"></div>
                            <input type="hidden" name="schedulemeeting" value="true" />
                            <div class="mt-3"><button type="submit" id="schedule-meeting-button" class="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"><span class="absolute inset-y-0 left-0 flex items-center pl-3"></span>Schedule a
                                    meeting</button>
                                <div class="flex justify-center">
                                    <h1 class="my-3">Or</h1>
                                </div>
                            </div>
                        </form>
                        <div id="instant-meeting-loader" class="flex justify-center"></div>
                        <form action="schedule-meeting.php" class="flex justify-center gap-1 mt-3" method="POST">
                            <input type="hidden" name="instantmeeting" value="true" />
                            <button type="submit"  class="group relative flex w-full justify-center rounded-md border border-transparent bg-violet-600 py-2 px-4 text-sm font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2">Instant Meeting</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
       
        <?php
        if ($success === true && $MeetingResponse !== null) { ?>
            <div id="modal">
                <div>
                    <div class="relative z-10" id="headlessui-dialog-5" role="dialog" aria-modal="true" data-headlessui-state="open">
                        <div class="fixed inset-0 bg-gray-700 bg-opacity-75 transition-opacity opacity-100"></div>
                        <div class="fixed inset-0 z-10 overflow-y-auto">
                            <div class="flex justify-end">
                                <button id="close-modal" onclick="removeModal()">Close</button>
                            </div>
                            <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg opacity-100 translate-y-0 sm:scale-100" id="headlessui-dialog-panel-6" data-headlessui-state="open">
                                    <div class="p-8 grid gap-2">
                                        <div class="h-14 flex justify-center items-center w-full rounded-lg bg-green-100 text-green-600">
                                            Your meeting has been created successfully!</div>
                                        <div class="font-semibold text-gray-600">Meeting id: <span class="font-normal text-gray-700"><?php echo $MeetingResponse->data->meeting_id ?></span>
                                        </div>
                                        <div class="font-semibold text-gray-600">Meeting passcode: <span class="font-normal text-gray-700"><?php echo $MeetingResponse->data->passcode ?></span>
                                        </div>
                                        <div class="font-semibold text-gray-600">Meeting URL: <span class="font-normal text-gray-700"><?php echo $MeetingResponse->data->joinURL ?></span>
                                        </div>
                                        <div class="flex justify-center"><a href="join-meeting.php?meeting_id=<?php echo $MeetingResponse->data->meeting_id ?>&pcode=<?php echo $MeetingResponse->data->pcode ?>" tabindex="0"><button class="bg-emerald-600 font-semibold px-4 py-2 mt-1 text-white rounded-md">Start
                                                    Meeting</button></a></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            <?php } ?>
            </div>
    </div>
    <script>
        // Schedule a meeting manually
        $(document).ready(function() {
            setTimeout(() => {
                getContactsList(<?php echo json_encode($contactsResponse) ?>)
            }, 500)
            $("#mySelectParticipants").change((event) => {
                addParticipant(event)
            })
            $("#mySelectModerators").change((event) => {
                addModerator(event)
            })
        })
        $(document).ready(function () {
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