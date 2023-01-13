import { PaperClipIcon } from '@heroicons/react/20/solid'

export default function Description({isHomepage} : {isHomepage?: boolean}) {
  return (
    <div className={`${isHomepage ? "mx-40" : "w-[60%]"} overflow-hidden bg-white shadow sm:rounded-lg`}>
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">{isHomepage ? "How to get access token?" : "How to Schedule a Meeting"}</h3>
        <p className="mt-1 text-sm text-gray-500">Steps given below - </p>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Step One</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{isHomepage ? "Go to meethour.io and sign in to your account." : <>Fill the required fields like meeting name, passcode, meeting date, meeting time, meeting meridiem and timezone in the Schedule a Meeting Form.<br/><span className='text-xs'>Note: You have to set a moderator to start the meeting. If you do not set a moderator, meeting can not start.</span></>}</dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Step Two</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{isHomepage ? "Go to the dashboard and then click on developers option." : ""}</dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Step Three</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{isHomepage ? "Copy your Client ID, Client Secret and Api Key. After copying, paste each copied text to the respective constant in constants/index.js." : ""}</dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Step Four</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{isHomepage ? "After completing all the steps given above, now click on Get Access Token given below." : ""}</dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Step Five</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{isHomepage ? "As you click, your access token will be recieved and stored it in brower's localstorage. The recieved access token is then used for making meethour rest api calls." : ""}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
