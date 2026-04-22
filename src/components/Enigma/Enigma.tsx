import { useEffect, useState, type FormEvent } from "react";
import { Helmet } from "../../lib/helmet";
import lendasImg from "../../assets/lendas.png";
import {
  fetchEnigmaCompletions,
  sendEnigmaCompletion,
  type EnigmaCompletion,
} from "../../services/googleSheets";
import "./Enigma.css";

const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkaWNhIjoidGVtIGFsZ28gZXNjb25kaWRvIG5hIGltYWdlbSwgdGVudGUgZGVzY29icmlyISEhIiwiaW1nIjoiaHR0cDovL2xvY2FsaG9zdDo1MTczL2ltZy1lbmlnbWEifQ.rnkaqom_QzmW87GwjWS4G4og2Ea-ElTuuk9MrpSPFQc";

const ENIGMA_SENHA = (import.meta.env.VITE_ENIGMA_SENHA || "").trim();

type Step = "token" | "form" | "success";

function isFullName(value: string): boolean {
  const parts = value
    .trim()
    .split(/\s+/)
    .filter((w) => w.length >= 2);
  return parts.length >= 2;
}

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
  const [winner, setWinner] = useState<EnigmaCompletion | null>(null);
  const [booting, setBooting] = useState(true);
  const [bootStage, setBootStage] = useState(0);

  const [step, setStep] = useState<Step>("token");
  const [senha, setSenha] = useState("");
  const [senhaErro, setSenhaErro] = useState("");
  const [nome, setNome] = useState("");
  const [nomeErro, setNomeErro] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchEnigmaCompletions().then((res) => {
      if (cancelled) return;
      if (res.success && res.data && res.data.length > 0) {
        setWinner(res.data[0]);
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

  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length > 11) v = v.slice(0, 11);
    if (v.length > 10) {
      v = v.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, "($1) $2-$3");
    } else if (v.length > 6) {
      v = v.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
    } else if (v.length > 2) {
      v = v.replace(/^(\d{2})(\d{0,5}).*/, "($1) $2");
    } else if (v.length > 0) {
      v = v.replace(/^(\d{0,2}).*/, "($1");
    }
    setWhatsapp(v);
  };

  const handleSenhaSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!ENIGMA_SENHA) {
      setSenhaErro("Configuração do enigma ausente.");
      return;
    }
    const provided = senha.trim().toLowerCase();
    const expected = ENIGMA_SENHA.toLowerCase();
    if (provided !== expected) {
      setSenhaErro("Senha incorreta.");
      return;
    }
    setSenhaErro("");
    setStep("form");
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isFullName(nome)) {
      setNomeErro("Informe nome e sobrenome.");
      return;
    }
    if (!whatsapp.trim()) return;
    setNomeErro("");
    setIsSubmitting(true);
    try {
      await sendEnigmaCompletion({
        nome: nome.trim().replace(/\s+/g, " "),
        whatsapp,
      });
      setStep("success");
    } catch {
      alert("Erro ao enviar. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

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

  if (winner) {
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

            <p className="enigma-solved-lede">o enigma já foi descoberto por</p>
            <p className="enigma-solved-name">{winner.nome}</p>

            {winner.timestamp && (
              <p className="enigma-solved-date">
                em {formatWinnerDate(winner.timestamp)}
              </p>
            )}

            <a href="/" className="enigma-submit enigma-submit--link">
              voltar ao início
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="enigma-container" style={containerStyle}>
      <Helmet>
        <title>Enigma | Lendas Escape Room</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {BackLink}

      <div className="enigma-center">
        {step === "token" && (
          <form className="enigma-panel" onSubmit={handleSenhaSubmit}>
            <code className="enigma-token">{TOKEN}</code>
            <input
              type="password"
              className="enigma-input"
              value={senha}
              onChange={(e) => {
                setSenha(e.target.value);
                if (senhaErro) setSenhaErro("");
              }}
              placeholder="senha do enigma"
              autoComplete="off"
              required
            />
            {senhaErro && <p className="enigma-error">{senhaErro}</p>}
            <button type="submit" className="enigma-submit">
              verificar
            </button>
          </form>
        )}

        {step === "form" && (
          <form className="enigma-panel" onSubmit={handleFormSubmit}>
            <p className="enigma-eyebrow">// enigma decifrado</p>
            <input
              type="text"
              className="enigma-input"
              value={nome}
              onChange={(e) => {
                setNome(e.target.value);
                if (nomeErro) setNomeErro("");
              }}
              placeholder="nome e sobrenome"
              required
              maxLength={80}
            />
            {nomeErro && <p className="enigma-error">{nomeErro}</p>}
            <input
              type="tel"
              className="enigma-input"
              value={whatsapp}
              onChange={handleWhatsappChange}
              placeholder="(00) 00000-0000"
              required
              maxLength={16}
            />
            <button
              type="submit"
              className="enigma-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "enviando..." : "registrar"}
            </button>
          </form>
        )}

        {step === "success" && (
          <div className="enigma-panel">
            <p className="enigma-eyebrow">// missão cumprida</p>
            <p className="enigma-success">
              seu nome já está entre os decifradores.
            </p>
            <a href="/" className="enigma-submit enigma-submit--link">
              voltar ao início
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
