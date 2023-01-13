import ApiServices from "meet-hour-react-web-sdk";
import React, { useState } from "react";
import { ScheduleMeetingBodyType, User } from "./../core/entities";
import Dropdown from "./Dropdown";
import Timezone from "./Timezone";

interface PropsType {
  onSubmitHandler: () => void;
  inputChangeHandler: (value: any) => void;
  setIsScheduled: (value: boolean) => void;
  setPopupFields: (value: any) => void;
  requestBody: ScheduleMeetingBodyType;
  setRequestBody: (value: ScheduleMeetingBodyType) => void;
  addParticipants: (value: number | User) => void;
  removeParticipant: (value: number | User) => void;
}

function ScheduleMeetingForm(props: PropsType) {
  const [contacts, setContacts] = useState<[]>([])
  const getContactsList = async () => {
    const body = {
      limit: 0,
      page: 0,
      exclude_hosts: 0
    }
    const response = await ApiServices.contactsList(localStorage.getItem("accessToken") || "", body)
    setContacts(response.contacts)
  }
  React.useEffect(() => {
    getContactsList()
  }, [])
  return (
    <div className="flex min-h-full items-center justify-center w-[40%] py-12 px-4 sm:px-3 lg:px-4 ml-3">
        <div className="w-full max-w-sm space-y-8">
          <div>
            <img
              className="mx-auto h-12 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              alt="Your Company"
            />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Schedule a meeting
            </h2>
          </div>
          <div className="mt-8 space-y-6">
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="-space-y-px rounded-md shadow-sm grid gap-2">
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
              <Dropdown contacts={contacts} addParticipants={props.addParticipants}/>
              {contacts.map((user: any) => {
                if(props.requestBody.attend.includes(user.id) === false)
                return null
                return(
                    <div className="flex justify-between">
                        <h1>{user.first_name}</h1>
                        <button className="border border-slate-400 rounded-md px-3" onClick={() => {props.removeParticipant(user.id)}}>Remove</button>
                    </div>
                )
              })}
              <Dropdown contacts={contacts} addParticipants={props.addParticipants}/>
              {contacts.map((user: any) => {
                if(props.requestBody.hostusers.includes(user.id) === false)
                return null
                return(
                    <div className="flex justify-between">
                        <h1>{user.first_name}</h1>
                        <button className="border border-slate-400 rounded-md px-3" onClick={() => {props.removeParticipant(user.id)}}>Remove</button>
                    </div>
                )
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
                type="submit"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                </span>
                Schedule a meeting
              </button>
              <div className="flex justify-center"><h1 className="my-3">Or</h1></div>
              <button className="group relative flex w-full justify-center rounded-md border border-transparent bg-violet-600 py-2 px-4 text-sm font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2">Start Instant Meeting</button>
            </div>
          </div>
        </div>
      </div>
  );
}

export default ScheduleMeetingForm;