import ApiServices, { UserObjectType } from "meet-hour-react-web-sdk";
import React, { useContext, useState } from "react";
import Dropdown from "./Dropdown";
import Timezone from "./Timezone";
import moment from "moment";
import MomentTimezone from "moment-timezone";
import LottieComponent from "./LottieComponent";
import { AppContext } from "../App";
import { ScheduleMeetingType } from "meet-hour-react-web-sdk";

interface PropsType {
  setIsLoading: (value: boolean) => void;
  isLoading: boolean;
  onSubmitHandler: () => void;
  inputChangeHandler: (value: any) => void;
  isScheduled?: boolean;
  setIsScheduled: (value: boolean) => void;
  popupFields: any;
  setPopupFields: (value: any) => void;
  requestBody: ScheduleMeetingType;
  setRequestBody: (value: ScheduleMeetingType) => void;
  addParticipant: (value: number | UserObjectType) => void;
  removeParticipant: (value: number | UserObjectType) => void;
  addModerator: (value: number) => void;
  removeModerator: (value: number) => void;
}
async function getUser(): Promise<Array<string>> {
  const response = await ApiServices.userDetails(
    localStorage.getItem("accessToken") || ""
  );
  return [response.data.name, response.data.email];
}
const instantMeeting = async (
  setIsScheduled: (value: boolean) => void,
  setPopupFields: (value: any) => void,
  setIsLoading: (value: boolean) => void,
  setIsInstant: (value: boolean) => void,
  appContext: any
) => {
  try {
    setIsInstant(true);
    setIsLoading(true);
    const [name, email] = await getUser();
    const host = {
      first_name: name?.split(" ")[0],
      last_name: name?.split(" ")[1],
      email: email,
    };
    const body = {
      meeting_name: "Quick Meeting",
      agenda: "",
      passcode: "123456",
      meeting_date: moment().format("DD-MM-YYYY"),
      meeting_time: moment().format("h:mm"),
      meeting_meridiem: moment().format("h:mm a").split(" ")[1].toUpperCase(),
      timezone: MomentTimezone.tz.guess(),
      instructions: "Team call, join as soon as possible",
      is_show_portal: 0,
      options: ["ALLOW_GUEST", "JOIN_ANYTIME"],
      hostusers: [host],
    };
    const response = await ApiServices.scheduleMeeting(
      localStorage.getItem("accessToken") || "",
      body
    );
    if (response.success) {
      setIsScheduled!(true);
      setPopupFields({
        meeting_id: response.data.meeting_id,
        passcode: response.data.passcode,
        joinURL: response.data.joinURL,
      });
      localStorage.setItem("meetingIdNumber", response.data.id);
      localStorage.setItem("meetingIdString", response.data.meeting_id);
    }
  } catch (error) {
    appContext.setIsError(true);
    console.log(error);
  } finally {
    setIsLoading(false);
  }
};

function ScheduleMeetingForm(props: PropsType) {
  const [isInstant, setIsInstant] = useState<boolean>(false);
  const [contacts, setContacts] = useState<Array<any>>([]);
  const appContext = useContext(AppContext);
  const getContactsList = async () => {
    if (!localStorage.getItem("accessToken")) {
      return;
    }
    const body = {
      limit: 0,
      page: 0,
      exclude_hosts: 0,
    };
    try {
      const response = await ApiServices.contactsList(
        localStorage.getItem("accessToken") || "",
        body
      );
      setContacts(response.contacts);
    } catch (error) {
      console.log(error);
      appContext?.setIsError(true);
      setTimeout(() => {
        appContext?.setIsError(false);
      }, 3000);
    }
  };
  React.useEffect(() => {
    getContactsList();
  }, []);
  return (
    <div className="flex min-h-full items-center justify-center lg:w-[40%] pb-6 px-4 sm:px-3 lg:px-4 ml-3">
      <div className="w-full max-w-sm space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Schedule a meeting
          </h2>
        </div>
        <div className="mt-8 space-y-6">
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="-space-y-px rounded-md shadow-sm grid gap-5">
            <div>
              <label htmlFor="meeting_name" className="sr-only">
                Meeting Name
              </label>
              <input
                onChange={(e) => {
                  props.inputChangeHandler(e);
                }}
                id="meeting_name"
                name="meeting_name"
                type="text"
                required
                className="appearance-none rounded-none relative block
                  w-full px-3 py-2 border border-gray-300
                  placeholder-gray-500 text-gray-900 rounded-b-md
                  focus:outline-none focus:ring-indigo-500
                  focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Meeting Name"
              />
            </div>
            <div>
              <label htmlFor="passcode" className="sr-only">
                Passcode
              </label>
              <input
                onChange={(e) => {
                  props.inputChangeHandler(e);
                }}
                id="passcode"
                name="passcode"
                type="text"
                required
                className="appearance-none rounded-none relative block
                  w-full px-3 py-2 border border-gray-300
                  placeholder-gray-500 text-gray-900 rounded-b-md
                  focus:outline-none focus:ring-indigo-500
                  focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Passcode"
              />
            </div>
            <div>
              <label htmlFor="meeting_date" className="sr-only">
                Meeting Date
              </label>
              <input
                onChange={(e) => {
                  props.inputChangeHandler(e);
                }}
                id="meeting_date"
                name="meeting_date"
                type="date"
                required
                className="appearance-none rounded-none relative block
                  w-full px-3 py-2 border border-gray-300
                  placeholder-gray-500 text-gray-900 rounded-b-md
                  focus:outline-none focus:ring-indigo-500
                  focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Meeting Name"
              />
            </div>
            <div>
              <label htmlFor="meeting_time" className="sr-only">
                Meeting Time
              </label>
              <input
                onChange={(e) => {
                  props.inputChangeHandler(e);
                }}
                id="meeting_time"
                name="meeting_time"
                type="time"
                required
                className="appearance-none rounded-none relative block
                  w-full px-3 py-2 border border-gray-300
                  placeholder-gray-500 text-gray-900 rounded-b-md
                  focus:outline-none focus:ring-indigo-500
                  focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Meeting Name"
              />
            </div>
            <Timezone inputChangeHandler={props.inputChangeHandler} />
            <Dropdown
              isModeratorType={false}
              contacts={contacts}
              addParticipant={props.addParticipant}
            />
            {props.requestBody.attend?.map((user: any) => {
              if (typeof user !== "number")
                return (
                  <div className="flex justify-between">
                    <h1>{user.first_name}</h1>
                    <button
                      className="border border-slate-400 rounded-md px-3"
                      onClick={() => {
                        props.removeParticipant(user);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                );
            })}
            {contacts?.map((user: any) => {
              if (props.requestBody.attend?.includes(user.id) === false)
                return null;
              return (
                <div className="flex justify-between">
                  <h1>{user.first_name}</h1>
                  <button
                    className="border border-slate-400 rounded-md px-3"
                    onClick={() => {
                      props.removeParticipant(user.id);
                    }}
                  >
                    Remove
                  </button>
                </div>
              );
            })}
            <div>
              <h1 className="text-lg font-semibold">
                Add participant manually
              </h1>
              <AddContactForm addParticipant={props.addParticipant} />
            </div>
            <Dropdown
              isModeratorType={true}
              contacts={contacts}
              addModerator={props.addModerator}
            />
            {contacts.map((user: any) => {
              if (props.requestBody.hostusers?.includes(user.id) === false)
                return null;
              return (
                <div className="flex justify-between">
                  <h1>{user.first_name}</h1>
                  <button
                    className="border border-slate-400 rounded-md px-3"
                    onClick={() => {
                      props.removeModerator(user.id);
                    }}
                  >
                    Remove
                  </button>
                </div>
              );
            })}
            <div className="">
              <p className="mt-3 text-sm">General Options</p>
              <div className="flex items-start mt-2">
                <div className="flex h-5 items-center">
                  <input
                    onChange={(e) => {
                      props.inputChangeHandler(e);
                    }}
                    id="options"
                    name="options"
                    type="checkbox"
                    value="ALLOW_GUEST"
                    className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="options"
                    className="font-medium text-gray-700"
                  >
                    Guest user can join meeting
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div>
            <button
              onClick={() => {
                setIsInstant(false);
                props.onSubmitHandler();
              }}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <span className="absolute inset-y-0 left-0 flex items-center pl-3"></span>
              {props.isLoading && !isInstant ? (
                <LottieComponent />
              ) : (
                "Schedule a meeting"
              )}
            </button>
            <div className="flex justify-center">
              <h1 className="my-3">Or</h1>
            </div>
            <button
              onClick={() => {
                instantMeeting(
                  props.setIsScheduled,
                  props.setPopupFields,
                  props.setIsLoading,
                  setIsInstant,
                  appContext
                );
              }}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-violet-600 py-2 px-4 text-sm font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
            >
              {props.isLoading && isInstant ? (
                <LottieComponent />
              ) : (
                "Start Instant Meeting"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const AddContactForm = ({
  addParticipant,
}: {
  addParticipant: (value: UserObjectType) => void;
}) => {
  const [userContact, setUserContact] = useState<UserObjectType>({
    first_name: "",
    last_name: "",
    email: "",
  });
  return (
    <form className="grid gap-2 mt-2">
      <div>
        <label className="sr-only">First Name</label>
        <input
          onChange={(e) => {
            const body = {
              first_name: e.target.value,
              last_name: userContact.last_name,
              email: userContact.email,
            };
            setUserContact(body);
          }}
          type="text"
          required
          className="appearance-none rounded-none relative block
                  w-full px-3 py-2 border border-gray-300
                  placeholder-gray-500 text-gray-900 rounded-b-md
                  focus:outline-none focus:ring-indigo-500
                  focus:border-indigo-500 focus:z-10 sm:text-sm"
          placeholder="First Name"
        />
      </div>
      <div>
        <label className="sr-only">Last Name</label>
        <input
          onChange={(e) => {
            const body = {
              first_name: userContact.first_name,
              last_name: e.target.value,
              email: userContact.email,
            };
            setUserContact(body);
          }}
          type="text"
          required
          className="appearance-none rounded-none relative block
                  w-full px-3 py-2 border border-gray-300
                  placeholder-gray-500 text-gray-900 rounded-b-md
                  focus:outline-none focus:ring-indigo-500
                  focus:border-indigo-500 focus:z-10 sm:text-sm"
          placeholder="Last Name"
        />
      </div>
      <div>
        <label className="sr-only">Email</label>
        <input
          onChange={(e) => {
            const body = {
              first_name: userContact.first_name,
              last_name: userContact.last_name,
              email: e.target.value,
            };
            setUserContact(body);
          }}
          type="email"
          required
          className="appearance-none rounded-none relative block
                  w-full px-3 py-2 border border-gray-300
                  placeholder-gray-500 text-gray-900 rounded-b-md
                  focus:outline-none focus:ring-indigo-500
                  focus:border-indigo-500 focus:z-10 sm:text-sm"
          placeholder="Email"
        />
      </div>
      <button
        onClick={(event) => {
          event.preventDefault();
          addParticipant(userContact);
        }}
        className="px-5 py-2 border border-blue-500 rounded-md"
      >
        Add
      </button>
    </form>
  );
};

export default ScheduleMeetingForm;
