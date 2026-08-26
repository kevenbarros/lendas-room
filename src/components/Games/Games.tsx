import "./Games.css";

/** Hub de minigames — projeto separado, publicado em domínio próprio. */
const GAMES_URL = "https://lendas-games-beryl.vercel.app";
const GAMES_HOST = "lendas-games-beryl.vercel.app";

const ArrowIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M5 12h14M13 5l7 7-7 7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface Game {
  emoji: string;
  title: string;
  description: string;
  meta: string;
  /** Rota dentro do hub. Ausente = ainda não lançado. */
  path?: string;
}

const GAMES: Game[] = [
  {
    emoji: "🕵️",
    title: "Jogo do Impostor",
    description:
      "Todos recebem a mesma palavra secreta — menos o impostor. Dê dicas e descubra quem está blefando.",
    meta: "3+ jogadores · 5–15 min",
    path: "/impostor",
  },
  {
    emoji: "❓",
    title: "Quem Sou Eu?",
    description:
      "Você recebe um personagem que só os outros enxergam. Pergunte sim ou não até descobrir quem é.",
    meta: "2+ jogadores · 10 min",
    path: "/quem-sou-eu",
  },
  {
    emoji: "🖼️",
    title: "Pixel",
    description:
      "A foto de um famoso abre em quatro quadrados. Quem reconhece primeiro leva mais ponto.",
    meta: "2+ jogadores · 10 min",
    path: "/pixel",
  },
  {
    emoji: "🧩",
    title: "Enigma Relâmpago",
    description:
      "Charadas cronometradas no estilo escape room. Resolva antes do tempo acabar.",
    meta: "1+ jogador · 5 min",
  },
];

const GameRow = ({ game, index }: { game: Game; index: number }) => {
  const number = String(index + 1).padStart(2, "0");

  const body = (
    <>
      <span className="games__row-index" aria-hidden="true">
        {number}
      </span>
      <span className="games__row-emoji" aria-hidden="true">
        {game.emoji}
      </span>
      <span className="games__row-body">
        <span className="games__row-title">{game.title}</span>
        <span className="games__row-description">{game.description}</span>
        <span className="games__row-meta">{game.meta}</span>
      </span>
    </>
  );

  if (!game.path) {
    return (
      <li className="games__item">
        <div className="games__row games__row--soon">
          {body}
          <span className="games__row-badge">Em breve</span>
        </div>
      </li>
    );
  }

  return (
    <li className="games__item">
      <a
        className="games__row"
        href={`${GAMES_URL}${game.path}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {body}
        <span className="games__row-arrow" aria-hidden="true">
          <ArrowIcon />
        </span>
        <span className="visually-hidden">— jogar, abre em nova aba</span>
      </a>
    </li>
  );
};

export const Games = () => {
  return (
    <section id="games" className="games" aria-labelledby="games-title">
      <div className="games__container">
        <div className="games__pitch">
          <span className="games__eyebrow">Grátis · No seu celular</span>

          <h2 id="games-title" className="games__title">
            Lendas <span className="games__title--accent">Games</span>
          </h2>

          <p className="games__text">
            Enquanto a sala não abre, o jogo continua. Um cria a sala, os outros
            entram com o código e todo mundo joga da própria tela — sem instalar
            nada e sem criar conta.
          </p>

          <ul className="games__perks">
            <li>Sem instalar</li>
            <li>Sem conta</li>
            <li>De graça</li>
          </ul>

          <a
            className="games__cta"
            href={GAMES_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Abrir o Lendas Games
            <ArrowIcon />
            <span className="visually-hidden">(abre em nova aba)</span>
          </a>
        </div>

        <div className="games__screen">
          <div className="games__screen-bar" aria-hidden="true">
            <span className="games__screen-dots">
              <i />
              <i />
              <i />
            </span>
            <span className="games__screen-url">{GAMES_HOST}</span>
          </div>

          <ul className="games__list">
            {GAMES.map((game, i) => (
              <GameRow key={game.title} game={game} index={i} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
