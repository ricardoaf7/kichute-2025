
export const mockUser = {
  id: "temp-admin",
  nome: "Administrador Temporário",
  tipo: "Administrador"
};

export const mockAuthData = {
  user: mockUser,
  isAdmin: true,
  isLoading: false,
  login: async () => {
    console.log("Login temporariamente desativado");
  },
  logout: async () => {
    console.log("Logout temporariamente desativado");
  }
};

