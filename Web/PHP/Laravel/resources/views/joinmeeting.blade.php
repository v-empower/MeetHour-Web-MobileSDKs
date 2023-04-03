@extends('layout')
@section('body')
    <body>
    <div>
    @include('nav')
    @if(Session::has('error'))
      <div id="error">
               <div class="flex fixed top-20 justify-center items-center text-lg font-medium w-96 rounded-md h-16 border border-red-600 bg-red-50 text-red-600">
                  <p>{{ Session::get('message') }}</p>
               </div>
            </div>
    @endif
    <?php if (isset($meetingId) && $meetingId !== null && $jwtToken == null && $id == null) { ?>
        <div id="moderator-selection-parent">
            <div class=" relative top-16 h-screen w-screen flex justify-center">
                <div id="moderator-selection" class="rounded-md opacity-100 h-auto p-5 w-96 bg-white">
                    <div class="flex justify-center w-full">
                    </div>
                    <h1 class="text-xl font-semibold ">Whom would you like to join as?</h1>
                    <div id="loader" class="flex justify-center"></div>
                    <form method="POST" action="/join-meeting?meeting_id=<?php echo $meetingId ?>&pCode=<?php echo $pCode ?>">
                    @csrf
                        <button type="submit" class="flex my-4 gap-2 px-4 py-2 border cursor-pointer text-black hover:text-white hover:bg-blue-600 border-blue-600 rounded-md">
                            <input hidden name="id" type="hidden" value="organizer" />
                            <input hidden name="id" type="hidden" value="organizer" />
                            <input hidden name="id" type="hidden" value="organizer" />
                            <h1><?php echo $meetingAttendees['organizer']->name ?></h1>
                            (Organizer / Account Owner)
                        </button>
                    </form>
                    <?php
                    if (is_array($meetingAttendees['hosts'])) {
                        foreach ($meetingAttendees['hosts'] as $host) { ?>
                            <form method="POST" action="/join-meeting?meeting_id=<?php echo $meetingId ?>&pCode=<?php echo $pCode ?>">
                            @csrf
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
                            <form method="POST" action="/join-meeting?meeting_id=<?php echo $meetingId ?>&pCode=<?php echo $pCode ?>">
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
    <script type="text/javascript" src="https://api.meethour.io/libs/<?php echo $API_RELEASE ?>/external_api.min.js?apiKey=<?php echo $API_KEY ?>"></script>
    <script type="text/javascript">
        var access_token = "<?php echo(isset($accessToken) ? $accessToken : ""); ?>";
        if (access_token === null || access_token === "") {
            alert("First generate the access token and then try to join a meeting.")
            window.location.href = "/"
        }
        if (window.location.search?.split("&")[0]?.split("?")[1]?.split("=")[1]) {
            document.querySelector("#meeting-id-input").remove()
        }
        $(document).ready(function() {
            $("#meeting-id-input-field").change((event) => {
                const meetingIdInputButton = document.querySelector("#meeting-id-input-button-anchor");
                if (event.target.value.includes(`https:/`)) {
                    const id = event.target.value.slice(20, 34);
                    meetingIdInputButton.setAttribute("href", `join-meeting?meeting_id=${id}`)
                    return;
                }
                meetingIdInputButton.setAttribute("href", `join-meeting?meeting_id=${event.target.value}`)
            })
        })
        $(document).ready(function() {
            var token = "<?php echo(isset($jwtToken) ? $jwtToken : ""); ?>"
            var meetId = "<?php echo(isset($meetingId) ? $meetingId : ""); ?>"
            var pCode = "<?php echo(isset($pCode) ? $pCode : ""); ?>"
            var conferenceURL = "<?php echo(isset($CONFERENCE_URL) ? $CONFERENCE_URL : ""); ?>"
            var apikey = "<?php echo(isset($API_KEY) ? $API_KEY : ""); ?>"
            if (token) {
                generateJwtToken(token, meetId, pCode, conferenceURL, apikey)
            }
        })
    </script>
@endsection
