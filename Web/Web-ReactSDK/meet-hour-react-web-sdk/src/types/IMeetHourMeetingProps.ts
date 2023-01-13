/* eslint-disable-next-line */
import { MeetHourMeeting } from '..';
import IMeetingProps from './IMeetingProps';

/**
 * The type of the React {@code Component} props of {@link MeetHourMeeting}.
 */
export default interface IMeetHourMeetingProps extends IMeetingProps {

    /**
     * The domain used to build the conference URL.
     */
    domain?: string;
}
