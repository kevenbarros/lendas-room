import { useEffect, useMemo, useState } from 'react';
import './SeasonCountdown.css';
import {
  fetchSeasons,
  findCurrentSeason,
  seasonEndsAt,
  type Season,
} from '../../lib/ranking';
import { HALLOWEEN } from '../../lib/halloween';

const pad = (n: number) => String(n).padStart(2, '0');

const END_FORMAT = new Intl.DateTimeFormat('pt-BR', {
  timeZone: 'America/Belem',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

/**
 * Contagem regressiva até o encerramento da temporada em andamento no ranking
 * da sala, lida das temporadas cadastradas no painel. Sem temporada ativa,
 * não renderiza nada.
 */
export const SeasonCountdown = ({
  size = 'md',
  roomId = '',
}: {
  size?: 'md' | 'lg';
  roomId?: string;
}) => {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    let cancelled = false;
    fetchSeasons()
      .then((s) => {
        if (!cancelled) setSeasons(s);
      })
      .catch((e) => console.error(e));
    return () => {
      cancelled = true;
    };
  }, []);

  // Troca junto com a aba da sala, sem buscar de novo.
  const season = useMemo(() => findCurrentSeason(seasons, roomId), [seasons, roomId]);

  useEffect(() => {
    if (!season) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [season]);

  if (!season) return null;

  const endsAt = seasonEndsAt(season);
  const left = Math.max(0, Math.floor((endsAt.getTime() - now) / 1000));
  if (left === 0) return null;

  const days = Math.floor(left / 86400);
  const units = [
    { value: days, label: days === 1 ? 'dia' : 'dias' },
    { value: Math.floor((left % 86400) / 3600), label: 'horas' },
    { value: Math.floor((left % 3600) / 60), label: 'min' },
    { value: left % 60, label: 'seg' },
  ];
  const urgent = left < 86400;

  return (
    <div
      className={[
        'countdown',
        `countdown--${size}`,
        HALLOWEEN ? 'countdown--halloween' : '',
        urgent ? 'is-urgent' : '',
      ].join(' ')}
      role="timer"
      aria-label={`A temporada ${season.name} encerra em ${END_FORMAT.format(endsAt)}`}
    >
      <p className="countdown__label" aria-hidden="true">
        {HALLOWEEN ? '⏳ ' : ''}A temporada <strong>{season.name}</strong> encerra em
      </p>
      <div className="countdown__units" aria-hidden="true">
        {units.map((u, i) => (
          <div key={u.label} className="countdown__unit">
            <span className="countdown__value">
              {i === 0 ? u.value : pad(u.value)}
            </span>
            <span className="countdown__unit-label">{u.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeasonCountdown;
