# Configuração do Google Apps Script

## Passo a Passo para Configurar a Integração com Google Sheets

### 1. Abra sua Planilha do Google Sheets
Acesse: https://docs.google.com/spreadsheets/d/1ni0YfC_wGqHL_VPKiSz6ZEx-TypIdg8Sbx7obleVuEo/edit

### 2. Configure as Colunas da Planilha

#### Aba 1 (Primeira aba) - Contatos
Na primeira linha (cabeçalho) da primeira aba, adicione:
- **A1**: Data/Hora
- **B1**: Email
- **C1**: Telefone

#### Aba 2 (Segunda aba) - Interesse nas Salas
1. Crie uma segunda aba/planilha (clique no **+** no canto inferior esquerdo)
2. Renomeie para **"Salas"** ou **"Interesse"**
3. Na primeira linha (cabeçalho), adicione:
- **A1**: Data/Hora
- **B1**: Sala
- **C1**: Total

4. Na segunda linha, adicione os contadores iniciais:
- **A2**: (deixe vazio)
- **B2**: iluminado
- **C2**: 0

- **A3**: (deixe vazio)
- **B3**: matinta
- **C3**: 0

- **A4**: (deixe vazio)
- **B4**: tesouro
- **C4**: 0

### 3. Abra o Editor do Apps Script
- Clique em **Extensões** > **Apps Script**
- Apague qualquer código existente

### 4. Cole o Código Abaixo

**IMPORTANTE: Cole TODO este código, substituindo TUDO que estiver no editor.**

```javascript
/**
 * Configuração do Google Apps Script para Lendas Escape Room
 * 
 * Aba 1: Contatos (emails e telefones)
 * Aba 2: Interesse nas Salas (contador de cliques)
 */

/**
 * Função para receber dados de contato via GET
 */
function doGet(e) {
  try {
    // Verifica se é tracking de sala ou contato
    if (e.parameter.action === 'trackRoom') {
      return trackRoomInterest(e);
    }
    
    // Caso contrário, trata como contato
    return saveContact(e);
    
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: 'Erro: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Salva dados de contato na primeira aba
 */
function saveContact(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  
  const timestamp = e.parameter.timestamp || new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
  const email = e.parameter.email || '';
  const phone = e.parameter.phone || '';
  
  sheet.appendRow([timestamp, email, phone]);
  
  return ContentService
    .createTextOutput(JSON.stringify({
      success: true,
      message: 'Contato salvo com sucesso!',
      row: sheet.getLastRow()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Registra interesse em uma sala e atualiza contador na segunda aba
 */
function trackRoomInterest(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Tenta pegar a segunda aba, ou cria se não existir
  let sheet = ss.getSheets()[1];
  if (!sheet) {
    sheet = ss.insertSheet('Salas');
    // Configura cabeçalhos e contadores iniciais
    sheet.appendRow(['Data/Hora', 'Sala', 'Total']);
    sheet.appendRow(['', 'iluminado', 0]);
    sheet.appendRow(['', 'matinta', 0]);
    sheet.appendRow(['', 'tesouro', 0]);
  }
  
  const room = e.parameter.room || '';
  const timestamp = e.parameter.timestamp || new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
  
  // Encontra a linha da sala e incrementa o contador
  const data = sheet.getDataRange().getValues();
  let updated = false;
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === room) {
      // Atualiza timestamp e incrementa contador
      sheet.getRange(i + 1, 1).setValue(timestamp);
      const currentCount = data[i][2] || 0;
      sheet.getRange(i + 1, 3).setValue(currentCount + 1);
      updated = true;
      break;
    }
  }
  
  // Se a sala não foi encontrada, adiciona nova linha
  if (!updated) {
    sheet.appendRow([timestamp, room, 1]);
  }
  
  return ContentService
    .createTextOutput(JSON.stringify({
      success: true,
      message: 'Interesse registrado com sucesso!',
      room: room
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Função de teste para contatos
 */
function testarContato() {
  const testData = {
    parameter: {
      email: 'teste@example.com',
      phone: '(11) 99999-9999',
      timestamp: new Date().toLocaleString('pt-BR')
    }
  };
  
  const resultado = doGet(testData);
  Logger.log(resultado.getContent());
}

/**
 * Função de teste para tracking de salas
 */
function testarSala() {
  const testData = {
    parameter: {
      action: 'trackRoom',
      room: 'iluminado',
      timestamp: new Date().toLocaleString('pt-BR')
    }
  };
  
  const resultado = doGet(testData);
  Logger.log(resultado.getContent());
  
  Logger.log('Execute esta função 3 vezes e veja o contador aumentar na segunda aba!');
}
```
      email: 'teste@example.com',
      phone: '(11) 99999-9999',
      timestamp: new Date().toLocaleString('pt-BR')
    }
  };
  
  const result = doGet(testData);
  Logger.log(result.getContent());
}
```

### 5. Salve o Projeto
- Clique no ícone de disquete ou **Ctrl+S**
- Dê um nome ao projeto (ex: "Lendas Room - Formulário")

### 6. Implante o Script como Aplicativo Web

**ATENÇÃO: Se você já tinha uma implantação, precisa criar uma NOVA VERSÃO**

#### 6.1. Se é a primeira vez:
1. Clique em **Implantar** > **Nova implantação**
2. Clique no ícone de engrenagem ⚙️ e selecione **Aplicativo da Web**

#### 6.2. Se já tinha implantado antes (SEU CASO):
1. Clique em **Implantar** > **Gerenciar implantações**
2. Clique no ícone de **lápis** (✏️ editar) na implantação existente
3. Em **"Versão"**, clique e selecione **"Nova versão"**

#### 6.3. Configure a implantação:
   - **Descrição**: Formulário de Contato - Lendas Room
   - **Executar como**: Eu (seu email)
   - **Quem tem acesso**: **Qualquer pessoa**
4. Clique em **Implantar** ou **Atualizar** (se estiver editando)
5. Se aparecer um aviso de segurança:
   - Clique em **Avançado**
   - Clique em **Ir para [nome do projeto] (não seguro)**
   - Clique em **Permitir**
6. **Copie a URL do aplicativo da Web** (algo como: `https://script.google.com/macros/s/AKfycby.../exec`)
   - ⚠️ **IMPORTANTE**: Se você editou uma versão existente, a URL será DIFERENTE da anterior!

### 7. Configure a Variável de Ambiente no Projeto

1. Crie um arquivo `.env` na raiz do projeto (se não existir)
2. Adicione a URL copiada:

```env
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/SUA_SCRIPT_ID/exec
```

3. Substitua `SUA_SCRIPT_ID` pela URL real que você copiou

### 8. Teste a Integração

1. Reinicie o servidor de desenvolvimento:
```bash
pnpm run dev
```

2. Acesse a página e preencha o formulário
3. Verifique se os dados aparecem na planilha do Google Sheets

## Solução de Problemas

### Os dados não estão aparecendo na planilha?
- Verifique se você copiou a URL correta do Apps Script
- Certifique-se de que configurou "Quem tem acesso" como "Qualquer pessoa"
- Verifique se reiniciou o servidor após adicionar a variável de ambiente
- Abra o console do navegador (F12) para verificar se há erros na requisição

### Erro de permissão?
- Você precisa autorizar o script quando implantá-lo pela primeira vez
- Se aparecer um aviso de "App não verificado", clique em "Avançado" e depois "Ir para [nome do projeto] (não seguro)"

### Erro de CORS?
- O projeto usa `fetch` com modo `no-cors` para evitar problemas de CORS
- Com `no-cors`, a requisição é enviada mas não podemos ler a resposta
- Se o formulário limpar os campos, significa que funcionou corretamente
- Verifique os dados diretamente na planilha do Google Sheets

### A mensagem não aparece após enviar?
- Abra o console do navegador (F12) para ver se há erros
- Verifique se a URL do script está configurada corretamente no arquivo `.env`
- O modo `no-cors` impede a leitura da resposta, mas o formulário limpa os campos em caso de sucesso
- Confirme os dados diretamente na planilha do Google Sheets

## Segurança

- O script só aceita dados via POST
- Os dados são salvos diretamente na planilha
- Não há validação no servidor - adicione se necessário
- Para produção, considere adicionar rate limiting

## Estrutura dos Dados Salvos

Cada linha na planilha conterá:
| Data/Hora | Email | Telefone |
|-----------|-------|----------|
| 22/01/2026 14:30:00 | user@example.com | (11) 99999-9999 |
