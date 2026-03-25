import { useEffect, useState, type FormEvent } from "react";
import { Helmet } from "../lib/helmet";
import { sendTermoToGoogleSheets } from "../services/googleSheets";
import "./TermoCompromisso.css";

export function TermoCompromisso() {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [dataAtual, setDataAtual] = useState("");
  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const now = new Date();
    // Exemplo de formato: "24/03/2026, 21:05:00"
    setDataAtual(now.toLocaleString("pt-BR"));
  }, []);

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
    setIsLoading(true);

    // Captura de IP dinâmica no momento exato do aceite para evitar AdBlockers travando estado
    let finalIp = "Não detectado";
    let finalLocal = "Não detectado";

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500); // 3.5s timeout no maximo
      
      const res = await fetch("https://ipinfo.io/json", { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (res.ok) {
        const data = await res.json();
        finalIp = data.ip || "Desconhecido";
        finalLocal = `${data.city || "-"} / ${data.region || "-"}, ${data.country || "-"}`;
      }
    } catch (err) {
      finalIp = "Bloqueado pelo Anti-rastreio/AdBlock";
      finalLocal = "Bloqueado pelo Anti-rastreio/AdBlock";
    }

    try {
      await sendTermoToGoogleSheets({
        nome,
        cpf,
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
        <title>Termo de Compromisso | Lendas Room</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="termo-card">
        <h1>Termo de Compromisso</h1>
        
        {!saved && (
           <div className="termo-text">
            <p>
              Eu, acima identificado(a), declaro para os devidos fins que participarei voluntariamente da atividade de entretenimento do tipo Escape Room, promovida pela empresa <strong>Lendas Room</strong>, estando ciente de que se trata de uma experiência imersiva que pode envolver:
            </p>
            <ul>
              <li>Ambientes fechados e com pouca iluminação;</li>
              <li>Estímulos sonoros e visuais intensos;</li>
              <li>Situações de pressão psicológica, suspense ou tensão;</li>
              <li>Desafios que exigem raciocínio lógico sob limite de tempo;</li>
              <li>Necessidade de interação e movimentação em espaços limitados.</li>
            </ul>

            <p><strong>Declaro ainda que:</strong></p>

            <ol>
              <li>
                <strong>Condições de saúde:</strong> Estou em plenas condições físicas e psicológicas para participar da atividade. Confirmo não possuir condições como síndrome do pânico, claustrofobia, ansiedade severa, epilepsia fotossensível, problemas cardíacos graves, gestação de risco ou qualquer outra condição que possa ser agravada pela experiência.
              </li>
              <li>
                <strong>Responsabilidade individual e do grupo:</strong> Assumo total responsabilidade por minha participação e também pelos participantes que me acompanham nesta sessão, declarando que todos foram devidamente informados sobre a natureza da atividade e seus possíveis efeitos.
              </li>
              <li>
                <strong>Isenção de responsabilidade da empresa:</strong> Isento a empresa, seus sócios, colaboradores e representantes de qualquer responsabilidade por danos físicos, emocionais ou psicológicos que possam ocorrer durante ou após a participação, desde que não decorrentes de dolo ou negligência comprovada.
              </li>
              <li>
                <strong>Cumprimento de regras:</strong> Comprometo-me a seguir todas as orientações fornecidas pela equipe antes e durante a atividade, respeitando os limites físicos do ambiente, não utilizando de força bruta e não danificando estruturas, cenários, objetos ou equipamentos eletrônicos.
              </li>
              <li>
                <strong>Interrupção da atividade:</strong> Estou ciente de que posso solicitar a interrupção da atividade ou a abertura da sala a qualquer momento, caso me sinta desconfortável, sendo minha responsabilidade comunicar imediatamente a equipe através das câmeras ou microfones disponíveis na sala.
              </li>
              <li>
                <strong>Uso de Imagem (Direitos):</strong> Autorizo, de forma gratuita, a captação e uso da minha imagem e da minha equipe em fotos e vídeos no final do jogo para fins de divulgação nas redes sociais e mídias do Lendas Room. Não é permitida a captação de imagens por parte dos jogadores <strong>dentro</strong> das salas.
              </li>
              <li>
                <strong>Responsabilidade por danos:</strong> Comprometo-me a ressarcir solidariamente e integralmente quaisquer danos materiais causados por mim ou por membros do meu grupo, decorrentes de uso indevido, uso de força excessiva, negligência, atos de vandalismo ou descumprimento das regras estabelecidas.
              </li>
            </ol>

            <p className="termo-conclusao">
              Declaro que li, compreendi e concordo integralmente com os termos acima, assumindo total responsabilidade por minha participação e pelas pessoas que me acompanham no evento desta data.
            </p>
          </div>
        )}

        {saved ? (
          <div className="success-message">
            <h2>Termo aceito com sucesso!</h2>
            <p>Obrigado, {nome}. Você e seus companheiros estão prontos para o jogo.</p>
          </div>
        ) : (
          <form className="termo-form" onSubmit={handleSubmit}>
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
              <label htmlFor="data">Data e Horário</label>
              <input
                type="text"
                id="data"
                value={dataAtual}
                readOnly
                disabled
              />
            </div>

            <button type="submit" className="btn-aceitar" disabled={isLoading}>
              {isLoading ? "Enviando..." : "Eu aceito"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
