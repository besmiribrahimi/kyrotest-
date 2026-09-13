"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/i18n";
import { HelpCircle, ChevronDown, Sparkles } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_DATA: Record<"en" | "ar", FAQItem[]> = {
  en: [
    {
      question: "How do I search and buy cars directly from Encar (엔카) and KB ChaChaCha (KB차차차)?",
      answer: "Advanced Koryo serves as your direct licensed sourcing partner and exporter in Seoul. You can browse live verified inventory from both Encar and KB ChaChaCha directly on our platform. Once you select a vehicle, our Seoul inspection team visits the vehicle, performs a 150-point diagnostic audit with paint-depth measurement, negotiates the dealer price, manages export de-registration, and arranges Ro-Ro shipping directly to your destination port.",
    },
    {
      question: "What is the difference between Encar and KB ChaChaCha used car inventories?",
      answer: "Encar (엔카) is South Korea's largest automotive marketplace with over 150,000 active listings, featuring official Encar Trust Diagnosis and insurance accident databases. KB ChaChaCha (KB차차차) is operated by KB Financial Group, renowned for verified odometer records, direct dealer stock, and strict financial verification. Advanced Koryo aggregates both feeds into a single unified search with transparent pricing and global shipping estimates.",
    },
    {
      question: "Can international buyers import Encar and KB ChaChaCha cars to Saudi Arabia, UAE, and GCC countries?",
      answer: "Yes. We regularly export vehicles to Jeddah Islamic Port, Jebel Ali (Dubai), Dammam, Hamad (Qatar), and Shuwaikh (Kuwait). We provide complete certified Korean Export Certificates, SASO / GCC conformity compliance documentation, Bill of Lading, and commercial invoices to guarantee seamless customs clearance.",
    },
    {
      question: "How does the direct vehicle sourcing process work?",
      answer: "You submit your vehicle requirements (make, model, trim, budget, and destination port). Our local export agents in Seoul inspect Encar listings and local dealer networks, verify the condition, perform a 150-point quality audit, and send you a video walkaround. Upon agreement, we secure the vehicle, handle export paperwork, and ship it directly to your target port.",
    },
    {
      question: "What does the 150-Point Quality Inspection cover?",
      answer: "Every vehicle undergoes a professional diagnostic audit. This includes engine compression tests, chassis/frame structure diagnostics (ensuring 0% structural damage), paint depth verification (to check for accidents/repaints), transmission diagnostics, electrical systems audit, and undercarriage rust check. We send you the verified inspection report and walkaround video before final purchase.",
    },
    {
      question: "What is the shipping time and transit route to my destination?",
      answer: "We ship all vehicles via Ro-Ro (Roll-on/Roll-off) vessels or container freight. Estimated transit times for GCC ports (Jeddah, Jebel Ali, Hamad, Shuwaikh) are typically 14 to 22 days. Shipping to Europe (Bremerhaven, Rotterdam) takes 34 to 40 days. All vehicles are fully insured during transit.",
    },
    {
      question: "Are there any custom duties, VAT, or local clearance taxes?",
      answer: "Yes, import customs regulations apply. For GCC countries, there is a standard 5% customs duty. Local VAT varies (e.g., 15% in Saudi Arabia, 5% in UAE). Our built-in Shipping Calculator provides clear estimates for your target port. We supply the complete export certificate, commercial invoice, and bill of lading to ensure smooth customs clearance.",
    },
    {
      question: "Can I track my vehicle sourcing and export stages?",
      answer: "Absolutely. Advanced Koryo provides weekly progress tracking. Once your sourcing starts, you will receive a unique tracking ID/VIN. You can enter it on our Client Progress Report portal to monitor the real-time status of your vehicle across 5 stages: Sourced & Secured, Export Certificate Issued, Port Deposited, Vessel Loaded, and Ocean Transit.",
    },
  ],
  ar: [
    {
      question: "كيف يمكنني البحث وشراء السيارات مباشرة من منصتي Encar (إنكار) وKB ChaChaCha؟",
      answer: "تعمل أدفانسد كوريو كوسيطك ومصدرك المرخص والمباشر في سيول. يمكنك تصفح المخزون المباشر والمعتمد من منصتي Encar وKB ChaChaCha من خلال موقعنا. فور اختيارك للسيارة، ينتقل فريق الفحص في سيول لمعاينة السيارة ميدانياً وفحصها فنياً عبر 150 نقطة وقياس سماكة الطلاء، والتفاوض على السعر، وإصدار شهادة التصدير، وحجز الشحن البحري Ro-Ro إلى مينائك.",
    },
    {
      question: "ما هو الفرق بين مخزون سيارات Encar ومخزون KB ChaChaCha؟",
      answer: "تعد منصة Encar (엔카) السوق الأكبر في كوريا بأكثر من 150,000 سيارة معتمدة، وتتميز بسجل الحوادث والتأمين المفصل وفحص Encar التشخيصي. بينما تتم إدارة منصة KB ChaChaCha (KB차차차) من قبل مجموعة KB المالية الكورية وتشتهر بالتحقق الصارم من العدادات والمخزون المباشر من الموزعين. توفر منصتنا دمجاً موحداً للبحث في كلا السوقين مع تحويل فوري للعملة وتقدير تكاليف الشحن.",
    },
    {
      question: "هل يمكن للعملاء في السعودية والإمارات والخليج استيراد سيارات Encar وKB مباشرة؟",
      answer: "نعم وبشكل دوري ومستمر. نقوم بالشحن إلى ميناء جدة الإسلامي، ميناء جبل علي (دبي)، ميناء الدمام، ميناء حمد (قطر)، وميناء الشويخ (الكويت). ونزودك بكافة أوراق التصدير المعتمدة وفحص مطابقة المواصفات الخليجية SASO وبوليصة الشحن الأصلية لضمان فسح جمركي فوري وبسيط.",
    },
    {
      question: "كيف تعمل عملية استيراد وتوريد السيارات الكورية مباشرة؟",
      answer: "تقوم بتقديم مواصفات السيارة المطلوبة (الماركة، الموديل، الممشى، الميزانية، وميناء الوصول). يقوم وكلائنا في سيول بالبحث في شبكة الموزعين ومنصة Encar وفحص السيارة وإجراء فحص فني شامل من 150 نقطة، وإرسال تقرير فني وفيديو معاينة. بعد موافقتك، نقوم بشراء السيارة وتجهيز أوراق التصدير وشحنها مباشرة إلى مينائك.",
    },
    {
      question: "ما الذي يغطيه الفحص الفني الشامل المكون من 150 نقطة؟",
      answer: "تخضع كل سيارة لفحص تشخيصي احترافي دقيق. يشمل ذلك ضغط المحرك، سلامة الشاسي والهيكل (ضمان خلوه من الحوادث بنسبة 100٪)، سماكة الطلاء بالأجهزة المخصصة للتأكد من عدم وجود رش، تشخيص ناقل الحركة (الجير)، الأنظمة الكهربائية، وسلامة أسفل السيارة من الصدأ. نرسل لك تقريراً مفصلاً بالفيديو قبل الشراء.",
    },
    {
      question: "ما هي المدة المستغرقة للشحن البحري وما هي مسارات الشحن المتاحة؟",
      answer: "نشحن السيارات عبر سفن Ro-Ro المخصصة لنقل المركبات أو الحاويات. يستغرق الشحن البحري لموانئ الخليج العربي (ميناء جدة الإسلامي، ميناء جبل علي، ميناء حمد، ميناء الشويخ) من 14 إلى 22 يوماً. بينما يستغرق الشحن إلى أوروبا (روتردام، بريمرهافن) من 34 إلى 40 يوماً. جميع شحناتنا مؤمنة بالكامل.",
    },
    {
      question: "هل هناك رسوم جمركية، ضريبة القيمة المضافة، أو رسوم تخليص محلي؟",
      answer: "نعم، تنطبق قوانين الاستيراد المحلية. تبلغ الرسوم الجمركية في دول الخليج 5% من القيمة التقديرية. تختلف ضريبة القيمة المضافة المحلية (مثل 15% في السعودية و5% في الإمارات). تتيح لك حاسبة الشحن بموقعنا حساب التكاليف التقريبية بدقة. ونزودك بكافة المستندات الرسمية (شهادة التصدير الكورية، الفاتورة الموثقة، بوليصة الشحن) لتخليص جمركي سلس.",
    },
    {
      question: "هل يمكنني تتبع مراحل الفحص والتصدير والشحن الخاصة بسيارتي؟",
      answer: "بكل تأكيد. توفر أدفانسد كوريو نظام تتبع شفاف لعملائنا. بمجرد بدء المعاملة، ستحصل على رقم تتبع خاص أو رقم الشاسي (VIN). يمكنك إدخاله في بوابة تتبع العملاء بموقعنا لمتابعة المراحل الخمس في بث حي ومباشر: (1) تأمين السيارة، (2) إلغاء التسجيل وتصدير الشهادة، (3) الإيداع بساحة الميناء، (4) الشحن والتحميل، (5) الإبحار والعبور.",
    },
  ],
};

export default function FAQSection() {
  const { language, dir } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const items = FAQ_DATA[language === "ar" ? "ar" : "en"];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq-section"
      dir={dir}
      className="py-20 bg-white dark:bg-[#020a18] text-slate-900 dark:text-white border-t border-slate-200 dark:border-white/10 transition-colors duration-300"
    >
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#0066ff]/10 dark:bg-[#003478]/40 border border-[#0066ff]/20 dark:border-[#0066ff]/30 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#0066ff] dark:text-sky-400 mb-4 transition-colors">
            <Sparkles className="h-4 w-4" />
            <span>{language === "ar" ? "الأسئلة الشائعة ودليل الشراء" : "FAQ & Import Guide"}</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3 transition-colors">
            {language === "ar" ? "الأسئلة الأكثر شيوعاً حول تصدير السيارات" : "Frequently Asked Questions"}
          </h2>
          
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-350 transition-colors">
            {language === "ar"
              ? "كل ما تود معرفته عن فحص الجودة المكون من 150 نقطة، وتكلفة الشحن والجمارك، وتتبع سيارتك من سيول إلى مينائك."
              : "Everything you need to know about the 150-point quality inspection, shipping rates, customs documentation, and order tracking."}
          </p>
        </div>

        {/* FAQ Accordion Grid */}
        <div className="max-w-4xl mx-auto space-y-4">
          {items.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="group rounded-3xl border border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-[#0b1528] hover:border-[#0066ff]/30 dark:hover:border-sky-500/30 transition-all duration-300 overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full flex items-center justify-between p-6 text-left font-bold text-sm sm:text-base text-slate-800 dark:text-white focus:outline-none"
                  aria-expanded={isOpen}
                  id={`faq-button-${idx}`}
                  aria-controls={`faq-panel-${idx}`}
                >
                  <span className="flex items-center gap-3 pr-4">
                    <HelpCircle className="h-5 w-5 text-[#0066ff] dark:text-sky-400 shrink-0" />
                    <span className="text-left font-sans font-extrabold tracking-tight">{item.question}</span>
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 text-slate-450 dark:text-slate-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-[#0066ff] dark:text-sky-400" : ""
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-panel-${idx}`}
                      aria-labelledby={`faq-button-${idx}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pt-1 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300 font-medium border-t border-slate-200/40 dark:border-white/5 transition-colors">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
