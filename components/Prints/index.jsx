import { getRandomInt, getTime } from "../../utils";
import styled from "styled-components";

const descriptions = [
  "Potential Slave, maybe ",
  "Mercancy vibes",
  "Could be a good exportation",
  "Skin problems",
  "No soul for sure",
  "Savage, but maybe with a soul",
  "Good and talented servant",
  "I will call you... indian",
];

const descriptionsThings = [
  "Shall be deliver to the King",
  "How splendid! new exotic piece for my museum",
  "LOOOOOOOT!!!!",
  "Kind of shine, might be gold? mine!",
  "From now own that's mine",
];

const Prints = ({ data }) => {
  return (
    <div className="w-full text-white">
      <table className="max-w-content">
        <thead>
          <tr>
            <th
              style={{
                textAlign: "left",
                verticalAlign: "top",
                paddingBottom: ".4rem",
                paddingRight: ".2rem",
              }}
            >
              Time
            </th>
            <th
              style={{
                textAlign: "left",
                verticalAlign: "top",
                paddingRight: ".2rem",
              }}
            >
              Accuracy
            </th>
            <th style={{ textAlign: "left", verticalAlign: "top" }}>
              Colonialist Depiction
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.map((el) => (
            <tr style={{ borderBottom: "1px solid black" }}>
              <th
                className="mr-1"
                style={{
                  textAlign: "left",
                  fontSize: "0.8rem",
                  verticalAlign: "top",
                }}
              >
                {/* {el.date.toLocaleDateString()}
                <br /> */}
                {getTime(el.date)}
              </th>
              <th style={{ fontSize: "0.8rem", verticalAlign: "top" }}>
                {el.score.toLocaleString("en", { style: "percent" })}
              </th>
              <th style={{ textAlign: "left", verticalAlign: "top" }}>
                <span>
                  {el.class === "person" ? "Savage - " : `Exotic ${el.class}: `}
                </span>
                {el.class === "person"
                  ? descriptions[getRandomInt(descriptions.length)]
                  : descriptionsThings[getRandomInt(descriptionsThings.length)]}
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Prints;
