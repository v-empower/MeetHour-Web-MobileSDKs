import HomePage from './pages/HomePage'
import JoinMeeting from "./pages/JoinMeeting"
import {
 Route, Routes
} from 'react-router-dom'
import ScheduleMeeting from './pages/ScheduleMeeting'
import Navbar from './components/Navbar'
import UpcomingMeetings from './pages/UpcomingMeetings'

function App() {
  return (
    <div>
          {window.location.pathname === "/join-meeting" ? <></> : <Navbar/>}
        <Routes>
            <Route path='/' element={<HomePage/>}/>
            <Route path='/schedule-meeting' element={<ScheduleMeeting/>}/>
            <Route path='/join-meeting' element={<JoinMeeting/>}/>
            <Route path='/upcoming-meetings' element={<UpcomingMeetings/>}/>
        </Routes>
    </div>
  )
}

export default App
