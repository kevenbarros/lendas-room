import "./About.css";
import puzzlesIcon from "../../assets/puzzles-icon.svg";
import keyIcon from "../../assets/icon key.svg";
import festaIcon from "../../assets/icon festa.svg";
import teamIcon from "../../assets/icont team.svg";

interface FeatureCardProps {
  icon: string;
  iconAlt: string;
  title: string;
  description: string;
}

const FeatureCard = ({
  icon,
  iconAlt,
  title,
  description,
}: FeatureCardProps) => {
  return (
    <article className="about__card">
      <img
        src={icon}
        alt={iconAlt}
        className="about__card-icon"
        aria-hidden="true"
      />
      <h3 className="about__card-title">{title}</h3>
      <p className="about__card-description">{description}</p>
    </article>
  );
};

export const About = () => {
  const features: FeatureCardProps[] = [
    {
      icon: puzzlesIcon,
      iconAlt: "Ícone de quebra-cabeças",
      title: "Puzzles",
      description:
        "Encontre pistas, resolva quebra-cabeças e desvende mistérios para cumprir sua missão.",
    },
    {
      icon: teamIcon,
      iconAlt: "Ícone de trabalho em equipe",
      title: "Trabalho em equipe",
      description:
        "Colabore com amigos ou desconhecidos. Esses jogos foram criados para desenvolver o trabalho em equipe e a cooperação, enquanto todos se divertem.",
    },
    {
      icon: keyIcon,
      iconAlt: "Ícone de chave",
      title: "Salas Imersivas",
      description:
        "Cenários totalmente imersivos para te transportar a um universo paralelo, onde você é protagonista de um verdadeiro desafio.",
    },
    {
      icon: festaIcon,
      iconAlt: "Ícone de festa",
      title: "Para quem é quando?",
      description:
        "Para todos os públicos, ideal para comemorar aniversários, encontros, team building de empresas ou simplesmente para quem quer viver uma experiência inesquecível.",
    },
  ];

  return (
    <section className="about" aria-labelledby="about-title">
      <div className="about__container">
        <h2 id="about-title" className="about__title">
          O que é escape room?
        </h2>

        <p className="about__description">
          Imagine uma história onde você e seus amigos são os protagonistas.
          Durante 60 minutos, você será transportado para um mundo de mistério e
          desafios, onde cada detalhe importa e cada decisão conta.
        </p>

        <div className="about__grid">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};
