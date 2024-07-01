import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        "Full Name": "Full Name",
        "Risk Profile": "Risk Profile",
        "Annual Income": "Annual Income",
        "Residence": "Residence",
        "Client Type": "Client Type",
        "Investment Type": "Investment Type",
        "Amount": "Amount",
        "Portfolios": "Portfolios",
        "Filter table...": "Filter table...",
      },
    },
    fr: {
      translation: {
        "Full Name": "Nom Complet",
        "Risk Profile": "Profil de Risque",
        "Annual Income": "Revenu Annuel",
        "Residence": "Résidence",
        "Client Type": "Type de Client",
        "Investment Type": "Type d'Investissement",
        "Amount": "Montant",
        "Portfolios": "Portfolios",
        "Filter table...": "Filtrer la table"
      },
    },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
