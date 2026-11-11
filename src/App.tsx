import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { VerticalNavigationDots } from './components/VerticalNavigationDots';
import { BottomControls } from './components/BottomControls';
import { WelcomeSection } from './components/sections/WelcomeSection';
import { IdentificationSection } from './components/sections/IdentificationSection';
import { TeachingSection } from './components/sections/TeachingSection';
import { CommunicationSection } from './components/sections/CommunicationSection';
import { StructureSection } from './components/sections/StructureSection';
import { OverallSatisfactionSection } from './components/sections/OverallSatisfactionSection';
import { SuggestionsSection } from './components/sections/SuggestionsSection';
import { ReviewAndSubmitSection } from './components/sections/ReviewAndSubmitSection';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { 
  SECTIONS, 
  INITIAL_SURVEY_DATA, 
  type SurveyData, 
  type SurveyResponseDocument 
} from './types/survey';
import { 
  submitSurveyResponse, 
  fetchAllSurveyResponses, 
  getStoredAdminSession, 
  logoutAdmin,
  type AdminUser 
} from './services/firebase';
import { sendSurveyToEmail } from './services/emailService';

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [surveyData, setSurveyData] = useState<SurveyData>(INITIAL_SURVEY_DATA);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Admin states
  const [isAdminView, setIsAdminView] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [adminResponses, setAdminResponses] = useState<SurveyResponseDocument[]>([]);

  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  // Check stored admin session on mount or check hash '#admin'
  useEffect(() => {
    const session = getStoredAdminSession();
    if (session) {
      setAdminUser(session);
    }

    if (window.location.hash === '#admin') {
      if (session) {
        setIsAdminView(true);
      } else {
        setIsAdminModalOpen(true);
      }
    }
  }, []);

  // Fetch admin responses when entering admin view
  const loadResponses = useCallback(async () => {
    try {
      const resp = await fetchAllSurveyResponses();
      setAdminResponses(resp);
    } catch (e) {
      console.error('Erro ao carregar dados:', e);
    }
  }, []);

  useEffect(() => {
    if (isAdminView) {
      loadResponses();
    }
  }, [isAdminView, loadResponses]);

  // Scroll smoothly to a specific section index without snapping
  const scrollToSection = useCallback((index: number) => {
    const targetEl = sectionRefs.current[index];
    if (targetEl) {
      const yOffset = -70; // Header offset
      const y = targetEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    setCurrentIndex(index);
  }, []);

  // Sync current section with scroll position via IntersectionObserver
  useEffect(() => {
    if (isAdminView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const indexAttr = entry.target.getAttribute('data-index');
            if (indexAttr !== null) {
              const idx = parseInt(indexAttr, 10);
              setCurrentIndex(idx);
            }
          }
        });
      },
      {
        rootMargin: '-20% 0px -40% 0px',
        threshold: 0.1,
      }
    );

    sectionRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isAdminView]);

  // Data update helpers
  const handleUpdateSurvey = (updates: Partial<SurveyData>) => {
    setSurveyData((prev) => ({ ...prev, ...updates }));
  };

  const handleUpdateRatings = (ratingsUpdates: Partial<SurveyData['ratings']>) => {
    setSurveyData((prev) => ({
      ...prev,
      ratings: { ...prev.ratings, ...ratingsUpdates },
    }));
  };

  const handleUpdateSuggestions = (suggestionsUpdates: Partial<SurveyData['suggestions']>) => {
    setSurveyData((prev) => ({
      ...prev,
      suggestions: { ...prev.suggestions, ...suggestionsUpdates },
    }));
  };

  // Submit survey action: saves locally/Firestore AND dispatches full email to Marlon.webcontato@gmail.com
  const handleFinalSubmit = async () => {
    // 1. Envia notificação por e-mail com todo o conteúdo
    await sendSurveyToEmail(surveyData);

    // 2. Registra no banco de dados persistente / Firestore
    await submitSurveyResponse(surveyData);

    setIsSubmitted(true);
  };

  const handleRestart = () => {
    setSurveyData(INITIAL_SURVEY_DATA);
    setIsSubmitted(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentIndex(0);
  };

  // Admin access handlers
  const handleOpenAdmin = () => {
    if (adminUser) {
      setIsAdminView(true);
    } else {
      setIsAdminModalOpen(true);
    }
  };

  const handleAdminLoginSuccess = (user: AdminUser) => {
    setAdminUser(user);
    setIsAdminModalOpen(false);
    setIsAdminView(true);
  };

  const handleAdminLogout = async () => {
    await logoutAdmin();
    setAdminUser(null);
    setIsAdminView(false);
    if (window.location.hash === '#admin') {
      window.location.hash = '';
    }
  };

  // If in Admin Dashboard view
  if (isAdminView && adminUser) {
    return (
      <AdminDashboard
        user={adminUser}
        responses={adminResponses}
        onLogout={handleAdminLogout}
        onBackToSurvey={() => {
          setIsAdminView(false);
          if (window.location.hash === '#admin') {
            window.location.hash = '';
          }
        }}
        onRefreshData={loadResponses}
      />
    );
  }

  return (
    <div className="relative min-h-screen bg-[#FAF7EF] text-[#283D35] flex flex-col font-sans">
      {/* Top Header */}
      <Header
        currentSectionIndex={currentIndex}
        onOpenAdmin={handleOpenAdmin}
        isAdminLoggedIn={Boolean(adminUser)}
      />

      {/* Floating Vertical Navigation Dots */}
      <VerticalNavigationDots
        currentIndex={currentIndex}
        onSelectIndex={scrollToSection}
      />

      {/* Free scrolling main content without forced auto-jumping */}
      <main className="w-full pt-16 sm:pt-20 pb-24">
        {/* SEÇÃO 1: BOAS-VINDAS */}
        <div
          ref={(el) => { sectionRefs.current[0] = el; }}
          data-index={0}
        >
          <WelcomeSection onScrollDown={() => scrollToSection(1)} />
        </div>

        {/* SEÇÃO 2: IDENTIFICAÇÃO */}
        <div
          ref={(el) => { sectionRefs.current[1] = el; }}
          data-index={1}
        >
          <IdentificationSection
            data={surveyData}
            onChange={handleUpdateSurvey}
          />
        </div>

        {/* SEÇÃO 3: ENSINO E APRENDIZAGEM */}
        <div
          ref={(el) => { sectionRefs.current[2] = el; }}
          data-index={2}
        >
          <TeachingSection
            ratings={surveyData.ratings}
            onChange={handleUpdateRatings}
          />
        </div>

        {/* SEÇÃO 4: COMUNICAÇÃO E ATENDIMENTO */}
        <div
          ref={(el) => { sectionRefs.current[3] = el; }}
          data-index={3}
        >
          <CommunicationSection
            ratings={surveyData.ratings}
            onChange={handleUpdateRatings}
          />
        </div>

        {/* SEÇÃO 5: ESTRUTURA E SEGURANÇA */}
        <div
          ref={(el) => { sectionRefs.current[4] = el; }}
          data-index={4}
        >
          <StructureSection
            ratings={surveyData.ratings}
            onChange={handleUpdateRatings}
          />
        </div>

        {/* SEÇÃO 6: SATISFAÇÃO GERAL & NPS */}
        <div
          ref={(el) => { sectionRefs.current[5] = el; }}
          data-index={5}
        >
          <OverallSatisfactionSection
            overallRating={surveyData.ratings.overallSatisfaction}
            npsScore={surveyData.npsScore}
            onRatingChange={(val) => handleUpdateRatings({ overallSatisfaction: val })}
            onNpsChange={(score) => handleUpdateSurvey({ npsScore: score })}
          />
        </div>

        {/* SEÇÃO 7: SUGESTÕES E COMENTÁRIOS */}
        <div
          ref={(el) => { sectionRefs.current[6] = el; }}
          data-index={6}
        >
          <SuggestionsSection
            suggestions={surveyData.suggestions}
            onChange={handleUpdateSuggestions}
          />
        </div>

        {/* SEÇÃO 8: REVISÃO E FINALIZAÇÃO */}
        <div
          ref={(el) => { sectionRefs.current[7] = el; }}
          data-index={7}
        >
          <ReviewAndSubmitSection
            data={surveyData}
            onSubmit={handleFinalSubmit}
            isSubmitted={isSubmitted}
            onRestart={handleRestart}
          />
        </div>
      </main>

      {/* Discreet floating helpers (scroll to top & jump to submit) */}
      <BottomControls
        currentIndex={currentIndex}
        onScrollToTop={() => scrollToSection(0)}
        onScrollToSubmit={() => scrollToSection(7)}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onSuccess={handleAdminLoginSuccess}
      />
    </div>
  );
}
