import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { db } from './firebase';

export interface Season {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  /** Sala da temporada; vazio = vale para todas as salas. */
  roomId: string;
}

export interface Room {
  id: string;
  name: string;
  active: boolean;
}

export interface RankingMember {
  name: string;
  instagram: string;
}

export interface RankingEntry {
  id: string;
  roomId: string;
  date: string;
  teamName: string;
  members: RankingMember[];
  timeSeconds: number;
}

/**
 * Ranking "Geral": todos os tempos já registrados, sem recorte de datas.
 * É a única contagem exibida no site. As datas são strings YYYY-MM-DD,
 * então este intervalo cobre qualquer data.
 */
export const GENERAL_SEASON: Season = {
  id: 'geral',
  name: 'Geral',
  startDate: '0000-01-01',
  endDate: '9999-12-31',
  roomId: '',
};

/**
 * Temporadas visíveis no site. As desmarcadas no painel ("Aparecer no site")
 * ficam de fora; as antigas, sem o campo, continuam aparecendo.
 */
export async function fetchSeasons(): Promise<Season[]> {
  const snap = await getDocs(query(collection(db, 'seasons'), orderBy('startDate', 'desc')));
  return snap.docs
    .map((d) => ({
      id: d.id,
      data: d.data() as Omit<Season, 'id' | 'roomId'> & {
        roomId?: string;
        showOnSite?: boolean;
      },
    }))
    .filter(({ data }) => data.showOnSite !== false)
    .map(({ id, data }) => ({
      id,
      name: data.name,
      startDate: data.startDate,
      endDate: data.endDate,
      roomId: data.roomId ?? '',
    }));
}

/** Data de hoje (YYYY-MM-DD) no fuso de Belém, onde ficam as salas. */
export function todayInBelem(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Belem' }).format(now);
}

/**
 * Temporada em andamento hoje no ranking da sala, ou null se nenhuma estiver
 * ativa. Vale a temporada da própria sala; sem ela, a de todas as salas.
 */
export function findCurrentSeason(
  seasons: Season[],
  roomId = '',
  now: Date = new Date(),
): Season | null {
  const today = todayInBelem(now);
  const running = seasons.filter((s) => today >= s.startDate && today <= s.endDate);
  return (
    (roomId ? running.find((s) => s.roomId === roomId) : undefined) ??
    running.find((s) => !s.roomId) ??
    null
  );
}

/** Momento em que a temporada encerra: fim do dia `endDate`, horário de Belém (UTC-3). */
export function seasonEndsAt(season: Season): Date {
  return new Date(`${season.endDate}T23:59:59-03:00`);
}

export async function fetchRooms(): Promise<Room[]> {
  const snap = await getDocs(collection(db, 'rooms'));
  return snap.docs
    .map((d) => {
      const data = d.data() as { name: string; active?: boolean };
      return { id: d.id, name: data.name, active: !!data.active };
    })
    .filter((r) => r.active)
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** Sala aberta por padrão quando o link não escolhe uma. */
export const DEFAULT_RANKING_ROOM_NAME = 'o iluminado';

/**
 * Sala inicial do ranking: a do link (`/ranking?sala=<id>`), senão
 * "o iluminado", senão a primeira sala ativa. Cada sala tem o próprio ranking.
 */
export function pickRankingRoom(rooms: Room[], preferredId?: string | null): Room | null {
  if (preferredId) {
    const fromLink = rooms.find((r) => r.id === preferredId);
    if (fromLink) return fromLink;
  }
  const target = DEFAULT_RANKING_ROOM_NAME.toLocaleLowerCase('pt-BR');
  return (
    rooms.find((r) => r.name.trim().toLocaleLowerCase('pt-BR') === target) ??
    rooms[0] ??
    null
  );
}

/** Sala pedida no link da página (`?sala=<id>`), se houver. */
export function roomIdFromUrl(): string | null {
  return new URLSearchParams(window.location.search).get('sala');
}

export async function fetchRanking(
  roomId: string,
  from: string,
  to: string,
): Promise<RankingEntry[]> {
  const snap = await getDocs(
    query(
      collection(db, 'rankingEntries'),
      where('roomId', '==', roomId),
      where('date', '>=', from),
      where('date', '<=', to),
    ),
  );
  const rows = snap.docs.map((d) => {
    const data = d.data() as Omit<RankingEntry, 'id'>;
    return {
      id: d.id,
      roomId: data.roomId,
      date: data.date,
      teamName: data.teamName,
      members: data.members ?? [],
      timeSeconds: data.timeSeconds,
    };
  });
  // Transforma o tempo restante em tempo de jogo e ordena do menor para o
  // maior: quem levou menos tempo para escapar fica no topo.
  rows.sort((a, b) => toGameSeconds(a.timeSeconds) - toGameSeconds(b.timeSeconds));
  return rows;
}

export function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/** Duração total de uma partida (1 hora). */
export const GAME_SECONDS = 3600;

/**
 * O valor salvo (`timeSeconds`) é o tempo que sobrou no relógio quando a
 * equipe terminou. Aqui convertemos para o tempo de jogo — quanto a equipe
 * de fato levou para escapar (duração total menos o tempo restante). É esse
 * valor, do menor para o maior, que define a colocação no ranking.
 */
export function toGameSeconds(remainingSeconds: number): number {
  return Math.max(0, GAME_SECONDS - remainingSeconds);
}

/** Tempo de jogo formatado (mm:ss) a partir do tempo restante salvo. */
export function formatGameTime(remainingSeconds: number): string {
  return formatTime(toGameSeconds(remainingSeconds));
}
