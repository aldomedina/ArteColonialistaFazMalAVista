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
              <span className="big-title">colombot:</span>
              <span>bring your favorite</span>
              <span className="align-self-end">colonialist</span>
              <span className="big-title"> to life</span>
            </h1>
          </div>
          <div className="flex flex-col">
            <Link href="/search" passHref>
              <button className="btn btn-big align-self-end">START</button>
            </Link>
            <h2>
              Una iniciativa da camara de
              <span className="linetrough">lisboa</span>
            </h2>
          </div>
        </div>
        <HomeCanvas />
      </div>
    </Layout>
  );
}
