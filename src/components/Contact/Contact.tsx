import { useState, type FormEvent } from "react";
import "./Contact.css";
import familiaImg from "../../assets/img-familia.png";
import { sendToGoogleSheets } from "../../services/googleSheets";

export const Contact = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | "">(
    "",
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validação básica
    if (!email && !phone) {
      setSubmitMessage(
        "Por favor, preencha pelo menos um campo (email ou telefone)",
      );
      setSubmitStatus("error");
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");
    setSubmitStatus("");

    try {
      const result = await sendToGoogleSheets({ email, phone });

      if (result.success) {
        setSubmitMessage(
          "✓ Cadastro realizado com sucesso! Você receberá seu cupom de 20% em breve.",
        );
        setSubmitStatus("success");
        // Limpar os campos após sucesso
        setEmail("");
        setPhone("");
      } else {
        setSubmitMessage(
          result.message || "Erro ao enviar dados. Tente novamente.",
        );
        setSubmitStatus("error");
      }
    } catch {
      setSubmitMessage("Erro ao processar solicitação. Tente novamente.");
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);

      // Limpar mensagem após 5 segundos
      setTimeout(() => {
        setSubmitMessage("");
        setSubmitStatus("");
      }, 5000);
    }
  };

  return (
    <section id="contact" className="contact" aria-labelledby="contact-title">
      <div className="contact__container">
        <div className="contact__content">
          <h2 id="contact-title" className="contact__title">
            VOCÊ CONSEGUE ESCAPAR EM 60 MINUTOS?
          </h2>

          <p className="contact__description">
            Escreva seu email ou whatsapp para garantir{" "}
            <span className="contact__description--highlight">
              20% de desconto
            </span>{" "}
            na estreia do Lendas Escape room
          </p>

          <form className="contact__form" onSubmit={handleSubmit}>
            <div className="contact__form-group">
              <input
                type="email"
                placeholder="Digite seu email"
                className="contact__input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                aria-label="Digite seu email"
              />
              <span className="contact__form-separator">Ou</span>
              <input
                type="tel"
                placeholder="(00) 00000-0000"
                className="contact__input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isSubmitting}
                aria-label="Digite seu telefone"
              />
              <button
                type="submit"
                className="contact__button"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enviando..." : "Enviar"}
              </button>
            </div>

            {submitMessage && (
              <div
                className={`contact__message contact__message--${submitStatus}`}
                role="alert"
              >
                {submitMessage}
              </div>
            )}
          </form>
        </div>

        <div className="contact__image-wrapper">
          <img
            src={familiaImg}
            alt="Família jogando escape room"
            className="contact__image"
          />
          <div className="contact__image-overlay">
            <p className="contact__image-text">
              ESCAPE PARA TODA A<br />
              <span className="contact__image-text--highlight">FAMÍLIA</span>
            </p>
            <div className="contact__image-icon">
              <svg
                width="45"
                height="44"
                viewBox="0 0 45 44"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="26.6285"
                  y="12.3352"
                  width="6"
                  height="37.6585"
                  rx="1"
                  transform="rotate(45 26.6285 12.3352)"
                  fill="#F95738"
                />
                <rect
                  x="6.2616"
                  y="39.0969"
                  width="4.08899"
                  height="6.48614"
                  rx="1"
                  transform="rotate(-45 6.2616 39.0969)"
                  fill="#F95738"
                />
                <rect
                  x="11.286"
                  y="34.8914"
                  width="4.08899"
                  height="7.23025"
                  rx="1"
                  transform="rotate(-45 11.286 34.8914)"
                  fill="#F95738"
                />
                <circle
                  cx="34.286"
                  cy="18"
                  r="5"
                  stroke="#BD3920"
                  strokeWidth="4"
                />
                <circle
                  cx="37.286"
                  cy="7"
                  r="5"
                  stroke="#BD3920"
                  strokeWidth="4"
                />
                <circle
                  cx="25.286"
                  cy="9"
                  r="5"
                  stroke="#BD3920"
                  strokeWidth="4"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
