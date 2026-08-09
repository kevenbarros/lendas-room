import { useEffect, useMemo, useState } from 'react';
import './Ranking.css';
import logo from '../../assets/logo.svg';
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

export function Ranking() {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [seasonId, setSeasonId] = useState('');
  const [roomId, setRoomId] = useState('');
  const [entries, setEntries] = useState<RankingEntry[]>([]);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [loadingRank, setLoadingRank] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setLoadingRank(true);
    fetchRanking(roomId, season.startDate, season.endDate)
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
  }, [season, roomId]);

  return (
    <div className="ranking">
      <div className="ranking__glow ranking__glow--coral" aria-hidden />
      <div className="ranking__glow ranking__glow--gold" aria-hidden />

      <header className="ranking__header">
        <a href="/" className="ranking__back">
          ← Voltar ao site
        </a>
        <img src={logo} alt="Lendas Escape Room" className="ranking__logo" />
      </header>

      <div className="ranking__hero">
        <p className="ranking__eyebrow">Lendas Escape Room</p>
        <h1 className="ranking__title">
          Ranking da <span>Temporada</span>
        </h1>
        <p className="ranking__subtitle">
          Os tempos mais rápidos de cada sala. Será que sua equipe chega ao topo?
        </p>
      </div>

      {loadingMeta ? (
        <p className="ranking__msg">Carregando ranking…</p>
      ) : error ? (
        <p className="ranking__msg">{error}</p>
      ) : seasons.length === 0 || rooms.length === 0 ? (
        <p className="ranking__msg">O ranking estará disponível em breve. 🏆</p>
      ) : (
        <>
          <div className="ranking__controls">
            <label className="ranking__season">
              <span>Temporada</span>
              <select value={seasonId} onChange={(e) => setSeasonId(e.target.value)}>
                {seasons.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>

            {rooms.length > 1 && (
              <div className="ranking__rooms">
                {rooms.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRoomId(r.id)}
                    className={`ranking__room ${r.id === roomId ? 'is-active' : ''}`}
                  >
                    {r.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {loadingRank ? (
            <p className="ranking__msg">Carregando tempos…</p>
          ) : entries.length === 0 ? (
            <p className="ranking__msg">
              Nenhum tempo registrado nesta temporada ainda. Seja a primeira equipe! 🚀
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
