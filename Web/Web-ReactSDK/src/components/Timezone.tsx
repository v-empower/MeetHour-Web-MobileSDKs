/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
import ApiServices from 'meet-hour-react-web-sdk';
import MomentTimezone from 'moment-timezone';
import React, { useEffect, useState } from 'react';

/**
 @param {any} inputChangeHandler
 @param {any} requestBody
 @param {any} setRequestBody
 */
function Timezone({ inputChangeHandler, requestBody, setRequestBody }: { inputChangeHandler: (value: any) => void; requestBody: any; setRequestBody: (value: any) => void; }) {
    const [ timezoneList, setTimezoneList ] = useState<[]>();
    const getTimezone = async () => {
        const response = await ApiServices.timezone(localStorage.getItem('accessToken') || '');
        setTimezoneList(response.timezones);
        setRequestBody({ ...requestBody,
            timezone: MomentTimezone.tz.guess() });

    };

    useEffect(() => {
        getTimezone();
    }, []);

    return (
        <div className='w-full h-10 rounded-md'>
            <select value={requestBody.timezone} className='w-full h-full rounded-md focus:outline-none bg-slate-50 border border-slate-300' name="timezone" onChange={(inputChangeHandler)}>
                {timezoneList?.map((timezone: any) =>
                    <option key={timezone.value} className='w-96' value={timezone.value}>{timezone.name}</option>
                )}
            </select>
        </div>
    );
}

export default Timezone;
