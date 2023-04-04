<?php
require('constants.php');
require('./vendor/autoload.php');
require('./vendor/meethour/php-sdk/src/autoload.php');
include 'db_connect.php';

use MeetHourApp\Services\MHApiService;
use MeetHourApp\Types\Login;

$success = false;
$error = false;
$message = null;
$accessToken = null;

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
   try{
      if ($_SERVER["REQUEST_METHOD"] == "POST") {
         $getaccesstoken = $_POST["getaccesstoken"];
         if (isset($getaccesstoken) && $getaccesstoken === 'true') {
            $meetHourApiService = new MHApiService();
            if (isset($CLIENT_ID) && !empty($CLIENT_ID) && isset($CLIENT_SECRET) && !empty($CLIENT_SECRET) && isset($USERNAME) && !empty($USERNAME) && isset($PASSWORD) && !empty($PASSWORD)) {
               $login = new Login($CLIENT_ID, $CLIENT_SECRET, $GRANT_TYPE, $USERNAME, $PASSWORD);
               $loginResponse = $meetHourApiService->login($login);
               if (isset($loginResponse->access_token) && !empty($loginResponse->access_token)) {
                  $selectQ = "SELECT `access_token` FROM `credentials` LIMIT 1";
                  $selectresult = $conn->query($selectQ);
                  $finalresult = null;
   
                  if ($selectresult->num_rows > 0) {
                     while ($row = $selectresult->fetch_assoc()) {
                        $sql = "UPDATE `credentials` SET `access_token`='" . $loginResponse->access_token . "' WHERE 1";
                        $finalresult = $conn->query($sql);
                     }
   
                  }
                  else {
                     $sql2 = "INSERT INTO `credentials`(`access_token`) VALUES ('".$loginResponse->access_token."')";
                     $finalresult = $conn->query($sql2);
                  }
                  if ($finalresult === TRUE) {
                     $sql3 = "SELECT `access_token` FROM `credentials` LIMIT 1";
                     $result = $conn->query($sql3);
                     if ($result->num_rows > 0) {
                        while ($row = $result->fetch_assoc()) {
                           $accessToken = $row["access_token"];
                           $success = true;
                        }
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
   
                  CloseCon($conn);
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
   }
   catch (\Exception $e) {
      $error = true;
      $message = $e->getMessage();
   }
   catch (GuzzleHttp\Exception\ClientException $e) {
      $error = true;
      $message = $e->getResponse();
   }   
}

?>

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
   <title>Meet Hour - PHP Example</title>
</head>

<body>
   <div>
      <div>
         <?php echo require('./header.php') ?>
      </div>
      <div class="relative top-16">
         <?php if (isset($error) && $error === true) { ?>
            <div id="error">
               <div class="flex fixed top-20 justify-center items-center text-lg font-medium w-96 rounded-md h-16 border border-red-600 bg-red-50 text-red-600">
                  <p><?php echo $message ?></p>
               </div>
            </div>
         <?php } ?>
         <div class="text-3xl flex justify-center font-bold mt-5 text-sky-500">
            <h1>Welcome to Meet Hour PHP - Example</h1>
         </div>
         <div class="md:mx-40 mx-5 overflow-hidden bg-white shadow sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6">
               <h3 class="text-lg font-medium leading-6 text-gray-900">Steps to Authorize Meet Hour Developer
                  account and get access token.</h3>
               <p class="mt-1 text-sm text-gray-500">Steps given below - </p>
            </div>
            <div class="border-t border-gray-200">
               <dl id="steps">
                  <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                     <dt class="text-sm font-medium text-gray-500">Step One</dt>
                     <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">Go to <a target="_blank" class="text-blue-500" href="https://meethour.io">meethour.io</a> and signup for
                        Developer or Higher plan. Currently we offer 28 days free trial.</dd>
                  </div>
                  <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                     <dt class="text-sm font-medium text-gray-500">Step Two</dt>
                     <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">Go to the <a target="_blank" class="text-blue-500" href="https://portal.meethour.io">dashboard</a> and then click
                        on <a class="text-blue-500" target="_blank" href="https://portal.meethour.io/customer/developers">developers</a> menu.</dd>
                  </div>
                  <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                     <dt class="text-sm font-medium text-gray-500">Step Three</dt>
                     <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">Copy your Client ID, Client
                        Secret and Api Key. After copying, paste each copied text to the respective constant in
                        the source code js/constants.js</dd>
                  </div>
                  <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                     <dt class="text-sm font-medium text-gray-500">Step Four</dt>
                     <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">After completing all the steps
                        given above, now click on Get Access Token given below.</dd>
                  </div>
                  <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                     <dt class="text-sm font-medium text-gray-500">Step Five</dt>
                     <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">As you click, your access token
                        will be received and stored it in brower's localstorage. The received access token is
                        then used for making Meet Hour rest api calls.</dd>
                  </div>
                  <?php
                  if ($success === true && $accessToken !== null) { ?>
                     <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt class="text-sm font-medium text-gray-500">Step Six</dt>
                        <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">Token successfully got generated. Now you can schedule a meeting. <a class="text-blue-500 underline" href='schedule-meeting.php'>Schedule a Meeting</a></dd>
                     </div>
                     <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-12 sm:gap-4 sm:px-12"><textarea class="" disabled><?php echo $accessToken; ?></textarea></div>
                  <?php
                  }
                  ?>
               </dl>
            </div>
         </div>
         <div class="grid w-screen justify-center mt-2">
            <div id="loader" class="flex justify-center">

            </div>
            <form action="index.php" class="flex justify-center gap-1 mt-3" method="post">
               <input type="hidden" name="getaccesstoken" value="true" />
               <button type="submit" id="getaccesstoken" class="bg-sky-600 flex justify-center items-center text-white rounded-md h-9 w-40">Get Access
                  Token</button>
            </form>
         </div>
      </div>
   </div>
</body>

</html>