"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Language = "en" | "ar";

export interface TranslationDictionary {
  nav: {
    home: string;
    inventory: string;
    directSourcing: string;
    shippingCalculator: string;
    weeklyReport: string;
    contact: string;
    getQuote: string;
  };
  hero: {
    badge: string;
    title: string;
    titleAccent: string;
    description: string;
    searchMakePlaceholder: string;
    searchModelPlaceholder: string;
    searchButton: string;
    stat1Label: string;
    stat1Value: string;
    stat2Label: string;
    stat2Value: string;
    stat3Label: string;
    stat3Value: string;
  };
  features: {
    title: string;
    subtitle: string;
    feat1Title: string;
    feat1Desc: string;
    feat2Title: string;
    feat2Desc: string;
    feat3Title: string;
    feat3Desc: string;
    feat4Title: string;
    feat4Desc: string;
  };
  inventory: {
    title: string;
    subtitle: string;
    filterBrand: string;
    filterModel: string;
    filterBody: string;
    filterPrice: string;
    allBrands: string;
    allModels: string;
    applyFilters: string;
    resetFilters: string;
    viewDetails: string;
    inquireWhatsapp: string;
    inspectedBadge: string;
    exportReady: string;
    noResults: string;
  };
  shipping: {
    title: string;
    subtitle: string;
    selectCountry: string;
    fobPrice: string;
    freightEstimate: string;
    customsDuty: string;
    totalEstimate: string;
    disclaimer: string;
    warningTitle: string;
    warningBody: string;
  };
  weeklyReport: {
    badge: string;
    title: string;
    subtitle: string;
    enterVinPlaceholder: string;
    trackButton: string;
    stage1: string;
    stage2: string;
    stage3: string;
    stage4: string;
    stage5: string;
    latestUpdate: string;
    downloadPdf: string;
  };
  contact: {
    title: string;
    subtitle: string;
    nameLabel: string;
    emailLabel: string;
    phoneLabel: string;
    messageLabel: string;
    submitButton: string;
    contactInfo: string;
    location: string;
  };
  footer: {
    rights: string;
    domain: string;
    tagline: string;
  };
  about: {
    title: string;
    subtitle: string;
    badge: string;
    description: string;
    regionsTitle: string;
    regionsDesc: string;
    hoursTitle: string;
    hoursDesc: string;
    audienceTitle: string;
    audience1: string;
    audience2: string;
    audience3: string;
    audience4: string;
    licenseTitle: string;
    licenseDesc1: string;
    licenseDesc2: string;
  };
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    nav: {
      home: "Home",
      inventory: "Inventory",
      directSourcing: "Direct Sourcing",
      shippingCalculator: "Shipping Calculator",
      weeklyReport: "Client Progress Report",
      contact: "Contact Us",
      getQuote: "Inquire Now",
    },
    hero: {
      badge: "Premier South Korean Vehicle Sourcing",
      title: "Direct Premium Korean Car Export to",
      titleAccent: "the Middle East & Worldwide",
      description:
        "Advanced Koryo connects international buyers with 100% verified, inspection-certified vehicles directly from South Korea with transparent Ro-Ro shipping and customs clearance assistance.",
      searchMakePlaceholder: "All Makes (Hyundai, Kia, Genesis...)",
      searchModelPlaceholder: "All Models",
      searchButton: "Search Vehicles",
      stat1Label: "Vehicles Exported",
      stat1Value: "3,500+",
      stat2Label: "Inspection Accuracy",
      stat2Value: "100%",
      stat3Label: "Destination Ports",
      stat3Value: "45+",
    },
    features: {
      title: "Why Choose Advanced Koryo?",
      subtitle: "Unmatched quality assurance and direct factory-level sourcing from South Korea.",
      feat1Title: "150-Point Korean Inspection",
      feat1Desc: "Every vehicle is rigorously audited for engine performance, structural integrity, and zero accident history.",
      feat2Title: "Direct Port Ro-Ro Shipping",
      feat2Desc: "Fast and insured Ro-Ro container logistics from Busan & Incheon Ports directly to Jeddah, Jebel Ali, Dammam, and global ports.",
      feat3Title: "Transparent Pricing",
      feat3Desc: "No middleman markups. Full breakdown of FOB Korea price, ocean freight, insurance, and local import tariffs.",
      feat4Title: "Weekly Progress Reports",
      feat4Desc: "Stay fully informed with interactive weekly progress tracking from vehicle acquisition to final port delivery.",
    },
    inventory: {
      title: "Verified Korean Vehicle Inventory",
      subtitle: "Explore pristine sedans, SUVs, and luxury EVs ready for immediate export.",
      filterBrand: "Make",
      filterModel: "Model",
      filterBody: "Body Type",
      filterPrice: "Max Price ($)",
      allBrands: "All Makes",
      allModels: "All Models",
      applyFilters: "Apply Filters",
      resetFilters: "Reset",
      viewDetails: "View Full Specs",
      inquireWhatsapp: "Inquire via WhatsApp",
      inspectedBadge: "Koryo Certified",
      exportReady: "GCC Export Ready",
      noResults: "No vehicles match your selected criteria.",
    },
    shipping: {
      title: "Land & Sea Freight Calculator",
      subtitle: "Estimate your total landed vehicle cost directly to your destination country.",
      selectCountry: "Select Destination Country",
      fobPrice: "FOB Vehicle Price (Korea)",
      freightEstimate: "Ocean Freight & Insurance",
      customsDuty: "Est. Local Customs Duty & VAT",
      totalEstimate: "Estimated Landed Total",
      disclaimer: "*Final shipping rates may fluctuate slightly based on Ro-Ro vessel schedules and container tariffs.",
      warningTitle: "Price Accuracy Notice",
      warningBody: "Shipping tariffs, fuel surcharges, and local port clearance regulations fluctuate weekly. This calculator is a baseline estimation tool. Always confirm the final invoice with our export agents via WhatsApp before initiating wire transfer.",
    },
    weeklyReport: {
      badge: "Client Transparency Portal",
      title: "Weekly Client Progress Report",
      subtitle: "Track the real-time status of your vehicle sourcing, inspection, and shipment.",
      enterVinPlaceholder: "Enter VIN or Order ID (e.g. MK-9042)",
      trackButton: "View Progress Report",
      stage1: "Vehicle Inspection & Acquisition",
      stage2: "Export Certification & De-registration",
      stage3: "Port Storage & Customs Clearance (Busan/Incheon)",
      stage4: "Vessel Loading (Ro-Ro Ship)",
      stage5: "Transit & Destination Arrival",
      latestUpdate: "Latest Log Update",
      downloadPdf: "Download Status Summary",
    },
    contact: {
      title: "Get in Touch with Advanced Koryo",
      subtitle: "Our Korean auto sourcing specialists are ready to assist you in English and Arabic.",
      nameLabel: "Your Name",
      emailLabel: "Email Address",
      phoneLabel: "Phone / WhatsApp",
      messageLabel: "Vehicle Specification / Request",
      submitButton: "Send Inquiry",
      contactInfo: "Headquarters & Global Logistics",
      location: "278 Beotkkot-ro, Gasan-dong, SJ Technoville, Seoul 08511, South Korea | Customer Service: info@mykoryo.com",
    },
    footer: {
      rights: "All Rights Reserved.",
      domain: "mykoryo.com",
      tagline: "ADVANCED KORYO - Direct South Korean Automotive Sourcing & Global Logistics.",
    },
    about: {
      title: "About Advanced Koryo",
      subtitle: "Direct South Korea-Based Auto Exporter",
      badge: "Direct Exporter • Not Broker",
      description: "ADVANCED KORYO is a South Korea–based automotive exporter, not a broker. We specialize in sourcing, inspecting, purchasing, and exporting new and used Korean vehicles directly from trusted dealers and auctions. We provide professional inspection reports, high-quality videos, transparent pricing, worldwide shipping, and end-to-end support to ensure a secure and reliable buying experience for customers around the world.",
      regionsTitle: "Global Coverage",
      regionsDesc: "We are headquartered in South Korea and serve customers worldwide, with a primary focus on Saudi Arabia, GCC countries, the Middle East, Europe, North America, Africa, and Asia. We export Korean vehicles to both individual buyers and dealerships worldwide.",
      hoursTitle: "Business Hours",
      hoursDesc: "Monday – Friday: 9:00 AM – 6:00 PM (Korea Standard Time). WhatsApp inquiries are accepted 24/7.",
      audienceTitle: "Who We Serve",
      audience1: "Individual buyers looking to import Korean vehicles.",
      audience2: "Car dealers and automotive traders purchasing in volume.",
      audience3: "Businesses seeking reliable vehicle export services.",
      audience4: "Customers worldwide who want direct access with transparent sourcing.",
      licenseTitle: "Official Export License Holder",
      licenseDesc1: "Advanced Koryo is a direct automotive exporter (has a direct export license), not a broker or middleman. We source, inspect, purchase, and export directly from South Korea.",
      licenseDesc2: "We are registered under Korean commercial law to perform direct exports, ensuring absolute transparency, zero agent markups, and clean title security."
    }
  },
  ar: {
    nav: {
      home: "الرئيسية",
      inventory: "السيارات المتاحة",
      directSourcing: "الاستيراد المباشر",
      shippingCalculator: "حاسبة الشحن",
      weeklyReport: "تقرير الإنجاز الأسبوعي",
      contact: "اتصل بنا",
      getQuote: "اطلب استشارة الآن",
    },
    hero: {
      badge: "المنصة الأولى لتصدير السيارات من كوريا الجنوبية",
      title: "استيراد مباشر للسيارات الكورية الفاخرة إلى",
      titleAccent: "الشرق الأوسط وكافة دول العالم",
      description:
        "أدفانسد كوريو (Advanced Koryo) توفر لك خدمة استيراد مضمونة 100% من كوريا الجنوبية مباشرة، مع فحص شامل وتخليص وشحن آمن عبر الناقلات البحرية إلى الموانئ العربية والعالمية.",
      searchMakePlaceholder: "جميع الماركات (هيونداي، كيا، جينيسيس...)",
      searchModelPlaceholder: "جميع الموديلات",
      searchButton: "البحث عن سيارة",
      stat1Label: "سيارة تم تصديرها",
      stat1Value: "+3,500",
      stat2Label: "دقة الفحص الفني",
      stat2Value: "100%",
      stat3Label: "موانئ الوصول",
      stat3Value: "+45",
    },
    features: {
      title: "لماذا تختار أدفانسد كوريو Advanced Koryo؟",
      subtitle: "ضمان جودة استثنائي وتوريد مباشر من المصادر الكورية المعتمدة بدون وسطاء.",
      feat1Title: "فحص فني شامل 150 نقطة",
      feat1Desc: "تدقيق دقيق لكفاءة المحرك، ناقل الحركة، الشاسي، والتأكد التام من خلو المركبة من الحوادث الهيكلية.",
      feat2Title: "شحن بحري مباشر Ro-Ro",
      feat2Desc: "لوجستيات شحن آمنة ومؤمنة من ميناء بوسان وإنشون مباشرة إلى جدة، جبل علي، الدمام، العقبة ومختلف الموانئ.",
      feat3Title: "شفافية مطلقة في الأسعار",
      feat3Desc: "سعر السيارة الشفاف من كوريا (FOB) بالإضافة لرسوم الشحن البحري والتأمين والتخليص دون أي عمولات خفية.",
      feat4Title: "تقارير إنجاز أسبوعية",
      feat4Desc: "ابقَ على اطلاع كامل بمرحلة استيراد سيارتك خطوة بخطوة من الشراء وحتى وصول السفينة لمينائك.",
    },
    inventory: {
      title: "معرض السيارات الكورية المعتمدة",
      subtitle: "تصفح أحدث سيارات السيدان، الدفع الرباعي، والسيارات الكهربائية الجاهزة للتصدير الفوري.",
      filterBrand: "الماركة",
      filterModel: "الموديل",
      filterBody: "نوع الهيكل",
      filterPrice: "السعر الأقصى ($)",
      allBrands: "جميع الماركات",
      allModels: "جميع الموديلات",
      applyFilters: "تطبيق التصفية",
      resetFilters: "إعادة ضبط",
      viewDetails: "تفاصيل السيارة والفحص",
      inquireWhatsapp: "تواصل عبر واتساب",
      inspectedBadge: "معتمد من Koryo",
      exportReady: "مطابق لمواصفات الخليج",
      noResults: "لا توجد سيارات تطابق خيارات البحث المختارة.",
    },
    shipping: {
      title: "حاسبة التكلفة الشاملة والشحن البحرية",
      subtitle: "احسب التكلفة التقديرية لسيارتك واصلة إلى دولة الوصول الخاصة بك.",
      selectCountry: "اختر دولة الوصول",
      fobPrice: "سعر السيارة في كوريا (FOB)",
      freightEstimate: "تكلفة الشحن البحري والتأمين",
      customsDuty: "الرسوم الجمركية والضريبة التقديرية",
      totalEstimate: "الإجمالي التقديري واصل للميناء",
      disclaimer: "* أسعار الشحن قد تتفاوت بشكل بسيط بناءً على جداول سفن Ro-Ro وتعريفات الحاويات البحرية.",
      warningTitle: "تنبيه حول دقة الأسعار",
      warningBody: "تتعرض تعرفة الشحن البحري ورسوم الوقود وقوانين التخليص الجمركي لتقلبات أسبوعية مستمرة. تعد هذه الحاسبة أداة تقديرية فقط. يرجى دائماً تأكيد التكلفة النهائية والفاتورة الرسمية مع وكلائنا عبر الواتساب قبل إرسال الحوالة البنكية.",
    },
    weeklyReport: {
      badge: "بوابة الشفافية وتتبع العملاء",
      title: "تقرير الإنجاز الأسبوعي للعميل",
      subtitle: "تتبع حالة طلبك ومراحل الفحص والتصدير والشحن في بث حي ومباشر.",
      enterVinPlaceholder: "أدخل رقم الشاسي (VIN) أو رقم الطلب (مثال: MK-9042)",
      trackButton: "عرض تقرير الإنجاز",
      stage1: "الفحص والشراء من المالك/المزاد في كوريا",
      stage2: "إصدار شهادة التصدير وإلغاء التسجيل الكوري",
      stage3: "إيداع السيارة في ساحة ميناء بوسان والتخليص التصديري",
      stage4: "تحميل السيارة على سفينة Ro-Ro البحرية",
      stage5: "الإبحار والوصول إلى ميناء المقصد",
      latestUpdate: "آخر تحديث مسجل",
      downloadPdf: "تحميل التقرير المكتوب (PDF)",
    },
    contact: {
      title: "تواصل مع فريق أدفانسد كوريو (Advanced Koryo)",
      subtitle: "خبراء تصدير السيارات الكورية جاهزون لخدمتك باللغتين العربية والإنجلیزية.",
      nameLabel: "الاسم الكامل",
      emailLabel: "البريد الإلكتروني",
      phoneLabel: "رقم الهاتف / الواتساب",
      messageLabel: "تفاصيل السيارة المطلوب استيرادها",
      submitButton: "إرسال الطلب",
      contactInfo: "المقر الرئيسي واللوجستيات",
      location: "٢٧٨ بيوتكوت-رو، غاسان-دونغ، إس جي تكنوفيل، سيول ٠٨٥١١، كوريا الجنوبية | خدمة العملاء: info@mykoryo.com",
    },
    footer: {
      rights: "جميع الحقوق محفوظة.",
      domain: "mykoryo.com",
      tagline: "أدفانسد كوريو - استيراد وتصدير السيارات الكورية مباشرة من المصدر إلى كافة الموانئ العالمية.",
    },
    about: {
      title: "عن شركة أدفانسد كوريو",
      subtitle: "مصدر مباشر للسيارات ومقره كوريا الجنوبية",
      badge: "مصدر مباشر وليس وسيط",
      description: "أدفانسد كوريو (ADVANCED KORYO) هي شركة لتصفية وتصدير السيارات ومقرها كوريا الجنوبية وليست مكتب وساطة. نحن متخصصون في فحص وشراء وتصدير السيارات الكورية الجديدة والمستعملة مباشرة من الوكلاء المعتمدين والمزادات. نوفر تقارير فحص احترافية، ومقاطع فيديو عالية الجودة، وأسعار شفافة، وشحنًا لكافة أنحاء العالم، ودعمًا متكاملاً لضمان تجربة شراء آمنة وموثوقة لعملائنا في جميع أنحاء العالم.",
      regionsTitle: "التغطية العالمية",
      regionsDesc: "يقع مقرنا الرئيسي في كوريا الجنوبية ونخدم العملاء في جميع أنحاء العالم، مع تركيز أساسي على المملكة العربية السعودية، ودول مجلس التعاون الخليجي، والشرق الأوسط، وأوروبا، وأمريكا الشمالية، وأفريقيا، وآسيا. نقوم بتصدير السيارات الكورية للمشترين الأفراد والمعارض في جميع أنحاء العالم.",
      hoursTitle: "ساعات العمل",
      hoursDesc: "الإثنين – الجمعة: 9:00 صباحًا – 6:00 مساءً (بتوقيت كوريا القياسي). ونستقبل استفساراتكم عبر الواتساب على مدار الساعة 24/7.",
      audienceTitle: "من نخدم",
      audience1: "المشترين الأفراد الراغبين في استيراد سيارات كورية.",
      audience2: "تجار السيارات والوكلاء الراغبين في الشراء بالجملة.",
      audience3: "الشركات التي تبحث عن خدمات تصدير سيارات موثوقة.",
      audience4: "العملاء في جميع أنحاء العالم الراغبين في وصول مباشر للسوق الكوري بشفافية تامة.",
      licenseTitle: "حائز على ترخيص تصدير رسمي",
      licenseDesc1: "شركة أدفانسد كوريو هي مصدر مباشر للسيارات ولديها ترخيص تصدير مباشر، وليست مكتب وساطة أو سمسار. نقوم بالشراء والتفتيش والتصدير مباشرة من كوريا الجنوبية.",
      licenseDesc2: "نحن مسجلون بموجب القانون التجاري الكوري للقيام بالتصدير المباشر، مما يضمن الشفافية الكاملة، عدم وجود عمولات إضافية، وضمان خلو السيارات من أي مشاكل قانونية."
    }
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDictionary;
  dir: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("mykoryo_lang") as Language;
    if (saved === "ar" || saved === "en") {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("mykoryo_lang", lang);
    if (typeof document !== "undefined") {
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = lang;
    }
  };

  const dir = language === "ar" ? "rtl" : "ltr";
  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
