import { useState, useEffect, useRef, type ReactNode } from "react";
import "./Rooms.css";
import iluminadoImg from "../../assets/oiluminado.png";
import { trackRoomClick, type RoomName } from "../../services/roomTracking";

interface RoomStat {
  icon: ReactNode;
  label: string;
  value: string;
}

interface RoomCardProps {
  image: string;
  imageAlt: string;
  video?: string;
  title: string;
  tagline: string;
  description: string;
  additionalInfo?: string;
  stats: RoomStat[];
  categories: string[];
  roomId: RoomName;
  onRoomClick: (roomId: RoomName) => void;
  isLoading: boolean;
  isVoted: boolean;
  disabledAll?: boolean;
}

const PlayersIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M12 12a4 4 0 100-8 4 4 0 000 8zm-7 9a7 7 0 0114 0H5zm14.5-9a3 3 0 100-6 3 3 0 000 6zM22 20a5.5 5.5 0 00-5.5-5.5H16M4.5 12a3 3 0 110-6 3 3 0 010 6zM2 20a5.5 5.5 0 015.5-5.5H8"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ClockIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
    <path
      d="M12 7v5l3 2"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DifficultyIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M3 20h4V10H3v10zm7 0h4V4h-4v16zm7 0h4v-7h-4v7z"
      fill="currentColor"
    />
  </svg>
);

const AgeIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M12 2l2.5 5.2 5.7.8-4.1 4 1 5.7L12 15l-5.1 2.7 1-5.7L3.8 8l5.7-.8L12 2z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

const TagIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7a1 1 0 100 2 1 1 0 000-2z"
      fill="currentColor"
    />
  </svg>
);

const SoundOnIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M11 5L6 9H3v6h3l5 4V5z"
      fill="currentColor"
    />
    <path
      d="M15.5 8.5a4 4 0 010 7M18 6a7 7 0 010 12"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const SoundOffIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M11 5L6 9H3v6h3l5 4V5z"
      fill="currentColor"
    />
    <path
      d="M22 9l-6 6M16 9l6 6"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const RoomCard = ({
  image,
  imageAlt,
  video,
  title,
  // tagline,
  description,
  additionalInfo,
  stats,
  categories,
  // roomId,
  // onRoomClick,
  // isLoading,
  // isVoted,
  // disabledAll = false,
}: RoomCardProps) => {
  const [showVideo, setShowVideo] = useState(false);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // Start the video automatically 3s after the card enters the viewport.
  useEffect(() => {
    if (!video || showVideo) return;
    const el = wrapperRef.current;
    if (!el) return;

    let timer: ReturnType<typeof setTimeout> | null = null;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!timer) {
              timer = setTimeout(() => setShowVideo(true), 3000);
            }
          } else if (timer) {
            clearTimeout(timer);
            timer = null;
          }
        });
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => {
      if (timer) clearTimeout(timer);
      observer.disconnect();
    };
  }, [video, showVideo]);

  // Pause when card scrolls out of view; resume when back in view.
  useEffect(() => {
    if (!showVideo) return;
    const el = wrapperRef.current;
    const vid = videoRef.current;
    if (!el || !vid) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            vid.play().catch(() => {});
          } else {
            vid.pause();
          }
        });
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [showVideo]);

  const handleToggleMute = () => {
    setMuted((prev) => {
      const next = !prev;
      if (videoRef.current) {
        videoRef.current.muted = next;
        if (!next) videoRef.current.play().catch(() => {});
      }
      return next;
    });
  };

  return (
    <article className="rooms__card">
      <div
        ref={wrapperRef}
        className={`rooms__card-image-wrapper${
          showVideo ? " rooms__card-image-wrapper--video" : ""
        }`}
      >
        <img
          src={image}
          alt={imageAlt}
          className={`rooms__card-image${
            showVideo ? " rooms__card-image--hidden" : ""
          }`}
          loading="lazy"
          decoding="async"
        />

        {video && showVideo && (
          <video
            ref={videoRef}
            className="rooms__card-video"
            src={video}
            autoPlay
            loop
            muted={muted}
            playsInline
            preload="metadata"
            aria-label={`Vídeo da sala ${title}`}
          />
        )}

        <div className="rooms__card-image-overlay">
          <div className="rooms__card-categories">
            {categories.map((cat) => (
              <span key={cat} className="rooms__card-category">
                <TagIcon />
                {cat}
              </span>
            ))}
          </div>
        </div>

        {video && showVideo && (
          <div className="rooms__card-media-controls rooms__card-media-controls--active">
            <button
              type="button"
              className="rooms__card-media-btn rooms__card-media-btn--mute"
              onClick={handleToggleMute}
              aria-label={muted ? "Ativar som" : "Desativar som"}
              aria-pressed={!muted}
            >
              {muted ? <SoundOffIcon /> : <SoundOnIcon />}
            </button>
          </div>
        )}
      </div>

      <div className="rooms__card-content">
        {/* <p className="rooms__card-tagline">{tagline}</p> */}
        <h3 className="rooms__card-title">{title}</h3>

        <ul className="rooms__card-stats" aria-label="Informações da sala">
          {stats.map((stat, i) => (
            <li key={i} className="rooms__card-stat">
              <span className="rooms__card-stat-icon">{stat.icon}</span>
              <span className="rooms__card-stat-texts">
                <span className="rooms__card-stat-label">{stat.label}</span>
                <span className="rooms__card-stat-value">{stat.value}</span>
              </span>
            </li>
          ))}
        </ul>

        <div className="rooms__card-description">
          <p>{description}</p>
          {additionalInfo && <p>{additionalInfo}</p>}
        </div>
      </div>
    </article>
  );
};

export const Rooms = () => {
  const [loadingRoom, setLoadingRoom] = useState<RoomName | null>(null);
  const [votedRoom, setVotedRoom] = useState<RoomName | null>(null);
  const [trackingMessage, setTrackingMessage] = useState("");
  const [messageStatus, setMessageStatus] = useState<"success" | "error" | "">(
    "",
  );

  useEffect(() => {
    const saved = localStorage.getItem("lendas_voted");
    if (saved === "iluminado" || saved === "matinta" || saved === "tesouro") {
      setVotedRoom(saved as RoomName);
    }
  }, []);

  const handleRoomClick = async (roomId: RoomName) => {
    if (votedRoom) {
      setTrackingMessage("Você já votou em uma sala.");
      setMessageStatus("error");
      setTimeout(() => setTrackingMessage(""), 3000);
      return;
    }

    setLoadingRoom(roomId);
    setTrackingMessage("");
    setMessageStatus("");

    try {
      const result = await trackRoomClick(roomId);

      if (result.success) {
        setVotedRoom(roomId);
        localStorage.setItem("lendas_voted", roomId);
        setTrackingMessage("✓ Interesse registrado com sucesso!");
        setMessageStatus("success");
      } else {
        setTrackingMessage(result.message);
        setMessageStatus("error");
      }
    } catch {
      setTrackingMessage("Erro ao registrar interesse. Tente novamente.");
      setMessageStatus("error");
    } finally {
      setLoadingRoom(null);
      setTimeout(() => {
        setTrackingMessage("");
        setMessageStatus("");
      }, 3000);
    }
  };

  const rooms: Omit<
    RoomCardProps,
    "onRoomClick" | "isLoading" | "isVoted" | "disabledAll"
  >[] = [
    {
      roomId: "iluminado",
      image: iluminadoImg,
      video: "/escape-iluminado.webm",
      imageAlt:
        "Sala O Iluminado - ambiente vintage com sofá e decoração clássica",
      title: "O ILUMINADO",
      tagline: "Um caso real, um mistério por resolver",
      categories: ["Investigação Criminal", "Terror"],
      stats: [
        {
          icon: <PlayersIcon />,
          label: "Jogadores",
          value: "2 a 7 pessoas",
        },
        {
          icon: <ClockIcon />,
          label: "Duração",
          value: "60 minutos",
        },
        {
          icon: <DifficultyIcon />,
          label: "Dificuldade",
          value: "Média",
        },
        {
          icon: <AgeIcon />,
          label: "Classificação",
          value: "14 anos",
        },
      ],
      description:
        "Um massacre ocorrido em 2007, no bairro do Marco, até hoje não foi solucionado.",
      additionalInfo:
        "O principal suspeito? Um senhor chamado Carlos. Ele teria assassinado quatro membros da família e desaparecido.\n\nApenas um neto ainda está vivo e pode ser a chave para desvendar o mistério.",
    },
  ];

  return (
    <section id="rooms" className="rooms" aria-labelledby="rooms-title">
      <div className="rooms__container">
        <p className="rooms__subtitle">
          AGORA QUE VOCÊ CONHECE O LENDAS ESCAPE ROOM
        </p>

        <h2 id="rooms-title" className="rooms__title">
          <span className="rooms__title--highlight">SELECIONE</span> QUAL SALA
          VOCÊ GOSTARIA DE DESVENDAR PRIMEIRO
        </h2>

        <div className="rooms__grid">
          {rooms.map((room, index) => (
            <RoomCard
              key={index}
              {...room}
              onRoomClick={handleRoomClick}
              isLoading={loadingRoom === room.roomId}
              isVoted={votedRoom === room.roomId}
              disabledAll={votedRoom !== null}
            />
          ))}
        </div>

        {trackingMessage && (
          <div
            className={`rooms__message rooms__message--${messageStatus}`}
            role="alert"
          >
            {trackingMessage}
          </div>
        )}
      </div>
    </section>
  );
};
