import { useState, useMemo, type FormEvent } from "react";
import { Helmet } from "../../lib/helmet";
import { sendMatchFormToGoogleSheets } from "../../services/googleSheets";
import {
  QUESTIONS,
  PERSONA_INFO,
  calculateScores,
  getTop2Personas,
  getComboTitle,
  type Persona,
} from "./personas";
import "./MatchForm.css";

type Step = 1 | 2 | 3 | 4;

const JOGOS_OPTIONS = ["RPG", "FPS", "Jogos de tabuleiro", "MOBA", "Mobile"];
const DIAS_OPTIONS = [
  { value: "semana", label: "Segunda a sexta" },
  { value: "fim", label: "Finais de semana" },
  { value: "ambos", label: "Ambos" },
];
const TURNO_OPTIONS = [
  { value: "manha", label: "Manhã" },
  { value: "tarde", label: "Tarde" },
  { value: "noite", label: "Noite" },
];

export function MatchForm() {
  const [step, setStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [temAmigos, setTemAmigos] = useState(false);
  const [amigos, setAmigos] = useState<string[]>([""]);

  // Step 2 - answers
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // Step 3 - interests & availability
  const [esportes, setEsportes] = useState("");
  const [jogos, setJogos] = useState<string[]>([]);
  const [jogosOutros, setJogosOutros] = useState("");
  const [filmes, setFilmes] = useState("");
  const [hobbies, setHobbies] = useState("");
  const [musica, setMusica] = useState("");
  const [dias, setDias] = useState("");
  const [turnos, setTurnos] = useState<string[]>([]);

  const { top1, top2, titulo } = useMemo(() => {
    if (step < 4) return { top1: null, top2: null, titulo: "" };
    const scores = calculateScores(answers);
    const [t1, t2] = getTop2Personas(scores);
    return {
      top1: t1,
      top2: t2,
      titulo: getComboTitle(t1, t2),
    };
  }, [answers, step]);

  const maskPhone = (raw: string) => {
    let value = raw.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 10) {
      value = value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else if (value.length > 6) {
      value = value.replace(/(\d{2})(\d{4,5})(\d{0,4})/, "($1) $2-$3");
    } else if (value.length > 2) {
      value = value.replace(/(\d{2})(\d+)/, "($1) $2");
    }
    return value;
  };

  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWhatsapp(maskPhone(e.target.value));
  };

  const onlyDigits = (s: string) => s.replace(/\D/g, "");

  const updateAmigo = (index: number, value: string) => {
    setAmigos((prev) =>
      prev.map((v, i) => (i === index ? maskPhone(value) : v)),
    );
  };

  const addAmigo = () => {
    setAmigos((prev) => (prev.length >= 6 ? prev : [...prev, ""]));
  };

  const removeAmigo = (index: number) => {
    setAmigos((prev) =>
      prev.length === 1 ? [""] : prev.filter((_, i) => i !== index),
    );
  };

  const toggleArray = (
    value: string,
    list: string[],
    setter: (v: string[]) => void,
  ) => {
    if (list.includes(value)) setter(list.filter((v) => v !== value));
    else setter([...list, value]);
  };

  const validateStep1 = () => {
    const baseOk =
      nome.trim().length >= 2 &&
      Number(idade) >= 14 &&
      Number(idade) <= 99 &&
      onlyDigits(whatsapp).length >= 10;
    if (!baseOk) return false;
    if (!temAmigos) return true;
    const selfDigits = onlyDigits(whatsapp);
    const normalized = amigos.map((a) => onlyDigits(a)).filter(Boolean);
    if (normalized.length === 0) return false;
    if (normalized.some((d) => d.length < 10)) return false;
    if (normalized.some((d) => d === selfDigits)) return false;
    if (new Set(normalized).size !== normalized.length) return false;
    return true;
  };

  const validateStep2 = () =>
    QUESTIONS.every((q) => answers[q.id] !== undefined);

  const validateStep3 = () => dias !== "" && turnos.length > 0;

  const goNext = () => {
    setError(null);
    if (step === 1 && !validateStep1()) {
      if (temAmigos) {
        setError(
          "Preencha nome, idade (14+), seu WhatsApp e pelo menos um WhatsApp de amigo válido (diferente do seu e sem duplicados).",
        );
      } else {
        setError("Preencha nome, idade (14+) e WhatsApp válido.");
      }
      return;
    }
    if (step === 2 && !validateStep2()) {
      setError("Responda todas as 8 perguntas para continuar.");
      return;
    }
    if (step === 3 && !validateStep3()) {
      setError("Escolha pelo menos um dia e um turno disponíveis.");
      return;
    }
    setStep((s) => Math.min(4, s + 1) as Step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    setError(null);
    setStep((s) => Math.max(1, s - 1) as Step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!top1 || !top2) return;
    setSubmitting(true);
    setError(null);

    try {
      const amigosLimpos = temAmigos
        ? amigos.map((a) => a.trim()).filter((a) => onlyDigits(a).length >= 10)
        : [];
      await sendMatchFormToGoogleSheets({
        nome,
        idade,
        whatsapp,
        respostas: answers,
        esportes,
        jogos,
        jogosOutros,
        filmes,
        hobbies,
        musica,
        dias,
        turnos,
        amigos: amigosLimpos,
        topPersona1: top1,
        topPersona2: top2,
        resultadoTitulo: titulo,
        dataHora: new Date().toLocaleString("pt-BR"),
      });
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      setError("Não foi possível enviar. Tente novamente em instantes.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="match">
        <Helmet>
          <title>Inscrição realizada | Lendas Escape Room</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div className="match__container">
          <div className="match__success">
            <div className="match__success-icon" aria-hidden="true">
              🎉
            </div>
            <h1 className="match__success-title">Você está na lista!</h1>
            <p className="match__success-text">
              Boas-vindas à comunidade, {nome.split(" ")[0]}. Em breve
              entraremos em contato pelo WhatsApp com um grupo de pessoas com
              interesses parecidos com os seus para viverem juntos a experiência
              Lendas.
            </p>
            <div className="match__success-persona">
              <span className="match__success-emojis">
                {top1 && PERSONA_INFO[top1].emoji}
                {top2 && PERSONA_INFO[top2].emoji}
              </span>
              <strong>{titulo}</strong>
            </div>
            <a href="/" className="match__btn match__btn--outline">
              Voltar ao início
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="match">
      <Helmet>
        <title>Encontre seu grupo | Lendas Escape Room</title>
        <meta
          name="description"
          content="Não tem grupo para jogar? Responda o quiz e conectamos você com pessoas de interesses parecidos para viver a experiência Lendas."
        />
      </Helmet>

      <div className="match__container">
        <a href="/" className="match__back" aria-label="Voltar ao início">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
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
          <span>Voltar</span>
        </a>

        <header className="match__header">
          <span className="match__eyebrow">Sem grupo? Sem problema.</span>
          <h1 className="match__title">
            ENCONTRE SEU <span className="match__title--accent">GRUPO</span>
          </h1>
          <p className="match__subtitle">
            Responda o quiz e conectamos você com pessoas de interesses e
            estilos parecidos para viver juntos a experiência Lendas.
          </p>
        </header>

        <div className="match__progress" aria-label="Progresso do formulário">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className={`match__progress-step ${
                step >= (n as Step) ? "is-active" : ""
              } ${step === (n as Step) ? "is-current" : ""}`}
            >
              <span className="match__progress-num">{n}</span>
              <span className="match__progress-label">
                {n === 1 && "Dados"}
                {n === 2 && "Perfil"}
                {n === 3 && "Interesses"}
                {n === 4 && "Resultado"}
              </span>
            </div>
          ))}
        </div>

        <form
          className="match__form"
          onSubmit={step === 4 ? handleSubmit : (e) => e.preventDefault()}
        >
          {step === 1 && (
            <fieldset className="match__step">
              <legend className="match__step-title">Dados básicos</legend>

              <div className="match__field">
                <label htmlFor="nome">Nome completo</label>
                <input
                  id="nome"
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Seu nome"
                  autoComplete="name"
                />
              </div>

              <div className="match__row">
                <div className="match__field">
                  <label htmlFor="idade">Idade</label>
                  <input
                    id="idade"
                    type="number"
                    min={14}
                    max={99}
                    value={idade}
                    onChange={(e) => setIdade(e.target.value)}
                    placeholder="18"
                  />
                </div>

                <div className="match__field">
                  <label htmlFor="whatsapp">WhatsApp</label>
                  <input
                    id="whatsapp"
                    type="tel"
                    value={whatsapp}
                    onChange={handleWhatsappChange}
                    placeholder="(91) 9 9999-9999"
                    autoComplete="tel"
                  />
                </div>
              </div>

              <div className="match__friends">
                <label className="match__friends-toggle">
                  <input
                    type="checkbox"
                    checked={temAmigos}
                    onChange={(e) => setTemAmigos(e.target.checked)}
                  />
                  <span>
                    Já tenho amigo(s) e queremos jogar com mais pessoas
                  </span>
                </label>

                {temAmigos && (
                  <div className="match__friends-box">
                    <p className="match__friends-note">
                      ⚠️ Seus amigos{" "}
                      <strong>precisam preencher este mesmo formulário</strong>{" "}
                      para entrarem no match. Use o número de WhatsApp que eles
                      vão cadastrar aqui — é assim que a gente garante que vocês
                      ficarão no mesmo grupo. Você pode incluir até 6 amigos.
                    </p>

                    {amigos.map((amigo, i) => (
                      <div key={i} className="match__friends-row">
                        <div className="match__field">
                          <label htmlFor={`amigo-${i}`}>
                            WhatsApp do amigo {i + 1}
                          </label>
                          <input
                            id={`amigo-${i}`}
                            type="tel"
                            value={amigo}
                            onChange={(e) => updateAmigo(i, e.target.value)}
                            placeholder="(91) 9 9999-9999"
                          />
                        </div>
                        {amigos.length > 1 && (
                          <button
                            type="button"
                            className="match__friends-remove"
                            onClick={() => removeAmigo(i)}
                            aria-label={`Remover amigo ${i + 1}`}
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}

                    {amigos.length < 6 && (
                      <button
                        type="button"
                        className="match__friends-add"
                        onClick={addAmigo}
                      >
                        + Adicionar outro amigo
                      </button>
                    )}
                  </div>
                )}
              </div>
            </fieldset>
          )}

          {step === 2 && (
            <fieldset className="match__step">
              <legend className="match__step-title">Seu estilo no jogo</legend>
              <p className="match__step-note">
                Não existe resposta certa ou errada — o sistema identifica seu
                perfil automaticamente.
              </p>

              {QUESTIONS.map((q, idx) => (
                <div key={q.id} className="match__question">
                  <h3 className="match__question-title">
                    {idx + 1}. {q.title}
                  </h3>
                  <p className="match__question-context">{q.context}</p>
                  <div className="match__options">
                    {q.options.map((opt) => (
                      <label
                        key={opt.value}
                        className={`match__option ${
                          answers[q.id] === opt.value ? "is-selected" : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name={q.id}
                          value={opt.value}
                          checked={answers[q.id] === opt.value}
                          onChange={() =>
                            setAnswers({ ...answers, [q.id]: opt.value })
                          }
                        />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </fieldset>
          )}

          {step === 3 && (
            <fieldset className="match__step">
              <legend className="match__step-title">
                Interesses e disponibilidade
              </legend>

              <div className="match__field">
                <label htmlFor="esportes">Esportes que curte</label>
                <input
                  id="esportes"
                  type="text"
                  value={esportes}
                  onChange={(e) => setEsportes(e.target.value)}
                  placeholder="Ex.: futebol, vôlei, skate..."
                />
              </div>

              <div className="match__field">
                <span className="match__field-label">Jogos que joga</span>
                <div className="match__checkgroup">
                  {JOGOS_OPTIONS.map((j) => (
                    <label
                      key={j}
                      className={`match__check ${
                        jogos.includes(j) ? "is-selected" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={jogos.includes(j)}
                        onChange={() => toggleArray(j, jogos, setJogos)}
                      />
                      <span>{j}</span>
                    </label>
                  ))}
                </div>
                <input
                  type="text"
                  value={jogosOutros}
                  onChange={(e) => setJogosOutros(e.target.value)}
                  placeholder="Outros (opcional)"
                  className="match__inline-input"
                />
              </div>

              <div className="match__field">
                <label htmlFor="filmes">Filmes e séries favoritos</label>
                <input
                  id="filmes"
                  type="text"
                  value={filmes}
                  onChange={(e) => setFilmes(e.target.value)}
                  placeholder="Ex.: Stranger Things, Senhor dos Anéis..."
                />
              </div>

              <div className="match__field">
                <label htmlFor="hobbies">Hobbies</label>
                <input
                  id="hobbies"
                  type="text"
                  value={hobbies}
                  onChange={(e) => setHobbies(e.target.value)}
                  placeholder="Ex.: desenhar, cozinhar, pedalar..."
                />
              </div>

              <div className="match__field">
                <label htmlFor="musica">Música</label>
                <input
                  id="musica"
                  type="text"
                  value={musica}
                  onChange={(e) => setMusica(e.target.value)}
                  placeholder="Ex.: rock, funk, MPB..."
                />
              </div>

              <div className="match__field">
                <span className="match__field-label">Dias disponíveis</span>
                <div className="match__checkgroup">
                  {DIAS_OPTIONS.map((d) => (
                    <label
                      key={d.value}
                      className={`match__check ${
                        dias === d.value ? "is-selected" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="dias"
                        value={d.value}
                        checked={dias === d.value}
                        onChange={(e) => setDias(e.target.value)}
                      />
                      <span>{d.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="match__field">
                <span className="match__field-label">Turnos que prefere</span>
                <div className="match__checkgroup">
                  {TURNO_OPTIONS.map((t) => (
                    <label
                      key={t.value}
                      className={`match__check ${
                        turnos.includes(t.value) ? "is-selected" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={turnos.includes(t.value)}
                        onChange={() => toggleArray(t.value, turnos, setTurnos)}
                      />
                      <span>{t.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </fieldset>
          )}

          {step === 4 && top1 && top2 && (
            <fieldset className="match__step match__step--result">
              <legend className="match__step-title">Seu perfil</legend>

              <div className="match__result-card">
                <span className="match__result-label">Você é</span>
                <div className="match__result-emojis" aria-hidden="true">
                  {PERSONA_INFO[top1].emoji}
                  {PERSONA_INFO[top2].emoji}
                </div>
                <h2 className="match__result-title">{titulo}</h2>

                <div className="match__result-personas">
                  <PersonaCard persona={top1} />
                  <PersonaCard persona={top2} />
                </div>

                <p className="match__result-text">
                  Agora é só confirmar! Vamos cruzar seu perfil com outras
                  pessoas e montar um grupo compatível para viverem juntos uma
                  experiência Lendas.
                </p>
              </div>
            </fieldset>
          )}

          {error && <div className="match__error">{error}</div>}

          <div className="match__actions">
            {step > 1 && (
              <button
                type="button"
                onClick={goBack}
                className="match__btn match__btn--outline"
                disabled={submitting}
              >
                Voltar
              </button>
            )}
            {step < 4 && (
              <button
                type="button"
                onClick={goNext}
                className="match__btn match__btn--primary"
              >
                Continuar
              </button>
            )}
            {step === 4 && (
              <button
                type="submit"
                className="match__btn match__btn--primary"
                disabled={submitting}
              >
                {submitting ? "Enviando..." : "Entrar na lista"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

function PersonaCard({ persona }: { persona: Persona }) {
  const info = PERSONA_INFO[persona];
  return (
    <div className="match__persona-card">
      <span className="match__persona-emoji" aria-hidden="true">
        {info.emoji}
      </span>
      <div>
        <strong>{info.short}</strong>
        <p>{info.desc}</p>
      </div>
    </div>
  );
}
