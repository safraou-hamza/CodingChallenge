import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import CustomerTable from './components/CustomerTable';
import './i18n';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.color};
    margin-top: 10px;
  }
`;

const lightTheme = {
  background: '#FFD3B6',
  color: '#000000',
  border: '#DCA47C',
  tableHeaderBackground: '#DCA47C',
  tableHoverBackground: '#e0e0e0',
  modalBackground: 'rgba(255, 211, 182, 0.7)',
  modalContentBackground: '#DCA47C',
  modalShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
  buttonBorderColor: '#DCA47C',
  buttonBackground: '#FFD3B6',
  buttonHoverBackground: '#DCA47C',
  buttonTextColor: '#000',
};

const darkTheme = {
  background: '#333333',
  color: '#FFD3B6',
  border: '#FFD3B6',
  tableHeaderBackground: '#DCA47C',
  tableHoverBackground: '#666666',
  modalBackground: 'rgba(0, 0, 0, 0.3)',
  modalContentBackground: '#333333',
  modalShadow: '0 0 10px rgba(255, 255, 255, 0.1)',
  buttonBorderColor: '#FFD3B6',
  buttonBackground: '#333',
  buttonHoverBackground: '#DCA47C',
  buttonTextColor: '#FFD3B6',
};

const AdaptiveButton = styled.button`
  margin: 0 0.2rem;
  padding: 0.3rem 0.5rem;
  border: 1px solid ${({ theme }) => theme.buttonBorderColor};
  border-radius: 4px;
  cursor: pointer;
  background-color: ${({ theme }) => theme.buttonBackground};
  color: ${({ theme }) => theme.buttonTextColor};

  &:hover {
    background-color: ${({ theme }) => theme.buttonHoverBackground};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;
const Buttons = styled.div`
display: flex;
justify-content: center;
align-items: center;`


const App: React.FC = () => {
  const { i18n } = useTranslation();
  const [theme, setTheme] = useState(lightTheme);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const toggleTheme = () => {
    setTheme(theme === lightTheme ? darkTheme : lightTheme);
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <div>
        <Buttons>
        <AdaptiveButton onClick={() => changeLanguage('en')}>English</AdaptiveButton>
        <AdaptiveButton onClick={() => changeLanguage('fr')}>Français</AdaptiveButton>
        <AdaptiveButton onClick={toggleTheme}>
          {theme === lightTheme ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        </AdaptiveButton>
        </Buttons>
        <CustomerTable />
      </div>
    </ThemeProvider>
  );
};

export default App;
