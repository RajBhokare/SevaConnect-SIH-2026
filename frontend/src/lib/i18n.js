import { create } from 'zustand';

export const translations = {
  en: {
    tagline: 'Connecting Skills. Empowering Communities.',
    heroHeadline: 'Trusted Services. Fair Opportunities.',
    heroSubtitle: 'A cooperative-powered marketplace connecting customers with verified independent gig workers for household and community services.',
    needService: 'Need a Service? Find Workers',
    offerSkills: 'Offer Your Skills? Join as Independent Worker',
    verifiedWorker: 'Verified Worker',
    fairMatch: 'FairMatch Recommended',
    emergencyHelp: 'Emergency Help',
    exploreServices: 'Explore Services',
    myBookings: 'My Bookings',
    dashboard: 'Dashboard',
    jobRequests: 'Job Requests',
    welfare: 'Cooperative & Welfare',
    myProfile: 'My Profile',
    aiOps: 'AI Ops',
    logIn: 'Log In',
    joinSignUp: 'Join / Sign Up',
    availableForWork: 'Available for Work',
    offline: 'Offline / On Break',
    openOpportunity: 'Open Opportunity',
    fairMatchDist: 'FairMatch Distribution',
    trustedService: 'Trusted Service Lifecycle',
    essentialServices: 'Household & Community Services',
    whyCooperative: 'Why Choose a Cooperative-Powered Marketplace?'
  },
  hi: {
    tagline: 'कौशल को जोड़ना। समुदायों को सशक्त बनाना।',
    heroHeadline: 'विश्वसनीय सेवाएँ। निष्पक्ष अवसर।',
    heroSubtitle: 'घरेलू और सामुदायिक सेवाओं के लिए सत्यापित स्वतंत्र गिग श्रमिकों को ग्राहकों से जोड़ने वाला एक सहकारी-संचालित डिजिटल बाज़ार।',
    needService: 'सेवा चाहिए? श्रमिक खोजें',
    offerSkills: 'कौशल साझा करें? स्वतंत्र श्रमिक के रूप में जुड़ें',
    verifiedWorker: 'सत्यापित श्रमिक',
    fairMatch: 'फेयरमैच अनुशंसित',
    emergencyHelp: 'आपातकालीन सहायता',
    exploreServices: 'सेवाएं खोजें',
    myBookings: 'मेरी बुकिंग्स',
    dashboard: 'डैशबोर्ड',
    jobRequests: 'कार्य अनुरोध',
    welfare: 'सहकारिता एवं कल्याण',
    myProfile: 'मेरी प्रोफाइल',
    aiOps: 'एआई ऑप्स',
    logIn: 'लॉग इन करें',
    joinSignUp: 'साइन अप करें',
    availableForWork: 'कार्य के लिए उपलब्ध',
    offline: 'ऑफलाइन / विश्राम पर',
    openOpportunity: 'खुला अवसर',
    fairMatchDist: 'फेयरमैच वितरण',
    trustedService: 'विश्वसनीय सेवा जीवनचक्र',
    essentialServices: 'घरेलू एवं सामुदायिक सेवाएं',
    whyCooperative: 'सहकारी-संचालित बाज़ार क्यों चुनें?'
  }
};

export const useLanguageStore = create((set) => ({
  language: localStorage.getItem('sevaconnect_lang') || 'en',
  setLanguage: (lang) => {
    localStorage.setItem('sevaconnect_lang', lang);
    set({ language: lang });
  }
}));

export const useTranslation = () => {
  const { language, setLanguage } = useLanguageStore();
  const t = (key) => translations[language]?.[key] || translations.en[key] || key;
  return { t, language, setLanguage };
};
