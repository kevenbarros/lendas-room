import "./Hero.css";
import backgroundImage from "../../assets/section-one.png";
import arrowIcon from "../../assets/arrow.svg";
import logoImage from "../../assets/logo.svg";
import { HALLOWEEN } from "../../lib/halloween";
import { Bats, Cobweb, Spider } from "../Halloween";

export const Hero = () => {
  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <section className="hero" aria-label="Seção principal">
      <div className="hero__overlay"></div>
      <img
        src={backgroundImage}
        alt=""
        className="hero__background"
        aria-hidden="true"
        loading="eager"
        decoding="async"
        fetchPriority="high"
      />
      {HALLOWEEN && (
        <div className="hero__halloween">
          <Cobweb corner="tl" size={170} />
          <Cobweb corner="tr" size={130} />
          <Spider left="88%" />
          <Bats
            bats={[
              { top: "22%", size: 30, duration: 17, delay: 1 },
              { top: "34%", size: 20, duration: 23, delay: 7 },
              { top: "16%", size: 16, duration: 27, delay: 13 },
            ]}
          />
        </div>
      )}

      <div className="hero__content">
        <img
          src={logoImage}
          alt="Lendas Escape Room"
          className="hero__logo"
          loading="eager"
          decoding="async"
        />

        <h1 className="hero__title">
          O PRIMEIRO{" "}
          <span className="hero__title--highlight">
            ESCAPE ROOM DE BELÉM DO PARÁ
          </span>{" "}
          CHEGOu!
        </h1>

        <p className="hero__description">
          Junte seus amigos para uma experiência única. Resolva enigmas,
          descubra pistas e escape antes que o tempo acabe!
        </p>

        <a
          href={`https://wa.me/5591999713060?text=${encodeURIComponent(
            "Olá! Gostaria de fazer uma reserva no Lendas Escape Room.",
          )}`}
          className="hero__cta"
          target="_blank"
          rel="noopener noreferrer"
        >
          Faça sua reserva
        </a>

        <button
          onClick={scrollToContent}
          className="hero__scroll"
          aria-label="Rolar para o conteúdo"
          type="button"
        >
          <img
            src={arrowIcon}
            alt=""
            aria-hidden="true"
            loading="eager"
            decoding="async"
          />
        </button>
      </div>
    </section>
  );
};
