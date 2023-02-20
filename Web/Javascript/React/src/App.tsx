import { createContext, useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import ErrorComponent from './components/ErrorComponent';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import JoinMeeting from './pages/JoinMeeting';
import ScheduleMeeting from './pages/ScheduleMeeting';

interface AppContextType {
  isError: boolean;
  setIsError: (value: boolean) => void;
  setErrorMessage: (value: string) => void;
}
export const AppContext = createContext<AppContextType | undefined>(undefined);

/**
 @returns {JSX}
 */
function App() {
    const [ isError, setIsError ] = useState(false);
    const [errorMessage, setErrorMessage] = useState("")

    return (
        <AppContext.Provider
            value={{
                isError,
                setIsError,
                setErrorMessage
            }}
        >
            <div>
                <Navbar />
                {isError ? <ErrorComponent errorMessage={errorMessage}/> : <></>}
                <Routes>
                    <Route path='/' element={<HomePage />} />
                    <Route path='/schedule-meeting' element={<ScheduleMeeting />} />
                    <Route path='/join-meeting' element={<JoinMeeting />} />
                </Routes>
            </div>
        </AppContext.Provider>
    );
}

export default App;
