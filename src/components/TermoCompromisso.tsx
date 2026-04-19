import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Helmet } from "../lib/helmet";
import { sendTermoToGoogleSheets } from "../services/googleSheets";
import "./TermoCompromisso.css";

interface AccordionSection {
  id: string;
  title: string;
  content: ReactNode;
}

const SECTIONS: AccordionSection[] = [
  {
    id: "sobre",
    title: "Sobre a experiência",
    content: (
      <>
        <p>
          O Lendas Escape Room oferece uma experiência imersiva em que você e
          sua equipe entram em uma sala temática e têm tempo limitado para
          encontrar a saída. Para escapar, será necessário usar intuição,
          raciocínio e trabalho em equipe.
        </p>
        <p>
          Ao participar, você declara estar ciente de que a atividade pode
          envolver:
        </p>
        <ul>
          <li>Ambientes fechados e com pouca iluminação;</li>
          <li>Estímulos sonoros e visuais intensos;</li>
          <li>Situações de pressão psicológica, suspense ou tensão;</li>
          <li>Desafios que exigem raciocínio lógico sob limite de tempo;</li>
          <li>Necessidade de interação e movimentação em espaços limitados.</li>
        </ul>
      </>
    ),
  },
  {
    id: "reserva",
    title: "Reserva e pagamento",
    content: (
      <ul>
        <li>
          Os jogos necessitam de agendamento. As reservas podem ser realizadas
          pelo WhatsApp informado no site, indicando data, horário, sala e
          quantidade de jogadores.
        </li>
        <li>
          O número mínimo e máximo de jogadores varia conforme o jogo escolhido
          e deverá ser respeitado no ato da reserva.
        </li>
        <li>
          Somente pessoas com 18 anos ou mais podem reservar e pagar um jogo no
          Lendas Escape Room.
        </li>
        <li>
          Menores de 14 anos deverão estar acompanhados por um adulto
          responsável, que obrigatoriamente deverá participar do jogo.
        </li>
        <li>
          O utilizador é inteiramente responsável pela veracidade das
          informações fornecidas.
        </li>
        <li>
          O preço de cada jogo será indicado nos canais de comunicação do
          Lendas, podendo variar de acordo com o número de participantes, sala e
          data. Os preços podem ser alterados a qualquer momento sem aviso
          prévio.
        </li>
        <li>
          A contratação do serviço será confirmada após o pagamento. Sem
          pagamento aprovado, a reserva poderá ser cancelada.
        </li>
        <li>A confirmação da reserva será enviada por e-mail.</li>
        <li>
          Caso o número de jogadores seja inferior ao previsto, a diferença não
          será reembolsada. Caso seja superior, a diferença será cobrada na
          recepção.
        </li>
        <li>
          Para a realização do jogo, poderá ser solicitada confirmação de nome
          completo, RG, CPF, telefone e e-mail informados no ato da reserva.
        </li>
      </ul>
    ),
  },
  {
    id: "atrasos",
    title: "Atrasos",
    content: (
      <ul>
        <li>
          Pedimos que os jogadores cheguem com 15 minutos de antecedência para
          receber instruções e realizar pagamentos, se necessário.
        </li>
        <li>
          Caso algum jogador não compareça no horário e chegue após o início do
          jogo, perderá o direito de participar com o restante do grupo.
        </li>
      </ul>
    ),
  },
  {
    id: "cancelamentos",
    title: "Cancelamentos e reagendamentos",
    content: (
      <ul>
        <li>
          A experiência é presencial, com data e horário definidos. Após a
          confirmação e pagamento, não será possível cancelar com menos de 24
          horas de antecedência. Nesses casos, não haverá reembolso.
        </li>
        <li>
          Reagendamentos podem ser solicitados com pelo menos 24 horas de
          antecedência, uma única vez, dentro do prazo de 30 dias.
        </li>
      </ul>
    ),
  },
  {
    id: "conduta",
    title: "Código de conduta e segurança",
    content: (
      <>
        <p>
          Antes do início, os jogadores receberão instruções. O Lendas reserva o
          direito de recusar o acesso ou terminar o jogo antecipadamente em caso
          de descumprimento das regras, sem direito a reembolso.
        </p>
        <p>A participação envolve determinados riscos, como:</p>
        <ul>
          <li>Mover ou levantar objetos com peso de até 5 kg;</li>
          <li>Estresse mental ou ansiedade;</li>
          <li>Sensação claustrofóbica por estar em espaço fechado;</li>
          <li>Movimentar-se em ambiente escuro ou com pouca iluminação.</li>
        </ul>
      </>
    ),
  },
  {
    id: "saude",
    title: "Condições de saúde",
    content: (
      <>
        <p>
          Declaro estar em plenas condições físicas e psicológicas para
          participar da atividade. Confirmo não possuir condições como síndrome
          do pânico, claustrofobia, ansiedade severa, epilepsia fotossensível,
          problemas cardíacos graves, gestação de risco ou qualquer outra
          condição que possa ser agravada pela experiência.
        </p>
        <p>
          Os jogos não são recomendados para pessoas com marca-passo, restrições
          psicológicas ou outras condições médicas que possam colocar em risco a
          saúde do jogador.
        </p>
      </>
    ),
  },
  {
    id: "responsabilidades",
    title: "Responsabilidades",
    content: (
      <>
        <p>
          Ao participar, o jogador assume responsabilidade por eventuais
          consequências decorrentes de sua própria conduta, incluindo danos
          materiais ou pessoais, ferimentos, doenças, incapacidades ou morte.
          Nesses casos, o Lendas, seus colaboradores, proprietários, parceiros e
          terceiros envolvidos ficam isentos de qualquer responsabilidade.
        </p>
        <ul>
          <li>
            <strong>Responsabilidade individual e do grupo:</strong> assumo
            total responsabilidade por minha participação e também pelos
            participantes que me acompanham, declarando que todos foram
            informados sobre a natureza da atividade e seus possíveis efeitos.
          </li>
          <li>
            <strong>Isenção de responsabilidade da empresa:</strong> isento a
            empresa, seus sócios, colaboradores e representantes de qualquer
            responsabilidade por danos físicos, emocionais ou psicológicos que
            possam ocorrer, desde que não decorrentes de dolo ou negligência
            comprovada.
          </li>
          <li>
            <strong>Cumprimento de regras:</strong> comprometo-me a seguir todas
            as orientações da equipe antes e durante a atividade, respeitando os
            limites físicos do ambiente, não utilizando força bruta e não
            danificando estruturas, cenários, objetos ou equipamentos.
          </li>
          <li>
            <strong>Interrupção da atividade:</strong> posso solicitar a
            interrupção da atividade ou a abertura da sala a qualquer momento,
            comunicando a equipe pelas câmeras ou microfones da sala. Uma vez
            interrompida, o jogador não poderá retornar ao jogo e não haverá
            reembolso.
          </li>
          <li>
            Participantes sob influência de álcool ou drogas não poderão jogar.
            Se a condição for constatada, a reserva será cancelada sem
            restituição do valor.
          </li>
          <li>
            Não é permitido ingressar nas salas com bebidas, alimentos ou
            objetos perigosos (cortantes, explosivos, armas).
          </li>
          <li>
            Comportamentos indisciplinados, desordeiros, intimidação ou assédio
            não serão tolerados e resultarão em encerramento do jogo sem
            reembolso.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "imagem",
    title: "Fotos, vídeos e uso de imagem",
    content: (
      <ul>
        <li>
          Não é permitido aos participantes utilizar qualquer aparelho de
          gravação de som ou imagem dentro das salas (celulares, câmeras,
          notebooks, tablets etc.).
        </li>
        <li>
          Todas as sessões podem ser filmadas e as imagens são de propriedade do
          Lendas Escape Room. Os participantes aceitam de antemão a filmagem.
        </li>
        <li>
          Autorizo, de forma gratuita, a captação e uso da minha imagem e da
          minha equipe em fotos e vídeos ao final do jogo para divulgação em
          redes sociais e mídias do Lendas Escape Room.
        </li>
        <li>
          Para menores de 18 anos, o adulto responsável pela reserva autoriza,
          em nome de todos os participantes, a captura e publicação de fotos e
          vídeos.
        </li>
      </ul>
    ),
  },
  {
    id: "sigilo",
    title: "Sigilo",
    content: (
      <p>
        Os participantes se comprometem a não revelar os segredos dos jogos, não
        comprometendo nem influenciando a participação de outras pessoas em
        futuras atividades.
      </p>
    ),
  },
  {
    id: "penalidades",
    title: "Penalidades e danos",
    content: (
      <>
        <p>
          Comprometo-me a ressarcir solidariamente e integralmente quaisquer
          danos materiais causados por mim ou por membros do meu grupo,
          decorrentes de uso indevido, força excessiva, negligência, vandalismo
          ou descumprimento das regras estabelecidas.
        </p>
        <p>
          Enquanto estiver nas instalações, devo respeitar os regulamentos da
          empresa e as normas de segurança. O contratante assume todas as
          responsabilidades dos participantes inscritos, inclusive a de
          indenizar o Lendas Escape Room por prejuízos de qualquer natureza.
        </p>
        <p>
          Alterações neste acordo podem ocorrer sem aviso prévio. Recomendamos
          consultar a política de privacidade regularmente.
        </p>
      </>
    ),
  },
];

export function TermoCompromisso() {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [dataAtual, setDataAtual] = useState("");
  const [aceitou, setAceitou] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ageError, setAgeError] = useState<string | null>(null);

  useEffect(() => {
    const now = new Date();
    setDataAtual(now.toLocaleString("pt-BR"));
  }, []);

  useEffect(() => {
    if (!dataNascimento) {
      setAgeError(null);
      return;
    }

    const birthDate = new Date(dataNascimento);
    if (isNaN(birthDate.getTime())) {
      setAgeError(null);
      return;
    }

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 18) {
      setAgeError(
        "O responsável deve ter 18 anos ou mais para aceitar os termos.",
      );
    } else {
      setAgeError(null);
    }
  }, [dataNascimento]);

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 9) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    } else if (value.length > 6) {
      value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
    } else if (value.length > 3) {
      value = value.replace(/(\d{3})(\d{1,3})/, "$1.$2");
    }

    setCpf(value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!aceitou || ageError) return;
    setIsLoading(true);

    let finalIp = "Não detectado";
    let finalLocal = "Não detectado";

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const res = await fetch("https://ipinfo.io/json", {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        finalIp = data.ip || "Desconhecido";
        finalLocal = `${data.city || "-"} / ${data.region || "-"}, ${data.country || "-"}`;
      }
    } catch {
      finalIp = "Bloqueado pelo Anti-rastreio/AdBlock";
      finalLocal = "Bloqueado pelo Anti-rastreio/AdBlock";
    }

    try {
      await sendTermoToGoogleSheets({
        nome,
        cpf,
        dataNascimento,
        dataHora: dataAtual,
        ip: finalIp,
        local: finalLocal,
        userAgent: navigator.userAgent || "Não detectado",
      });
      setSaved(true);
    } catch (error) {
      console.error("Failed:", error);
      alert("Ocorreu um erro ao enviar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="termo-container">
      <Helmet>
        <title>Termo de Compromisso | Lendas Escape Room</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="termo-card">
        <a href="/" className="termo-back" aria-label="Voltar ao início">
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

        <h1>Termo de Compromisso</h1>

        {!saved && (
          <>
            <p className="termo-intro">
              Leia atentamente cada seção abaixo antes de aceitar. Ao confirmar,
              você declara estar de acordo com todos os termos e condições de
              participação no Lendas Escape Room.
            </p>

            <div className="termo-accordions">
              {SECTIONS.map((section) => (
                <details key={section.id} className="termo-accordion">
                  <summary className="termo-accordion__header">
                    <span>{section.title}</span>
                    <svg
                      className="termo-accordion__chevron"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        d="M6 9l6 6 6-6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </summary>
                  <div className="termo-accordion__content">
                    {section.content}
                  </div>
                </details>
              ))}
            </div>
          </>
        )}

        {saved ? (
          <div className="success-message">
            <h2>Termo aceito com sucesso!</h2>
            <p>
              Obrigado, {nome}. Você e seus companheiros estão prontos para o
              jogo.
            </p>
            <a href="/" className="btn-voltar">
              Voltar ao início
            </a>
          </div>
        ) : (
          <form className="termo-form" onSubmit={handleSubmit}>
            <label className="termo-checkbox">
              <input
                type="checkbox"
                checked={aceitou}
                onChange={(e) => setAceitou(e.target.checked)}
                required
              />
              <span>
                Declaro que li, compreendi e concordo integralmente com os
                termos acima, assumindo total responsabilidade por minha
                participação e pelas pessoas que me acompanham no evento desta
                data.
              </span>
            </label>

            <div className="form-group">
              <label htmlFor="nome">Nome Completo do Responsável</label>
              <input
                type="text"
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                placeholder="Digite seu nome completo"
              />
            </div>

            <div className="form-group">
              <label htmlFor="cpf">CPF</label>
              <input
                type="text"
                id="cpf"
                value={cpf}
                onChange={handleCpfChange}
                required
                maxLength={14}
                pattern="\d{3}\.?\d{3}\.?\d{3}-?\d{2}"
                title="Digite um CPF válido. Ex: 000.000.000-00"
                placeholder="000.000.000-00"
              />
            </div>

            <div className="form-group">
              <label htmlFor="dataNascimento">Data de Nascimento</label>
              <input
                type="date"
                id="dataNascimento"
                value={dataNascimento}
                onChange={(e) => setDataNascimento(e.target.value)}
                required
                max={new Date().toISOString().split("T")[0]}
              />
              {ageError && <p className="termo-form__error">{ageError}</p>}
            </div>

            <div className="form-group form-group--full">
              <label htmlFor="data">Data e Horário</label>
              <input
                type="text"
                id="data"
                value={dataAtual}
                readOnly
                disabled
              />
            </div>

            <button
              type="submit"
              className="btn-aceitar"
              disabled={isLoading || !aceitou || !!ageError}
            >
              {isLoading ? "Enviando..." : "Eu aceito"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
