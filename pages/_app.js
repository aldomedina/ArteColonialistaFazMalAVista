import { createContext, useState } from "react";
import "../styles/main.scss";

export const SectionContext = createContext();

function MyApp({ Component, pageProps }) {
  const [activeSection, setActiveSection] = useState("main");
  const setSection = (s) => setActiveSection(s);
  return (
    <SectionContext.Provider value={{ activeSection, setSection }}>
      <Component {...pageProps} />
    </SectionContext.Provider>
  );
}

export default MyApp;
