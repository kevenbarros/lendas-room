import { useEffect, useMemo, useState } from 'react';
import './RankingHome.css';
import {
  fetchRanking,
  fetchRooms,
  fetchSeasons,
  formatGameTime,
  type RankingEntry,
  type Room,
  type Season,
} from '../../lib/ranking';

const MEDALS = ['🥇', '🥈', '🥉'];
const TOP_N = 5;

export const RankingHome = () => {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [seasonId, setSeasonId] = useState('');
  const [roomId, setRoomId] = useState('');
  const [entries, setEntries] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [s, r] = await Promise.all([fetchSeasons(), fetchRooms()]);
        if (cancelled) return;
        setSeasons(s);
        setRooms(r);
        const today = new Date().toISOString().slice(0, 10);
        const current = s.find((x) => today >= x.startDate && today <= x.endDate);
        setSeasonId((current ?? s[0])?.id ?? '');
        setRoomId(r[0]?.id ?? '');
      } catch (e) {
        if (!cancelled) setError(true);
        console.error(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const season = useMemo(
    () => seasons.find((s) => s.id === seasonId) ?? null,
    [seasons, seasonId],
  );

  useEffect(() => {
    if (!season || !roomId) {
      setEntries([]);
      return;
    }
    let cancelled = false;
    fetchRanking(roomId, season.startDate, season.endDate)
      .then((rows) => {
        if (!cancelled) setEntries(rows.slice(0, TOP_N));
      })
      .catch((e) => {
        if (!cancelled) setError(true);
        console.error(e);
      });
    return () => {
      cancelled = true;
    };
  }, [season, roomId]);

  // Sem dados ainda → não renderiza a seção (evita um bloco vazio na home).
  if (loading || error || seasons.length === 0 || rooms.length === 0) {
    return null;
  }

  return (
    <section
      id="ranking"
      className="rankhome"
      aria-labelledby="rankhome-title"
    >
      <div className="rankhome__glow" aria-hidden />
      <div className="rankhome__container">
        <header className="rankhome__head">
          <span className="rankhome__eyebrow">🏆 Ranking</span>
          <h2 id="rankhome-title" className="rankhome__title">
            As equipes mais <span>rápidas</span>
          </h2>
          <p className="rankhome__subtitle">
            Quanto menor o tempo de jogo, melhor a colocação.
            Será que vocês chegam ao topo?
          </p>
        </header>

        {rooms.length > 1 && (
          <div className="rankhome__rooms">
            {rooms.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRoomId(r.id)}
                className={`rankhome__room ${r.id === roomId ? 'is-active' : ''}`}
              >
                {r.name}
              </button>
            ))}
          </div>
        )}

        {entries.length === 0 ? (
          <p className="rankhome__empty">
            Nenhum tempo registrado ainda. Seja a primeira equipe! 🚀
          </p>
        ) : (
          <>
            {/* Pódio: ordem visual 2º · 1º · 3º */}
            <div className="rankhome__podium">
              {[1, 0, 2].map((place) => {
                const entry = entries[place];
                if (!entry) return null;
                return (
                  <div
                    key={entry.id}
                    style={{ animationDelay: `${place * 120}ms` }}
                    className={`rankhome__pod rankhome__pod--${place + 1}`}
                  >
                    <span className="rankhome__pod-medal">{MEDALS[place]}</span>
                    <span className="rankhome__pod-team">{entry.teamName}</span>
                    <span className="rankhome__pod-time">
                      {formatGameTime(entry.timeSeconds)}
                    </span>
                    <div className="rankhome__pedestal">
                      {place === 0 && <span className="rankhome__shine" aria-hidden />}
                      <span className="rankhome__pod-rank">{place + 1}º</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Demais colocações */}
            {entries.length > 3 && (
              <ol className="rankhome__list">
                {entries.slice(3).map((entry, i) => (
                  <li
                    key={entry.id}
                    style={{ animationDelay: `${(i + 3) * 90}ms` }}
                    className="rankhome__row"
                  >
                    <span className="rankhome__pos">{i + 4}º</span>
                    <span className="rankhome__team">{entry.teamName}</span>
                    <span className="rankhome__time">
                      {formatGameTime(entry.timeSeconds)}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </>
        )}

        <a href="/ranking" className="rankhome__cta">
          Ver ranking completo
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
    </section>
  );
};

export default RankingHome;
