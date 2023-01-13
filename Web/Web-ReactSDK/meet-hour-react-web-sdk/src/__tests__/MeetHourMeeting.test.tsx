import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import * as React from 'react';

import { DEFAULT_DOMAIN } from '../constants';
import { MeetHourMeeting } from '../index';
import { IMeetHourExternalApi } from '../types';

/* eslint-disable no-undef */

describe('MeetHourMeeting component', () => {
    it('should render correctly', () => {
        const props = {
            domain: DEFAULT_DOMAIN,
            roomName: 'TestingMeetHourMeetingComponent',
            onApiReady: (externalApi: IMeetHourExternalApi) => {
                console.log(externalApi);
            }
        };

        const wrapper = shallow(<MeetHourMeeting {...props} />);
        const snapshot = toJson(wrapper);


        // Overwrite non-deterministic fields
        snapshot.children[0].props.id = 'test';
        snapshot.children[0].props.key = 'test';
        expect(snapshot).toMatchSnapshot();
    });

    it('should render iframe', () => {
        const props = {
            domain: DEFAULT_DOMAIN,
            roomName: 'TestingMeetIFrame',
            onApiReady: (externalApi: IMeetHourExternalApi) => {
                console.log(externalApi);
            }
        };
        const wrapper = shallow(<MeetHourMeeting {...props} />);
        const iframe = wrapper.find('iframe');

        expect(iframe).toBeTruthy();
    });
});
