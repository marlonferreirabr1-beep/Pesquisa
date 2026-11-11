import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Star, 
  TrendingUp, 
  Download, 
  LogOut, 
  Search, 
  Eye, 
  Sparkles, 
  RotateCcw, 
  ArrowLeft,
  X,
  UserCheck
} from 'lucide-react';
import type { SurveyResponseDocument } from '../../types/survey';
import { GRADES_LIST } from '../../types/survey';
import { exportResponsesToCsv } from '../../utils/csvExport';
import { resetDemoSurveyResponses, isFirebaseConfigured, type AdminUser } from '../../services/firebase';

interface AdminDashboardProps {
  user: AdminUser;
  responses: SurveyResponseDocument[];
  onLogout: () => void;
  onBackToSurvey: () => void;
  onRefreshData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  user,
  responses,
  onLogout,
  onBackToSurvey,
  onRefreshData,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedShift, setSelectedShift] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | '7days' | '30days'>('all');
  const [inspectingResponse, setInspectingResponse] = useState<SurveyResponseDocument | null>(null);

  // Filtered dataset
  const filteredResponses = useMemo(() => {
    return responses.filter((r) => {
      // Search
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchName = r.responsibleName?.toLowerCase().includes(term);
        const matchStudent = r.studentName?.toLowerCase().includes(term);
        const matchLikes = r.suggestions?.whatYouLikeMost?.toLowerCase().includes(term);
        const matchImprove = r.suggestions?.whatCanImprove?.toLowerCase().includes(term);
        const matchComments = r.suggestions?.generalComments?.toLowerCase().includes(term);
        if (!matchName && !matchStudent && !matchLikes && !matchImprove && !matchComments) {
          return false;
        }
      }

      // Grade
      if (selectedGrade && r.grade !== selectedGrade) {
        return false;
      }

      // Shift
      if (selectedShift && r.shift !== selectedShift) {
        return false;
      }

      // Period
      if (selectedPeriod !== 'all') {
        const msLimit = selectedPeriod === '7days' ? 7 * 86400000 : 30 * 86400000;
        const respTime = r.timestamp || new Date(r.createdAt).getTime();
        if (Date.now() - respTime > msLimit) {
          return false;
        }
      }

      return true;
    });
  }, [responses, searchTerm, selectedGrade, selectedShift, selectedPeriod]);

  // Aggregate Metrics Calculations
  const metrics = useMemo(() => {
    const total = filteredResponses.length;
    if (total === 0) {
      return {
        total: 0,
        overallAvg: 0,
        npsScore: 0,
        promotersPct: 0,
        passivesPct: 0,
        detractorsPct: 0,
        promotersCount: 0,
        passivesCount: 0,
        detractorsCount: 0,
        categoryAverages: {
          teaching: 0,
          communication: 0,
          structure: 0,
          overall: 0,
        },
      };
    }

    let sumOverall = 0;
    let sumTeaching = 0;
    let sumComm = 0;
    let sumStruct = 0;

    let promoters = 0;
    let passives = 0;
    let detractors = 0;

    filteredResponses.forEach((r) => {
      sumOverall += r.ratings.overallSatisfaction || 0;
      sumTeaching += (
        (r.ratings.teachingQuality || 0) + 
        (r.ratings.developmentFollowUp || 0) + 
        (r.ratings.teachersMethodology || 0)
      ) / 3;
      sumComm += (
        (r.ratings.schoolCommunication || 0) + 
        (r.ratings.frontDeskService || 0) + 
        (r.ratings.pedagogicalCoordination || 0)
      ) / 3;
      sumStruct += (
        (r.ratings.cleanlinessOrganization || 0) + 
        (r.ratings.studentSafety || 0) + 
        (r.ratings.physicalStructure || 0)
      ) / 3;

      if (r.npsScore !== null && r.npsScore !== undefined) {
        if (r.npsScore >= 9) promoters++;
        else if (r.npsScore >= 7) passives++;
        else detractors++;
      }
    });

    const overallAvg = Number((sumOverall / total).toFixed(1));
    const teachingAvg = Number((sumTeaching / total).toFixed(1));
    const commAvg = Number((sumComm / total).toFixed(1));
    const structAvg = Number((sumStruct / total).toFixed(1));

    const totalNpsResponses = promoters + passives + detractors || 1;
    const promotersPct = Math.round((promoters / totalNpsResponses) * 100);
    const passivesPct = Math.round((passives / totalNpsResponses) * 100);
    const detractorsPct = Math.round((detractors / totalNpsResponses) * 100);
    const npsScore = Math.round(promotersPct - detractorsPct);

    return {
      total,
      overallAvg,
      npsScore,
      promotersPct,
      passivesPct,
      detractorsPct,
      promotersCount: promoters,
      passivesCount: passives,
      detractorsCount: detractors,
      categoryAverages: {
        teaching: teachingAvg,
        communication: commAvg,
        structure: structAvg,
        overall: overallAvg,
      },
    };
  }, [filteredResponses]);

  const handleExportCsv = () => {
    exportResponsesToCsv(filteredResponses, `pesquisa_satisfacao_relatorio_${Date.now()}.csv`);
  };

  const handleResetDemo = () => {
    if (confirm('Deseja recarregar o conjunto de respostas padrão de teste para visualização de métricas?')) {
      resetDemoSurveyResponses();
      onRefreshData();
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7EF] text-[#283D35] pb-16">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#D9BA79]/30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://i.postimg.cc/4dB1VpFp/file-00000000fde4820e9eedd8fce39418f5.png"
              alt="Logo Colégio"
              className="h-9 w-auto object-contain"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif-title text-lg font-bold text-[#283D35]">
                  Painel da Direção
                </h1>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-amber-50 text-[#B8964C] border border-[#D9BA79]/40">
                  Gestão Estratégica
                </span>
              </div>
              <p className="text-[11px] text-stone-500">
                Logado como: <strong className="text-[#283D35]">{user.email}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onBackToSurvey}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#283D35] hover:bg-stone-100 border border-stone-200 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ver Formulário</span>
            </button>

            <button
              onClick={handleExportCsv}
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#283D35] hover:bg-[#1E2E28] text-white shadow-xs transition-all cursor-pointer"
              title="Exporta dados tabulares em formato CSV para Excel e Google Sheets"
            >
              <Download className="w-3.5 h-3.5 text-[#D9BA79]" />
              <span>Exportar CSV</span>
            </button>

            <button
              onClick={onLogout}
              type="button"
              className="p-1.5 rounded-xl text-stone-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Sair do painel administrativo"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Banner about Firestore status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-[#D9BA79]/30 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-[#D9BA79]/40 flex items-center justify-center text-[#B8964C] shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#283D35]">
                Ambiente de Gestão de Satisfação em Tempo Real
              </p>
              <p className="text-[11px] text-stone-500">
                {isFirebaseConfigured
                  ? 'Conectado à nuvem Firebase Firestore. Sincronização permanente ativa.'
                  : 'Armazenamento operacional local com persistência entre sessões. Configure suas chaves no .env para ativar a nuvem na Vercel.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetDemo}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-medium text-stone-600 hover:text-[#283D35] bg-stone-50 hover:bg-stone-100 border border-stone-200 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-stone-400" />
              <span>Dados de Exemplo</span>
            </button>
          </div>
        </div>

        {/* Top 4 KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Total Respostas */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs text-stone-500 font-medium">Total de Avaliações</p>
              <p className="text-3xl font-serif-title font-bold text-[#283D35] mt-1">
                {metrics.total}
              </p>
              <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
                Respostas consolidadas
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>

          {/* 2. Média Geral */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs text-stone-500 font-medium">Média Geral de Satisfação</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-serif-title font-bold text-[#283D35]">
                  {metrics.overallAvg.toFixed(1)}
                </span>
                <span className="text-xs text-stone-400">/ 5.0</span>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-3 h-3 ${
                      s <= Math.round(metrics.overallAvg)
                        ? 'fill-[#D9BA79] text-[#D9BA79]'
                        : 'text-stone-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#B8964C] flex items-center justify-center">
              <Star className="w-6 h-6 fill-[#D9BA79]" />
            </div>
          </div>

          {/* 3. NPS Score */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs text-stone-500 font-medium">Índice NPS Geral</p>
              <p className="text-3xl font-serif-title font-bold text-[#283D35] mt-1">
                {metrics.npsScore > 0 ? `+${metrics.npsScore}` : metrics.npsScore}
              </p>
              <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md mt-0.5 ${
                metrics.npsScore >= 75
                  ? 'bg-emerald-100 text-emerald-800'
                  : metrics.npsScore >= 50
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-rose-100 text-rose-800'
              }`}>
                {metrics.npsScore >= 75
                  ? 'Zona de Excelência'
                  : metrics.npsScore >= 50
                  ? 'Zona de Qualidade'
                  : 'Zona de Aperfeiçoamento'}
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          {/* 4. Taxa de Promotores */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs text-stone-500 font-medium">Promotores da Marca</p>
              <p className="text-3xl font-serif-title font-bold text-[#283D35] mt-1">
                {metrics.promotersPct}%
              </p>
              <p className="text-[11px] text-stone-500 mt-0.5">
                {metrics.promotersCount} famílias indicam ativamente
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-stone-100 text-[#283D35] flex items-center justify-center">
              <UserCheck className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Visual Charts & Category Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Dimensões Avaliadas */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
            <h3 className="font-serif-title text-lg font-bold text-[#283D35]">
              Desempenho por Dimensão Avaliada
            </h3>
            <p className="text-xs text-stone-500">
              Médias obtidas na escala de 1 a 5 estrelas em cada área chave da instituição:
            </p>

            <div className="space-y-4 pt-2">
              {/* Ensino */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-[#283D35]">
                  <span>Ensino, Metodologias &amp; Professores</span>
                  <span className="text-[#B8964C]">{metrics.categoryAverages.teaching} / 5.0</span>
                </div>
                <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-700 rounded-full transition-all duration-700"
                    style={{ width: `${(metrics.categoryAverages.teaching / 5) * 100}%` }}
                  />
                </div>
              </div>

              {/* Comunicação */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-[#283D35]">
                  <span>Comunicação, Atendimento &amp; Coordenação</span>
                  <span className="text-[#B8964C]">{metrics.categoryAverages.communication} / 5.0</span>
                </div>
                <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#B8964C] rounded-full transition-all duration-700"
                    style={{ width: `${(metrics.categoryAverages.communication / 5) * 100}%` }}
                  />
                </div>
              </div>

              {/* Estrutura */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-[#283D35]">
                  <span>Estrutura Física, Limpeza &amp; Segurança</span>
                  <span className="text-[#B8964C]">{metrics.categoryAverages.structure} / 5.0</span>
                </div>
                <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#283D35] rounded-full transition-all duration-700"
                    style={{ width: `${(metrics.categoryAverages.structure / 5) * 100}%` }}
                  />
                </div>
              </div>

              {/* Satisfação Geral */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-[#283D35]">
                  <span>Satisfação Geral com a Escola</span>
                  <span className="text-[#B8964C]">{metrics.categoryAverages.overall} / 5.0</span>
                </div>
                <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 rounded-full transition-all duration-700"
                    style={{ width: `${(metrics.categoryAverages.overall / 5) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* NPS Breakdown Bar */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="font-serif-title text-lg font-bold text-[#283D35]">
                Distribuição Detalhada de NPS
              </h3>
              <p className="text-xs text-stone-500">
                Segmentação dos respondentes segundo a metodologia Net Promoter Score:
              </p>

              {/* Stacked Bar */}
              <div className="w-full h-7 rounded-xl overflow-hidden flex my-5 shadow-xs">
                <div 
                  className="bg-emerald-600 flex items-center justify-center text-white text-[10px] font-bold transition-all duration-500"
                  style={{ width: `${metrics.promotersPct}%` }}
                  title={`Promotores: ${metrics.promotersPct}%`}
                >
                  {metrics.promotersPct > 10 ? `${metrics.promotersPct}%` : ''}
                </div>
                <div 
                  className="bg-amber-500 flex items-center justify-center text-white text-[10px] font-bold transition-all duration-500"
                  style={{ width: `${metrics.passivesPct}%` }}
                  title={`Passivos: ${metrics.passivesPct}%`}
                >
                  {metrics.passivesPct > 10 ? `${metrics.passivesPct}%` : ''}
                </div>
                <div 
                  className="bg-rose-500 flex items-center justify-center text-white text-[10px] font-bold transition-all duration-500"
                  style={{ width: `${metrics.detractorsPct}%` }}
                  title={`Detratores: ${metrics.detractorsPct}%`}
                >
                  {metrics.detractorsPct > 10 ? `${metrics.detractorsPct}%` : ''}
                </div>
              </div>

              {/* Legend with counts */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 mx-auto mb-1" />
                  <p className="font-bold text-emerald-900">{metrics.promotersCount} ({metrics.promotersPct}%)</p>
                  <p className="text-[11px] text-emerald-700">Promotores (9-10)</p>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500 mx-auto mb-1" />
                  <p className="font-bold text-amber-900">{metrics.passivesCount} ({metrics.passivesPct}%)</p>
                  <p className="text-[11px] text-amber-700">Passivos (7-8)</p>
                </div>

                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500 mx-auto mb-1" />
                  <p className="font-bold text-rose-900">{metrics.detractorsCount} ({metrics.detractorsPct}%)</p>
                  <p className="text-[11px] text-rose-700">Detratores (0-6)</p>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF7EF] text-[11px] text-[#283D35]/75 border border-[#D9BA79]/30">
              <strong>Fórmula NPS:</strong> % Promotores ({metrics.promotersPct}%) - % Detratores ({metrics.detractorsPct}%) = <strong>{metrics.npsScore > 0 ? `+${metrics.npsScore}` : metrics.npsScore}</strong> pontos.
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs space-y-3">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por responsável, aluno ou palavra em sugestões..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 text-xs text-[#283D35] bg-stone-50/50 focus:bg-white focus:outline-none focus:border-[#D9BA79]"
              />
            </div>

            {/* Selects */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Grade Filter */}
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="px-3 py-2 rounded-xl border border-stone-200 text-xs text-[#283D35] bg-white cursor-pointer"
              >
                <option value="">Todas as Turmas / Séries</option>
                {GRADES_LIST.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>

              {/* Shift Filter */}
              <div className="px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-600 bg-stone-50">
                Turno: <strong>Vespertino (Tarde)</strong>
              </div>

              {/* Period Filter */}
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as any)}
                className="px-3 py-2 rounded-xl border border-stone-200 text-xs text-[#283D35] bg-white cursor-pointer"
              >
                <option value="all">Todo o Período</option>
                <option value="7days">Últimos 7 dias</option>
                <option value="30days">Últimos 30 dias</option>
              </select>

              {(searchTerm || selectedGrade || selectedShift || selectedPeriod !== 'all') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedGrade('');
                    setSelectedShift('');
                    setSelectedPeriod('all');
                  }}
                  className="px-2.5 py-2 rounded-xl text-xs text-rose-600 hover:bg-rose-50 font-medium cursor-pointer"
                >
                  Limpar
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Responses Table / List */}
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-stone-100 flex items-center justify-between">
            <h3 className="font-serif-title text-base font-bold text-[#283D35]">
              Respostas Individuais dos Responsáveis ({filteredResponses.length})
            </h3>
            <span className="text-xs text-stone-400">
              Clique no ícone de olho para inspecionar todos os detalhes
            </span>
          </div>

          {filteredResponses.length === 0 ? (
            <div className="p-12 text-center text-stone-400 text-sm">
              Nenhuma resposta encontrada para os filtros aplicados.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200/70 text-stone-600 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Data/Hora</th>
                    <th className="py-3 px-4">Responsável / Aluno</th>
                    <th className="py-3 px-4">Turma &amp; Turno</th>
                    <th className="py-3 px-4 text-center">Geral</th>
                    <th className="py-3 px-4 text-center">NPS</th>
                    <th className="py-3 px-4">Comentário Principal</th>
                    <th className="py-3 px-4 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-[#283D35]">
                  {filteredResponses.map((r) => {
                    const dateObj = new Date(r.createdAt || r.timestamp);
                    const formattedDate = dateObj.toLocaleDateString('pt-BR');
                    const formattedTime = dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

                    const commentPreview =
                      r.suggestions.whatYouLikeMost ||
                      r.suggestions.whatCanImprove ||
                      r.suggestions.generalComments ||
                      'Sem texto livre';

                    return (
                      <tr key={r.id} className="hover:bg-amber-50/40 transition-colors">
                        <td className="py-3 px-4 whitespace-nowrap text-stone-500 font-mono">
                          {formattedDate} {formattedTime}
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-semibold text-[#283D35]">
                            {r.responsibleName || <span className="text-stone-400 font-normal italic">Anônimo</span>}
                          </p>
                          {r.studentName && (
                            <p className="text-[11px] text-stone-400">Aluno(a): {r.studentName}</p>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-medium text-[#283D35] line-clamp-1">{r.grade}</p>
                          <span className="inline-block text-[10px] px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-600 mt-0.5 font-medium">
                            {r.shift}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-flex items-center gap-1 font-bold text-[#B8964C] bg-amber-50 px-2 py-0.5 rounded-md border border-[#D9BA79]/30">
                            <Star className="w-3 h-3 fill-[#D9BA79]" />
                            {r.ratings.overallSatisfaction}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-block font-bold px-2 py-0.5 rounded-md ${
                            (r.npsScore ?? 0) >= 9
                              ? 'bg-emerald-100 text-emerald-800'
                              : (r.npsScore ?? 0) >= 7
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {r.npsScore ?? '-'}
                          </span>
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          <p className="truncate text-stone-600" title={commentPreview}>
                            "{commentPreview}"
                          </p>
                        </td>
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => setInspectingResponse(r)}
                            className="p-1.5 rounded-lg bg-stone-100 hover:bg-[#283D35] hover:text-white transition-all cursor-pointer inline-flex items-center gap-1 text-xs font-medium"
                            title="Ver detalhes completos da avaliação"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Ver</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* INSPECTION MODAL */}
      {inspectingResponse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-[#D9BA79]/40 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setInspectingResponse(null)}
              type="button"
              className="absolute top-5 right-5 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-stone-100 pb-4 mb-5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#B8964C]">
                Detalhes da Avaliação Escolar
              </span>
              <h3 className="font-serif-title text-2xl font-bold text-[#283D35] mt-1">
                {inspectingResponse.grade} • Turno {inspectingResponse.shift}
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Enviado em: {new Date(inspectingResponse.createdAt || inspectingResponse.timestamp).toLocaleString('pt-BR')} • 
                Responsável: <strong>{inspectingResponse.responsibleName || 'Anônimo'}</strong>
                {inspectingResponse.studentName && ` (Aluno: ${inspectingResponse.studentName})`}
              </p>
            </div>

            {/* Questions breakdown */}
            <div className="space-y-4 text-xs">
              <div className="bg-[#FAF7EF] p-4 rounded-2xl border border-[#D9BA79]/30 space-y-2">
                <h4 className="font-semibold text-[#283D35] text-sm flex items-center gap-2">
                  <Star className="w-4 h-4 text-[#B8964C] fill-[#D9BA79]" />
                  Notas Atribuídas por Critério
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <div className="p-2 bg-white rounded-xl border border-stone-200">
                    <span className="text-stone-500">Qualidade do Ensino:</span>
                    <strong className="float-right text-[#283D35]">{inspectingResponse.ratings.teachingQuality} / 5</strong>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-stone-200">
                    <span className="text-stone-500">Acompanhamento do Filho:</span>
                    <strong className="float-right text-[#283D35]">{inspectingResponse.ratings.developmentFollowUp} / 5</strong>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-stone-200">
                    <span className="text-stone-500">Professores e Metodologias:</span>
                    <strong className="float-right text-[#283D35]">{inspectingResponse.ratings.teachersMethodology} / 5</strong>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-stone-200">
                    <span className="text-stone-500">Comunicação com as Famílias:</span>
                    <strong className="float-right text-[#283D35]">{inspectingResponse.ratings.schoolCommunication} / 5</strong>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-stone-200">
                    <span className="text-stone-500">Atendimento da Secretaria:</span>
                    <strong className="float-right text-[#283D35]">{inspectingResponse.ratings.frontDeskService} / 5</strong>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-stone-200">
                    <span className="text-stone-500">Suporte da Coordenação:</span>
                    <strong className="float-right text-[#283D35]">{inspectingResponse.ratings.pedagogicalCoordination} / 5</strong>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-stone-200">
                    <span className="text-stone-500">Limpeza e Organização:</span>
                    <strong className="float-right text-[#283D35]">{inspectingResponse.ratings.cleanlinessOrganization} / 5</strong>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-stone-200">
                    <span className="text-stone-500">Segurança dos Alunos:</span>
                    <strong className="float-right text-[#283D35]">{inspectingResponse.ratings.studentSafety} / 5</strong>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-stone-200">
                    <span className="text-stone-500">Ambientes e Estrutura Física:</span>
                    <strong className="float-right text-[#283D35]">{inspectingResponse.ratings.physicalStructure} / 5</strong>
                  </div>
                  <div className="p-2 bg-amber-50 rounded-xl border border-[#D9BA79]/40">
                    <span className="text-[#B8964C] font-semibold">Satisfação Geral:</span>
                    <strong className="float-right text-[#B8964C] text-sm">{inspectingResponse.ratings.overallSatisfaction} / 5</strong>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-stone-200 flex items-center justify-between mt-2">
                  <span className="font-semibold text-[#283D35]">Recomendação NPS (0 a 10):</span>
                  <span className="text-base font-bold text-[#283D35]">
                    {inspectingResponse.npsScore} / 10
                  </span>
                </div>
              </div>

              {/* Sugestões Abertas */}
              <div className="space-y-2 pt-2">
                <h4 className="font-semibold text-[#283D35] text-sm">
                  Textos e Comentários Abertos
                </h4>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <p className="text-[10px] uppercase font-bold text-stone-400">O que mais gosta no colégio:</p>
                  <p className="text-stone-700 mt-1 italic">
                    {inspectingResponse.suggestions.whatYouLikeMost || 'Não preenchido'}
                  </p>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <p className="text-[10px] uppercase font-bold text-stone-400">O que acredita que podemos melhorar:</p>
                  <p className="text-stone-700 mt-1 italic">
                    {inspectingResponse.suggestions.whatCanImprove || 'Não preenchido'}
                  </p>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <p className="text-[10px] uppercase font-bold text-stone-400">Sugestões, elogios ou comentários adicionais:</p>
                  <p className="text-stone-700 mt-1 italic">
                    {inspectingResponse.suggestions.generalComments || 'Não preenchido'}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-100 flex justify-end">
              <button
                type="button"
                onClick={() => setInspectingResponse(null)}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#283D35] text-white hover:bg-[#1E2E28] cursor-pointer"
              >
                Fechar Detalhes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
