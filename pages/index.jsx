import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-ccc w-full h-full flex items-center justify-center">
      <div className="py-5 px-3 flex flex-col h-full w-full">
        <div className="border-b-1 flex-1 flex justify-center items-center text-center uppercase">
          <Link href="/kolar">A arte colonialista faz mal à vista</Link>
        </div>
        <div className="border-b-1 flex-1 flex justify-center items-center text-center uppercase">
          <Link href="/eurocentrismo">
            COLONIALIST KNOWLEDGE PRODUCTION FICTION
          </Link>
        </div>
        <div className="  flex-1 flex justify-center items-center text-center uppercase">
          <Link href="/134">134 Nomes</Link>
        </div>
      </div>
    </div>
  );
}
