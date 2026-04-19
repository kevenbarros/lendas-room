import { useState } from "react";
import "./FAQ.css";

type TabId = "reserva" | "jogo";

interface QA {
  question: string;
  answer: string;
}

interface Tab {
  id: TabId;
  label: string;
  items: QA[];
}

const TABS: Tab[] = [
  {
    id: "reserva",
    label: "Reserva",
    items: [
      {
        question: "Quem pode agendar?",
        answer:
          "Somente pessoas com 18 anos ou mais podem reservar e pagar um jogo no Lendas Escape Room, sendo jogador ou não.",
      },
      {
        question:
          "Posso fazer a reserva da sala e pagamento diretamente na unidade?",
        answer:
          "Toda a operação comercial é realizada diretamente pelo nosso contato no WhatsApp.",
      },
      {
        question: "Quais são as formas de pagamento aceitas pelo Lendas?",
        answer:
          "O pagamento é realizado no link direcionado pelo atendimento comercial. É possível efetuar a compra via crédito, débito e PIX.",
      },
      {
        question: "Em que horário devo chegar no Lendas?",
        answer:
          "O grupo precisa estar presente no local 15 minutos antes do horário agendado, pois esse tempo é utilizado para orientações e explicações referentes ao jogo. Após as orientações, o jogo será iniciado.",
      },
      {
        question:
          "O que acontece se alguém do grupo chegar atrasado ou perder o início do jogo?",
        answer:
          "Caso algum jogador não compareça no horário e chegue após o início do jogo, ele perderá o direito de participar com o restante do grupo. Organize sua equipe e chegue com antecedência para que todos recebam as orientações necessárias.",
      },
      {
        question: "Qual o horário de funcionamento?",
        answer: "Quarta a domingo, das 17h30 às 20h30.",
      },
    ],
  },
  {
    id: "jogo",
    label: "Sobre o jogo",
    items: [
      {
        question: "Quantas pessoas podem participar do jogo?",
        answer: "Nossa sala comporta de 2 a 7 jogadores.",
      },
      {
        question: "Tem restrição de idade para participar?",
        answer: "A idade recomendada é a partir de 14 anos.",
      },
      {
        question: "Você precisa de conhecimento ou habilidades especiais?",
        answer:
          "Não há necessidade de habilidades especiais ou conhecimento para concluir o jogo com sucesso, mas precisará de atenção e criatividade, além de muito trabalho em equipe.",
      },
      {
        question: "E se não conseguirmos resolver algum enigma?",
        answer:
          "Se houver alguma dificuldade durante um enigma, vocês podem pedir dica e nosso monitor vai ajudar.",
      },
      {
        question: "Nosso grupo será filmado durante o jogo?",
        answer:
          "Por medidas de segurança e para monitorarmos o jogo, a sala possui câmeras que ficam ligadas o tempo todo.",
      },
      {
        question: "Podemos tirar fotos e filmar durante o jogo?",
        answer:
          "Os jogadores são proibidos de filmar ou fotografar no interior da sala. Essa é uma medida de segurança para evitar que as pistas e enigmas das atividades sejam revelados posteriormente, atrapalhando a experiência dos próximos jogadores.",
      },
      {
        question: "Que tipo de roupa devo usar?",
        answer:
          "Para participação nos jogos, recomenda-se que os participantes utilizem roupas confortáveis e casuais.",
      },
      {
        question: "O que é proibido de levar para o jogo?",
        answer: "Alimentos, bebidas e aparelhos eletrônicos não são permitidos.",
      },
    ],
  },
];

interface AccordionItemProps {
  item: QA;
  isOpen: boolean;
  onToggle: () => void;
  id: string;
}

const AccordionItem = ({ item, isOpen, onToggle, id }: AccordionItemProps) => {
  return (
    <div className={`faq__item ${isOpen ? "faq__item--open" : ""}`}>
      <button
        type="button"
        className="faq__question"
        aria-expanded={isOpen}
        aria-controls={`${id}-answer`}
        id={`${id}-question`}
        onClick={onToggle}
      >
        <span className="faq__question-text">{item.question}</span>
        <span className="faq__question-icon" aria-hidden="true">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 4.5l6 6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </span>
      </button>
      <div
        id={`${id}-answer`}
        role="region"
        aria-labelledby={`${id}-question`}
        className="faq__answer-wrapper"
        hidden={!isOpen}
      >
        <p className="faq__answer">{item.answer}</p>
      </div>
    </div>
  );
};

export const FAQ = () => {
  const [activeTab, setActiveTab] = useState<TabId>("reserva");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const currentTab = TABS.find((t) => t.id === activeTab) ?? TABS[0];

  const handleTabChange = (id: TabId) => {
    setActiveTab(id);
    setOpenIndex(0);
  };

  const handleToggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id="faq" className="faq" aria-labelledby="faq-title">
      <div className="faq__container">
        <header className="faq__header">
          <span className="faq__eyebrow">PERGUNTAS FREQUENTES</span>
          <h2 id="faq-title" className="faq__title">
            F<span className="faq__title--highlight">A</span>Q
          </h2>
          <span className="faq__divider" aria-hidden="true" />
          <p className="faq__subtitle">
            Antes de entrar na aventura, tire suas dúvidas com a gente.
          </p>
        </header>

        <div
          className="faq__tabs"
          role="tablist"
          aria-label="Categorias de perguntas"
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              id={`tab-${tab.id}`}
              aria-controls={`panel-${tab.id}`}
              aria-selected={activeTab === tab.id}
              className={`faq__tab ${
                activeTab === tab.id ? "faq__tab--active" : ""
              }`}
              onClick={() => handleTabChange(tab.id)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div
          role="tabpanel"
          id={`panel-${currentTab.id}`}
          aria-labelledby={`tab-${currentTab.id}`}
          className="faq__panel"
        >
          {currentTab.items.map((item, index) => (
            <AccordionItem
              key={`${currentTab.id}-${index}`}
              id={`faq-${currentTab.id}-${index}`}
              item={item}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
