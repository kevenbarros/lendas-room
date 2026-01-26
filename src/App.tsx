import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { About as AboutSSR } from "./components/About";
import { Rooms as RoomsSSR } from "./components/Rooms";
import { Contact as ContactSSR } from "./components/Contact";
import "./App.css";
import { Helmet } from "./lib/helmet";
import { lazy, Suspense } from "react";

const About = import.meta.env.SSR
  ? AboutSSR
  : lazy(() =>
      import("./components/About").then((m) => ({ default: m.About })),
    );
const Rooms = import.meta.env.SSR
  ? RoomsSSR
  : lazy(() =>
      import("./components/Rooms").then((m) => ({ default: m.Rooms })),
    );
const Contact = import.meta.env.SSR
  ? ContactSSR
  : lazy(() =>
      import("./components/Contact").then((m) => ({ default: m.Contact })),
    );

function App() {
  return (
    <>
      <Helmet>
        <title>Lendas Escape Room | Salas Temáticas e Promoções</title>
        <meta
          name="description"
          content="Escape room com salas temáticas e desafios únicos. Reserve sua experiência hoje!"
        />
        <link rel="canonical" href="https://lendas-escape-room.example/" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Lendas Escape Room — Salas Temáticas e Promoções"
        />
        <meta
          property="og:description"
          content="Escape room com salas temáticas e desafios únicos. Reserve sua experiência hoje!"
        />
        <meta property="og:url" content="https://lendas-escape-room.example/" />
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
        <Suspense fallback={null}>
          <Rooms />
        </Suspense>
        <Suspense fallback={null}>
          <Contact />
        </Suspense>
      </main>
    </>
  );
}

export default App;
