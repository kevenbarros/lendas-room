# 🎯 Tracking de Interesse nas Salas - Guia Rápido

## ✅ O que foi implementado

### Frontend
1. **Botões interativos** nos cards das salas
2. **Feedback visual** quando o usuário clica
3. **Estados de loading** durante o envio
4. **Mensagens de sucesso/erro**

### Backend (Google Sheets)
1. **Segunda aba** para rastrear interesse nas salas
2. **Sistema de contador** automático
3. **Registro de timestamp** de cada clique

---

## 📊 Estrutura da Planilha

### Aba 1: Contatos
```
| Data/Hora           | Email              | Telefone        |
|---------------------|--------------------|-----------------| 
| 22/01/2026 12:00:00 | user@example.com   | (11) 99999-9999 |
```

### Aba 2: Salas (Interesse)
```
| Data/Hora           | Sala       | Total |
|---------------------|------------|-------|
| 22/01/2026 12:15:00 | iluminado  | 5     |
| 22/01/2026 12:16:00 | matinta    | 3     |
| 22/01/2026 12:17:00 | tesouro    | 8     |
```

Cada vez que alguém clica em "Achei esse interessante", o contador aumenta automaticamente!

---

## 🚀 Como Configurar

### 1. Prepare a Planilha

#### Aba 1 (Contatos)
Já deve estar configurada com:
- A1: Data/Hora
- B1: Email  
- C1: Telefone

#### Aba 2 (Salas) - NOVA!
1. Clique no **+** no canto inferior esquerdo para criar nova aba
2. Renomeie para **"Salas"**
3. Configure assim:

```
A1: Data/Hora    | B1: Sala      | C1: Total
A2: (vazio)      | B2: iluminado | C2: 0
A3: (vazio)      | B3: matinta   | C3: 0
A4: (vazio)      | B4: tesouro   | C4: 0
```

### 2. Atualize o Google Apps Script

1. Vá em **Extensões** > **Apps Script**
2. **Substitua TODO o código** pelo novo código em [GOOGLE_APPS_SCRIPT.md](GOOGLE_APPS_SCRIPT.md)
3. **Salve** (Ctrl+S)

### 3. Reimplante o Script

**IMPORTANTE: Você PRECISA criar uma nova versão!**

1. **Implantar** > **Gerenciar implantações**
2. Clique no ícone de **lápis** ✏️
3. Em "Versão", selecione **"Nova versão"**
4. Clique em **Atualizar**
5. A URL pode mudar - copie a nova URL se necessário

### 4. Teste o Tracking de Salas

Execute a função de teste no Apps Script:

```javascript
// No Apps Script, execute esta função
testarSala()
```

Execute 3 vezes e veja o contador aumentar na segunda aba!

---

## 🎮 Como Funciona (Usuário)

1. Usuário rola até a seção "Salas"
2. Clica em **"Achei esse interessante"** em uma sala
3. Botão mostra "Registrando..."
4. Mensagem verde aparece: "✓ Interesse registrado com sucesso!"
5. Na planilha, o contador da sala aumenta automaticamente

---

## 📈 Monitorando os Dados

### Ver Total de Interessados por Sala
Abra a segunda aba da planilha e veja a coluna "Total":
- **Iluminado**: X pessoas interessadas
- **Matinta**: Y pessoas interessadas  
- **Tesouro**: Z pessoas interessadas

### Ver Histórico de Cliques
A coluna "Data/Hora" mostra quando foi o último clique em cada sala.

---

## 🔧 Testando Localmente

1. Reinicie o servidor: `pnpm run dev`
2. Acesse: http://localhost:5173
3. Role até a seção "Salas"
4. Clique em qualquer botão "Achei esse interessante"
5. Verifique a segunda aba da planilha

---

## 🐛 Troubleshooting

### Contador não aumenta?
- Verifique se criou a segunda aba com o nome "Salas"
- Certifique-se de reimplantar o script com nova versão
- Execute `testarSala()` no Apps Script para testar

### Mensagem de erro aparece?
- Verifique se a URL do script está correta no `.env`
- Abra o console do navegador (F12) para ver erros
- Confirme que reimplantou o script

### Dados vão para aba errada?
- Contatos devem ir para Aba 1
- Interesse nas salas deve ir para Aba 2
- Verifique o código do Apps Script

---

## 📝 Estrutura dos Arquivos

```
src/
├── services/
│   ├── googleSheets.ts      # Serviço de contatos
│   └── roomTracking.ts      # Serviço de tracking (NOVO)
├── components/
│   └── Rooms/
│       ├── Rooms.tsx         # Componente atualizado
│       └── Rooms.css         # Estilos com feedback
```

---

## ✨ Próximos Passos

Agora você pode:
- Analisar qual sala é mais popular
- Ver tendências de interesse ao longo do tempo
- Tomar decisões baseadas em dados reais
- Personalizar ofertas para as salas mais populares

Boa sorte! 🎉
