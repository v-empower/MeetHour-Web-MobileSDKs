import React, {
    ReactElement,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';

import { DEFAULT_DOMAIN } from '../constants';
import { fetchExternalApi } from '../init';
import { IMeetHourExternalApi, IMeetHourMeetingProps, MeetHourExternalAPI } from '../types';
import { generateComponentId } from '../utils';

/**
 * Returns the MeetHourMeeting Component with access to a custom External API
 * to be used as-it-is in React projects
 *
 * @param {IMeetHourMeetingProps} props the component's props
 * @returns {ReactElement} the `MeetHourMeeting` Component
 * @example
  ```js
    <MeetHourMeeting
        domain='meethour.io'
        roomName: 'TestRoom'
        apiKey: '' // This you will get in Developers Page.
    />
  ```
 */
const MeetHourMeeting = ({
    domain = DEFAULT_DOMAIN,
    apiBaseURL,
    apiKey,
    roomName,
    configOverwrite,
    interfaceConfigOverwrite,
    jwt,
    pcode,
    invitees,
    devices,
    userInfo,
    release,
    spinner: Spinner,
    onApiReady,
    onReadyToClose,
    getIFrameRef
}: IMeetHourMeetingProps): ReactElement => {
    const [ loading, setLoading ] = useState(true);
    const [ apiLoaded, setApiLoaded ] = useState(false);
    const externalApi = useRef<MeetHourExternalAPI>();
    const apiRef = useRef<IMeetHourExternalApi>();
    const meetingRef = useRef<HTMLDivElement>(null);
    const componentId = useMemo(() =>
        generateComponentId('MeetHourMeeting')
    , [ generateComponentId ]);

    useEffect(() => {
        fetchExternalApi(apiBaseURL, apiKey, release)
            .then((api: MeetHourExternalAPI) => {
                externalApi.current = api;
                setApiLoaded(true);
            })
            .catch((e: Error) => console.error(e.message));
    }, []);

    // eslint-disable-next-line @typescript-eslint/no-shadow
    const loadIFrame = useCallback((MeetHourExternalAPI: MeetHourExternalAPI) => {
        apiRef.current = new MeetHourExternalAPI(domain, {
            roomName,
            configOverwrite,
            interfaceConfigOverwrite,
            jwt,
            apiKey,
            pcode,
            invitees,
            devices,
            userInfo,
            release,
            parentNode: meetingRef.current
        });
        setLoading(false);
        if (apiRef.current) {
            typeof onApiReady === 'function' && onApiReady(apiRef.current);
            apiRef.current.on('readyToClose', () => {
                typeof onReadyToClose === 'function' && onReadyToClose();
            });
            if (meetingRef.current && typeof getIFrameRef === 'function') {
                getIFrameRef(meetingRef.current);
            }
        }
    }, [
        apiRef,
        meetingRef,
        onApiReady,
        onReadyToClose,
        getIFrameRef,
        domain,
        apiBaseURL,
        apiKey,
        roomName,
        configOverwrite,
        interfaceConfigOverwrite,
        jwt,
        pcode,
        invitees,
        devices,
        userInfo
    ]);

    useEffect(() => {
        if (apiLoaded && !apiRef.current) {
            if (externalApi.current) {
                loadIFrame(externalApi.current);
            }
        }
    }, [ apiLoaded, loadIFrame ]);

    const renderLoadingSpinner = useCallback(() => {
        if (!Spinner) {
            return null;
        }
        if (!loading || apiRef.current) {
            return null;
        }
        //@ts-ignore
        return <Spinner />;
    }, [ Spinner, apiRef.current ]);

    return (
        <React.Fragment>
            {renderLoadingSpinner()}
            <div
                id={componentId}
                key={componentId}
                ref={meetingRef}
            />
        </React.Fragment>
    );
};

export default MeetHourMeeting;
