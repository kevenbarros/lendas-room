import { useState, useEffect } from "react";
import "./Rooms.css";
import iluminadoImg from "../../assets/room-iluminado.png";
import matintaImg from "../../assets/rom-matinta.png";
import tesouroImg from "../../assets/room-tesouro.png";
import { trackRoomClick, type RoomName } from "../../services/roomTracking";

interface RoomCardProps {
  image: string;
  imageAlt: string;
  title: string;
  description: string;
  additionalInfo?: string;
  roomId: RoomName;
  onRoomClick: (roomId: RoomName) => void;
  isLoading: boolean;
  isVoted: boolean;
  disabledAll?: boolean;
}

const RoomCard = ({
  image,
  imageAlt,
  title,
  description,
  additionalInfo,
  roomId,
  onRoomClick,
  isLoading,
  isVoted,
  disabledAll = false,
}: RoomCardProps) => {
  return (
    <article className="rooms__card">
      <div className="rooms__card-image-wrapper">
        <img src={image} alt={imageAlt} className="rooms__card-image" />
      </div>

      <div className="rooms__card-content">
        <h3 className="rooms__card-title">{title}</h3>

        <div className="rooms__card-description">
          <p>{description}</p>
          {additionalInfo && <p>{additionalInfo}</p>}
        </div>

        <button
          className="rooms__card-button"
          type="button"
          onClick={() => onRoomClick(roomId)}
          disabled={isVoted || isLoading || disabledAll}
          aria-pressed={isVoted}
        >
          {isLoading
            ? "Registrando..."
            : isVoted
              ? "✓ Registrado"
              : "Achei esse interessante"}
        </button>
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

  // Inicializa voto salvo no localStorage
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
      // Limpar mensagem após 3 segundos
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
      imageAlt:
        "Sala O Iluminado - ambiente vintage com sofá e decoração clássica",
      title: "O ILUMINADO",
      description:
        "Um massacre ocorrido em 2005, no bairro do Marco, até hoje não foi solucionado.",
      additionalInfo:
        "O principal suspeito? Um senhor chamado Alberto. Ele teria assassinado quatro membros da família e desaparecido.\n\nApenas um neto ainda está vivo e pode ser a chave para desvendar o mistério.",
    },
    {
      roomId: "matinta",
      image: matintaImg,
      imageAlt: "Sala A Matinta - ambiente escuro e misterioso",
      title: "A MATINTA",
      description:
        "Duas crianças desapareceram em Itaituba. Foram ditos de buscas e nenhum sinal delas.",
      additionalInfo:
        'Na verdade, foi encontrada apenas uma casa abandonada no meio da mata, com um bilhete sobre a mesa escrito "Taiporã". Acho que isso não significa nada.\n\nVocê acha que consegue encontrar as crianças?',
    },
    {
      roomId: "tesouro",
      image: tesouroImg,
      imageAlt: "Sala O Baú do Tesouro - ambiente de taverna medieval",
      title: "O BAÚ DO TESOURO",
      description:
        "A lenda fala sobre um baú repleto de ouro e pedras preciosas. O tesouro, diz o ditado, não é apenas conversa fiada.",
      additionalInfo:
        "Mas não vá sozinho. Os últimos que foram atrás desse tesouro nunca voltaram para contar a história.",
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
          VOCÊ GOSTARIA DE DESVENDAR PRIMEIRO?
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
