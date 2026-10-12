import { useEffect, useState } from 'react';
import './Ranking.css';
import logo from '../../assets/logo.svg';
import {
  fetchRanking,
  fetchRankingRoom,
  formatGameTime,
  GENERAL_SEASON,
  type RankingEntry,
} from '../../lib/ranking';
import { HALLOWEEN } from '../../lib/halloween';
import { SeasonCountdown } from './SeasonCountdown';
import { Bats, Clouds, Cobweb, Fog, Moon, Spider } from '../Halloween';

const MEDALS = HALLOWEEN ? ['🎃', '👻', '💀'] : ['🥇', '🥈', '🥉'];

export function Ranking() {
  const [roomId, setRoomId] = useState('');
  const [entries, setEntries] = useState<RankingEntry[]>([]);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [loadingRank, setLoadingRank] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // O ranking mostra só a sala "o iluminado".
        const room = await fetchRankingRoom();
        if (cancelled) return;
        setRoomId(room?.id ?? '');
      } catch (e) {
        if (!cancelled) setError('Não foi possível carregar o ranking agora.');
        console.error(e);
      } finally {
        if (!cancelled) setLoadingMeta(false);
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
    setLoadingRank(true);
    // O ranking é sempre o Geral: todos os tempos já registrados.
    fetchRanking(roomId, GENERAL_SEASON.startDate, GENERAL_SEASON.endDate)
      .then((rows) => {
        if (!cancelled) setEntries(rows);
      })
      .catch((e) => {
        if (!cancelled) setError('Não foi possível carregar o ranking agora.');
        console.error(e);
      })
      .finally(() => {
        if (!cancelled) setLoadingRank(false);
      });
    return () => {
      cancelled = true;
    };
  }, [roomId]);

  return (
    <div className={`ranking ${HALLOWEEN ? 'ranking--halloween' : ''}`}>
      <div className="ranking__glow ranking__glow--coral" aria-hidden />
      <div className="ranking__glow ranking__glow--gold" aria-hidden />
      {HALLOWEEN && (
        <>
          <Clouds />
          <Moon />
          <Clouds layer="front" />
          <Cobweb corner="tl" size={180} />
          <Cobweb corner="tr" size={150} />
          <Spider left="82%" />
          <Bats />
          <Fog />
        </>
      )}

      <header className="ranking__header">
        <a href="/" className="ranking__back">
          ← Voltar ao site
        </a>
        <img src={logo} alt="Lendas Escape Room" className="ranking__logo" />
      </header>

      <div className="ranking__hero">
        <p className="ranking__eyebrow">
          {HALLOWEEN ? '🎃 Edição de Halloween 🎃' : 'Lendas Escape Room'}
        </p>
        <h1 className="ranking__title">
          Ranking <span>Geral</span>
        </h1>
        <p className="ranking__subtitle">
          {HALLOWEEN
            ? 'Os tempos mais rápidos da sala O Iluminado. Escapem antes que as almas peguem vocês!'
            : 'Os tempos mais rápidos da sala O Iluminado. Será que sua equipe chega ao topo?'}
        </p>
        <SeasonCountdown size="lg" />
      </div>

      {loadingMeta ? (
        <p className="ranking__msg">Carregando ranking…</p>
      ) : error ? (
        <p className="ranking__msg">{error}</p>
      ) : !roomId ? (
        <p className="ranking__msg">O ranking estará disponível em breve. 🏆</p>
      ) : (
        <>
          {loadingRank ? (
            <p className="ranking__msg">Carregando tempos…</p>
          ) : entries.length === 0 ? (
            <p className="ranking__msg">
              {HALLOWEEN
                ? 'Nenhuma alma escapou ainda. Seja a primeira equipe! 👻'
                : 'Nenhum tempo registrado ainda. Seja a primeira equipe! 🚀'}
            </p>
          ) : (
            <>
              {/* Pódio: ordem visual 2º · 1º · 3º */}
              <div className="ranking__podium">
                {[1, 0, 2].map((place) => {
                  const entry = entries[place];
                  if (!entry) return null;
                  return (
                    <div
                      key={entry.id}
                      className={`ranking__pod ranking__pod--${place + 1}`}
                    >
                      <div className="ranking__pod-card">
                        <span className="ranking__pod-medal">{MEDALS[place]}</span>
                        <span className="ranking__pod-team">{entry.teamName}</span>
                        {entry.members.length > 0 && (
                          <span className="ranking__pod-members">
                            {entry.members.map((m, j) => (
                              <span key={j} className="ranking__member">
                                {m.instagram ? (
                                  <a
                                    href={`https://instagram.com/${m.instagram}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    @{m.instagram}
                                  </a>
                                ) : (
                                  m.name
                                )}
                              </span>
                            ))}
                          </span>
                        )}
                        <span className="ranking__pod-time">
                          {formatGameTime(entry.timeSeconds)}
                        </span>
                      </div>
                      <div className="ranking__pedestal">
                        {place === 0 && (
                          <span className="ranking__shine" aria-hidden />
                        )}
                        <span className="ranking__pod-rank">{place + 1}º</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Demais colocações */}
              {entries.length > 3 && (
                <>
                <div className="ranking__list-head" aria-hidden>
                  <span className="ranking__list-head-pos">#</span>
                  <span className="ranking__list-head-team">Equipe</span>
                  <span className="ranking__list-head-time">Tempo de jogo</span>
                </div>
                <ol className="ranking__list">
                  {entries.slice(3).map((entry, i) => (
                    <li key={entry.id} className="ranking__row">
                      <span className="ranking__pos">{i + 4}º</span>
                      <div className="ranking__team">
                        <span className="ranking__teamname">{entry.teamName}</span>
                        {entry.members.length > 0 && (
                          <span className="ranking__members">
                            {entry.members.map((m, j) => (
                              <span key={j} className="ranking__member">
                                {m.instagram ? (
                                  <a
                                    href={`https://instagram.com/${m.instagram}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    @{m.instagram}
                                  </a>
                                ) : (
                                  m.name
                                )}
                              </span>
                            ))}
                          </span>
                        )}
                      </div>
                      <span className="ranking__time">
                        {formatGameTime(entry.timeSeconds)}
                      </span>
                    </li>
                  ))}
                </ol>
                </>
              )}
            </>
          )}
        </>
      )}

      <footer className="ranking__footer">Lendas Escape Room · Belém — PA</footer>
    </div>
  );
}

export default Ranking;
