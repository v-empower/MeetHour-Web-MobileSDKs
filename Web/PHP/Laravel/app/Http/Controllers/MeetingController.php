<?php

namespace App\Http\Controllers;

use App\Models\Meeting;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use MeetHourApp\Services\MHApiService;
use MeetHourApp\Types\Login;
use MeetHourApp\Types\ScheduleMeeting;
use MeetHourApp\Types\ContactsList;
use MeetHourApp\Types\GenerateJwt;
use MeetHourApp\Types\ViewMeeting;

class MeetingController extends Controller
{
    public function getaccesstoken(Request $request)
    {
        $success = false;
        $error = false;
        $message = null;
        $accessToken = null;

        if ($request->getaccesstoken === 'true') {
            $meetHourApiService = new MHApiService();
            if (!empty(env('MEETHOUR_CLIENTID')) && !empty(env('MEETHOUR_CLIENTSECRET')) && !empty(env('MEETHOUR_USERNAME')) && !empty(env('MEETHOUR_PASSWORD'))) {
                $login = new Login(env('MEETHOUR_CLIENTID'), env('MEETHOUR_CLIENTSECRET'), env('MEETHOUR_GRANT_TYPE', 'password'), env('MEETHOUR_USERNAME'), env('MEETHOUR_PASSWORD'));
                $loginResponse = $meetHourApiService->login($login);

                if ($loginResponse->access_token) {
                    DB::beginTransaction();
                    try {
                        $selectResult = DB::select('SELECT `access_token` FROM `meetings` LIMIT 1');
                        $finalResult = null;
                        if (isset($selectResult[0]) && $selectResult[0]->access_token) {
                            $finalResult = DB::table('meetings')->update(array(
                                'access_token'=>$loginResponse->access_token,));
                        } else {
                            $finalResult = DB::table('meetings')->insert(
                                ['access_token' => $loginResponse->access_token]
                            );
                        }
                        DB::commit();
                        if ($finalResult) {
                            $result2 = DB::select('SELECT `access_token` FROM `meetings`     LIMIT 1');
                            if (isset($result2[0]) && $result2[0]->access_token) {
                                $accessToken = $result2[0]->access_token;
                                $success = true;
                            }
                        }
                    } catch (\Exception $e) {
                        DB::rollBack();
                        $error = true;
                        $message = $e->getMessage();
                        return redirect()->back()->with('error', $error)->with('message', $message)->withInput();
                    }
                } else {
                    $error = true;
                    $message = 'Something went wrong. Login API is failing. Check Credentials once again.';
                    return redirect()->back()->with('error', $error)->with('message', $message)->withInput();
                }
            } else {
                $error = true;
                $message = 'Something went wrong. Make sure you set the credentials.';
                return redirect()->back()->with('error', $error)->with('message', $message)->withInput();
            }
        } else {
            $error = true;
            $message = 'Something went wrong. Form post value getaccesstoken should be true.';
            return redirect()->back()->with('error', $error)->with('message', $message)->withInput();
        }

        return redirect('/')->with('success', $success)->with('message', $message)->with('accessToken', $accessToken)->withInput();
    }

    public function schedulepage(Request $request)
    {
        $success = false;
        $error = false;
        $message = null;
        $accessToken = null;
        $MeetingResponse = null;
        $timezoneResponse = null;
        $timezonesList = null;
        $contactsResponse = null;
        $contacts = null;

        $meetHourApiService = new MHApiService();
        DB::beginTransaction();

        try {
            $selectResult = DB::select('SELECT `access_token` FROM `meetings` LIMIT 1');
            $finalResult = null;
            if (isset($selectResult[0]) && $selectResult[0]->access_token) {
                $accessToken = $selectResult[0]->access_token;
                $success = true;
                $timezoneResponse = $meetHourApiService->timezone($accessToken);
                $timezonesList = $timezoneResponse->timezones;
                $contactsListBody = new ContactsList();
                $contactsResponse = $meetHourApiService->contactsList($accessToken, $contactsListBody);
                $contacts = $contactsResponse->contacts;
            } else {
                $success = false;
                $error = true;
                $message = 'Access Token missing in database. Click on Get Access Token once again.';
                return redirect()->back()->with('error', $error)->with('message', $message)->withInput();
            }
        } catch (\Exception $e) {
            DB::rollBack();
            $error = true;
            $message = $e->getMessage();
            return redirect()->back()->with('error', $error)->with('message', $message)->withInput();
        }
        DB::commit();
        return view('schedulemeeting', compact('timezoneResponse', 'timezonesList', 'success', 'contacts', 'contactsResponse', 'MeetingResponse'));
    }


    public function create(Request $request)
    {
        $success = false;
        $error = false;
        $message = null;
        $accessToken = null;
        $MeetingResponse = null;

        $meetHourApiService = new MHApiService();
        DB::beginTransaction();

        try {
            $selectResult = DB::select('SELECT `access_token` FROM `meetings` LIMIT 1');
            if (isset($selectResult[0]) && $selectResult[0]->access_token) {
                $accessToken = $selectResult[0]->access_token;
                $success = true;
            } else {
                $success = false;
                $error = true;
                $message = 'Access Token missing in database. Click on Get Access Token once again.';
                return redirect()->back()->with('error', $error)->with('message', $message)->withInput();
            }
        } catch (\Exception $e) {
            DB::rollBack();
            $error = true;
            $message = $e->getMessage();
            return redirect()->back()->with('error', $error)->with('message', $message)->withInput();
        }

        $instantMeeting = $request->instantmeeting;
        $ScheduleMeeting = $request->schedulemeeting;

        if (isset($instantMeeting) && $instantMeeting === 'true') {
            $timezone  = date_default_timezone_get();

            $scheduleBody = new ScheduleMeeting("Instant Meeting", "123456", date('h:i'), 'PM', date('d-m-Y'), $timezone);  // You can give

            $apiresponse = $meetHourApiService->scheduleMeeting($accessToken, $scheduleBody);

            if ($apiresponse->success === true) {
                $MeetingResponse = $apiresponse;
                $success = true;
            } else {
                $success = false;
                $error = true;
                $message = 'Instant Meeting has been failed \n ' . json_encode($apiresponse);
                return redirect()->back()->with('error', $error)->with('message', $message)->withInput();
            }
        } elseif (isset($ScheduleMeeting) && $ScheduleMeeting === 'true') {
            $meetingName = $request->meeting_name;
            $passcode = $request->passcode;
            $meetingDate = $request->meeting_date;
            $time12 = date("g:i a", strtotime($request->meeting_time));
            $timeArray = explode(" ", $time12);
            $timeString = $timeArray[0]; // "04:56"
            $timeStamp = strtotime($timeString);
            $meetingTime = date("H:i", $timeStamp);
            $meetingMeridiem = $timeArray[1];
            $timezone = $request->timezone;
            $hostUsersArray = $request->hostusersArray;
            $hostUsersString = json_decode($hostUsersArray);
            $hostUsers = array_map('intval', $hostUsersString);
            $attendeesArray = $_POST["attendArray"];
            $attendeesString = json_decode($attendeesArray);
            $attendees = array_map('intval', $attendeesString);

            $scheduleBody = new ScheduleMeeting($meetingName, $passcode, $meetingTime, $meetingMeridiem, $meetingDate, $timezone);
            $scheduleBody->attend = $attendees;
            $scheduleBody->hostusers = $hostUsers;
            $scheduleBody->options = ["ALLOW_GUEST"];
            $apiresponse = $meetHourApiService->scheduleMeeting($accessToken, $scheduleBody);

            if ($apiresponse->success === true) {
                $MeetingResponse = $apiresponse;
                $success = true;
            } else {
                $success = false;
                $error = true;
                $message = 'Scheduling Meeting has been failed \n ' . json_encode($apiresponse);
                return redirect()->back()->with('error', $error)->with('message', $message)->withInput();
            }
        }
        DB::commit();
        return redirect('/schedule-meeting')->with('success', $success)->with('MeetingResponse', $MeetingResponse)->withInput();
    }

    public function joinmeetingpage(Request $request)
    {
        $success = false;
        $error = false;
        $message = null;
        $accessToken = null;
        $meetingId = null;
        $id = null;
        $pCode = null;
        $meetingAttendees = [];
        $jwtToken = null;
        $CONFERENCE_URL = env('MEETHOUR_CONFERENCE_URL');
        $API_KEY = env('MEETHOUR_APIKEY');
        $API_RELEASE = env('MEETHOUR_API_RELEASE');

        $meetHourApiService = new MHApiService();
        DB::beginTransaction();

        try {
            $selectResult = DB::select('SELECT `access_token` FROM `meetings` LIMIT 1');
            if (isset($selectResult[0]) && $selectResult[0]->access_token) {
                $accessToken = $selectResult[0]->access_token;
                $success = true;
            } else {
                $success = false;
                $error = true;
                $message = 'Access Token missing in database. Click on Get Access Token once again.';
                return redirect()->back()->with('error', $error)->with('message', $message)->withInput();
            }

            if (isset($request->pCode) && isset($request->meeting_id) && isset($request->id)) {
                $meetingId = $request->meeting_id;
                $pCode = $request->pCode;
                $id = $request->id;
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
            } elseif (isset($request->pCode) && isset($request->meeting_id)) {
                if ($request->meeting_id !== null) {
                    $meetingId = $request->meeting_id;
                    $pCode = $request->pCode;
                    $viewMeetingBody = new ViewMeeting($meetingId);
                    $viewMeetingResponse = $meetHourApiService->viewMeeting($accessToken, $viewMeetingBody);
                    $attendees = [];
                    if (!empty($viewMeetingResponse->meeting->meeting_attendees)) {
                        $attendees = json_decode($viewMeetingResponse->meeting->meeting_attendees);
                    }
                    if ($attendees === null)
                        $attendees = [];
                    $meetingAttendees = array(
                        'organizer' => $viewMeetingResponse->organizer,
                        'hosts' => $viewMeetingResponse->meeting->hosts,
                        'attendees' => $attendees
                    );
                }
            }
        } catch (\Exception $e) {
            DB::rollBack();
            $error = true;
            $message = $e->getMessage();
            return redirect()->back()->with('error', $error)->with('message', $message)->withInput();
        }
        DB::commit();
        return view('joinmeeting', compact('accessToken', 'meetingId', 'success', 'jwtToken', 'id', 'pCode', 'meetingAttendees','API_KEY','CONFERENCE_URL', 'API_RELEASE'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Meeting  $meeting
     * @return \Illuminate\Http\Response
     */
    public function edit(Meeting $meeting)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Meeting  $meeting
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Meeting $meeting)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Meeting  $meeting
     * @return \Illuminate\Http\Response
     */
    public function destroy(Meeting $meeting)
    {
        //
    }
}
