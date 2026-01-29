import { useState, useEffect } from "react";
import "./Header.css";
import logoIcon from "../../assets/logo.svg";

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`header ${isScrolled ? "header--scrolled" : ""}`}
      role="banner"
    >
      <div className="header__container">
        {/* Logo */}
        <a
          href="/"
          className="header__logo"
          aria-label="Lendas Escape Room - Página inicial"
        >
          <img
            src={logoIcon}
            alt="Lendas Escape Room logo"
            className="header__logo-icon"
            // width="40"
            // height="40"
          />
        </a>

        {/* Desktop Navigation */}
        <nav className="header__nav" aria-label="Navegação principal">
          <ul className="header__nav-list">
            <li className="header__nav-item">
              <a href="#about" className="header__nav-link">
                O que é Escape room?
              </a>
            </li>
            <li className="header__nav-item">
              <a href="#rooms" className="header__nav-link">
                Salas
              </a>
            </li>
            <li className="header__nav-item">
              <a href="#contact" className="header__nav-link">
                Promoção
              </a>
            </li>
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="header__menu-toggle"
          aria-label="Abrir menu de navegação"
          aria-expanded={isMobileMenuOpen}
          onClick={toggleMobileMenu}
          type="button"
        >
          <span className="header__menu-icon"></span>
          <span className="header__menu-icon"></span>
          <span className="header__menu-icon"></span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          <div
            className="header__overlay"
            onClick={closeMobileMenu}
            aria-hidden="true"
          ></div>
          <nav
            className="header__mobile-nav"
            aria-label="Menu de navegação mobile"
          >
            <button
              className="header__mobile-close"
              onClick={closeMobileMenu}
              aria-label="Fechar menu"
              type="button"
            >
              <svg
                width="16"
                height="16"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M14.364.222l1.414 1.414L9.414 8l6.364 6.364-1.414 1.414L8 9.414l-6.364 6.364-1.414-1.414L6.586 8 .222 1.636 1.636.222 8 6.586 14.364.222z"
                  fill="currentColor"
                  fillRule="evenodd"
                />
              </svg>
            </button>
            <ul className="header__mobile-list">
              <li className="header__mobile-item">
                <a
                  href="#about"
                  className="header__mobile-link"
                  onClick={closeMobileMenu}
                >
                  O que é Escape room?
                </a>
              </li>
              <li className="header__mobile-item">
                <a
                  href="#rooms"
                  className="header__mobile-link"
                  onClick={closeMobileMenu}
                >
                  Salas
                </a>
              </li>
              <li className="header__mobile-item">
                <a
                  href="#contact"
                  className="header__mobile-link"
                  onClick={closeMobileMenu}
                >
                  Promoção
                </a>
              </li>
            </ul>
          </nav>
        </>
      )}
    </header>
  );
};
