import type { MatchPlayer } from "../../services/googleSheets";

export interface MatchConfig {
  numGroups: number;
  playersPerGroup: number;
}

export function buildMatchPrompt(
  players: MatchPlayer[],
  config: MatchConfig,
): string {
  const { numGroups, playersPerGroup } = config;
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
        `- Amigos declarados (WhatsApp): ${p.amigos || "-"}`,
      ].join("\n");
    })
    .join("\n\n");

  return `Você é um especialista em matchmaking social para um Escape Room em Belém do Pará.

# Objetivo
Forme **${numGroups} grupo(s)** de exatamente **${playersPerGroup} jogadores cada** (${totalNeeded} pessoas no total) a partir da lista abaixo, conectando pessoas que não se conhecem e têm chance real de se divertirem juntas.

# Regras INVIOLÁVEIS (se quebrar qualquer uma, a resposta está errada)
- **Cada jogador aparece em EXATAMENTE UM grupo** ou na lista "Não alocados". Nunca repita um jogador em dois grupos. Nunca invente jogadores que não estão na lista.
- **Copie os WhatsApp EXATAMENTE como estão na lista** (mesmos dígitos, mesma formatação). Nunca altere, abrevie, reformate ou invente números. Se um número tem "(91) 9 9999-9999", copie assim, igual. Use copiar-e-colar mental.
- **Nome e WhatsApp têm que corresponder** ao mesmo jogador da lista. Não misture o nome de um com o telefone de outro.

# Regras de formação dos grupos
1. Cada grupo deve ter **${playersPerGroup} jogadores**.
2. **REGRA OBRIGATÓRIA — Amigos declarados**: se um jogador listar WhatsApp(s) em "Amigos declarados" e essas pessoas também estão cadastradas, elas **DEVEM** ficar no mesmo grupo. Esta regra vem antes de todas as outras de balanceamento. Se o amigo declarado não está na lista de cadastrados, ignore-o. Se o núcleo de amigos excede o tamanho do grupo, priorize o núcleo e comente no final.
3. **Disponibilidade**: agrupe apenas pessoas com sobreposição clara de dias e turnos. Se não houver overlap, não force o encaixe (exceto para amigos declarados, que sempre ficam juntos).
4. **Equilíbrio de personas** (muito importante para a dinâmica do jogo):
   - Pelo menos 1 "Líder" ou "Estratégico" (alguém que organize).
   - Pelo menos 1 "Comunicador" ou "Alívio Cômico" (alguém que mantenha a energia).
   - Pelo menos 1 "Investigador" ou "Observador" (alguém atento a detalhes).
   - Pelo menos 1 "Executor" ou "Tenta-Tudo" (alguém que tome ação).
   - Evite grupos com 3+ "Líderes" (choque de egos) ou concentração de um único tipo analítico.
5. **Afinidade de interesses**: priorize overlap em jogos, filmes/séries, hobbies ou música. Um interesse forte em comum já basta.
6. **Faixa etária**: mantenha diferença máxima de ~10 anos dentro do grupo, salvo se os interesses forem muito alinhados.
7. Se sobrar gente sem grupo adequado, liste separadamente em "Não alocados" explicando o motivo.

# Formato da resposta
Para cada grupo retorne:

## Grupo N — [nome temático curto, inspirado no perfil do grupo]
**Jogadores (WhatsApp):**
- Nome (WhatsApp) — Persona principal
- ...

**Por que este grupo funciona:**
- 2 a 4 bullets curtos explicando a química (personas complementares + interesses em comum + disponibilidade).

**Sugestão de abordagem:**
- 1 frase sobre como apresentar o grupo no WhatsApp (tom, gancho comum).

Depois dos grupos, inclua uma seção final **"Não alocados"** listando quem ficou de fora e por quê (se houver).

# Lista de jogadores (${players.length} cadastrados)

${playersBlock}
`;
}
