import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  email: null,
  firstName: null,
  lastName: null,  // Ajouté
  address: null,
  city: null,      // Ajouté
  postalCode: null, // Ajouté
  isHost: false,   // Ajouté
  isActive: false,   // Ajouté
  services: null,
  profileImage: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      // Retourner un nouvel objet state complet
      return {
        ...state,
        ...action.payload,
      };
    },
    logout: () => {
      // Retourner l'état initial
      return initialState;
    }
  }
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;