import loader from "../lottiefiles/loader.json";
import Lottie from "lottie-react";
export default function LottieComponent() {
  return (
    <div className="w-11 h-11">
      <Lottie animationData={loader} />
    </div>
  );
}
