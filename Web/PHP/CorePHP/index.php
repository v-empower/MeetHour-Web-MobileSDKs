<?php
require('./vendor/autoload.php');
require('./vendor/meethour/php-sdk/src/autoload.php');

use MeetHourApp\Services\MHApiService;
use MeetHourApp\Types\ScheduleMeeting;
use MeetHourApp\Types\AddContact;
use MeetHourApp\Types\ArchiveMeeting;
use MeetHourApp\Types\CompletedMeetings;
use MeetHourApp\Types\ContactsList;
use MeetHourApp\Types\EditContact;
use MeetHourApp\Types\EditMeeting;
use MeetHourApp\Types\GenerateJwt;
use MeetHourApp\Types\Login;
use MeetHourApp\Types\MissedMeetings;
use MeetHourApp\Types\RecordingsList;
use MeetHourApp\Types\RefreshToken;
use MeetHourApp\Types\UpcomingMeetings;
use MeetHourApp\Types\ViewMeeting;

// date_default_timezone_set('UTC');
// $meetHourApiService = new MHApiService();
// $body = array(
//     'meeting_name' => 'Quick Meeting',
//     'agenda' => '',
//     'passcode' => '123456',
//     'meeting_date' => date('d-m-Y'),
//     'meeting_time' => date('h:i'),
//     'meeting_meridiem' => 'PM',
//     'timezone' => date_default_timezone_get(),
//     'instructions' => 'Team call, join as soon as possible',
//     'is_show_portal' => 0,
//     'options' => array('ALLOW_GUEST', 'JOIN_ANYTIME'),
//     'hostusers' => array('first_name' => "Zeeshan", 'last_name' => "Ali", 'email' => "xeeshanali786@gmail.com")
// );
//     $login = new Login("890py815uk6xpy2qz2ozup60y9xw15q530tx", "a7b7ca34db7d7c54d76cb1dbe94f41a353e425d7a660865e7cf86a5d824ae033", "password", "zeeshan.ali@v-empower.com", "u98Iu9wA");
//     $loginResponse = $meetHourApiService->login($login);
//     $scheduleBody = new ScheduleMeeting("Quick Meeting", "123456", date('h:i'), 'PM', date('d-m-Y'), 'Asia/Kolkata', );
//     $response = $meetHourApiService->scheduleMeeting($loginResponse->access_token, $scheduleBody);
//     var_dump($response);
//     $test = new ViewMeeting("MHR23032123062");
//     $response = $meetHourApiService->timezone($loginResponse->access_token);
//     var_dump($response);

   $str = "<h1>Hello World</h1><h2>Hello Friends</h2><strong>Go ahead</strong>";
   $html_code = htmlspecialchars($str);
   

?>

<!DOCTYPE html>
<html lang="en">
<head>
   <meta charset="UTF-8">
   <meta http-equiv="X-UA-Compatible" content="IE=edge">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Document</title>
</head>
<body>
   <h1>Hello</h1>
   <?php echo $html_code ?>
</body>
</html>