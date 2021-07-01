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
  });

  return (
    <div className="h-full max-w-screen overflow-hidden">
      <animated.div style={slideTroughSections} className="h-full flex">
        <BonusTrack />
        <nav
          style={{ minWidth: MENU_WIDTH }}
          className="menu p-5px h-full flex flex-col justify-between bg-black text-white"
        >
          <ul className="flex flex-col">
            <Link href="/">HOME</Link>
            <Link href="/projeto">O PROJETO</Link>
            <li>
              A PESQUISA
              <img src={downloadIcon} alt="download-icon" className="ml-05" />
            </li>
          </ul>

          <button className="text-white" onClick={() => setSection("bonus")}>
            BONUS TRACK
          </button>
        </nav>
        {children}
      </animated.div>
    </div>
  );
};

export default Layout;
