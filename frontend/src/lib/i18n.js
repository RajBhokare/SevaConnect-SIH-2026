import { create } from 'zustand';

export const translations = {
  en: {
    tagline: 'Connecting Skills. Empowering Communities.',
    heroHeadline: 'Trusted Services. Fair Opportunities.',
    heroSubtitle: 'A cooperative-powered marketplace connecting customers with verified independent gig workers.',
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
    federationAdmin: 'Federation Admin',
    logIn: 'Log In',
    joinSignUp: 'Join / Sign Up',
    availableForWork: 'Available for Work',
    offline: 'Offline / On Break',
    bookService: 'Book Service',
    totalEarnings: 'Total Earnings',
    welfareFund: 'Welfare Fund',
    todaysJobs: 'Today\'s Jobs',
    ratingTrust: 'Rating & Trust',
    viewInvoice: 'View Invoice',
    acceptJob: 'Accept Job',
    decline: 'Decline',
    navigateMaps: 'Navigate (Maps)',
    markComplete: 'Mark Completed',
    verificationQueue: 'Verification Queue',
    demandHeatmap: 'Demand Heatmap',
    wageFloor: 'Fair Wage Floor'
  },
  hi: {
    tagline: 'कौशल को जोड़ना। समुदायों को सशक्त बनाना।',
    heroHeadline: 'विश्वसनीय सेवाएँ। निष्पक्ष अवसर।',
    heroSubtitle: 'घरेलू और सामुदायिक सेवाओं के लिए सत्यापित स्वतंत्र गिग श्रमिकों को जोड़ने वाला सहकारी बाज़ार।',
    needService: 'सेवा चाहिए? कारीगर खोजें',
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
    federationAdmin: 'फेडरेशन एडमिन',
    logIn: 'लॉग इन करें',
    joinSignUp: 'साइन अप करें',
    availableForWork: 'कार्य के लिए उपलब्ध',
    offline: 'ऑफलाइन / विश्राम पर',
    bookService: 'सेवा बुक करें',
    totalEarnings: 'कुल कमाई',
    welfareFund: 'कल्याण कोष',
    todaysJobs: 'आज के कार्य',
    ratingTrust: 'रेटिंग एवं विश्वास',
    viewInvoice: 'रसीद देखें',
    acceptJob: 'स्वीकारें',
    decline: 'अस्वीकारें',
    navigateMaps: 'दिशा-निर्देश (नक्शा)',
    markComplete: 'पूर्ण घोषित करें',
    verificationQueue: 'सत्यापन कतार',
    demandHeatmap: 'मांग हीटमैप',
    wageFloor: 'न्यूनतम मजदूरी दर'
  },
  mr: {
    tagline: 'कौशल्यांना जोडणे. समाजाचे सक्षमीकरण.',
    heroHeadline: 'विश्वासार्ह सेवा. न्याय्य संधी.',
    heroSubtitle: 'घरगुती व नागरी सेवांसाठी पडताळणी केलेल्या स्वतंत्र कामगारांना जोडणारी सहकारी बाजारपेठ.',
    needService: 'सेवा हवी आहे? कामगार शोधा',
    offerSkills: 'कौशल्ये आहेत? स्वतंत्र कामगार म्हणून जोडा',
    verifiedWorker: 'पडताळणीकृत कामगार',
    fairMatch: 'फेअरमॅच शिफारस',
    emergencyHelp: 'तातडीची मदत',
    exploreServices: 'सेवा शोधा',
    myBookings: 'माझ्या बुकिंग्ज',
    dashboard: 'डॅशबोर्ड',
    jobRequests: 'कामाच्या विनंत्या',
    welfare: 'सहकारी व कल्याण निधी',
    myProfile: 'माझे प्रोफाईल',
    aiOps: 'एआय ऑप्स',
    federationAdmin: 'फेडरेशन प्रशासन',
    logIn: 'लॉग इन',
    joinSignUp: 'नोंदणी करा',
    availableForWork: 'कामासाठी उपलब्ध',
    offline: 'ऑफलाईन / विश्रांतीवर',
    bookService: 'सेवा बुक करा',
    totalEarnings: 'एकूण कमाई',
    welfareFund: 'कल्याण निधी',
    todaysJobs: 'आजची कामे',
    ratingTrust: 'रेटिंग व विश्वास',
    viewInvoice: 'पावती पहा',
    acceptJob: 'स्वीकारा',
    decline: 'नाकारा',
    navigateMaps: 'नकाशा दिशा',
    markComplete: 'काम पूर्ण झाले',
    verificationQueue: 'पडताळणी रांग',
    demandHeatmap: 'मागणी नकाशा',
    wageFloor: 'किमान हमी वेतन'
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
