import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Rooms } from "./components/Rooms";
import { Contact } from "./components/Contact";
import "./App.css";

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Rooms />
        <Contact />
      </main>
    </>
  );
}

export default App;
