import { useEffect, useState } from "react";
import { Helmet } from "../../lib/helmet";
import lendasImg from "../../assets/lendas.png";
import "./ImgEnigma.css";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function ImgEnigma() {
  const [size, setSize] = useState<string>("—");

  useEffect(() => {
    fetch(lendasImg, { method: "HEAD" })
      .then((r) => {
        const len = r.headers.get("content-length");
        if (len) setSize(formatSize(parseInt(len, 10)));
      })
      .catch(() => setSize("—"));
  }, []);

  const timestamp = new Date().toISOString().replace("T", " ").slice(0, 19);

  return (
    <div className="img-enigma">
      <Helmet>
        <title>Arquivo · 001 | Lendas Escape Room</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <a href="/enigma" className="img-enigma__back" aria-label="Voltar ao enigma">
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
        <span>voltar</span>
      </a>

      <main className="img-enigma__vault" aria-label="Arquivo restrito">
        <header className="img-enigma__header">
          <div className="img-enigma__badge">
            <span className="img-enigma__badge-dot" aria-hidden="true" />
            restrito
          </div>
          <div className="img-enigma__id">LND-001</div>
        </header>

        <div className="img-enigma__stamp" aria-hidden="true">
          evidência
        </div>

        <h1 className="img-enigma__title">
          <span className="img-enigma__title-sub">arquivo de caso</span>
          <span className="img-enigma__title-main">lendas.png</span>
        </h1>

        <dl className="img-enigma__meta">
          <div className="img-enigma__row">
            <dt>origem</dt>
            <dd>Belém · PA</dd>
          </div>
          <div className="img-enigma__row">
            <dt>formato</dt>
            <dd>image/png</dd>
          </div>
          <div className="img-enigma__row">
            <dt>tamanho</dt>
            <dd>{size}</dd>
          </div>
          <div className="img-enigma__row">
            <dt>integridade</dt>
            <dd>
              <span className="img-enigma__ok">preservada</span>
            </dd>
          </div>
          <div className="img-enigma__row">
            <dt>acesso</dt>
            <dd>{timestamp} UTC</dd>
          </div>
        </dl>

        <a
          href={lendasImg}
          download="lendas.png"
          className="img-enigma__download"
        >
          <span className="img-enigma__download-icon" aria-hidden="true">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 3v13m0 0l-5-5m5 5l5-5M5 21h14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="img-enigma__download-label">
            baixar evidência
          </span>
          <span className="img-enigma__download-meta">.png · bruto</span>
        </a>

        <p className="img-enigma__note">
          &gt; acesso liberado · uso restrito ao investigador
          <span className="img-enigma__cursor" aria-hidden="true" />
        </p>
      </main>
    </div>
  );
}
