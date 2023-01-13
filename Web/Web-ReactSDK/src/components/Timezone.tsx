import ApiServices from 'meet-hour-react-web-sdk'
import React, { useEffect, useState } from 'react'

function Timezone({inputChangeHandler} : {inputChangeHandler: (value: any) => void}) {
    const [timezoneList, setTimezoneList] = useState<[]>()
    const getTimezone = async () => {
        const response = await ApiServices.timezone(localStorage.getItem("accessToken") || "");
        setTimezoneList(response.timezones)
    }
    useEffect(() => {
        getTimezone();
    }, [])
    
  return (
    <div className='w-full h-10 rounded-md'>
      <select className='w-full h-full rounded-md focus:outline-none bg-slate-50 border border-slate-300' name="timezone" onChange={(inputChangeHandler)}>
      {timezoneList?.map((timezone: any) => {
        return (
          <option key={timezone.value} className='w-96' value={timezone.value}>{timezone.name}</option>
        )
      })}
      </select>
    </div>
  )
}

export default Timezone