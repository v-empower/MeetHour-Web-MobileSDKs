import Lottie from 'lottie-react';

import loader from '../lottiefiles/loader.json';

/**
 @returns {JSX}
 */
export default function LottieComponent() {
    return (
        <div className="w-11 h-11">
            <Lottie animationData={loader} />
        </div>
    );
}
