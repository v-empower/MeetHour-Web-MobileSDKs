/* eslint-disable max-len */
/**
 *
 * @param {boolean} isHomepage
 * @returns {JSX}
 */
export default function Description({ isHomepage }: { isHomepage?: boolean; }) {
    return (
        <div
            className={`${
                isHomepage ? 'md:mx-40 mx-5' : 'lg:w-[60%]'
            } overflow-hidden bg-white shadow sm:rounded-lg`}
        >
            <div className='px-4 py-5 sm:px-6'>
                <h3 className='text-lg font-medium leading-6 text-gray-900'>
                    {isHomepage
                        ? 'Steps to Authorize Meet Hour Developer account and get access token.'
                        : 'How to Schedule a Meeting'}
                </h3>
                <p className='mt-1 text-sm text-gray-500'>Steps given below - </p>
            </div>
            <div className='border-t border-gray-200'>
                <dl>
                    <div className='bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                        <dt className='text-sm font-medium text-gray-500'>Step One</dt>
                        <dd className='mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
                            {isHomepage ? (
                                <>
                  Go to{' '}
                                    <a
                                        target='_blank'
                                        className='text-blue-500'
                                        href='https://meethour.io'
                                    >
                    meethour.io
                                    </a>{' '}
                  and signup for Developer or Higher plan. Currently we offer 28
                  days free trial.
                                </>
                            ) : (
                                <>
                  Fill the required fields like meeting name, passcode, meeting
                  date, meeting time, meeting meridiem and timezone in the
                  Schedule a Meeting Form.
                                    <br />
                                    <span className='text-xs'>
                    Note: You have to set a moderator to start the meeting. If
                    you do not set a moderator, meeting can not start.
                                    </span>
                                </>
                            )}
                        </dd>
                    </div>
                    <div className='bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                        <dt className='text-sm font-medium text-gray-500'>Step Two</dt>
                        <dd className='mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
                            {isHomepage ? (
                                <>
                  Go to the{' '}
                                    <a
                                        target='_blank'
                                        className='text-blue-500'
                                        href='https://portal.meethour.io'
                                    >
                    dashboard
                                    </a>{' '}
                  and then click on{' '}
                                    <a
                                        className='text-blue-500'
                                        target='_blank'
                                        href='https://portal.meethour.io/customer/developers'
                                    >
                    developers
                                    </a>{' '}
                  menu.
                                </>
                            )
                                : 'After adding all the necessary fields, now add participants and moderators. Note: To start a meeting, atleast one moderator is required.'
                            }
                        </dd>
                    </div>
                    <div className='bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                        <dt className='text-sm font-medium text-gray-500'>Step Three</dt>
                        <dd className='mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
                            {isHomepage
                                ? 'Copy your Client ID, Client Secret and Api Key. After copying, paste each copied text to the respective constant in the source code src/constants/index.tsx'
                                : 'You can choose general options according to your requirements.'}
                        </dd>
                    </div>
                    <div className='bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                        <dt className='text-sm font-medium text-gray-500'>Step Four</dt>
                        <dd className='mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
                            {isHomepage
                                ? 'After completing all the steps given above, now click on Get Access Token given below.'
                                : 'After filling all the fields, now you can click on Schedule a Meeting button which will take you to the joining page.'}
                        </dd>
                    </div>
                    <div className='bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                        <dt className='text-sm font-medium text-gray-500'>Step Five</dt>
                        <dd className='mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
                            {isHomepage
                                ? 'As you click, your access token will be received and stored it in brower\'s localstorage. The received access token is then used for making Meet Hour rest api calls.'
                                : 'In joining page you will be asked, whom do you want to join as. Choose and go ahead to the meeting.'}
                        </dd>
                    </div>
                    {localStorage.getItem('accessToken') ? (
                        <div className='bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                            <dt className='text-sm font-medium text-gray-500'>Step Six</dt>
                            <dd className='mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
                                {isHomepage ? (
                                    <>
                    Token successfully got generated. Now you can schedule a
                    meeting.{' '}
                                        <a
                                            className='text-blue-500 underline'
                                            href='/schedule-meeting'
                                        >
                      Schedule a Meeting
                                        </a>
                                    </>
                                )
                                    : 'When clicked on Instant Meeting, a quick meeting will be scheduled. '
                                }
                            </dd>
                        </div>
                    )
                        : <></>
                    }
                </dl>
            </div>
        </div>
    );
}
