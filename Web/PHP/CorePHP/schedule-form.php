<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $meetingName = $_POST["meeting_name"];
  $meetingName = $_POST["passcode"];
  $meetingName = $_POST["meeting_date"];
  $meetingName = $_POST["meeting_time"];
  var_dump("hello");
  var_dump($meetingName);
  var_dump("hello");

  // Do something with the form data, such as send an email or save it to a database

  // Redirect the user to a thank you page
  header("Location: schedule-meeting.php");
  exit();
}
?>
