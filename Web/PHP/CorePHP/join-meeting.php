<?php

require('./vendor/autoload.php');
require('./vendor/meethour/php-sdk/src/autoload.php');
require('constants.php');
include 'db_connect.php';

use MeetHourApp\Services\MHApiService;
use MeetHourApp\Types\ViewMeeting;
use MeetHourApp\Types\GenerateJwt;

$success = false;
$error = false;
$message = null;
$accessToken = null;
$meetingId = null;
$meetingAttendees = [];
$jwtToken = null;
$pCode = null;


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
        if ($row = $result->fetch_assoc()) {
            $accessToken = $row["access_token"];
            $success = true;
            if ($_SERVER["REQUEST_METHOD"] == "POST") {
                $meetingId = isset($_GET['meeting_id']) ? $_GET['meeting_id'] : "";
                $pCode = isset($_GET['pcode']) ? $_GET['pcode'] : "";
                $id = $_POST["id"];
                $generateJwtBody = new GenerateJwt($meetingId);
                if ($id != "organizer") {
                    $generateJwtBody->contact_id = (int) $id;
                }
                $generateJwtResponse = $meetHourApiService->generateJwt($accessToken, $generateJwtBody);
                if ($generateJwtResponse->success === true && isset($generateJwtResponse->jwt)) {
                    $jwtToken = $generateJwtResponse->jwt;
                    $success = true;
                } else {
                    $error = true;
                    $message = 'Error in Generating JWT Token \n' . json_encode($generateJwtResponse);
                }
            } else {
                $meetingId = isset($_GET["meeting_id"]) ? $_GET["meeting_id"] : null;
                $pCode = isset($_GET['pcode']) ? $_GET['pcode'] : "";
                if ($meetingId !== null) {
                    $viewMeetingBody = new ViewMeeting($_GET['meeting_id']);
                    $viewMeetingResponse = $meetHourApiService->viewMeeting($accessToken, $viewMeetingBody);
                    $attendees = [];
                    if (!empty($viewMeetingResponse->meeting->meeting_attendees)) {
                        $attendees = json_decode($viewMeetingResponse->meeting->meeting_attendees);
                    }
                    if ($attendees === null) {
                        $attendees = [];
                    }
                    $meetingAttendees = array(
                        'organizer' => $viewMeetingResponse->organizer,
                        'hosts' => $viewMeetingResponse->meeting->hosts,
                        'attendees' => $attendees
                    );
                }
            }
        }
    } else {
        $success = false;
        $error = true;
        $message = 'Some issue in querying access token from database';
    }
}

?>

<!DOCTYPE html>
<html lang="en">

<head>

    <head>
        <meta charset="UTF-8" />
        <title>Meet Hour Javascript Example (Join Meeting)</title>
        <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=0" />
        <link href="https://portal.meethour.io/dist/images/favicon.png" rel="shortcut icon" />
        <link href="css/style.css" rel="stylesheet">
        <link href="css/loader.css" rel="stylesheet">
        <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
        <script type="text/JavaScript" src=" https://MomentJS.com/downloads/moment.js"></script>
        <script type="text/javascript" src="https://api.meethour.io/libs/<?php echo $API_RELEASE ?>/external_api.min.js?apiKey=<?php echo $API_KEY ?>"></script>
        <script src="js/joinMeeting.js"></script>
    </head>
</head>

<body>
    <div>
        <?php echo require('./header.php') ?>
    </div>
    <?php if (isset($error) && $error === true) { ?>
        <div id="error">
            <div class="flex fixed top-20 justify-center items-center text-lg font-medium w-96 rounded-md h-16 border border-red-600 bg-red-50 text-red-600">
                <p id="error-message"><?php echo $message ?></p>
            </div>
        </div>
    <?php } ?>
    <?php if ($meetingId !== null && $jwtToken == null && !isset($_POST["id"])) { ?>
        <div id="moderator-selection-parent">
            <div class=" relative top-16 h-screen w-screen flex justify-center">
                <div id="moderator-selection" class="rounded-md opacity-100 h-auto p-5 w-96 bg-white">
                    <div class="flex justify-center w-full">
                    </div>
                    <h1 class="text-xl font-semibold ">Whom would you like to join as?</h1>
                    <div id="loader" class="flex justify-center"></div>
                    <form method="POST" action="join-meeting.php?meeting_id=<?php echo $meetingId ?>&pcode=<?php echo $pCode ?>">
                        <button type="submit" class="flex my-4 gap-2 px-4 py-2 border cursor-pointer text-black hover:text-white hover:bg-blue-600 border-blue-600 rounded-md">
                            <input hidden name="id" type="hidden" value="organizer" />
                            <h1><?php echo $meetingAttendees['organizer']->name ?></h1>
                            (Organizer / Account Owner)
                        </button>
                    </form>
                    <?php
                    if (is_array($meetingAttendees['hosts'])) {
                        foreach ($meetingAttendees['hosts'] as $host) { ?>
                            <form method="POST" action="join-meeting.php?meeting_id=<?php echo $meetingId ?>&pcode=<?php echo $pCode ?>">
                                <button type="sumbit" class="flex my-4 gap-2 px-4 py-2 border cursor-pointer text-black hover:text-white hover:bg-blue-600 border-blue-600 rounded-md">
                                    <input name="id" type="hidden" value=<?php echo $host->id ?> />
                                    <h1><?php echo $host->first_name ?></h1>
                                    <h1><?php echo $host->last_name ?></h1>
                                    (Moderator / Host)
                                </button>
                            </form>
                    <?php
                        }
                    } ?>
                    <?php
                    if (is_array($meetingAttendees['hosts'])) {
                        foreach ($meetingAttendees['attendees'] as $attendee) { ?>
                            <form method="POST" action="join-meeting.php?meeting_id=<?php echo $meetingId ?>&pcode=<?php echo $pCode ?>">
                                <button type="submit" class="flex my-4 gap-2 px-4 py-2 border cursor-pointer text-black hover:text-white hover:bg-blue-600 border-blue-600 rounded-md">
                                    <input name="id" type="hidden" value=<?php echo $attendee->id ?>>
                                    <h1><?php echo $attendee->first_name ?></h1>
                                    <h1><?php echo $attendee->last_name ?></h1>
                                    (Attendee)
                                </button>
                            </form>
                    <?php }
                        } ?>
                </div>
            </div>
        </div>
    <?php } ?>
    <div id="meeting-id-input" class="grid gap-3 p-5 relative top-16">
        <h1 class="text-slate-600 text-2xl">Join a Meeting</h1><input id="meeting-id-input-field" placeholder="Enter Meeting Id or link here." class="w-64 h-10 border border-slate-400 focus:outline-none rounded-md pl-3" type="text"><a id="meeting-id-input-button-anchor"><button id="meeting-id-input-button" class="w-28 h-8 text-white font-semibold text-sm bg-green-600 rounded-md">Join Meeting</button></a>
    </div>
    <div class="relative top-16 h-screen" id="conference-parent"></div>
    <script type="text/javascript">
        var access_token = "<?php echo(isset($accessToken) ? $accessToken : ""); ?>";
        if (access_token === null || access_token === "") {
            alert("First generate the access token and then try to join a meeting.")
            window.location.href = "index.php"
        }
        if (window.location.search?.split("&")[0]?.split("?")[1]?.split("=")[1]) {
            document.querySelector("#meeting-id-input").remove()
        }
        $(document).ready(function() {
            $("#meeting-id-input-field").change((event) => {
                const meetingIdInputButton = document.querySelector("#meeting-id-input-button-anchor");
                if (event.target.value.includes(`https:/`)) {
                    const id = event.target.value.slice(20, 34);
                    meetingIdInputButton.setAttribute("href", `join-meeting.php?meeting_id=${id}`)
                    return;
                }
                meetingIdInputButton.setAttribute("href", `join-meeting.php?meeting_id=${event.target.value}`)
            })
        })
        $(document).ready(function() {
            var token = "<?php echo(isset($jwtToken) ? $jwtToken : ""); ?>"
            var meetId = "<?php echo(isset($meetingId) ? $meetingId : ""); ?>"
            var pcode = "<?php echo(isset($pCode) ? $pCode : ""); ?>"
            var conferenceURL = "<?php echo(isset($CONFERENCE_URL) ? $CONFERENCE_URL : ""); ?>"
            var apikey = "<?php echo(isset($API_KEY) ? $API_KEY : ""); ?>"
            if (token) {
                generateJwtToken(token, meetId, pcode, conferenceURL, apikey)
            }
        })
    </script>
</body>

</html>
