import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import "./Admin.css";
import {
  fetchMatchData,
  generateMatchLocal,
  type MatchPlayer,
} from "../../services/googleSheets";
import { buildMatchPrompt } from "./promptBuilder";

const AUTH_KEY = "lendas_admin_secret";
const CONNECTED_KEY = "lendas_connected_players";

type FilterMode = "all" | "pending" | "connected";

function loadConnectedSet(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(CONNECTED_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set(arr);
  } catch {
    return new Set();
  }
}

function saveConnectedSet(set: Set<string>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CONNECTED_KEY, JSON.stringify([...set]));
}

export const Admin = () => {
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [players, setPlayers] = useState<MatchPlayer[]>([]);
  const [fetchError, setFetchError] = useState("");
  const [connected, setConnected] = useState<Set<string>>(() =>
    loadConnectedSet(),
  );
  const [filter, setFilter] = useState<FilterMode>("all");

  const [numGroups, setNumGroups] = useState(1);
  const [playersPerGroup, setPlayersPerGroup] = useState(7);
  const [onlyPending, setOnlyPending] = useState(true);

  const [prompt, setPrompt] = useState("");
  const [copied, setCopied] = useState(false);

  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [aiError, setAiError] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.sessionStorage.getItem(AUTH_KEY);
    if (saved) {
      setSecret(saved);
      void loadData(saved);
    }
  }, []);

  const loadData = async (key: string) => {
    setLoading(true);
    setFetchError("");
    try {
      const res = await fetchMatchData(key);
      if (!res.success) {
        setFetchError(res.error || "Erro ao carregar dados.");
        setAuthed(false);
        window.sessionStorage.removeItem(AUTH_KEY);
        return false;
      }
      setPlayers(res.data || []);
      setAuthed(true);
      window.sessionStorage.setItem(AUTH_KEY, key);
      return true;
    } catch {
      setFetchError("Falha de conexão. Tente novamente.");
      setAuthed(false);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError("");
    if (!secret.trim()) {
      setLoginError("Informe a senha.");
      return;
    }
    const ok = await loadData(secret.trim());
    if (!ok) setLoginError("Senha incorreta ou falha ao buscar dados.");
  };

  const handleLogout = () => {
    window.sessionStorage.removeItem(AUTH_KEY);
    setSecret("");
    setAuthed(false);
    setPlayers([]);
    setPrompt("");
    setAiResponse("");
  };

  const toggleConnected = (whatsapp: string) => {
    const next = new Set(connected);
    if (next.has(whatsapp)) next.delete(whatsapp);
    else next.add(whatsapp);
    setConnected(next);
    saveConnectedSet(next);
  };

  const filteredPlayers = useMemo(() => {
    if (filter === "all") return players;
    if (filter === "pending")
      return players.filter((p) => !connected.has(p.whatsapp));
    return players.filter((p) => connected.has(p.whatsapp));
  }, [players, connected, filter]);

  const eligiblePlayers = useMemo(() => {
    return onlyPending
      ? players.filter((p) => !connected.has(p.whatsapp))
      : players;
  }, [players, connected, onlyPending]);

  const totalNeeded = numGroups * playersPerGroup;
  const enough = eligiblePlayers.length >= totalNeeded;

  const handleGeneratePrompt = () => {
    const text = buildMatchPrompt(eligiblePlayers, {
      numGroups,
      playersPerGroup,
    });
    setPrompt(text);
    setCopied(false);
    setTimeout(() => {
      document
        .getElementById("admin-prompt-output")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleGenerateLocal = async () => {
    setAiLoading(true);
    setAiError("");
    setAiResponse("");
    try {
      const res = await generateMatchLocal({
        players: eligiblePlayers,
        numGroups,
        playersPerGroup,
      });
      if (!res.success) {
        setAiError(
          res.error ||
            "Erro ao gerar com IA local. Verifique se o backend e o Ollama estão rodando.",
        );
        return;
      }
      setAiResponse(res.response || "");
      setTimeout(() => {
        document
          .getElementById("admin-ai-output")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    } catch {
      setAiError("Falha de conexão com o backend local.");
    } finally {
      setAiLoading(false);
    }
  };

  const personaDistribution = useMemo(() => {
    const map: Record<string, number> = {};
    for (const p of players) {
      map[p.topPersona1] = (map[p.topPersona1] || 0) + 1;
    }
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [players]);

  const pendingCount = players.filter((p) => !connected.has(p.whatsapp)).length;
  const connectedCount = players.length - pendingCount;

  if (!authed) {
    return (
      <div className="admin admin--login">
        <form className="admin__login-card" onSubmit={handleLogin}>
          <h1>Admin — Lendas</h1>
          <p className="admin__login-hint">
            Informe a senha de administrador para acessar os dados de
            matchmaking.
          </p>
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Senha"
            autoFocus
          />
          {(loginError || fetchError) && (
            <div className="admin__error">{loginError || fetchError}</div>
          )}
          <button type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
          <a href="/" className="admin__back">
            ← voltar ao site
          </a>
        </form>
      </div>
    );
  }

  return (
    <div className="admin">
      <header className="admin__header">
        <div>
          <h1>Admin — Conexões</h1>
          <p className="admin__subtitle">
            {players.length} cadastrado{players.length === 1 ? "" : "s"} ·{" "}
            {pendingCount} pendente{pendingCount === 1 ? "" : "s"} ·{" "}
            {connectedCount} já conectado{connectedCount === 1 ? "" : "s"}
          </p>
        </div>
        <div className="admin__header-actions">
          <button
            type="button"
            className="admin__btn admin__btn--ghost"
            onClick={() => loadData(secret)}
            disabled={loading}
          >
            {loading ? "Atualizando..." : "Atualizar"}
          </button>
          <button
            type="button"
            className="admin__btn admin__btn--ghost"
            onClick={handleLogout}
          >
            Sair
          </button>
        </div>
      </header>

      {fetchError && <div className="admin__error">{fetchError}</div>}

      <section className="admin__panel">
        <h2>Formar grupos com IA</h2>
        <p className="admin__panel-hint">
          Defina quantos grupos e quantos jogadores por grupo. A IA analisa
          personas, interesses e disponibilidade para montar o match ideal.
        </p>

        <div className="admin__controls">
          <label className="admin__field">
            <span>Grupos</span>
            <input
              type="number"
              min={1}
              max={50}
              value={numGroups}
              onChange={(e) =>
                setNumGroups(Math.max(1, Number(e.target.value) || 1))
              }
            />
          </label>
          <label className="admin__field">
            <span>Jogadores por grupo</span>
            <input
              type="number"
              min={2}
              max={20}
              value={playersPerGroup}
              onChange={(e) =>
                setPlayersPerGroup(Math.max(2, Number(e.target.value) || 2))
              }
            />
          </label>
          <label className="admin__checkbox">
            <input
              type="checkbox"
              checked={onlyPending}
              onChange={(e) => setOnlyPending(e.target.checked)}
            />
            <span>Usar apenas jogadores ainda não conectados</span>
          </label>
        </div>

        <div className="admin__summary">
          <strong>{totalNeeded}</strong> jogadores necessários —{" "}
          {eligiblePlayers.length} elegíve
          {eligiblePlayers.length === 1 ? "l" : "is"}
          {!enough && (
            <span className="admin__warn">
              {" "}
              (faltam {totalNeeded - eligiblePlayers.length})
            </span>
          )}
        </div>

        <div className="admin__actions">
          <button
            type="button"
            className="admin__btn admin__btn--primary"
            onClick={handleGenerateLocal}
            disabled={aiLoading || !eligiblePlayers.length}
          >
            {aiLoading ? "Pensando..." : "Gerar com IA local"}
          </button>
          <button
            type="button"
            className="admin__btn admin__btn--ghost"
            onClick={handleGeneratePrompt}
            disabled={!eligiblePlayers.length}
          >
            Gerar prompt (copiar p/ ChatGPT)
          </button>
        </div>

        {aiError && <div className="admin__error">{aiError}</div>}

        {aiResponse && (
          <div id="admin-ai-output" className="admin__result-box">
            <div className="admin__prompt-header">
              <strong>Resultado da IA local</strong>
              <button
                type="button"
                className="admin__btn admin__btn--ghost"
                onClick={() => navigator.clipboard.writeText(aiResponse)}
              >
                Copiar
              </button>
            </div>
            <pre className="admin__result-text">{aiResponse}</pre>
          </div>
        )}

        {prompt && (
          <div id="admin-prompt-output" className="admin__prompt-box">
            <div className="admin__prompt-header">
              <strong>Prompt gerado</strong>
              <button
                type="button"
                className="admin__btn admin__btn--primary"
                onClick={handleCopy}
              >
                {copied ? "Copiado ✓" : "Copiar"}
              </button>
            </div>
            <textarea readOnly value={prompt} rows={18} />
            <p className="admin__prompt-hint">
              Cole este texto em ChatGPT, Claude ou Gemini. A resposta trará os
              grupos prontos.
            </p>
          </div>
        )}
      </section>

      {personaDistribution.length > 0 && (
        <section className="admin__panel">
          <h2>Distribuição de personas</h2>
          <ul className="admin__persona-list">
            {personaDistribution.map(([persona, count]) => (
              <li key={persona}>
                <span>{persona}</span>
                <strong>{count}</strong>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="admin__panel">
        <div className="admin__panel-header">
          <h2>Jogadores</h2>
          <div className="admin__filter">
            <button
              type="button"
              className={filter === "all" ? "active" : ""}
              onClick={() => setFilter("all")}
            >
              Todos ({players.length})
            </button>
            <button
              type="button"
              className={filter === "pending" ? "active" : ""}
              onClick={() => setFilter("pending")}
            >
              Pendentes ({pendingCount})
            </button>
            <button
              type="button"
              className={filter === "connected" ? "active" : ""}
              onClick={() => setFilter("connected")}
            >
              Conectados ({connectedCount})
            </button>
          </div>
        </div>

        {filteredPlayers.length === 0 ? (
          <p className="admin__empty">
            Nenhum jogador nesta visualização. Compartilhe{" "}
            <a href="/conectar">/conectar</a> para captar mais pessoas.
          </p>
        ) : (
          <div className="admin__table-wrap">
            <table className="admin__table">
              <thead>
                <tr>
                  <th>Conectado</th>
                  <th>Nome</th>
                  <th>Idade</th>
                  <th>WhatsApp</th>
                  <th>Persona</th>
                  <th>Título</th>
                  <th>Dias</th>
                  <th>Turnos</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlayers.map((p, i) => {
                  const isConnected = connected.has(p.whatsapp);
                  return (
                    <tr
                      key={`${p.whatsapp}-${i}`}
                      className={isConnected ? "admin__row--connected" : ""}
                    >
                      <td>
                        <input
                          type="checkbox"
                          checked={isConnected}
                          onChange={() => toggleConnected(p.whatsapp)}
                          aria-label={`Marcar ${p.nome} como conectado`}
                        />
                      </td>
                      <td>{p.nome}</td>
                      <td>{p.idade}</td>
                      <td>{p.whatsapp}</td>
                      <td>
                        {p.topPersona1}
                        {p.topPersona2 ? ` + ${p.topPersona2}` : ""}
                      </td>
                      <td>{p.resultadoTitulo}</td>
                      <td>{p.dias}</td>
                      <td>{p.turnos}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};
