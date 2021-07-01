import { useState, useContext } from "react";
import { useSpring, animated } from "react-spring";
import { SectionContext } from "../../pages/_app";

const Burger = () => {
  const [isOpen, toggle] = useState(true);
  const { activeSection, setSection } = useContext(SectionContext);

  const first = useSpring({
    transform:
      activeSection === "menu"
        ? "translate(5px, 32px) rotate(-45deg)"
        : "translate(2px, 7px) rotate(0deg)",
  });
  const second = useSpring({
    transform:
      activeSection === "menu"
        ? "translate(10px, 4px) rotate(45deg)"
        : "translate(2px, 19px) rotate(0deg)",
  });
  const third = useSpring({
    transform:
      activeSection === "menu"
        ? "translate(5px, 32px) rotate(-45deg)"
        : "translate(2px, 31px) rotate(0deg)",
  });

  return (
    <button>
      <svg
        onClick={() => setSection(activeSection === "menu" ? "main" : "menu")}
        width="40"
        height="33"
        viewBox="0 0 44 44"
        fill="#000"
        xmlns="http://www.w3.org/2000/svg"
      >
        <animated.rect width="40" height="6" style={first} />
        <animated.rect width="40" height="6" style={second} />
        <animated.rect width="40" height="6" style={third} />
      </svg>
    </button>
  );
};

export default Burger;
