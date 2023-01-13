import { MeetHourExternalAPI } from './MeetHourExternalAPI';
declare global {
    interface Window {
        MeetHourExternalAPI: MeetHourExternalAPI;
    }
}

export { MeetHourExternalAPI } from './MeetHourExternalAPI';
export { default as IMeetHourMeetingProps } from './IMeetHourMeetingProps';
export { default as IMeetHourExternalApi } from './IMeetHourExternalApi';

