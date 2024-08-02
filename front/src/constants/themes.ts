// themes.ts
export const lightTheme = {
  background: '#ffffff',
  text: '#000000',
  primary: '#1e90ff',
  secondary: '#ff6347',
  buttonBackground: '#1e90ff',
  buttonText: '#ffffff',
};

export const darkTheme = {
  background: '#000000',
  text: '#ffffff',
  primary: '#1e90ff',
  secondary: '#ff6347',
  buttonBackground: '#1e90ff',
  buttonText: '#000000',
};

export type Theme = typeof lightTheme;
