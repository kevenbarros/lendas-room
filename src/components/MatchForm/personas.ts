export type Persona =
  | "Líder"
  | "Estratégico"
  | "Investigador"
  | "Executor"
  | "Tenta-Tudo"
  | "Comunicador"
  | "Observador"
  | "Alívio Cômico";

export const PERSONAS: Persona[] = [
  "Líder",
  "Estratégico",
  "Investigador",
  "Executor",
  "Tenta-Tudo",
  "Comunicador",
  "Observador",
  "Alívio Cômico",
];

export const PERSONA_INFO: Record<
  Persona,
  { emoji: string; short: string; desc: string }
> = {
  "Líder": {
    emoji: "👑",
    short: "Líder",
    desc: "Organiza, decide e inspira o grupo. Sabe o momento certo de agir.",
  },
  "Estratégico": {
    emoji: "🧠",
    short: "Estratégico",
    desc: "Pensa antes de agir. Resolve enigmas usando lógica e planejamento.",
  },
  "Investigador": {
    emoji: "🔍",
    short: "Investigador",
    desc: "Explora cada canto, caça pistas e não deixa nada passar despercebido.",
  },
  "Executor": {
    emoji: "⚡",
    short: "Executor",
    desc: "Age rápido e testa soluções no movimento. Mão na massa sempre.",
  },
  "Tenta-Tudo": {
    emoji: "🎲",
    short: "Tenta-Tudo",
    desc: "Aposta em qualquer hipótese. Coragem e improviso são seus trunfos.",
  },
  "Comunicador": {
    emoji: "🗣️",
    short: "Comunicador",
    desc: "Mantém o grupo conectado. Organiza ideias e facilita a colaboração.",
  },
  "Observador": {
    emoji: "👀",
    short: "Observador",
    desc: "Nota padrões e detalhes sutis que os outros nem percebem.",
  },
  "Alívio Cômico": {
    emoji: "😄",
    short: "Alívio Cômico",
    desc: "Quebra a tensão com humor e mantém a energia do grupo em alta.",
  },
};

export interface QuestionOption {
  value: string;
  label: string;
  scores: Partial<Record<Persona, number>>;
}

export interface Question {
  id: string;
  title: string;
  context: string;
  options: QuestionOption[];
}

export const QUESTIONS: Question[] = [
  {
    id: "p1",
    title: "Tomada de decisão",
    context: "Quando você está em grupo resolvendo um problema:",
    options: [
      { value: "A", label: "Organizo o grupo e direciono", scores: { "Líder": 2 } },
      { value: "B", label: "Analiso antes de agir", scores: { "Estratégico": 2 } },
      { value: "C", label: "Procuro pistas e detalhes", scores: { "Investigador": 2 } },
      { value: "D", label: "Testo rapidamente", scores: { "Executor": 2 } },
      { value: "E", label: "Tento qualquer possibilidade", scores: { "Tenta-Tudo": 2 } },
      { value: "F", label: "Observo antes de agir", scores: { "Observador": 2 } },
      { value: "G", label: "Mantenho todos alinhados", scores: { "Comunicador": 2 } },
      { value: "H", label: "Faço piadas e deixo leve", scores: { "Alívio Cômico": 2 } },
    ],
  },
  {
    id: "p2",
    title: "Sob pressão",
    context: "Quando o tempo está acabando:",
    options: [
      { value: "A", label: "Lidero as decisões", scores: { "Líder": 2 } },
      { value: "B", label: "Penso com calma", scores: { "Estratégico": 2 } },
      { value: "C", label: "Continuo investigando", scores: { "Investigador": 2 } },
      { value: "D", label: "Saio testando tudo", scores: { "Executor": 1, "Tenta-Tudo": 1 } },
      { value: "E", label: "Observo o comportamento do grupo", scores: { "Observador": 2 } },
      { value: "F", label: "Motivo o time", scores: { "Comunicador": 2 } },
      { value: "G", label: "Faço piadas", scores: { "Alívio Cômico": 2 } },
    ],
  },
  {
    id: "p3",
    title: "Contribuição no jogo",
    context: "O que você mais gosta de fazer:",
    options: [
      { value: "A", label: "Organizar", scores: { "Líder": 2 } },
      { value: "B", label: "Resolver enigmas", scores: { "Estratégico": 2 } },
      { value: "C", label: "Explorar ambiente", scores: { "Investigador": 2 } },
      { value: "D", label: "Agir e testar", scores: { "Executor": 2 } },
      { value: "E", label: "Improvisar", scores: { "Tenta-Tudo": 2 } },
      { value: "F", label: "Observar padrões", scores: { "Observador": 2 } },
      { value: "G", label: "Conversar", scores: { "Comunicador": 2 } },
      { value: "H", label: "Animar o grupo", scores: { "Alívio Cômico": 2 } },
    ],
  },
  {
    id: "p4",
    title: "Comportamento social",
    context: "Em um grupo novo, você:",
    options: [
      { value: "A", label: "Assume o controle", scores: { "Líder": 2 } },
      { value: "B", label: "Fica analisando", scores: { "Estratégico": 1, "Observador": 1 } },
      { value: "C", label: "Explora sozinho", scores: { "Investigador": 2 } },
      { value: "D", label: "Vai direto agir", scores: { "Executor": 2 } },
      { value: "E", label: "Interage com todos", scores: { "Comunicador": 2 } },
      { value: "F", label: "Brinca com o grupo", scores: { "Alívio Cômico": 2 } },
      { value: "G", label: "Vai no improviso", scores: { "Tenta-Tudo": 2 } },
    ],
  },
  {
    id: "p5",
    title: "Risco",
    context: "Você prefere:",
    options: [
      { value: "A", label: "Planejar", scores: { "Estratégico": 2 } },
      { value: "B", label: "Testar", scores: { "Executor": 2 } },
      { value: "C", label: "Arriscar sem pensar", scores: { "Tenta-Tudo": 2 } },
      { value: "D", label: "Observar primeiro", scores: { "Observador": 2 } },
    ],
  },
  {
    id: "p6",
    title: "Organização",
    context: "Você gosta de liderar e organizar?",
    options: [
      { value: "A", label: "Sim", scores: { "Líder": 2 } },
      { value: "B", label: "Às vezes", scores: { "Líder": 1 } },
      { value: "C", label: "Não", scores: {} },
    ],
  },
  {
    id: "p7",
    title: "Humor",
    context: "Você faz piadas durante desafios?",
    options: [
      { value: "A", label: "Muito", scores: { "Alívio Cômico": 2 } },
      { value: "B", label: "Às vezes", scores: { "Alívio Cômico": 1 } },
      { value: "C", label: "Nunca", scores: {} },
    ],
  },
  {
    id: "p8",
    title: "Atenção",
    context: "Você percebe detalhes que outros não veem?",
    options: [
      { value: "A", label: "Sim", scores: { "Investigador": 1, "Observador": 1 } },
      { value: "B", label: "Às vezes", scores: { "Investigador": 0.5, "Observador": 0.5 } },
      { value: "C", label: "Não", scores: {} },
    ],
  },
];

export function calculateScores(
  answers: Record<string, string>,
): Record<Persona, number> {
  const scores: Record<Persona, number> = {
    "Líder": 0,
    "Estratégico": 0,
    "Investigador": 0,
    "Executor": 0,
    "Tenta-Tudo": 0,
    "Comunicador": 0,
    "Observador": 0,
    "Alívio Cômico": 0,
  };

  for (const question of QUESTIONS) {
    const answer = answers[question.id];
    if (!answer) continue;
    const option = question.options.find((o) => o.value === answer);
    if (!option) continue;
    for (const [persona, score] of Object.entries(option.scores)) {
      scores[persona as Persona] += score as number;
    }
  }

  return scores;
}

export function getTop2Personas(
  scores: Record<Persona, number>,
): [Persona, Persona] {
  const sorted = [...PERSONAS].sort((a, b) => scores[b] - scores[a]);
  return [sorted[0], sorted[1]];
}

const COMBO_TITLES: Record<string, string> = {
  "Líder|Estratégico": "Estrategista Líder",
  "Líder|Investigador": "Líder Detetive",
  "Líder|Executor": "Líder Ativo",
  "Líder|Comunicador": "Líder Carismático",
  "Líder|Observador": "Líder Tático",
  "Líder|Alívio Cômico": "Líder Descontraído",
  "Líder|Tenta-Tudo": "Líder Ousado",
  "Estratégico|Investigador": "Mente Analítica",
  "Estratégico|Executor": "Estrategista Ativo",
  "Estratégico|Observador": "Tático Observador",
  "Estratégico|Comunicador": "Estrategista Social",
  "Estratégico|Tenta-Tudo": "Estrategista Ousado",
  "Estratégico|Alívio Cômico": "Estrategista Descontraído",
  "Investigador|Observador": "Caçador de Pistas",
  "Investigador|Executor": "Explorador Ativo",
  "Investigador|Tenta-Tudo": "Investigador Audaz",
  "Investigador|Comunicador": "Investigador Social",
  "Investigador|Alívio Cômico": "Investigador Descontraído",
  "Executor|Tenta-Tudo": "Testador Caótico",
  "Executor|Observador": "Executor Atento",
  "Executor|Comunicador": "Executor Coletivo",
  "Executor|Alívio Cômico": "Executor Animado",
  "Tenta-Tudo|Observador": "Experimentador Cauteloso",
  "Tenta-Tudo|Comunicador": "Improvisador Social",
  "Tenta-Tudo|Alívio Cômico": "Caótico Divertido",
  "Comunicador|Observador": "Comunicador Atento",
  "Comunicador|Alívio Cômico": "Animador do Grupo",
  "Observador|Alívio Cômico": "Observador Sagaz",
};

export function getComboTitle(top1: Persona, top2: Persona): string {
  const key = [top1, top2].sort().join("|");
  const custom = COMBO_TITLES[key];
  if (custom) return custom;
  return `${PERSONA_INFO[top1].short} ${PERSONA_INFO[top2].short}`;
}
