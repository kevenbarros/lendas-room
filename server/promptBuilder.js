export function buildMatchPrompt(players, { numGroups, playersPerGroup }) {
  const totalNeeded = numGroups * playersPerGroup;

  const playersBlock = players
    .map((p, i) => {
      return [
        `Jogador ${i + 1}:`,
        `- Nome: ${p.nome}`,
        `- Idade: ${p.idade}`,
        `- WhatsApp: ${p.whatsapp}`,
        `- Persona 1: ${p.topPersona1}`,
        `- Persona 2: ${p.topPersona2}`,
        `- Título combinado: ${p.resultadoTitulo}`,
        `- Esportes: ${p.esportes || "-"}`,
        `- Jogos: ${p.jogos || "-"}${p.jogosOutros ? ` | outros: ${p.jogosOutros}` : ""}`,
        `- Filmes/séries: ${p.filmes || "-"}`,
        `- Hobbies: ${p.hobbies || "-"}`,
        `- Música: ${p.musica || "-"}`,
        `- Dias disponíveis: ${p.dias || "-"}`,
        `- Turnos: ${p.turnos || "-"}`,
      ].join("\n");
    })
    .join("\n\n");

  return `Você é um especialista em matchmaking social para um Escape Room em Belém do Pará.

# Objetivo
Forme **${numGroups} grupo(s)** de exatamente **${playersPerGroup} jogadores cada** (${totalNeeded} pessoas no total) a partir da lista abaixo, conectando pessoas que não se conhecem e têm chance real de se divertirem juntas.

# Regras de formação dos grupos
1. Cada grupo deve ter **${playersPerGroup} jogadores**.
2. **Disponibilidade é o filtro mais importante**: agrupe apenas pessoas com sobreposição clara de dias e turnos.
3. **Equilíbrio de personas**:
   - Pelo menos 1 "Líder" ou "Estratégico".
   - Pelo menos 1 "Comunicador" ou "Alívio Cômico".
   - Pelo menos 1 "Investigador" ou "Observador".
   - Pelo menos 1 "Executor" ou "Tenta-Tudo".
   - Evite grupos com 3+ "Líderes" ou concentração de um único tipo analítico.
4. **Afinidade de interesses**: priorize overlap em jogos, filmes/séries, hobbies ou música.
5. **Faixa etária**: diferença máxima de ~10 anos, salvo se os interesses forem muito alinhados.
6. Se sobrar gente, liste em "Não alocados" explicando o motivo.

# Formato da resposta
Para cada grupo retorne:

## Grupo N — [nome temático curto]
**Jogadores (WhatsApp):**
- Nome (WhatsApp) — Persona principal

**Por que este grupo funciona:**
- 2 a 4 bullets curtos sobre a química.

**Sugestão de abordagem:**
- 1 frase sobre como apresentar o grupo no WhatsApp.

Depois dos grupos, inclua "Não alocados" se houver.

# Lista de jogadores (${players.length} cadastrados)

${playersBlock}
`;
}
