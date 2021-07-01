import Link from "next/link";
import Layout from "../components/Layout";
import Burguer from "../components/Burguer";
import HomeCanvas from "../components/HomeCanvas";

export default function Home() {
  return (
    <Layout>
      <div className="home h-full w-screen relative">
        <div className="absolute top-5px left-5px">
          <Burguer />
        </div>
        <div className="flex flex-col justify-between h-full p-5px">
          <div>
            <h1 className="uppercase flex flex-col">
              <span>A arte</span>
              <span className="big-title">colonialista</span>
              <span className="align-self-center">faz mal</span>
              <span className="align-self-end"> à vista</span>
            </h1>
          </div>
          <Link href="/kolar">
            <button className="btn btn-big align-self-end">START</button>
          </Link>
        </div>
        <HomeCanvas />
      </div>
    </Layout>
  );
}
