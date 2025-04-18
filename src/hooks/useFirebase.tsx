
// This file is kept as a placeholder
// Firebase hook functionality has been removed

export function useFirebaseAuth() {
  return {
    user: null,
    loading: false,
    signIn: async () => false,
    signUp: async () => false,
    logout: async () => {},
  };
}
