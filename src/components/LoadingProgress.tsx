import Lottie from "lottie-react";
import loading from '../assets/lotties/9965-loading-spinner.json';
// import loading from '../assets/lotties/63230-mini-tricube-spinner-2.json';

export default function LoadingProgress() {

  return <>
    <Lottie className="w-[4rem] " animationData={loading} loop={true} />
  </>
}
