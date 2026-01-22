# Lendas Room - Landing Page

Landing page profissional para Escape Room com integração ao Google Sheets.

## 🚀 Tecnologias

- React 18 + TypeScript
- Vite
- CSS Modules
- Google Sheets Integration (Fetch API)

## 📦 Instalação

```bash
# Instalar dependências
pnpm install

# Iniciar servidor de desenvolvimento
pnpm run dev
```

## ⚙️ Configuração do Google Sheets

Para conectar o formulário de contato ao Google Sheets:

1. Leia o guia completo em [GOOGLE_APPS_SCRIPT.md](GOOGLE_APPS_SCRIPT.md)
2. Configure o Google Apps Script na sua planilha
3. Copie o arquivo `.env.example` para `.env`
4. Adicione a URL do script no arquivo `.env`

```bash
# .env
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/SUA_SCRIPT_ID/exec
```

## 🎨 Design System

- **Títulos**: Archivo Black
- **Textos**: Karma
- Consulte [docs/design-system.md](docs/design-system.md) para mais detalhes

## 📋 Funcionalidades

- ✅ Design responsivo (mobile-first)
- ✅ Formulário de contato integrado ao Google Sheets
- ✅ Feedback visual de envio
- ✅ Validação de formulário
- ✅ SEO otimizado
- ✅ Acessibilidade (WCAG)

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
