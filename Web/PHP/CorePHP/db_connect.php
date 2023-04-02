<?php
function OpenCon()
 {
require('constants.php');
 $dbhost = $DB_HOST;
 $dbuser = $DB_USER;
 $dbpass = $DB_PASSWORD;
 $db = $DATABASE;
 $conn = new mysqli($dbhost, $dbuser, $dbpass,$db) or die("Connect failed: %s\n". $conn -> error);
 
 return $conn;
 }
 
function CloseCon($conn)
 {
 $conn -> close();
 }
