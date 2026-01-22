# Design System - Projeto Room (Furniture Landing Page)

Este documento serve como a única fonte de verdade para a interface. O Copilot deve seguir estas definições para manter a coerência visual.

## 1. Paleta de Cores
- **Dark Grey (Text/Primary):** `hsl(0, 0%, 27%)`
- **White (Background):** `hsl(0, 0%, 100%)` - #FFFFFF
- **Very Dark Grey (Header/Footer):** `hsl(0, 0%, 0%)`
- **Dark Navy (Header Background):** `hsl(229, 31%, 13%)` - #1a1d2e - #0F1020
- **Medium Grey (Description):** `hsl(0, 0%, 63%)`
- **Coral/Orange (CTA/Accent):** #F95738

## 2. Tipografia (Importante para SEO e Estilo)
- **Font-family:** 'League Spartan', sans-serif.
- **Weights:** 500 (Regular/Medium), 600 (Semi-bold), 700 (Bold).
- **H1 (Hero):** Bold, tamanho grande (~40px), line-height reduzido, semântica para SEO.
- **Body:** Regular, 12px ou 15px, espaçamento entre letras (letter-spacing) ligeiramente negativo.

## 3. Componentes Chave
- **Header:** 
  - Fundo: Dark Navy (#1a1d2e)
  - Logo: Ícone de chave + texto "room" (lowercase, branco)
  - Navigation: Links em branco, hover com sublinhado ou transição suave
  - Mobile: Menu hambúrguer com overlay
  - Posição: Fixed top, z-index alto
  - Padding: 1.5rem horizontal
- **Navigation:** Transparente sobre o Hero (se aplicável), links em minúsculo, hover com borda inferior.
- **Hero Slider:** Layout em grid. Desktop: Imagem (60%) | Texto (40%). Mobile: Imagem (Topo) | Texto (Base).
- **Buttons (CTA):** Texto em uppercase, ícone de seta (arrow-long), espaçamento largo entre letras. Sem fundo (ghost) ou fundo preto.
- **Section 'About':** Imagens laterais fixas e bloco de texto centralizado.

## 4. Comportamento Responsivo
- Breakpoint principal: 768px.
- No Mobile, o menu deve ser um Overlay (Hambúrguer).