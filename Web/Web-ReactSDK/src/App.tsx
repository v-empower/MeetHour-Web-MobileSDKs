import HomePage from "./pages/HomePage";
import JoinMeeting from "./pages/JoinMeeting";
import { Route, Routes } from "react-router-dom";
import ScheduleMeeting from "./pages/ScheduleMeeting";
import Navbar from "./components/Navbar";
import { createContext, useState } from "react";
import ErrorComponent from "./components/ErrorComponent";
interface AppContextType {
  isError: boolean;
  setIsError: (value: boolean) => void;
}
export const AppContext = createContext<AppContextType | undefined>(undefined);

function App() {
  const [isError, setIsError] = useState(false);
  return (
    <AppContext.Provider
      value={{
        isError: isError,
        setIsError: setIsError,
      }}
    >
      <div>
        <Navbar />
        {isError ? <ErrorComponent /> : <></>}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/schedule-meeting" element={<ScheduleMeeting />} />
          <Route path="/join-meeting" element={<JoinMeeting />} />
        </Routes>
      </div>
    </AppContext.Provider>
  );
}

export default App;
