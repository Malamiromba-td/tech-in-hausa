import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Game da Mu",
  description:
    "Labarin TechInHausa, manufarta, da wanda ya kafa ta, Ibrahim Zubairu (Malamiromba).",
  alternates: { canonical: "/game-da-mu" },
  openGraph: {
    title: "Game da Mu | TechInHausa",
    description:
      "Labarin TechInHausa, manufarta, da wanda ya kafa ta, Ibrahim Zubairu (Malamiromba).",
    url: "/game-da-mu",
  },
};

export default function GameDaMuPage() {
  return (
    <>
      <Nav />

      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <div className="mb-3.5 text-[14.5px] font-medium text-indigo">
            Game da Mu
          </div>
          <h1 className="mb-6 font-display text-[32px] leading-tight text-indigo-deep md:text-[42px]">
            Cire shingen da ke tsakanin fasaha da al&apos;ummar Hausa.
          </h1>
          <p className="mb-4 text-[16px] leading-relaxed text-ink/75">
            TechInHausa wani shiri ne da Ibrahim Zubairu (wanda aka fi sani da
            Malamiromba) ya kafa, don kawo ilimin fasaha da AI ga masu jin Hausa
            a duniya baki daya — a harshen da suke magana da shi, ba wanda ake
            fassara musu daga baya ba.
          </p>
          <p className="mb-4 text-[16px] leading-relaxed text-ink/75">
            Tun bayan kaddamar da shirin, an wallafa fiye da bidiyo 48 na ilimi,
            kuma an kai ga daliban da ke kasashe tara, duk kuma kyauta ne kai
            tsaye, babu wani caji.
          </p>
          <p className="mb-4 text-[16px] leading-relaxed text-ink/75">
            Manufar ta zurfafa fiye da koyar da coding kawai — ita ce tabbatar
            da cewa yaren Hausa da masu magana da shi ba za su makara ba wajen
            shiga sabuwar duniyar dijital da AI take kawowa.
          </p>

          <div className="my-10 border-t border-line" />

          <h2 className="mb-4 font-display text-[24px] text-indigo-deep">
            Wanda Ya Kafa
          </h2>
          <p className="mb-4 text-[16px] leading-relaxed text-ink/75">
            Ibrahim Zubairu, wanda aka fi sani da Malamiromba, shi ne wanda ya
            kafa TechInHausa da kuma Malamiromba Ltd. Ya kafa shirin ne bisa
            la&apos;akari da yadda mafi yawan albarkatun koyar da fasaha suke
            wanzuwa cikin turanci kadai, wanda hakan ke bar sauran al&apos;umma
            a baya.
          </p>
          <p className="mb-4 text-[16px] leading-relaxed text-ink/75">
            Ibrahim Zubairu (Malamiromba) is a Nigerian tech educator and
            community builder focused on making modern technology accessible to
            Hausa-speaking communities. He has taught and guided thousands of
            learners across Northern Nigeria and beyond, helping them understand
            and use digital tools, AI, and tech skills in practical, everyday
            ways.
          </p>
          <p className="mb-4 text-[16px] leading-relaxed text-ink/75">
            Beyond teaching, Ibrahim advocates for AI literacy and the growth of
            technical capacity in underserved language communities. He believes
            that curiosity about technology is universal, what often stands in
            the way is access and understanding. This platform is a reflection
            of that belief: making technology clear, relatable, and usable for
            more people.
          </p>

          <div className="my-10 border-t border-line" />

          <h2 className="mb-4 font-display text-[24px] text-indigo-deep">
            Ayyukanmu
          </h2>
          <ul className="flex flex-col gap-3 text-[16px] text-ink/75">
            <li>
              <strong className="text-ink">TechInHausa</strong> — darussan
              bidiyo da labarai kan fasaha da AI, kyauta, a harshen Hausa
            </li>
            <li>
              <strong className="text-ink">TathSchool</strong> — dandalin koyo
              (LMS) don darussa masu zurfi da difloma
            </li>
            <li>
              <strong className="text-ink">Malamiromba Ltd</strong> — kamfanin
              da ke tallafawa dukkan ayyukan biyu
            </li>
          </ul>
        </div>
      </section>

      <Footer />
    </>
  );
}
