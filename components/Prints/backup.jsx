import { getRandomInt, getTime } from "../../utils";

const descriptionsPerson = [
  "Potential Slave, maybe...",
  "Hmm... Gives me mercancy vibes",
  "Could be a good exportation",
  "Savage, but maybe with a soul",
  "Meh... Skin problems",
  "No soul, no love",
  "Looks like a good and talented servant",
  "I will call you... indian",
  "He could become Christian very easily",
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
      <table style={{ fontFamily: "monospace" }} className="max-w-content">
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
              Acc.
            </th>
            <th style={{ textAlign: "left", verticalAlign: "top" }}>
              Colonialist Depiction
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.map((el, i) => (
            <tr
              key={`depection-${i}`}
              style={{ borderBottom: "1px solid black" }}
            >
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
                  ? descriptionsPerson[getRandomInt(descriptionsPerson.length)]
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
