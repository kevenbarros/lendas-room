import { useEffect, useState } from 'react';
import './RankingHome.css';
import {
  fetchRanking,
  fetchRankingRoom,
  formatGameTime,
  GENERAL_SEASON,
  type RankingEntry,
} from '../../lib/ranking';
import { HALLOWEEN } from '../../lib/halloween';
import { SeasonCountdown } from './SeasonCountdown';
import { Bats, Clouds, Cobweb, Fog, Graveyard, Moon } from '../Halloween';

const MEDALS = HALLOWEEN ? ['🎃', '👻', '💀'] : ['🥇', '🥈', '🥉'];
const TOP_N = 5;

export const RankingHome = () => {
  const [roomId, setRoomId] = useState('');
  const [entries, setEntries] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // O ranking mostra só a sala "o iluminado".
        const room = await fetchRankingRoom();
        if (cancelled) return;
        setRoomId(room?.id ?? '');
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

  useEffect(() => {
    if (!roomId) {
      setEntries([]);
      return;
    }
    let cancelled = false;
    // Na home a contagem é sempre a Geral: todos os tempos já registrados.
    fetchRanking(roomId, GENERAL_SEASON.startDate, GENERAL_SEASON.endDate)
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
  }, [roomId]);

  // Sem dados ainda → não renderiza a seção (evita um bloco vazio na home).
  if (loading || error || !roomId) {
    return null;
  }

  return (
    <section
      id="ranking"
      className={`rankhome ${HALLOWEEN ? 'rankhome--halloween' : ''}`}
      aria-labelledby="rankhome-title"
    >
      <div className="rankhome__glow" aria-hidden />
      {HALLOWEEN && (
        <>
          <Clouds />
          <Moon />
          <Clouds layer="front" />
          <Cobweb corner="tl" />
          <Cobweb corner="tr" size={110} />
          <Bats />
          <Fog />
          <Graveyard />
        </>
      )}
      <div className="rankhome__container">
        <header className="rankhome__head">
          <span className="rankhome__eyebrow">
            {HALLOWEEN ? '🎃 Ranking de Halloween' : '🏆 Ranking'}
          </span>
          <h2 id="rankhome-title" className="rankhome__title">
            {HALLOWEEN ? (
              <>
                As equipes mais <span>assombrosas</span>
              </>
            ) : (
              <>
                As equipes mais <span>rápidas</span>
              </>
            )}
          </h2>
          <p className="rankhome__subtitle">
            {HALLOWEEN
              ? 'Quanto menor o tempo de jogo, melhor a colocação. Escapem antes que as almas peguem vocês!'
              : 'Quanto menor o tempo de jogo, melhor a colocação. Será que vocês chegam ao topo?'}
          </p>
          <SeasonCountdown />
        </header>

        {entries.length === 0 ? (
          <p className="rankhome__empty">
            {HALLOWEEN
              ? 'Nenhuma alma escapou ainda. Seja a primeira equipe! 👻'
              : 'Nenhum tempo registrado ainda. Seja a primeira equipe! 🚀'}
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
