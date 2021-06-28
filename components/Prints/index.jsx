import { getRandomInt, getTime } from "../../utils";
import styled from "styled-components";
const descriptions = [
  "Potential Slave",
  "Mercancy vibes",
  "Candidate for sexual explotation",
  "Could be a good exportation",
];

const descriptionsThings = [
  "Shall be deliver to the King",
  "A good present to the church",
];

const Prints = ({ data }) => {
  return (
    <div className="w-full" style={{ color: "white" }}>
      <h2>Colonialist Predictions:</h2>
      <table>
        {data?.map((el) => (
          <tr style={{ borderBottom: "1px solid white" }}>
            <th
              className="mr-1"
              style={{
                textAlign: "left",
                fontSize: "0.8rem",
                verticalAlign: "top",
              }}
            >
              {el.date.toLocaleDateString()}
              <br />
              {getTime(el.date)}
            </th>
            <th style={{ fontSize: "0.8rem", verticalAlign: "top" }}>
              {el.score.toLocaleString("en", { style: "percent" })}
            </th>
            <th style={{ textAlign: "left", verticalAlign: "top" }}>
              <span>{el.class === "person" ? "Savage - " : "Loot - "}</span>
              {el.class === "person"
                ? descriptions[getRandomInt(descriptions.length)]
                : descriptionsThings[getRandomInt(descriptionsThings.length)]}
            </th>
          </tr>
        ))}
      </table>
    </div>
  );
};

export default Prints;
