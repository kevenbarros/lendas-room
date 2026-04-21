import "./Conectadas.css";

const PERSONAS = [
  { emoji: "👑", label: "Líder" },
  { emoji: "🧠", label: "Estratégico" },
  { emoji: "🔍", label: "Investigador" },
  { emoji: "⚡", label: "Executor" },
  { emoji: "🗣️", label: "Comunicador" },
  { emoji: "😄", label: "Alívio Cômico" },
];

export const Conectadas = () => {
  return (
    <section
      id="conectadas"
      className="conectadas"
      aria-labelledby="conectadas-title"
    >
      <div className="conectadas__container">
        <div className="conectadas__visual" aria-hidden="true">
          <div className="conectadas__ring">
            {PERSONAS.map((p, i) => (
              <span
                key={p.label}
                className="conectadas__persona"
                style={{
                  transform: `rotate(${(360 / PERSONAS.length) * i}deg) translateY(-86px) rotate(-${(360 / PERSONAS.length) * i}deg)`,
                }}
                title={p.label}
              >
                {p.emoji}
              </span>
            ))}
            <div className="conectadas__ring-core">
              <span>✨</span>
            </div>
          </div>
        </div>

        <div className="conectadas__content">
          <span className="conectadas__eyebrow">Novo · Matchmaking</span>
          <h2 id="conectadas-title" className="conectadas__title">
            Lendas <span className="conectadas__title--accent">Conectadas</span>
          </h2>
          <p className="conectadas__text">
            Vir sozinho não é problema — a gente acha sua tribo. Responda um
            quiz rápido, a gente identifica seu perfil de jogador e te conecta
            com pessoas de estilo e interesses parecidos para jogar junto.
          </p>

          <ol className="conectadas__steps">
            <li>
              <strong>1.</strong> Responda o quiz
            </li>
            <li>
              <strong>2.</strong> A gente monta o grupo
            </li>
            <li>
              <strong>3.</strong> Vocês vêm jogar
            </li>
          </ol>

          <a href="/conectar" className="conectadas__cta">
            Quero encontrar meu grupo
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
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
          </a>
        </div>
      </div>
    </section>
  );
};
