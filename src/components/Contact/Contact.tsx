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
              <label className="visually-hidden" htmlFor="contact-email">
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                placeholder="Digite seu email"
                className="contact__input"
                value={email}
                onChange={(e) => setEmail(e.target.value.replace(/\s/g, ""))}
                disabled={isSubmitting}
                aria-label="Digite seu email"
              />
              <span className="contact__form-separator">Ou</span>
              <label className="visually-hidden" htmlFor="contact-phone">
                Telefone
              </label>
              <input
                id="contact-phone"
                type="tel"
                placeholder="(00) 00000-0000"
                className="contact__input"
                value={phone}
                onChange={(e) => {
                  let value = e.target.value;
                  value = value.replace(/\D/g, "");
                  value = value.replace(/^(\d{2})(\d)/, "($1) $2");
                  value = value.replace(/(\d)(\d{4})$/, "$1-$2");
                  setPhone(value);
                }}
                maxLength={15}
                disabled={isSubmitting}
                aria-label="Digite seu telefone"
              />
              <button
                type="submit"
                className="contact__button"
                disabled={isSubmitting}
                aria-label="Enviar cadastro"
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
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </section>
  );
};
