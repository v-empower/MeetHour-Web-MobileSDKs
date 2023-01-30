/* eslint-disable camelcase */
import ApiServices from 'meet-hour-react-web-sdk';
import * as React from 'react';

import { AppContext } from '../App';
import Description from '../components/Description';
import LottieComponent from '../components/LottieComponent';
import { CLIENT_ID, CLIENT_SECRET, EMAIL, PASSWORD } from '../constants';

const loginBody = {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    username: EMAIL,
    password: PASSWORD
};

const HomePage = () => {
    const appContext = React.useContext(AppContext);
    const [ isHomepage, setIsHomepage ] = React.useState<boolean>(false);
    const [ isLoading, setIsLoading ] = React.useState<boolean>(false);
    const getAccessToken = async () => {
        setIsLoading(true);
        try {
            const response = await ApiServices.login(loginBody);

            localStorage.setItem('accessToken', response.access_token);
        } catch (error) {
            appContext?.setIsError(true);
            setTimeout(() => {
                appContext?.setIsError(false);
            }, 6000);
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        setIsHomepage(true);
    }, []);

    return (
        <div className="relative top-16">
            <div className="text-3xl flex justify-center font-bold mt-5 text-sky-500">
                <h1>Welcome to Meet Hour</h1>
            </div>
            <Description isHomepage={isHomepage} />
            <div className="flex justify-center gap-1 mt-3">
                <button
                    className="bg-sky-600 flex justify-center items-center text-white rounded-md h-9 w-40"
                    onClick={() => {
                        getAccessToken();
                    }}
                >
                    {isLoading ? <LottieComponent /> : <>Get Access Token</>}
                </button>
            </div>
        </div>
    );
};

export default HomePage;
