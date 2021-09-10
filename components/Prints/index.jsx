const Prints = ({ data }) => (
  <div className="w-full  p-5px text-white">
    <h3 className="text-3xl m-5px ">COLONIALIST DEPICTIONS</h3>
    <div className="flex flex-col m-5px">
      {data?.slice(0, 5).map((el, i) => (
        <div
          key={`${el.id}-${el.class}`}
          className={`mb-05 opacity-${10 - i * 2}0`}
        >
          <p>{`${el.id} - ${
            el.class === "person" ? "Savage - " : `Exotic ${el.class}`
          } (${el.score.toLocaleString("en", { style: "percent" })})`}</p>
          <h4 className="text-xl">
            &quot;
            {el.description}
            &quot;
          </h4>
        </div>
      ))}
    </div>
  </div>
);

export default Prints;
