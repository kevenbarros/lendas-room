# Lendas Match Server

Backend Node para gerar agrupamentos via IA local (Ollama). Pode ser acoplado a outro backend Node existente — basta copiar `index.js`, `promptBuilder.js` e `ollama.js`.

## Pré-requisitos

1. **Node 18+** (tem `fetch` nativo).
2. **Ollama** rodando localmente. Instalar em [ollama.com](https://ollama.com) e baixar um modelo:
   ```bash
   ollama pull llama3.1
   ```
   Alternativas boas para matchmaking: `llama3.1:8b`, `mistral`, `qwen2.5`.

## Rodar

```bash
cd server
npm install
npm start
```

Servidor sobe em `http://localhost:3001`.

### Variáveis de ambiente (opcionais)

| Var            | Default                   | Descrição                         |
| -------------- | ------------------------- | --------------------------------- |
| `PORT`         | `3001`                    | Porta HTTP                        |
| `OLLAMA_URL`   | `http://localhost:11434`  | Endereço da API Ollama            |
| `OLLAMA_MODEL` | `llama3.1`                | Modelo a usar                     |

Exemplo (Windows PowerShell):
```powershell
$env:OLLAMA_MODEL="mistral"; npm start
```

## Endpoints

- `GET /health` — ping de vida.
- `POST /api/match` — gera grupos. Body:
  ```json
  {
    "players": [ /* MatchPlayer[] do Google Sheets */ ],
    "numGroups": 2,
    "playersPerGroup": 7
  }
  ```
  Resposta:
  ```json
  { "success": true, "response": "texto markdown com os grupos" }
  ```

## Frontend

A página `/admin` chama este backend em `http://localhost:3001` por padrão. Para mudar, configure `VITE_LOCAL_AI_URL` no `.env` do projeto raiz.
