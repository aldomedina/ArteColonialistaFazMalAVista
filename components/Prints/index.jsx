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
  // {getTime(el.date)}

  // <span>
  //               {el.class === "person" ? "Savage - " : `Exotic ${el.class}: `}
  //             </span>
  //             {el.class === "person"
  //               ? descriptionsPerson[getRandomInt(descriptionsPerson.length)]
  //               : descriptionsThings[getRandomInt(descriptionsThings.length)]}
  // {el.score.toLocaleString("en", { style: "percent" })}
  return (
    <div className="w-full text-white p-5px">
      <h3 className="text-3xl m-5px border-b-1-white">
        COLONIALIST DEPICTIONS
      </h3>
      <div className="flex flex-col ">
        {data?.map((el, i) => (
          <div key={`${el.id}-${el.class}`} className="mb-05">
            <p>{`${getTime(el.date)} - ${
              el.class === "person" ? "Savage - " : `Exotic ${el.class}`
            } (${el.score.toLocaleString("en", { style: "percent" })})`}</p>
            <h4 className="text-xl">
              &quot;
              {el.class === "person"
                ? descriptionsPerson[getRandomInt(descriptionsPerson.length)]
                : descriptionsThings[getRandomInt(descriptionsThings.length)]}
              &quot;
            </h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Prints;
