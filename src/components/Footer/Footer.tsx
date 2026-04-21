import "./Footer.css";
import logoIcon from "../../assets/logo.svg";

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__container">
        <div className="footer__brand">
          <a href="/" aria-label="Lendas Escape Room">
            <img
              src={logoIcon}
              alt="Lendas Escape Room"
              className="footer__logo"
            />
          </a>
          <p className="footer__tagline">
            O primeiro Escape Room de Belém do Pará.
          </p>
        </div>

        <nav className="footer__nav" aria-label="Links do rodapé">
          <a href="#about" className="footer__link">
            Sobre
          </a>
          <a href="#rooms" className="footer__link">
            Salas
          </a>
          <a href="#faq" className="footer__link">
            FAQ
          </a>
          <a href="#contact-info" className="footer__link">
            Contato
          </a>
          <a href="/conectar" className="footer__link">
            Encontrar grupo
          </a>
          <a href="/termo-de-compromisso" className="footer__link">
            Termo de compromisso
          </a>
        </nav>
      </div>

      <div className="footer__bottom">
        <small>© {year} Lendas Escape Room. Todos os direitos reservados.</small>
      </div>
    </footer>
  );
};
