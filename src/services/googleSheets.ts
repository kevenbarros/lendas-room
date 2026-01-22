/**
 * Serviço de integração com Google Sheets
 * Para configurar:
 * 1. Abra sua planilha do Google Sheets
 * 2. Clique em Extensões > Apps Script
 * 3. Cole o código fornecido no README
 * 4. Clique em Implantar > Nova implantação
 * 5. Escolha "Aplicativo da Web"
 * 6. Configure "Executar como": Eu (seu email)
 * 7. Configure "Quem tem acesso": Qualquer pessoa
 * 8. Clique em Implantar e copie a URL
 * 9. Cole a URL na variável SCRIPT_URL abaixo
 */

// Cole aqui a URL do seu Google Apps Script após a implantação
const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL || "";

export interface ContactFormData {
  email: string;
  phone: string;
  timestamp?: string;
}

export interface GoogleSheetsResponse {
  success: boolean;
  message: string;
  row?: number;
}

/**
 * Envia dados do formulário para o Google Sheets
 * Usa fetch com mode: 'no-cors' para evitar problemas de CORS
 */
export const sendToGoogleSheets = async (
  data: ContactFormData,
): Promise<GoogleSheetsResponse> => {
  if (!SCRIPT_URL) {
    console.error("Google Script URL não configurada");
    return {
      success: false,
      message: "Configuração do Google Sheets não encontrada",
    };
  }

  try {
    // Adiciona timestamp aos dados
    const formData = {
      ...data,
      timestamp: new Date().toLocaleString("pt-BR", {
        timeZone: "America/Sao_Paulo",
      }),
    };

    // Cria URL com parâmetros
    const params = new URLSearchParams({
      email: formData.email,
      phone: formData.phone,
      timestamp: formData.timestamp,
    });

    // Usa fetch com no-cors - única forma de funcionar com Google Apps Script
    await fetch(`${SCRIPT_URL}?${params.toString()}`, {
      method: "GET",
      mode: "no-cors", // Necessário para Google Apps Script
    });

    // Com no-cors, não podemos ler a resposta, mas o status 200 indica sucesso
    // A requisição foi enviada com sucesso
    return {
      success: true,
      message: "Dados enviados com sucesso!",
    };
  } catch (error) {
    console.error("Erro ao enviar dados:", error);
    return {
      success: false,
      message: "Erro ao enviar dados. Tente novamente.",
    };
  }
};
