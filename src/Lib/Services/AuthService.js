import { jwtDecode } from "jwt-decode";
import {
  saveSession,
  extractResponseData,
  getFriendlyErrorMessage,
  getStatusConnection,
  getByEndpoint,
  clearSession
} from "@utils/helpers";

const AuthService = {
  login: async (correo, password) => {
    try {
      const data = await getByEndpoint(`auth/login`, {
        documento:   correo,
        enpass: password,
      }, "post");

      const { token, usuario } = extractResponseData(data);

      if (!token) throw new Error("No se recibió un token de acceso.");

      saveSession({
        access: token,
        usuario
      });
      return { token, usuario };
    } catch (error) {
      console.error("Error en login:", error);
      throw new Error(getFriendlyErrorMessage(error));
    }
  },

  logout: () => clearSession(),

  getCurrentUser: () => {
    const userData = sessionStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
  },

  isAuthenticated: () => {
    getStatusConnection();

    const token = sessionStorage.getItem("accessToken");
    if (!token) return false;

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp ? decoded.exp > currentTime : true;
    } catch (e) {
      console.warn("Token inválido:", e);
      return false;
    }
  },

  getAuthHeader: () => {
    const token = sessionStorage.getItem("accessToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
};

export default AuthService;
