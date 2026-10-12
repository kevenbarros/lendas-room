import { useId } from 'react';
import './Halloween.css';

// Decorações puramente visuais (aria-hidden, sem eventos de ponteiro).
// Posições fixas para o markup ser igual no SSR e no cliente.

const BAT_PATH =
  'M50 14C47 8 44 8 43 12C38 6 28 4 18 8C24 12 26 18 24 24C18 20 8 22 0 28C10 28 16 32 18 40C24 34 32 34 38 38C40 32 44 30 50 34C56 30 60 32 62 38C68 34 76 34 82 40C84 32 90 28 100 28C92 22 82 20 76 24C74 18 76 12 82 8C72 4 62 6 57 12C56 8 53 8 50 14Z';

type BatSpec = { top: string; size: number; duration: number; delay: number };

const DEFAULT_BATS: BatSpec[] = [
  { top: '12%', size: 34, duration: 16, delay: 0 },
  { top: '28%', size: 22, duration: 21, delay: 5 },
  { top: '8%', size: 18, duration: 25, delay: 11 },
  { top: '40%', size: 26, duration: 19, delay: 8 },
];

export const Bats = ({ bats = DEFAULT_BATS }: { bats?: BatSpec[] }) => (
  <div className="hw-bats" aria-hidden="true">
    {bats.map((b, i) => (
      <span
        key={i}
        className={`hw-bat ${i % 2 ? 'hw-bat--rtl' : ''}`}
        style={{
          top: b.top,
          width: b.size,
          animationDuration: `${b.duration}s`,
          animationDelay: `${b.delay}s`,
        }}
      >
        <svg viewBox="0 0 100 44" fill="currentColor">
          <path d={BAT_PATH} />
        </svg>
      </span>
    ))}
  </div>
);

// Teia de canto: raios saindo do canto e fios ligando os raios, com leve "barriga".
const ANGLES = [0, 15, 30, 45, 60, 75, 90].map((a) => (a * Math.PI) / 180);
const RINGS = [22, 44, 68, 94];
const R = 120;

const point = (r: number, a: number) =>
  [r * Math.cos(a), r * Math.sin(a)] as const;

const WEB_RAYS = ANGLES.map((a) => {
  const [x, y] = point(R, a);
  return `M0 0L${x.toFixed(1)} ${y.toFixed(1)}`;
}).join('');

const WEB_RINGS = RINGS.map((r) =>
  ANGLES.slice(1)
    .map((a, i) => {
      const [x0, y0] = point(r, ANGLES[i]);
      const [x1, y1] = point(r, a);
      const [cx, cy] = point(r * 0.86, (ANGLES[i] + a) / 2);
      return `${i === 0 ? `M${x0.toFixed(1)} ${y0.toFixed(1)}` : ''}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`;
    })
    .join(''),
).join('');

export const Cobweb = ({
  corner = 'tl',
  size = 140,
}: {
  corner?: 'tl' | 'tr';
  size?: number;
}) => (
  <svg
    className={`hw-web hw-web--${corner}`}
    width={size}
    height={size}
    viewBox="0 0 120 120"
    fill="none"
    aria-hidden="true"
  >
    <path d={WEB_RAYS + WEB_RINGS} stroke="currentColor" strokeWidth="0.8" />
  </svg>
);

export const Spider = ({ left = '18%' }: { left?: string }) => (
  <span className="hw-spider" style={{ left }} aria-hidden="true">
    <span className="hw-spider__thread" />
    <svg className="hw-spider__body" viewBox="0 0 40 32" fill="none">
      <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M14 14 6 8 2 14M14 17 4 16 1 22M26 14l8-6 4 6M26 17l10-1 3 6M15 20l-7 4-2 6M25 20l7 4 2 6" />
      </g>
      <ellipse cx="20" cy="18" rx="7" ry="8" fill="currentColor" />
      <circle cx="20" cy="9" r="4.5" fill="currentColor" />
      <circle cx="18.4" cy="8.6" r="1" fill="#ff7a18" />
      <circle cx="21.6" cy="8.6" r="1" fill="#ff7a18" />
    </svg>
  </span>
);

export const Fog = () => (
  <div className="hw-fog" aria-hidden="true">
    <span className="hw-fog__layer" />
    <span className="hw-fog__layer hw-fog__layer--2" />
  </div>
);

export const Moon = () => (
  <span className="hw-moon" aria-hidden="true">
    <span className="hw-moon__halo" />
    <span className="hw-moon__disc">
      <span className="hw-moon__cloud" />
      <span className="hw-moon__cloud hw-moon__cloud--2" />
    </span>
    <span className="hw-moon__bat">
      <svg viewBox="0 0 100 44" fill="currentColor">
        <path d={BAT_PATH} />
      </svg>
    </span>
  </span>
);

// Nuvens noturnas: topo iluminado pela lua, base escura, atravessando o céu devagar.
const CLOUD_PATH =
  'M22 72C6 72 0 58 12 50C6 36 22 26 36 32C40 16 62 8 76 20C86 4 114 4 124 22C138 12 160 18 162 36C178 30 196 42 190 56C200 62 194 74 180 72Z';

type CloudSpec = {
  top: string;
  width: number;
  duration: number;
  delay: number;
  opacity?: number;
  flip?: boolean;
};

const BACK_CLOUDS: CloudSpec[] = [
  { top: '0.5rem', width: 260, duration: 95, delay: -10, opacity: 0.55 },
  { top: '6rem', width: 180, duration: 120, delay: -70, opacity: 0.45, flip: true },
  { top: '2.5rem', width: 140, duration: 80, delay: -45, opacity: 0.4 },
  { top: '11rem', width: 220, duration: 140, delay: -100, opacity: 0.35, flip: true },
];

const FRONT_CLOUDS: CloudSpec[] = [
  { top: '4.5rem', width: 200, duration: 70, delay: -20, opacity: 0.7 },
];

export const Clouds = ({ layer = 'back' }: { layer?: 'back' | 'front' }) => {
  const id = useId();
  const clouds = layer === 'front' ? FRONT_CLOUDS : BACK_CLOUDS;
  return (
    <div className={`hw-clouds hw-clouds--${layer}`} aria-hidden="true">
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id={`${id}-cloud`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d9c8ff" />
            <stop offset="30%" stopColor="#8f74c9" />
            <stop offset="100%" stopColor="#2a1a48" />
          </linearGradient>
        </defs>
      </svg>
      {clouds.map((c, i) => (
        <span
          key={i}
          className="hw-cloud"
          style={{
            top: c.top,
            width: c.width,
            opacity: c.opacity,
            animationDuration: `${c.duration}s`,
            animationDelay: `${c.delay}s`,
          }}
        >
          <svg
            viewBox="0 0 200 80"
            style={c.flip ? { transform: 'scaleX(-1)' } : undefined}
          >
            <path d={CLOUD_PATH} fill={`url(#${id}-cloud)`} />
          </svg>
        </span>
      ))}
    </div>
  );
};

// Horizonte de cemitério: o "chão" tem a mesma cor da seção seguinte,
// então a cena termina sem emenda. A cor vem de --hw-ground no pai.
export const Graveyard = () => (
  <svg
    className="hw-graveyard"
    viewBox="0 0 1440 140"
    preserveAspectRatio="xMidYMax slice"
    aria-hidden="true"
  >
    <path
      className="hw-graveyard__ridge"
      d="M0 108C120 92 240 100 360 104C480 108 560 88 720 92C880 96 960 112 1080 104C1200 96 1320 90 1440 100"
    />
    <g className="hw-graveyard__ground">
      <path d="M0 140V108C120 92 240 100 360 104C480 108 560 88 720 92C880 96 960 112 1080 104C1200 96 1320 90 1440 100V140Z" />
      {/* lápides e cruzes */}
      <path d="M48 115V92a12 12 0 0 1 24 0v23Z" />
      <path d="M158 115V86a12 12 0 0 1 24 0v29Z" />
      <path d="M257 115V78h6v37ZM249 86h22v5h-22Z" />
      <path d="M315 115V78a15 15 0 0 1 30 0v37Z" />
      <path d="M400 115V98a10 10 0 0 1 20 0v17Z" />
      <path d="M637 115V80a13 13 0 0 1 26 0v35Z" />
      <path d="M1297 115V72h6v43ZM1288 81h24v5h-24Z" />
      <path d="M1360 115V84a14 14 0 0 1 28 0v31Z" />
      {/* cerca */}
      <path d="M816 91h192v3H816ZM816 104h192v3H816Z" />
      <path d="M820 115V86l3-6 3 6v29Z" /><path d="M838 115V86l3-6 3 6v29Z" /><path d="M856 115V86l3-6 3 6v29Z" /><path d="M874 115V86l3-6 3 6v29Z" /><path d="M892 115V86l3-6 3 6v29Z" /><path d="M910 115V86l3-6 3 6v29Z" /><path d="M928 115V86l3-6 3 6v29Z" /><path d="M946 115V86l3-6 3 6v29Z" /><path d="M964 115V86l3-6 3 6v29Z" /><path d="M982 115V86l3-6 3 6v29Z" /><path d="M1000 115V86l3-6 3 6v29Z" />
      {/* árvore seca */}
      <path
        d="M1180 115V72M1180 88l-22-16-8-14M1158 72l-14 2M1180 80l18-18 4-16M1198 62l14-4M1180 98l-14-8"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </g>
    {/* abóbora acesa */}
    <g className="hw-graveyard__pumpkin">
      <ellipse cx="560" cy="94" rx="14" ry="11" />
      <path d="M559 83q1-6 5-7" fill="none" stroke="#3d6b2a" strokeWidth="2.5" strokeLinecap="round" />
      <path className="hw-graveyard__face" d="M553 90l3-4 3 4ZM561 90l3-4 3 4ZM552 97q8 6 16 0l-3 1-2-2-3 2-3-2-2 2Z" />
    </g>
  </svg>
);
