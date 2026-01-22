# 🔍 Guia de Troubleshooting - Google Sheets Integration

## ⚠️ A tabela não está atualizando?

Siga este checklist passo a passo:

---

## ✅ Passo 1: Verificar o Google Apps Script

### 1.1. Abra o Editor do Apps Script
1. Acesse sua planilha: https://docs.google.com/spreadsheets/d/1ni0YfC_wGqHL_VPKiSz6ZEx-TypIdg8Sbx7obleVuEo/edit
2. Clique em **Extensões** > **Apps Script**

### 1.2. Verifique se o código está correto
Cole este código (substitua todo o conteúdo):

```javascript
function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    const timestamp = e.parameter.timestamp || new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    const email = e.parameter.email || '';
    const phone = e.parameter.phone || '';
    
    sheet.appendRow([timestamp, email, phone]);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Dados salvos com sucesso!',
        row: sheet.getLastRow()
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: 'Erro: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

### 1.3. Salve o script
- Clique no ícone de disquete ou pressione **Ctrl+S**

---

## ✅ Passo 2: Testar o Script Diretamente

### 2.1. Adicione função de teste
Cole este código adicional no Apps Script:

```javascript
function testarFormulario() {
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
```

### 2.2. Execute o teste
1. Selecione a função **testarFormulario** no menu dropdown
2. Clique em **Executar** (▶️)
3. Autorize o script quando solicitado
4. Verifique se uma nova linha aparece na planilha com os dados de teste

**Se a linha NÃO aparecer:** O problema está no script ou nas permissões.
**Se a linha APARECER:** O script está funcionando, o problema é na conexão do frontend.

---

## ✅ Passo 3: Reimplantar o Script

### 3.1. Faça uma nova implantação
1. Clique em **Implantar** > **Gerenciar implantações**
2. Clique no ícone de **lápis** (editar) na implantação existente
3. Em "Versão", selecione **Nova versão**
4. Clique em **Implantar**
5. **Copie a nova URL** (ela mudará)

### 3.2. Atualize a URL no projeto
1. Abra o arquivo `.env` na raiz do projeto
2. Substitua pela nova URL:

```env
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/NOVA_URL_AQUI/exec
```

3. Reinicie o servidor:
```bash
pnpm run dev
```

---

## ✅ Passo 4: Verificar Permissões

Certifique-se de que na implantação:
- ✅ **Executar como:** Eu (seu email)
- ✅ **Quem tem acesso:** **Qualquer pessoa**

Se estiver diferente, edite a implantação e mude.

---

## ✅ Passo 5: Testar o Formulário com Debug

### 5.1. Abra o Console do Navegador
1. Abra a página: http://localhost:5173
2. Pressione **F12** para abrir o DevTools
3. Vá na aba **Console**

### 5.2. Preencha e envie o formulário
Observe as mensagens no console:
- ✅ **"Dados enviados com sucesso!"** - A requisição foi enviada
- ❌ **Erros de rede** - Problema de conexão ou URL incorreta

### 5.3. Verifique a aba Network
1. Na DevTools, vá para a aba **Network**
2. Preencha e envie o formulário
3. Procure pela requisição para `script.google.com`
4. Clique nela e verifique:
   - **Status:** Deve ser 200 (OK)
   - **Headers:** Veja os parâmetros enviados

---

## ✅ Passo 6: Testar a URL Diretamente no Navegador

Teste se o script está respondendo:

1. Copie sua URL do Apps Script
2. Adicione parâmetros de teste:
```
https://script.google.com/macros/s/SUA_URL/exec?email=teste@teste.com&phone=123456789&timestamp=22/01/2026
```
3. Cole no navegador e pressione Enter
4. Você deve ver uma resposta JSON
5. **Verifique se uma nova linha apareceu na planilha**

---

## 🐛 Problemas Comuns e Soluções

### Problema 1: "URL não configurada"
**Solução:** Verifique se o arquivo `.env` existe e tem a URL correta

### Problema 2: "Requisição enviada mas nada acontece"
**Solução:** 
- Verifique se reimplantou o script após fazer alterações
- Certifique-se de estar editando a planilha correta
- Verifique se a função `doGet` está salva no Apps Script

### Problema 3: "Erro 404"
**Solução:** A URL do script está incorreta. Reimplante e copie a URL novamente.

### Problema 4: "Access Denied"
**Solução:** Configure "Quem tem acesso" como "Qualquer pessoa" na implantação

---

## 📊 Verificação Final

Faça este teste completo:

1. ✅ Script do Apps Script está salvo e correto
2. ✅ Função `testarFormulario()` executada com sucesso
3. ✅ Script reimplantado com permissões corretas
4. ✅ URL atualizada no arquivo `.env`
5. ✅ Servidor reiniciado (`pnpm run dev`)
6. ✅ Console do navegador não mostra erros
7. ✅ Requisição aparece na aba Network com status 200
8. ✅ Dados aparecem na planilha do Google Sheets

---

## 💡 Dica Extra

Se nada funcionar, faça um teste direto:

```javascript
// No Apps Script, adicione e execute esta função
function testeManual() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.appendRow([new Date().toLocaleString('pt-BR'), 'teste@email.com', '123456789']);
  Logger.log('Linha adicionada!');
}
```

Se isso funcionar, o problema está na conexão entre o frontend e o Apps Script.

---

## 🆘 Precisa de Ajuda?

Se seguiu todos os passos e ainda não funciona:

1. Compartilhe o erro exato do console do navegador
2. Verifique se a URL no `.env` termina com `/exec`
3. Teste a URL diretamente no navegador com os parâmetros
4. Verifique se há algum bloqueio de firewall/antivírus
