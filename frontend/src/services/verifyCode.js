// import api from "./api";

export const verifyCodeMock = ({ code, flowType, email }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const validCode = "123456";

      if (code === validCode) {
        resolve({
          success: true,
          message: flowType === "signup"
            ? "Cadastro confirmado com sucesso!"
            : "Código de recuperação válido!"
        });
      } else {
        resolve({
          success: false,
          message: "Código incorreto!"
        });
      }
    }, 800);
  });
};

/*
export const verifyCode = async ({ code, email }) => {
  try {
    const response = await api.post("/verify-code", { email, code });
    // Backend must return a message like: { success: true, message: "..." }
    return response.data;
  } catch (error) {
    // If there's any errors
    return {
      success: false,
      message: "Erro ao verificar código!"
    };
  }
};
*/

export default verifyCodeMock;
