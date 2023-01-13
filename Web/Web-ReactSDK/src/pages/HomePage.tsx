import ApiServices, { MeetHourMeeting } from 'meet-hour-react-web-sdk';
import * as React from "react";
import {Link} from 'react-router-dom'
import Description from '../components/Description';
import { CLIENT_ID, CLIENT_SECRET, EMAIL, PASSWORD } from '../constants';

const loginBody = {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    username: EMAIL,
    password: PASSWORD
  }

const HomePage = () => {
    const [isHomepage, setIsHomepage] = React.useState<boolean>(false)
    const [isTokenRecieved, setIsTokenRecieved] = React.useState<boolean>()
    const [ showNew, toggleShowNew ] = React.useState(false);

    const getAccessToken = async () => {
        try{
            const response = await ApiServices.login(loginBody)
        localStorage.setItem("accessToken", response.access_token)
        setIsTokenRecieved(true)
        }
        catch(error){
            console.log(error)
        }
    }
    
 
    // const resolveKnockingParticipants = condition => {
    //     knockingParticipants.forEach((participant: any) => {
    //         apiRef.current?.executeCommand('answerKnockingParticipant', participant?.id, condition(participant));
    //         updateKnockingParticipants(participants => participants.filter((item: any) => item.id === participant.id));
    //     });
    // };

    

    const handleMeetHourIFrameRef2 = (iframeRef: any) => {
        iframeRef.allow = 'camera; microphone; display-capture; autoplay; clipboard-write';
        iframeRef.style.marginTop = '10px';
        iframeRef.style.border = '10px dashed #df486f';
        iframeRef.style.padding = '5px';
        iframeRef.style.height = '400px';
    };

    

    

    const meetingID = () => 'TestRoom';


    // Passing room password dynamically.

    // setTimeout(() => {
    //     apiRef?.current?.addEventListener('passwordRequired', () => {
    //         apiRef?.current?.executeCommand('password', pass);
    //     });

    // }, 200);

    // Multiple instances demo
    const renderNewInstance = () => {
        if (!showNew) {
            return null;
        }

        return (
            <MeetHourMeeting apiBaseURL='' apiKey=''
                roomName = { meetingID() }
                getIFrameRef = { handleMeetHourIFrameRef2 } />
        );
    };

    // const renderButtons = () => (
    //     <div style = {{ margin: '15px 0' }}>
    //         <div style = {{
    //             display: 'flex',
    //             justifyContent: 'center'
    //         }}>
    //             <button
    //                 type = 'text'
    //                 title = 'Click to execute toggle raise hand command'
    //                 style = {{
    //                     border: 0,
    //                     borderRadius: '6px',
    //                     fontSize: '14px',
    //                     background: '#f8ae1a',
    //                     color: '#040404',
    //                     padding: '12px 46px',
    //                     margin: '2px 2px'
    //                 }}
    //                 onClick = { () => apiRef.current.executeCommand('toggleRaiseHand') }>
    //                 Raise hand
    //             </button>
    //             <button
    //                 type = 'text'
    //                 title = 'Click to approve/reject knocking participant'
    //                 style = {{
    //                     border: 0,
    //                     borderRadius: '6px',
    //                     fontSize: '14px',
    //                     background: '#0056E0',
    //                     color: 'white',
    //                     padding: '12px 46px',
    //                     margin: '2px 2px'
    //                 }}
    //                 onClick = { () => resolveKnockingParticipants(({ name }) => !name.includes('test')) }>
    //                 Resolve lobby
    //             </button>
    //             <button
    //                 type = 'text'
    //                 title = 'Click to execute subject command'
    //                 style = {{
    //                     border: 0,
    //                     borderRadius: '6px',
    //                     fontSize: '14px',
    //                     background: '#df486f',
    //                     color: 'white',
    //                     padding: '12px 46px',
    //                     margin: '2px 2px'
    //                 }}
    //                 onClick = { () => apiRef.current.executeCommand('subject', 'New Subject')}>
    //                 Change subject
    //             </button>
    //             <button
    //                 type = 'text'
    //                 title = 'Click to create a new MeetHourMeeting instance'
    //                 style = {{
    //                     border: 0,
    //                     borderRadius: '6px',
    //                     fontSize: '14px',
    //                     background: '#3D3D3D',
    //                     color: 'white',
    //                     padding: '12px 46px',
    //                     margin: '2px 2px'
    //                 }}
    //                 onClick = { () => toggleShowNew(!showNew) }>
    //                 Toggle new instance
    //             </button>
    //         </div>
    //     </div>
    // );
    React.useEffect(()=> {
        setIsHomepage(true)
    }, [])
    

    

    return (
        <div className='relative top-16'>  
        
            <div className='text-3xl flex justify-center font-bold mt-5 text-sky-500'><h1>Welcome to Meethour</h1></div>
            {/* <MeetHourMeeting
                roomName = { meetingID() }
                spinner = { renderSpinner }
                // eslint-disable-next-line max-len
                jwt = {''} // You need to generate JWT from here - https://docs.v-empower.com/docs/MeetHour-API/b7e3d0ab3906f-generate-jwt
                pcode= {''}
                configOverwrite = {{
                    subject: 'TestRoom',
                    hideConferenceSubject: false
                }}
                interfaceConfigOverwrite = {{
                    applyMeetingSettings: true,
                    disablePrejoinHeader: true,
                    disablePrejoinFooter: true,
                    SHOW_MEET_HOUR_WATERMARK: false,
                    HIDE_DEEP_LINKING_LOGO: true,
                    MOBILE_APP_PROMO: false,
                    ENABLE_DESKTOP_DEEPLINK:false,
                    ENABLE_MOBILE_BROWSER: true
                }}
                onApiReady = { externalApi => handleApiReady(externalApi) }
                onReadyToClose = { handleReadyToClose }
                getIFrameRef = { handleMeetHourIFrameRef1 } />
            {renderButtons()}
            {renderNewInstance()}
            {renderLog()} */}
            <Description isHomepage={isHomepage}/>
            <div className='flex justify-center mt-3'><button className='bg-sky-600 text-white rounded-md px-5 py-1' onClick={()=> {
                getAccessToken()
            }}>Get Access Token</button></div>
            {isTokenRecieved ? <div>Token Successfully Recieved</div> : <></>}
            
        </div>
    );
};

export default HomePage;