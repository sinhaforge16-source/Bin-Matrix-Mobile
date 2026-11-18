export type Language = 'en' | 'si';

export interface Translations {
  // Brand
  brandName: string;

  // Splash
  loading: string;
  skipHint: string;

  // Language Selection
  chooseLanguage: string;
  chooseLanguageSub: string;
  sinhala: string;
  english: string;
  continueAsUser: string;
  continueAsDriver: string;

  // Auth Home
  createAccount: string;
  login: string;

  // Register
  registerTitle: string;
  registerSubtitle: string;
  namePlaceholder: string;
  locationPlaceholder: string;
  emailPlaceholder: string;
  passwordPlaceholder: string;
  binKeyPlaceholder: string;
  signUpBtn: string;
  alreadyHaveAccount: string;
  orSignUpWith: string;

  // Login
  loginTitle: string;
  loginSubtitle: string;
  binKeyLoginPlaceholder: string;
  passwordLoginPlaceholder: string;
  forgotPassword: string;
  signInBtn: string;
  createNewAccount: string;
  orSignInWith: string;
  demoHint: string;

  // Dashboard / Bins
  plastic: string;
  paper: string;
  organic: string;
  full: string;
  upcomingPickup: string;
  pickupTimeTomorrow: string;

  // Chatbot
  chatbotTitle: string;
  botGreeting: string;
  botAskLocation: string;
  botLocationConfirmed: string;
  chatPlaceholder: string;
  gpsReportedText: string;

  // Account
  accountTitle: string;
  emailLabel: string;
  languageLabel: string;
  addAccount: string;
  logOut: string;
  logOutConfirmTitle: string;
  logOutConfirmMsg: string;
  cancel: string;

  // Common Nav
  navHome: string;
  navChatbot: string;
  navAccount: string;

  // Driver Prototype
  driverSignInBtn: string;
  driverStartRouteBtn: string;
  driverLoginTitle: string;
  driverLoginSubtitle: string;
  driverIdPlaceholder: string;
  driverHello: string;
  driverRouteReady: string;
  driverStart: string;
  driverEnd: string;
  driverRouteTitle: string;
  driverRouteCompleted: string;
  driverRouteConfirmEnd: string;
  driverStopOk: string;
  driverDemoHint: string;
  truckNumberLabel: string;
  mapViewTitle: string;
  binsSidebarTitle: string;
  driverAccountTitle: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    brandName: 'BIN MATRIX',
    loading: 'Loading',
    skipHint: 'Tap anywhere to skip',

    chooseLanguage: 'Choose your language',
    chooseLanguageSub: 'Pick the language you’re most comfortable with to continue.',
    sinhala: 'Sinhala',
    english: 'English',
    continueAsUser: 'Continue as user',
    continueAsDriver: 'Continue as Driver',

    createAccount: 'Create an account',
    login: 'LOGIN',

    registerTitle: 'Create an account',
    registerSubtitle: 'Set up your profile and link your smart bin in just a few steps.',
    namePlaceholder: 'Name',
    locationPlaceholder: 'Location',
    emailPlaceholder: 'E mail',
    passwordPlaceholder: 'Password',
    binKeyPlaceholder: 'Bin Key',
    signUpBtn: 'Sign up',
    alreadyHaveAccount: 'Already have an account',
    orSignUpWith: 'Or sign up with',

    loginTitle: 'Hi, welcome back',
    loginSubtitle: 'Your smart bin is waiting, check status and updates instantly.',
    binKeyLoginPlaceholder: 'Bin Key / Username (user)',
    passwordLoginPlaceholder: 'Password (1234)',
    forgotPassword: 'Forgot your password?',
    signInBtn: 'Sign in',
    createNewAccount: 'Create new account',
    orSignInWith: 'Or sign in with',
    demoHint: 'Demo: user / 1234 (Tap to fill)',

    plastic: 'PLASTIC',
    paper: 'PAPER',
    organic: 'ORGANIC',
    full: 'Full',
    upcomingPickup: 'Up Coming Pickup',
    pickupTimeTomorrow: 'Tomorrow, at 8 a.m',

    chatbotTitle: 'Chatbot',
    botGreeting: "Hi! I'm Bin Matrix. Upload a photo of overflowing trash with its location, and I'll notify the cleaning team.",
    botAskLocation: 'Sir, please send your current location',
    botLocationConfirmed: 'Location confirmed! Dispatching cleaning truck TR-09 now. Estimated arrival: 18 minutes.',
    chatPlaceholder: 'Ask Bin Matrix',
    gpsReportedText: '📍 42 Flower Road, Colombo 07\nLat: 6.9012° N, Long: 79.8601° E',

    accountTitle: 'Account',
    emailLabel: 'Email',
    languageLabel: 'Language',
    addAccount: 'Add Account',
    logOut: 'Log Out',
    logOutConfirmTitle: 'Log Out',
    logOutConfirmMsg: 'Are you sure you want to log out of Bin Matrix?',
    cancel: 'Cancel',

    navHome: 'Home',
    navChatbot: 'Chatbot',
    navAccount: 'Account',

    // Driver Flow (Prototype)
    driverSignInBtn: 'Sign in as Driver',
    driverStartRouteBtn: "Start Today's Route",
    driverLoginTitle: 'Hi, welcome back',
    driverLoginSubtitle: 'Your smart bin is waiting, check status and updates instantly.',
    driverIdPlaceholder: 'Driver Id',
    driverHello: 'Hello!',
    driverRouteReady: 'Your route for today is ready.',
    driverStart: 'START',
    driverEnd: 'END',
    driverRouteTitle: 'Route Plan',
    driverRouteCompleted: 'Stop Completed!',
    driverRouteConfirmEnd: 'Are you sure you want to complete and end today’s waste collection route?',
    driverStopOk: 'OK',
    driverDemoHint: 'Demo Driver: driver / 1234 (Tap to fill)',
    truckNumberLabel: 'Truck Number',
    mapViewTitle: 'Map View',
    binsSidebarTitle: 'BINS',
    driverAccountTitle: 'Driver Account',
  },

  si: {
    brandName: 'බින් මැට්‍රික්ස්',
    loading: 'පූරණය වෙමින් පවතී...',
    skipHint: 'මඟ හැරීමට තට්ටු කරන්න',

    chooseLanguage: 'ඔබගේ භාෂාව තෝරන්න',
    chooseLanguageSub: 'ඉදිරියට යාමට ඔබ වඩාත් පහසු භාෂාව තෝරා ගන්න.',
    sinhala: 'සිංහල',
    english: 'English',
    continueAsUser: 'පරිශීලකයෙකු ලෙස ඉදිරියට යන්න',
    continueAsDriver: 'රියදුරෙකු ලෙස ඉදිරියට යන්න',

    createAccount: 'ගිණුමක් සාදන්න',
    login: 'ඇතුල් වන්න',

    registerTitle: 'ගිණුමක් සාදන්න',
    registerSubtitle: 'ඔබගේ පැතිකඩ සකසා පියවර කිහිපයකින් ස්මාර්ට් බඳුන සම්බන්ධ කරන්න.',
    namePlaceholder: 'නම',
    locationPlaceholder: 'ස්ථානය',
    emailPlaceholder: 'විද්‍යුත් තැපෑල',
    passwordPlaceholder: 'මුරපදය',
    binKeyPlaceholder: 'ස්මාර්ට් බඳුන් යතුර',
    signUpBtn: 'ලියාපදිංචි වන්න',
    alreadyHaveAccount: 'දැනටමත් ගිණුමක් තිබේද?',
    orSignUpWith: 'හෝ මෙයින් ලියාපදිංචි වන්න',

    loginTitle: 'ආයුබෝවන්, නැවත සාදරයෙන් පිළිගනිමු',
    loginSubtitle: 'ඔබගේ ස්මාර්ට් බඳුන සූදානම්, තත්ත්වය ක්ෂණිකව පරීක්ෂා කරන්න.',
    binKeyLoginPlaceholder: 'බඳුන් යතුර / පරිශීලක නාමය (user)',
    passwordLoginPlaceholder: 'මුරපදය (1234)',
    forgotPassword: 'මුරපදය අමතකද?',
    signInBtn: 'ඇතුල් වන්න',
    createNewAccount: 'නව ගිණුමක් සාදන්න',
    orSignInWith: 'හෝ මෙයින් ඇතුල් වන්න',
    demoHint: 'නිරූපණ ගිණුම: user / 1234 (තට්ටු කරන්න)',

    plastic: 'ප්ලාස්ටික්',
    paper: 'කඩදාසි',
    organic: 'කාබනික',
    full: 'පිරී ඇත',
    upcomingPickup: 'ඉදිරි අපද්‍රව්‍ය එකතු කිරීම',
    pickupTimeTomorrow: 'හෙට, පෙ.ව. 8:00 ට',

    chatbotTitle: 'චැට්බොට්',
    botGreeting: 'ආයුබෝවන්! මම බින් මැට්‍රික්ස්. පිරී ඉතිරී ගිය අපද්‍රව්‍යවල ඡායාරූපයක් ස්ථානය සමඟ එවන්න, මම පිරිසිදු කිරීමේ කණ්ඩායමට දන්වන්නෙමි.',
    botAskLocation: 'කරුණාකර ඔබගේ වත්මන් ස්ථානය එවන්න',
    botLocationConfirmed: 'ස්ථානය තහවුරු විය! TR-09 පිරිසිදු කිරීමේ රථය පිටත් කෙරිණි. පැමිණීමට විනාඩි 18 කි.',
    chatPlaceholder: 'බින් මැට්‍රික්ස් වෙතින් විමසන්න...',
    gpsReportedText: '📍 මල් පාර, කොළඹ 07\nඅක්ෂාංශ: 6.9012° N, දේශාංශ: 79.8601° E',

    accountTitle: 'ගිණුම',
    emailLabel: 'විද්‍යුත් තැපෑල',
    languageLabel: 'භාෂාව',
    addAccount: 'ගිණුමක් එක් කරන්න',
    logOut: 'ඉවත් වන්න',
    logOutConfirmTitle: 'ඉවත් වීම',
    logOutConfirmMsg: 'ඔබට බින් මැට්‍රික්ස් ගිණුමෙන් ඉවත් වීමට අවශ්‍යද?',
    cancel: 'අවලංගු කරන්න',

    navHome: 'මුල් පිටුව',
    navChatbot: 'චැට්බොට්',
    navAccount: 'ගිණුම',

    // Driver Flow (Prototype in Sinhala)
    driverSignInBtn: 'රියදුරු ලෙස ඇතුල් වන්න',
    driverStartRouteBtn: 'අද දින ගමන් මාර්ගය',
    driverLoginTitle: 'ආයුබෝවන්, නැවත සාදරයෙන් පිළිගනිමු',
    driverLoginSubtitle: 'අපද්‍රව්‍ය එකතු කිරීමේ ගමන් මාර්ගය සූදානම්, තත්ත්වය බලන්න.',
    driverIdPlaceholder: 'රියදුරු හැඳුනුම් අංකය',
    driverHello: 'ආයුබෝවන්!',
    driverRouteReady: 'අද දින ඔබගේ ගමන් මාර්ගය සූදානම්.',
    driverStart: 'ආරම්භ කරන්න',
    driverEnd: 'අවසන් කරන්න',
    driverRouteTitle: 'ගමන් මාර්ග සැලැස්ම',
    driverRouteCompleted: 'ස්ථානය සම්පූර්ණයි!',
    driverRouteConfirmEnd: 'අද දින අපද්‍රව්‍ය එකතු කිරීමේ මාර්ගය අවසන් කිරීමට ඔබට අවශ්‍යද?',
    driverStopOk: 'හරි',
    driverDemoHint: 'නිරූපණ රියදුරු: driver / 1234 (තට්ටු කරන්න)',
    truckNumberLabel: 'ට්‍රක් රථ අංකය',
    mapViewTitle: 'සිතියම් දසුන',
    binsSidebarTitle: 'බඳුන්',
    driverAccountTitle: 'රියදුරු ගිණුම',
  },
};
