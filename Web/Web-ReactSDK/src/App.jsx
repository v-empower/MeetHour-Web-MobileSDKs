import { MeetHourMeeting } from 'meet-hour-react-web-sdk';
import React, { useRef, useState } from 'react';

const App = () => {
    const apiRef = useRef();
    const [ logItems, updateLog ] = useState([]);
    const [ showNew, toggleShowNew ] = useState(false);
    const [ knockingParticipants, updateKnockingParticipants ] = useState([]);

    const printEventOutput = payload => {
        updateLog(items => [ ...items, JSON.stringify(payload) ]);
    };

    const handleAudioStatusChange = (payload, feature) => {
        if (payload.muted) {
            updateLog(items => [ ...items, `${feature} off` ])
        } else {
            updateLog(items => [ ...items, `${feature} on` ])
        }
    };

    const handleChatUpdates = payload => {
        if (payload.isOpen || !payload.unreadCount) {
            return;
        }
        apiRef.current.executeCommand('toggleChat');
        updateLog(items => [ ...items, `you have ${payload.unreadCount} unread messages` ])
    };

    const handleKnockingParticipant = payload => {
        updateLog(items => [ ...items, JSON.stringify(payload) ]);
        updateKnockingParticipants(participants => [ ...participants, payload?.participant ])
    };

    const resolveKnockingParticipants = condition => {
        knockingParticipants.forEach(participant => {
            apiRef.current.executeCommand('answerKnockingParticipant', participant?.id, condition(participant));
            updateKnockingParticipants(participants => participants.filter(item => item.id === participant.id));
        });
    };

    const handleMeetHourIFrameRef1 = iframeRef => {
        iframeRef.allow = 'camera; microphone; display-capture; autoplay; clipboard-write';
        iframeRef.style.border = '10px solid #3d3d3d';
        iframeRef.style.background = '#3d3d3d';
        iframeRef.style.height = '400px';
        iframeRef.style.marginBottom = '20px';
    };

    const handleMeetHourIFrameRef2 = iframeRef => {
        iframeRef.allow = 'camera; microphone; display-capture; autoplay; clipboard-write';
        iframeRef.style.marginTop = '10px';
        iframeRef.style.border = '10px dashed #df486f';
        iframeRef.style.padding = '5px';
        iframeRef.style.height = '400px';
    };

    const handleApiReady = apiObj => {
        apiRef.current = apiObj;
        apiRef.current.on('knockingParticipant', handleKnockingParticipant);
        apiRef.current.on('audioMuteStatusChanged', payload => handleAudioStatusChange(payload, 'audio'));
        apiRef.current.on('videoMuteStatusChanged', payload => handleAudioStatusChange(payload, 'video'));
        apiRef.current.on('raiseHandUpdated', printEventOutput);
        apiRef.current.on('titleViewChanged', printEventOutput);
        apiRef.current.on('chatUpdated', handleChatUpdates);
        apiRef.current.on('knockingParticipant', handleKnockingParticipant);
    };

    const handleReadyToClose = () => {
        /* eslint-disable-next-line no-alert */
        alert('Ready to close...');
    };

    const meetingID = () => 'TestRoom';


    // Passing room password dynamically.
    const pass = '12345';

    setTimeout(() => {
        apiRef.current.addEventListener('passwordRequired', () => {
            apiRef.current.executeCommand('password', pass);
        });

    }, 200);

    // Multiple instances demo
    const renderNewInstance = () => {
        if (!showNew) {
            return null;
        }

        return (
            <MeetHourMeeting
                roomName = { meetingID() }
                getIFrameRef = { handleMeetHourIFrameRef2 } />
        );
    };

    const renderButtons = () => (
        <div style = {{ margin: '15px 0' }}>
            <div style = {{
                display: 'flex',
                justifyContent: 'center'
            }}>
                <button
                    type = 'text'
                    title = 'Click to execute toggle raise hand command'
                    style = {{
                        border: 0,
                        borderRadius: '6px',
                        fontSize: '14px',
                        background: '#f8ae1a',
                        color: '#040404',
                        padding: '12px 46px',
                        margin: '2px 2px'
                    }}
                    onClick = { () => apiRef.current.executeCommand('toggleRaiseHand') }>
                    Raise hand
                </button>
                <button
                    type = 'text'
                    title = 'Click to approve/reject knocking participant'
                    style = {{
                        border: 0,
                        borderRadius: '6px',
                        fontSize: '14px',
                        background: '#0056E0',
                        color: 'white',
                        padding: '12px 46px',
                        margin: '2px 2px'
                    }}
                    onClick = { () => resolveKnockingParticipants(({ name }) => !name.includes('test')) }>
                    Resolve lobby
                </button>
                <button
                    type = 'text'
                    title = 'Click to execute subject command'
                    style = {{
                        border: 0,
                        borderRadius: '6px',
                        fontSize: '14px',
                        background: '#df486f',
                        color: 'white',
                        padding: '12px 46px',
                        margin: '2px 2px'
                    }}
                    onClick = { () => apiRef.current.executeCommand('subject', 'New Subject')}>
                    Change subject
                </button>
                <button
                    type = 'text'
                    title = 'Click to create a new MeetHourMeeting instance'
                    style = {{
                        border: 0,
                        borderRadius: '6px',
                        fontSize: '14px',
                        background: '#3D3D3D',
                        color: 'white',
                        padding: '12px 46px',
                        margin: '2px 2px'
                    }}
                    onClick = { () => toggleShowNew(!showNew) }>
                    Toggle new instance
                </button>
            </div>
        </div>
    );

    const renderLog = () => logItems.map(
        (item, index) => (
            <div
                style = {{
                    fontFamily: 'monospace',
                    padding: '5px'
                }}
                key = { index }>
                {item}
            </div>
        )
    );

    const renderSpinner = () => (
        <div style = {{
            fontFamily: 'sans-serif',
            textAlign: 'center'
        }}>
            Loading..
        </div>
    );


    return (
        <>
            <h1 style = {{
                fontFamily: 'sans-serif',
                textAlign: 'center'
            }}>
                Meet Hour Meeting Web React Example
            </h1>
            <p style = {{
                fontFamily: 'sans-serif',
                textAlign: 'center'
            }}><a href="https://meethour.io/TestRoom" target={'_blank'}>https://meethour.io/TestRoom</a></p>
            <MeetHourMeeting
                roomName = { meetingID() }
                spinner = { renderSpinner }
                // eslint-disable-next-line max-len
                jwt = {''} // You need to generate JWT from here - https://docs.v-empower.com/docs/MeetHour-API/b7e3d0ab3906f-generate-jwt
                configOverwrite = {{
                    subject: 'TestRoom',
                    hideConferenceSubject: false,
                    prejoinPageEnabled: false
                }}
                interfaceConfigOverwrite = {{
                    applyMeetingSettings: true,
                    disablePrejoinHeader: true,
                    disablePrejoinFooter: true,
                    SHOW_MEET_HOUR_WATERMARK: false,
                    HIDE_DEEP_LINKING_LOGO: true,
                    MOBILE_APP_PROMO: false,
                    ENABLE_MOBILE_BROWSER: true
                }}
                onApiReady = { externalApi => handleApiReady(externalApi) }
                onReadyToClose = { handleReadyToClose }
                getIFrameRef = { handleMeetHourIFrameRef1 } />
            {renderButtons()}
            {renderNewInstance()}
            {renderLog()}
        </>
    );
};

export default App;
