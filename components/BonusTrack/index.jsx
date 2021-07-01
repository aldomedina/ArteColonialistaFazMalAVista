import { useContext } from "react";
import Link from "next/link";

import { SectionContext } from "../../pages/_app";
import colombotIMG from "../../assets/colombot-presentation.png";
import backIcon from "../../assets/back-icon.svg";

const BonusTrack = () => {
  const { setSection } = useContext(SectionContext);
  return (
    <div className="bonus-track min-w-screen h-full bg-black text-white p-5px relative flex flex-col">
      <div className="w-full flex justify-between text-md">
        <h3>BONUS TRACK</h3>
        <button
          className="text-white text-md"
          onClick={() => setSection("main")}
        >
          <span>BACK</span> <img src={backIcon} alt="back-icon" />
        </button>
      </div>
      <div className="flex-1 flex flex-col justify-between">
        <h2 className="flex flex-col big-title">
          <span>COLOMBOT: A</span>
          <span>FICTION ABOUT</span>
          <span>COLONIALIST</span>
          <span>KNOWLEDGE</span>
          <span>PRODUCTION</span>
        </h2>
      </div>
      <img
        src={colombotIMG}
        alt="colombot-image"
        className="absolute right-50 bottom-50"
      />
      <Link href="/colombot">
        <button className="btn btn-big btn-white align-self-end z-10">
          START
        </button>
      </Link>
    </div>
  );
};

export default BonusTrack;
