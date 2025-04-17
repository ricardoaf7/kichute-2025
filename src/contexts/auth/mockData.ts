
export const mockUser = {
  id: "temp-admin",
  nome: "Administrador Temporário",
  role: "Administrador"  // Changed from tipo to role to match the usage in the app
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

