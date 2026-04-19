import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { About as AboutSSR } from "./components/About";
// import { Contact as ContactSSR } from "./components/Contact";
import { FAQ as FAQSSR } from "./components/FAQ";
import { ContactInfo as ContactInfoSSR } from "./components/ContactInfo";
import "./App.css";
import { Helmet } from "./lib/helmet";
import { lazy, Suspense, useEffect, useState } from "react";
import { TermoCompromisso } from "./components/TermoCompromisso";
import { Rooms } from "./components/Rooms";

const About = import.meta.env.SSR
  ? AboutSSR
  : lazy(() =>
      import("./components/About").then((m) => ({ default: m.About })),
    );

// const Contact = import.meta.env.SSR
//   ? ContactSSR
//   : lazy(() =>
//       import("./components/Contact").then((m) => ({ default: m.Contact })),
//     );

const FAQ = import.meta.env.SSR
  ? FAQSSR
  : lazy(() => import("./components/FAQ").then((m) => ({ default: m.FAQ })));

const ContactInfo = import.meta.env.SSR
  ? ContactInfoSSR
  : lazy(() =>
      import("./components/ContactInfo").then((m) => ({
        default: m.ContactInfo,
      })),
    );

function App() {
  const [isTermoPage, setIsTermoPage] = useState(false);

  useEffect(() => {
    setIsTermoPage(window.location.pathname === "/termo-de-compromisso");
  }, []);

  if (isTermoPage) {
    return <TermoCompromisso />;
  }

  return (
    <>
      <Helmet>
        <title>Lendas Room | O Primeiro Escape Room de Belém</title>
        <meta
          name="description"
          content="O primeiro Escape Room de Belém! Salas temáticas, desafios imersivos e muita diversão com seus amigos. Garanta sua vaga com 20% OFF na estreia!"
        />
        <meta
          name="keywords"
          content="escape room belém, jogos de fuga belém, lendas room, entretenimento belém, o que fazer em belém, sala de escape"
        />
        <link rel="canonical" href="https://lendas-room.vercel.app/" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Lendas Room | O Primeiro Escape Room de Belém"
        />
        <meta
          property="og:description"
          content="Desvende mistérios e escape antes que o tempo acabe! O primeiro Escape Room de Belém do Pará chegou."
        />
        <meta property="og:url" content="https://lendas-room.vercel.app/" />
        <meta
          property="og:image"
          content="https://lendas-room.vercel.app/og-image.jpg"
        />
      </Helmet>
      <a href="#main-content" className="skip-link">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="main-content">
        <Hero />
        <Suspense fallback={null}>
          <About />
        </Suspense>
        {/* <Suspense fallback={null}>
          <TermoCompromisso />}
          
          </Suspense> */}
        <Suspense fallback={null}>{<Rooms />}</Suspense>
        {/* <Suspense fallback={null}>{<Contact />}</Suspense> */}
        <Suspense fallback={null}>
          <FAQ />
        </Suspense>
        <Suspense fallback={null}>
          <ContactInfo />
        </Suspense>
      </main>
    </>
  );
}

export default App;
