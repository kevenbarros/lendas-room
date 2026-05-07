import { useEffect, useState } from "react";
import { Helmet } from "../../lib/helmet";
import lendasImg from "../../assets/lendas.png";
import {
  fetchEnigmaCompletions,
  type EnigmaCompletion,
} from "../../services/googleSheets";
import "./Enigma.css";

function formatWinnerDate(raw: string): string {
  if (!raw) return "";
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  return d.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
}

const LOADING_STEPS = [
  "estabelecendo conexão segura",
  "autenticando credenciais",
  "verificando integridade do arquivo",
  "descriptografando conteúdo",
  "acesso autorizado",
];

const STEP_DELAY_MS = 1400;

export function Enigma() {
  const [winners, setWinners] = useState<EnigmaCompletion[]>([]);
  const [booting, setBooting] = useState(true);
  const [bootStage, setBootStage] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetchEnigmaCompletions().then((res) => {
      if (cancelled) return;
      if (res.success && res.data && res.data.length > 0) {
        setWinners(res.data);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const timers: number[] = [];
    for (let i = 1; i <= LOADING_STEPS.length; i++) {
      timers.push(window.setTimeout(() => setBootStage(i), STEP_DELAY_MS * i));
    }
    timers.push(
      window.setTimeout(
        () => setBooting(false),
        STEP_DELAY_MS * LOADING_STEPS.length + 500,
      ),
    );
    return () => timers.forEach((t) => clearTimeout(t));
  }, []);

  const containerStyle = { backgroundImage: `url(${lendasImg})` };

  const BackLink = (
    <a href="/" className="enigma-back" aria-label="Voltar ao início">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M19 12H5M12 19l-7-7 7-7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>voltar</span>
    </a>
  );

  if (booting) {
    const progress = Math.round((bootStage / LOADING_STEPS.length) * 100);
    return (
      <div className="enigma-container" style={containerStyle}>
        <Helmet>
          <title>Carregando… | Lendas Escape Room</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        {BackLink}

        <div className="enigma-center">
          <div className="enigma-boot" role="status" aria-live="polite">
            <div className="enigma-boot__header">
              <span className="enigma-boot__dot enigma-boot__dot--r" />
              <span className="enigma-boot__dot enigma-boot__dot--y" />
              <span className="enigma-boot__dot enigma-boot__dot--g" />
              <span className="enigma-boot__title">
                lendas · secure terminal
              </span>
              <span className="enigma-boot__lock" aria-hidden="true">
                🔒
              </span>
            </div>

            <div className="enigma-boot__banner">
              <span>// arquivo confidencial</span>
              <span className="enigma-boot__code">#LND-001</span>
            </div>

            <ul className="enigma-boot__list">
              {LOADING_STEPS.map((text, i) => {
                const active = bootStage === i;
                const done = bootStage > i;
                return (
                  <li
                    key={i}
                    className={
                      done
                        ? "enigma-boot__step enigma-boot__step--done"
                        : active
                          ? "enigma-boot__step enigma-boot__step--active"
                          : "enigma-boot__step"
                    }
                  >
                    <span className="enigma-boot__prompt">$</span>
                    <span className="enigma-boot__text">{text}</span>
                    <span className="enigma-boot__status">
                      {done ? "[ok]" : active ? "…" : ""}
                    </span>
                  </li>
                );
              })}
            </ul>

            <div
              className="enigma-boot__bar"
              aria-label={`carregando ${progress}%`}
            >
              <div
                className="enigma-boot__bar-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="enigma-boot__percent">
              {progress.toString().padStart(3, "0")}% ·
              <span className="enigma-boot__cursor" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="enigma-container" style={containerStyle}>
      <Helmet>
        <title>Enigma decifrado | Lendas Escape Room</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {BackLink}

      <div className="enigma-center">
        <div className="enigma-panel enigma-panel--solved">
          <div className="enigma-seal" aria-hidden="true">
            <span className="enigma-seal__line" />
            <span className="enigma-seal__text">caso encerrado</span>
            <span className="enigma-seal__line" />
          </div>

          <p className="enigma-eyebrow">// enigma decifrado</p>

          <p className="enigma-solved-lede">
            {winners.length > 1
              ? "o enigma já foi descoberto por:"
              : "o enigma já foi descoberto por"}
          </p>

          {winners.length > 0 ? (
            <ul className="enigma-winners">
              {winners.map((w, i) => (
                <li key={`${w.nome}-${i}`} className="enigma-winners__item">
                  <span className="enigma-solved-name">{w.nome}</span>
                  {w.timestamp && (
                    <span className="enigma-solved-date">
                      em {formatWinnerDate(w.timestamp)}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="enigma-solved-name">—</p>
          )}

          <a href="/" className="enigma-submit enigma-submit--link">
            voltar ao início
          </a>
        </div>
      </div>
    </div>
  );
}
