import "./Hero.css";
import backgroundImage from "../../assets/section-one.png";
import arrowIcon from "../../assets/arrow.svg";

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
      />

      <div className="hero__content">
        <h1 className="hero__title">
          O PRIMEIRO{" "}
          <span className="hero__title--highlight">ESCAPE ROOM DE BELÉM</span>{" "}
          ESTÁ CHEGANDO!
        </h1>

        <p className="hero__description">
          Junte seus amigos para uma experiência única. Resolva enigmas,
          descubra pistas e escape antes que o tempo acabe!
        </p>

        <a href="#contact" className="hero__cta">
          Cadastra-se para receber 20% OFF na estréia
        </a>

        <button
          onClick={scrollToContent}
          className="hero__scroll"
          aria-label="Rolar para o conteúdo"
          type="button"
        >
          <img src={arrowIcon} alt="" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
};
