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
    <script src="js/constants.js"></script>
    <script src="js/scheduleMeeting.js"></script>
    <script src="js/joinMeeting.js"></script>
</head>

<body>
    <script type="text/javascript" language="javascript">
        var sc = document.createElement("script");
        sc.setAttribute("src", `https://api.meethour.io/libs/${API_RELEASE}/external_api.min.js?apiKey=${API_KEY}`);
        sc.setAttribute("type", "text/javascript");
        document.head.appendChild(sc);

        var sc1 = document.createElement("script");
        sc1.setAttribute("src", `https://api.meethour.io/libs/${API_RELEASE}/meethour-apis.min.js?apiKey=${API_KEY}`);
        sc1.setAttribute("type", "text/javascript");
        document.head.appendChild(sc1);
    </script>
    <div>
        <div id="navbar">
        </div>
        <div class="lg:flex w-screen relative top-16 justify-between overflow-x-hidden">
            <div id="error"></div>
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
                        <form onsubmit="scheduleMeeting(event)" id="form" method="POST">
                            <div class="-space-y-px rounded-md shadow-sm grid gap-5">
                                <div><label for="meeting_name" class="sr-only">Meeting Name</label><input
                                        id="meeting_name" name="meeting_name" type="text" required="" class="appearance-none rounded-none relative block
                      w-full px-3 py-2 border border-gray-300
                      placeholder-gray-500 text-gray-900 rounded-b-md
                      focus:outline-none focus:ring-indigo-500
                      focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Meeting Name"></div>
                                <div><label for="passcode" class="sr-only">Passcode</label><input id="passcode"
                                        name="passcode" type="text" required="" class="appearance-none rounded-none relative block
                      w-full px-3 py-2 border border-gray-300
                      placeholder-gray-500 text-gray-900 rounded-b-md
                      focus:outline-none focus:ring-indigo-500
                      focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Passcode"></div>
                                <div><label for="meeting_date" class="sr-only">Meeting Date</label><input
                                        id="meeting_date" name="meeting_date" type="date" required="" class="appearance-none rounded-none relative block
                      w-full px-3 py-2 border border-gray-300
                      placeholder-gray-500 text-gray-900 rounded-b-md
                      focus:outline-none focus:ring-indigo-500
                      focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Passcode"></div>
                                <div><label for="meeting_time" class="sr-only">Meeting Time</label><input
                                        id="meeting_time" name="meeting_time" type="time" required="" class="appearance-none rounded-none relative block
                      w-full px-3 py-2 border border-gray-300
                      placeholder-gray-500 text-gray-900 rounded-b-md
                      focus:outline-none focus:ring-indigo-500
                      focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Meeting Time"></div>
                                <div class="w-full h-10 rounded-md"><select id="select-participant"
                                        class="w-full h-full rounded-md focus:outline-none bg-slate-50 border border-slate-300"
                                        name="timezone">
                                    </select></div>
                                <div class="relative inline-block text-left" data-headlessui-state=""
                                    style="margin-bottom: 35px;">
                                    <div>
                                        <h2 style="margin-top: 15px;">Choose Participants</h2>
                                        <select required id="mySelectParticipants"
                                            class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transform opacity-100 scale-100 inline-flex w-full justify-between rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
                                            style="width: 100%;">
                                        </select>
                                    </div>
                                </div>
                                <div id="participants-display" class="grid gap-2">

                                </div>
                                <!-- <div>
                                    <h1 class="text-lg font-semibold">Add participant manually</h1>
                                    <div class="grid gap-2 mt-2">
                                        <div><label class="sr-only">First Name</label><input type="text" required=""
                                                class="appearance-none rounded-none relative block
                    w-full px-3 py-2 border border-gray-300
                    placeholder-gray-500 text-gray-900 rounded-b-md
                    focus:outline-none focus:ring-indigo-500
                    focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="First Name"></div>
                                        <div><label class="sr-only">Last Name</label><input type="text" required=""
                                                class="appearance-none rounded-none relative block
                    w-full px-3 py-2 border border-gray-300
                    placeholder-gray-500 text-gray-900 rounded-b-md
                    focus:outline-none focus:ring-indigo-500
                    focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Last Name"></div>
                                        <div><label class="sr-only">Email</label><input type="email" required="" class="appearance-none rounded-none relative block
                    w-full px-3 py-2 border border-gray-300
                    placeholder-gray-500 text-gray-900 rounded-b-md
                    focus:outline-none focus:ring-indigo-500
                    focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Email"></div><button
                                            class="px-5 py-2 border border-blue-500 rounded-md">Add</button>
                                    </div>
                                </div> -->
                                <!-- <div class="relative inline-block text-left" data-headlessui-state="">
                                    <div><button
                                            class="inline-flex w-full justify-between rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
                                            id="moderators-dropdown-button" type="button" aria-haspopup="menu"
                                            aria-expanded="false" data-headlessui-state="">Add Moderators<svg
                                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                                fill="currentColor" aria-hidden="true" class="-mr-1 ml-2 h-5 w-5">
                                                <path fill-rule="evenodd"
                                                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                                    clip-rule="evenodd"></path>
                                            </svg></button></div>
                                </div> -->
                                <div class="relative inline-block text-left" data-headlessui-state=""
                                    style="margin-bottom: 35px;">
                                    <div>
                                        <h2 style="margin-top: 15px;">Choose Moderators</h2>
                                        <select id="mySelectModerators"
                                            class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transform opacity-100 scale-100 inline-flex w-full justify-between rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
                                            style="width: 100%;">
                                        </select>
                                    </div>
                                </div>
                                <div id="moderators-display" class="grid gap-2">

                                </div>
                                <div class="">
                                    <p class="mt-3 text-sm">General Options</p>
                                    <div class="flex items-start mt-2">
                                        <div class="flex h-5 items-center"><input disabled checked id="options"
                                                name="options" type="checkbox"
                                                class="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
                                                value="ALLOW_GUEST"></div>
                                        <div class="ml-3 text-sm"><label for="options"
                                                class="font-medium text-gray-700">Guest
                                                user can join meeting</label></div>
                                    </div>
                                </div>
                            </div>
                            <div id="manual-meeting-loader" class="flex justify-center"></div>
                            <div class="mt-3"><button type="submit" id="schedule-meeting-button"
                                    class="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"><span
                                        class="absolute inset-y-0 left-0 flex items-center pl-3"></span>Schedule a
                                    meeting</button>
                                <div class="flex justify-center">
                                    <h1 class="my-3">Or</h1>
                                </div>
                            </div>
                        </form>
                        <div id="instant-meeting-loader" class="flex justify-center"></div>
                        <button id="instant-meeting-button"
                            class="group relative flex w-full justify-center rounded-md border border-transparent bg-violet-600 py-2 px-4 text-sm font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2">Start
                            Instant Meeting</button>
                    </div>
                    
                </div>
            </div>
        </div>
        <div id="modal"></div>
    </div>

    <script type="text/javascript" language="javascript">
        

        // Schedule a meeting with generic information
        $(document).ready(function () {
            console.log(window.location)
            $("#navbar").append(navbar)
            $("#instant-meeting-button").click(async () => {
                const [name, email] = await getUser();
                const host = {
                    first_name: name?.split(" ")[0],
                    last_name: name?.split(" ")[1],
                    email,
                };
                const body = {
                    meeting_name: "Quick Meeting",
                    agenda: "",
                    passcode: "123456",
                    meeting_date: moment().format("DD-MM-YYYY"),
                    meeting_time: moment().format("hh:mm"),
                    meeting_meridiem: moment().format("h:mm a").split(" ")[1].toUpperCase(),
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    instructions: "Team call, join as soon as possible",
                    is_show_portal: 0,
                    options: ["ALLOW_GUEST", "JOIN_ANYTIME"],
                    hostusers: [host],
                };
                const response = await instantMeeting(body);
                console.log(response)
                if (response.success) {
                    $("#modal").append(`<div>
          <div class="relative z-10" id="headlessui-dialog-5" role="dialog" aria-modal="true"
              data-headlessui-state="open">
              <div class="fixed inset-0 bg-gray-700 bg-opacity-75 transition-opacity opacity-100"></div>
              <div class="fixed inset-0 z-10 overflow-y-auto">
                  <div
                      class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                      <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg opacity-100 translate-y-0 sm:scale-100"
                          id="headlessui-dialog-panel-6" data-headlessui-state="open">
                          <div class="flex">
                      <button class="float-right" id="close-modal" onclick="removeModal()">Close</button>
                  </div>
                          <div class="p-8 grid gap-2">
                              <div
                                  class="h-14 flex justify-center items-center w-full rounded-lg bg-green-100 text-green-600">
                                  Your meeting has been created successfully!</div>
                              <div class="font-semibold text-gray-600">Meeting id: <span
                                      class="font-normal text-gray-700">${response.data.meeting_id}</span>
                              </div>
                              <div class="font-semibold text-gray-600">Meeting passcode: <span
                                      class="font-normal text-gray-700">${response.data.passcode}</span>
                              </div>
                              <div class="font-semibold text-gray-600">Meeting URL: <span
                                      class="font-normal text-gray-700">${response.data.joinURL}</span>
                              </div>
                              <div class="flex justify-center"><a href="join-meeting.html?meeting_id=${response.data.meeting_id}&pcode=${response.data.pcode}"
                                      tabindex="0"><button
                                          class="bg-emerald-600 font-semibold px-4 py-2 mt-1 text-white rounded-md">Start
                                          Meeting</button></a></div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>`)
                }
            })
        })
        // Schedule a meeting manually
        $(document).ready(function () {
            setTimeout(() =>{

                getContactsList()
                getTimezones()
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
        $(document).ready(function () {
            $("#close-modal").click(() => {
                document.querySelector("#modal").removeChild('div')
            })
        })
    </script>
</body>

</html>