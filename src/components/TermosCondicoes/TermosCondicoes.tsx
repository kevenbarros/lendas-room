import { Helmet } from "../../lib/helmet";
import "./TermosCondicoes.css";

interface Section {
  id: string;
  title: string;
  paragraphs?: string[];
  items?: string[];
  subsections?: { title: string; items?: string[]; paragraphs?: string[] }[];
}

const SECTIONS: Section[] = [
  {
    id: "introducao",
    title: "Termos e condições",
    paragraphs: [
      "O Lendas oferece experiências de Escape Room, nas quais você e sua equipe entram em uma sala temática e têm um tempo limitado para encontrar a saída. Para escapar, será necessário usar intuição, raciocínio e trabalho em equipe.",
      "Estes termos e condições regulam o uso e a prestação dos serviços do Lendas. Pedimos que sejam lidos com atenção e aprovados antes da utilização.",
      "Ao realizar a reserva e o pagamento, você se responsabiliza por informar todos os participantes sobre o conteúdo destes termos e por obter o consentimento de cada um. Dessa forma, ao aceitar estes termos, entende-se que todos os integrantes da equipe também estão de acordo.",
    ],
  },
  {
    id: "reserva",
    title: "Reserva e Pagamento",
    items: [
      "Os jogos necessitam de agendamento. As reservas podem ser realizadas pelo WhatsApp informado no site, indicando a data, horário, sala e quantidade de jogadores que irão participar.",
      "O número mínimo e máximo de jogadores varia conforme o jogo desejado e deverá ser respeitado no ato da reserva.",
      "Somente pessoas com 18 anos ou mais podem reservar e pagar um jogo no Lendas Escape Room.",
      "Menores de 14 anos deverão estar acompanhados por um adulto responsável, que obrigatoriamente deverá participar do jogo.",
      "O utilizador é inteiramente responsável pela veracidade da informação fornecida. Ao submeter a sua reserva, garante ao Lendas que todos os dados disponibilizados são verdadeiros e estão corretos.",
      "O preço de cada jogo será indicado nos canais de comunicação do Lendas, podendo variar de acordo com o número de participantes, sala e data selecionados. Os preços são fixados de acordo com a política comercial da empresa, podendo ser alterados a qualquer momento sem aviso prévio.",
      "A contratação dos serviços do Lendas Escape Game será confirmada após pagamento. Se o pagamento não for creditado ou aprovado, a reserva poderá ser cancelada.",
      "A confirmação da reserva será enviada por e-mail.",
      "Caso o número de jogadores seja inferior ao inicialmente previsto na reserva, a diferença de preço não será reembolsada.",
      "Caso o número de jogadores seja superior ao inicialmente previsto, a diferença do valor será cobrada na recepção, de acordo com a lista de valores em vigor e considerando o número máximo de jogadores.",
      "Para a realização do jogo, o Lendas poderá solicitar a confirmação do seu nome completo, RG, CPF, telefone e endereço de e-mail, informados previamente no ato da reserva e do pagamento do serviço.",
    ],
  },
  {
    id: "atrasos",
    title: "Atrasos",
    items: [
      "Pedimos para os jogadores chegarem com 15 minutos de antecedência do horário de início do evento para recebimento das instruções do jogo e realização de pagamentos, caso necessário.",
      "Caso algum jogador não compareça no horário e chegue após o início do jogo, ele perderá o direito de participar com o restante do grupo.",
    ],
  },
  {
    id: "cancelamentos",
    title: "Cancelamentos e Reagendamentos",
    items: [
      "O jogo é uma experiência presencial, com data e horário definidos. Por isso, após a confirmação e pagamento da reserva, não será possível cancelar com menos de 24 horas de antecedência. Nesses casos, não haverá reembolso.",
      "Caso seu grupo precise reagendar, entre em contato com pelo menos 24 horas de antecedência em relação à data e horário reservados. O reagendamento pode ser feito uma única vez, dentro do prazo de até 30 dias.",
    ],
  },
  {
    id: "conduta",
    title: "Código de Conduta e Segurança",
    paragraphs: [
      "Antes do início, os jogadores receberão instruções para participação. O Lendas reserva-se o direito de recusar o acesso ou terminar o jogo antecipadamente aos participantes por qualquer incumprimento das regras, sem direito a reembolso.",
      "A participação na atividade envolve determinados riscos, como:",
    ],
    subsections: [
      {
        title: "",
        items: [
          "Mover ou levantar objetos com um peso de até 5 kg.",
          "Estresse mental ou ansiedade.",
          "Sensação claustrofóbica, por estar em um espaço fechado.",
          "Movimentar-se num ambiente escuro ou com pouca iluminação.",
        ],
      },
    ],
  },
  {
    id: "responsabilidades",
    title: "Responsabilidades",
    paragraphs: [
      "Ao participar da atividade, o jogador assume responsabilidade por eventuais consequências decorrentes de sua própria conduta, incluindo, mas não se limitando a danos materiais ou pessoais, ferimentos, doenças, incapacidades ou morte.",
      "Nesses casos, o Lendas, bem como seus colaboradores, proprietários, parceiros comerciais e terceiros envolvidos, ficam isentos de qualquer responsabilidade.",
    ],
    items: [
      "Caso algum jogador deseje sair durante o jogo, pode falar com os monitores que estarão assistindo o grupo através de câmeras. Menores de idade poderão sair da sala acompanhados pelos pais ou adulto responsável. Independente do motivo da saída, o jogador não pode retornar ao jogo e não será efetuado reembolso ou ressarcimento do valor.",
      "A participação nos jogos exige dos participantes concentração e controle de seu estado físico e emocional. Assim, participantes que estiverem sob a influência de álcool ou drogas de qualquer natureza não poderão jogar. Se esta condição for constatada, a reserva será cancelada, não havendo restituição do valor pago.",
      "Também não será permitido o ingresso nas salas de jogos com bebidas e ou qualquer tipo de alimento.",
      "É totalmente proibido levar objetos perigosos para o local, incluindo, a título de exemplo, objetos cortantes, artigos explosivos, armas, ou outros itens que poderão colocar em perigo a segurança das pessoas.",
      "Qualquer comportamento indisciplinado ou desordeiro, segundo o critério dos colaboradores — incluindo, a título de exemplo, gritar, ameaçar, subir em móveis, danificar artigos ou decoração do jogo e utilizar a força para abrir fechaduras — não será tolerado pelo Lendas. Estes jogadores serão retirados do jogo, sem que lhes seja concedido direito a reembolso.",
      "Os jogos não são recomendados para pessoas que tenham condições de saúde como claustrofobia, marca-passo, restrição de saúde de ordem psicológica e outras restrições médicas que possam colocar em risco a saúde do jogador.",
      "O Lendas não tolera qualquer tipo de intimidação ou assédio aos seus colaboradores ou outros jogadores, reservando-se o direito de impedir a entrada ou terminar o jogo antes do tempo estipulado, sem que estes tenham direito a qualquer reembolso.",
    ],
  },
  {
    id: "fotos",
    title: "Fotos e vídeos",
    items: [
      "Devido às características e natureza do jogo, não será permitida a utilização, pelos participantes, de qualquer aparelho de gravação de som ou imagem, tais como, exemplificativamente, celulares, smartphones, notebooks, tablets, câmeras fotográficas, filmadoras, etc.",
      "Todas as sessões de jogos podem ser filmadas e as imagens são de propriedade do Lendas Escape Room. Os participantes aceitam, de antemão, a filmagem e autorizam a capturar suas imagens, a armazenar e a usar tais gravações.",
      "Pode ser realizada a divulgação gratuita de fotos e vídeos seus e de seu grupo, gravados com seu consentimento ao final das sessões, para serem divulgados nas mídias sociais, na Internet e no website do Lendas Escape Room.",
      "No caso de fotos e vídeos de menores de 18 anos, uma vez que a reserva será realizada por um adulto, este adulto será também responsável pela aceitação expressa destes termos e condições em que autoriza, em nome de todos os participantes, a captura e possível publicação de fotos e vídeos em redes sociais e website do Lendas.",
    ],
  },
  {
    id: "sigilo",
    title: "Sigilo",
    items: [
      "Os participantes se comprometem a não revelar os segredos dos jogos, não comprometendo nem influenciando, assim, a participação de outras pessoas nas futuras atividades.",
    ],
  },
  {
    id: "penalidades",
    title: "Penalidades",
    items: [
      "Você e seu grupo se comprometem a zelar e não danificar e/ou prejudicar, de nenhuma forma, a infraestrutura, equipamentos e materiais do Lendas. Caso seja constatado algum dano que tenha sido acarretado por você ou pelo grupo, de forma intencional ou não, o Lendas reserva-se o direito de cobrar o valor correspondente, com o que você concorda desde já.",
    ],
    paragraphs: [
      "Enquanto estiver nas instalações do Lendas, você deve respeitar o cumprimento dos regulamentos da empresa, além de adotar uma postura adequada em relação às normas de segurança da organização. O contratante dos serviços assume todas as responsabilidades dos participantes que inscrever para participar das atividades do jogo, inclusive, mas não se limitando, a de indenizar o Lendas Escape Room por quaisquer prejuízos, de qualquer natureza, que causar.",
      "Alterações desse acordo podem ocorrer sem aviso prévio. Deste modo, recomendamos que consulte a nossa política de privacidade com regularidade de forma a estar sempre atualizado.",
    ],
  },
];

export const TermosCondicoes = () => {
  return (
    <>
      <Helmet>
        <title>Termos e Condições | Lendas Escape Room</title>
        <meta
          name="description"
          content="Termos e condições de uso dos serviços do Lendas Escape Room."
        />
      </Helmet>
      <main className="termos">
        <div className="termos__container">
          <header className="termos__header">
            <a href="/" className="termos__back" aria-label="Voltar ao início">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M19 12H5M12 19l-7-7 7-7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Voltar</span>
            </a>
            <h1 className="termos__title">TERMOS E CONDIÇÕES</h1>
            <p className="termos__subtitle">
              Última atualização: {new Date().toLocaleDateString("pt-BR")}
            </p>
          </header>

          <article className="termos__content">
            {SECTIONS.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="termos__section"
              >
                <h2 className="termos__section-title">{section.title}</h2>
                {section.paragraphs?.map((p, i) => (
                  <p key={`p-${i}`} className="termos__paragraph">
                    {p}
                  </p>
                ))}
                {section.items && (
                  <ul className="termos__list">
                    {section.items.map((item, i) => (
                      <li key={`i-${i}`} className="termos__list-item">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                {section.subsections?.map((sub, i) => (
                  <div key={`sub-${i}`} className="termos__subsection">
                    {sub.title && (
                      <h3 className="termos__subsection-title">{sub.title}</h3>
                    )}
                    {sub.paragraphs?.map((p, j) => (
                      <p key={`sp-${j}`} className="termos__paragraph">
                        {p}
                      </p>
                    ))}
                    {sub.items && (
                      <ul className="termos__list">
                        {sub.items.map((item, j) => (
                          <li key={`si-${j}`} className="termos__list-item">
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </section>
            ))}
          </article>
        </div>
      </main>
    </>
  );
};
