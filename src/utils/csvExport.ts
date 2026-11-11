import type { SurveyResponseDocument } from '../types/survey';

function getNpsCategory(score: number | null): string {
  if (score === null || score === undefined) return 'Não informado';
  if (score >= 9) return 'Promotor';
  if (score >= 7) return 'Neutro / Passivo';
  return 'Detrator';
}

function escapeCsvCell(text: string | number | null | undefined): string {
  if (text === null || text === undefined) return '""';
  const str = String(text).replace(/"/g, '""');
  return `"${str}"`;
}

export function exportResponsesToCsv(responses: SurveyResponseDocument[], filename = 'pesquisa_satisfacao_colegio.csv') {
  const headers = [
    'ID',
    'Data de Envio',
    'Horário',
    'Responsável',
    'Aluno',
    'Turma / Série',
    'Turno',
    '1. Qualidade do Ensino (1-5)',
    '2. Acompanhamento do Filho (1-5)',
    '3. Professores e Metodologias (1-5)',
    '4. Comunicação com as Famílias (1-5)',
    '5. Atendimento da Secretaria (1-5)',
    '6. Suporte da Coordenação (1-5)',
    '7. Limpeza e Organização (1-5)',
    '8. Segurança dos Alunos (1-5)',
    '9. Ambientes e Estrutura Física (1-5)',
    '10. Satisfação Geral (1-5)',
    'Nota Recomendação (NPS 0-10)',
    'Classificação NPS',
    'O que mais gosta no colégio',
    'O que acredita que podemos melhorar',
    'Sugestões, elogios e comentários',
  ];

  const rows = responses.map((r) => {
    const dateObj = new Date(r.createdAt || r.timestamp);
    const dateStr = dateObj.toLocaleDateString('pt-BR');
    const timeStr = dateObj.toLocaleTimeString('pt-BR');

    return [
      escapeCsvCell(r.id),
      escapeCsvCell(dateStr),
      escapeCsvCell(timeStr),
      escapeCsvCell(r.responsibleName || 'Anônimo'),
      escapeCsvCell(r.studentName || 'Não informado'),
      escapeCsvCell(r.grade || 'Não informada'),
      escapeCsvCell(r.shift || 'Não informado'),
      escapeCsvCell(r.ratings.teachingQuality || ''),
      escapeCsvCell(r.ratings.developmentFollowUp || ''),
      escapeCsvCell(r.ratings.teachersMethodology || ''),
      escapeCsvCell(r.ratings.schoolCommunication || ''),
      escapeCsvCell(r.ratings.frontDeskService || ''),
      escapeCsvCell(r.ratings.pedagogicalCoordination || ''),
      escapeCsvCell(r.ratings.cleanlinessOrganization || ''),
      escapeCsvCell(r.ratings.studentSafety || ''),
      escapeCsvCell(r.ratings.physicalStructure || ''),
      escapeCsvCell(r.ratings.overallSatisfaction || ''),
      escapeCsvCell(r.npsScore ?? ''),
      escapeCsvCell(getNpsCategory(r.npsScore)),
      escapeCsvCell(r.suggestions.whatYouLikeMost || ''),
      escapeCsvCell(r.suggestions.whatCanImprove || ''),
      escapeCsvCell(r.suggestions.generalComments || ''),
    ].join(';');
  });

  // UTF-8 BOM prefix ensures Microsoft Excel and Google Sheets parse accented Portuguese letters seamlessly
  const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
