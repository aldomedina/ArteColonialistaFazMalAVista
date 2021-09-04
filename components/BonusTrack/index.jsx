import { useContext } from "react";
import Link from "next/link";

import { SectionContext } from "../../pages/_app";
import colombotIMG from "../../assets/colombot-presentation.png";
import backIcon from "../../assets/back-icon.svg";

const BonusTrack = () => {
  const { setSection } = useContext(SectionContext);
  return (
    <div className="bonus-track min-w-screen h-full bg-black text-white p-5px pt-0 relative flex flex-col">
      <div className="sticky top-0 w-full flex justify-between text-md bg-black py-5px">
        <h3>O PROJETO</h3>
        <button
          className="text-white text-md"
          onClick={() => setSection("main")}
        >
          <span>BACK</span> <img src={backIcon} alt="back-icon" />
        </button>
      </div>
      <div className="flex-1 flex flex-col justify-between">
        <h2 className="flex flex-col big-title">
          <span>COLOMBOT: A</span>
          <span>FICTION ABOUT</span>
          <span>PORTUGUESE</span>
          <span>COLONIALIST</span>
          <span>CONMEMORATION</span>
        </h2>
        <div className="body">
          <p>
            This project work, circumscribed by the discipline of design, aims
            to make visible the socio-cultural tensions emanating from the
            presence of colonial era commemorative monuments in the public
            sphere. Based on the postulates of Remediation theory, Discursive
            Design and Speculative Design principles, it was proposed to develop
            a web application that exposes the glorification of colonialism in
            official discourse.
          </p>
          <p>
            The final web-app was designed based on a fictional scenario, in
            which some of the most problematic traits observed in European
            authorities are exacerbated to the point of satire. The fictitious
            scenario was based on the social and political context of
            contemporary Portugal, strained by its relationship with its
            colonial past. Portuguese sociologist Miguel Cardina, in an
            interview with Diário de Notícias, pointed out that this
            relationship is based on an amnesic memory, one that: "selects and
            magnifies a certain reading of what the so-called processes of the
            discoveries, of colonization, of the relationship with other
            peoples, of the encounter of cultures, all expressions that have a
            very own charge, adjectivize positively, what the process of
            colonization was, and that is the dominant memory" (Cardina, 2019).
          </p>
          <p>
            The official discourse emanating from the sphere of political power
            is an example of what Cardina presented. The proposal to build a
            Museum of the Discoveries as part of the campaign program of the
            mayor of Lisbon, Fernando Medina -who, by the way, was elected that
            same year-; the erection of a new monument that pays tribute to
            figures from the colonial past such as Father António Vieira, the
            permanence of objects built by the Estado Novo to reinforce
            Portuguese pride in terms of its colonial power and its -intact-
            presence in the public space.
          </p>
          <p>
            These elements were used as inputs to build a fictitious scenario in
            which the speculative design object is projected. The scenario is
            described on the basis of two dimensions. On the one hand, there is
            the sociopolitical context that shapes this alternate present, in
            which a political power is imagined with an uncritical position and
            even inclined to reinforce patriotic pride based on the colonial
            past, traits that are exacerbated to the point of satire. In the
            conceived scenario, speculation is made about the intention to
            expand the platforms on which figures from the past have
            traditionally been celebrated and honored.
          </p>
          <p>
            The second dimension of the scenario is described by its
            technological context, particularly imagining the introduction to
            the narrative of a new Deep Learning technique that would allow the
            consciousness of a person to be emulated in an artificial
            intelligence trained from the records they have left in their life.
            The fictional scenario continues in the hypothetical situation of
            having to generate a design object that responds to the needs of the
            political class, considering the possibilities that the
            technological context offers.
          </p>
          <p>
            Hence, Colombot: Bring Your Favorite Colonialist to Life! was born,
            an application that emulates the incarnation of historical figures
            of colonialism in an artificial intelligence. With this application,
            users can enter this fictional scenario and see the world through
            the eyes of the colonizers -those immortalized in the monuments
            present in public space. The surroundings that the application user
            captures with his camera are portrayed from the anachronistic
            perspective of these historical characters.
          </p>
          <p>
            Cardina, M., Martins, B. S., & Khan, S. (2019). A violência colonial
            no presente: pesquisas, testemunhos e perspectivas – Entrevista com
            Mustafah Dhada. Estudos Ibero-Americanos, 45(2), 64-76.
            https://doi.org/10.15448/1980-864X.2019.2.33813
          </p>
        </div>
      </div>
    </div>
  );
};

export default BonusTrack;
