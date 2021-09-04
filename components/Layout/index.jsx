import { useContext } from "react";
import Link from "next/link";
import { useSpring, animated } from "react-spring";

import { SectionContext } from "../../pages/_app";
import useWindowsSize from "../Hooks/useWindowsSize";
import BonusTrack from "../BonusTrack";
import downloadIcon from "../../assets/download-icon.svg";

const MENU_WIDTH = 230;

const Layout = ({ children }) => {
  const { activeSection, setSection } = useContext(SectionContext);
  const { width } = useWindowsSize();
  const slideTroughSections = useSpring({
    transform: `translate3d(${
      activeSection === "bonus"
        ? 0
        : activeSection === "menu"
        ? -width
        : -(width + MENU_WIDTH)
    }px,0,0)`,
    delay: 0,
  });

  const downloadResearch = () => {
    const link = document.createElement("a");
    link.href = url;
    link.download = research;
    link.dispatchEvent(new MouseEvent("click"));
  };

  return (
    <div className="layout h-full max-w-screen overflow-hidden">
      <animated.div
        style={slideTroughSections}
        className="horizontal-slider h-full flex"
      >
        <BonusTrack />
        <nav
          style={{ minWidth: MENU_WIDTH }}
          className="menu p-5px h-full flex flex-col justify-between bg-black text-white"
        >
          <ul className="flex flex-col">
            <li>
              <Link href="/" passHref>
                <span onClick={() => setSection("main")}>HOME</span>
              </Link>
            </li>
            <li>
              <button
                className="text-white"
                onClick={() => setSection("bonus")}
              >
                The Projet
              </button>
            </li>
            <li>
              <a
                href="https://drive.google.com/file/d/19SucwlAS2fLg1XYA1OW669BjEu4WPrvZ/view"
                target="_blank"
                rel="noreferrer"
              >
                RESEARCH
                <img src={downloadIcon} alt="download-icon" className="ml-05" />
              </a>
            </li>
            <li>
              <Link href="/colombot" passHref>
                <span onClick={() => setSection("main")}>COLOMBOT</span>
              </Link>
            </li>
          </ul>

          {/* <button className="text-white" onClick={() => setSection("bonus")}>
            BONUS TRACK
          </button> */}
        </nav>
        {children}
      </animated.div>
    </div>
  );
};

export default Layout;
