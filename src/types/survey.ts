export type ShiftType = 'Matutino' | 'Vespertino' | 'Integral';

export interface SurveyRatings {
  teachingQuality: number; // 1-5
  developmentFollowUp: number; // 1-5
  teachersMethodology: number; // 1-5
  schoolCommunication: number; // 1-5
  frontDeskService: number; // 1-5
  pedagogicalCoordination: number; // 1-5
  cleanlinessOrganization: number; // 1-5
  studentSafety: number; // 1-5
  physicalStructure: number; // 1-5
  overallSatisfaction: number; // 1-5
}

export interface SurveySuggestions {
  whatYouLikeMost: string;
  whatCanImprove: string;
  generalComments: string;
}

export interface SurveyData {
  responsibleName: string;
  studentName: string;
  grade: string;
  shift: ShiftType | '';
  ratings: SurveyRatings;
  npsScore: number | null; // 0-10
  suggestions: SurveySuggestions;
}

export interface SurveyResponseDocument extends SurveyData {
  id: string;
  createdAt: string; // ISO date string
  timestamp: number; // epoch ms
  status: 'completed';
}

export const GRADES_LIST = [
  'Socialização / 2 Anos',
  '1° Período / 3 Anos',
  '2° Período / 4 Anos',
  '3° Período / 5 Anos',
  '1° Ano / 6 Anos',
  '2° Ano / 7 Anos',
  '3° Ano / 8 Anos',
  '4° Ano / 9 Anos',
  '5° Ano / 10 Anos',
];

export const INITIAL_SURVEY_DATA: SurveyData = {
  responsibleName: '',
  studentName: '',
  grade: '',
  shift: 'Vespertino',
  ratings: {
    teachingQuality: 0,
    developmentFollowUp: 0,
    teachersMethodology: 0,
    schoolCommunication: 0,
    frontDeskService: 0,
    pedagogicalCoordination: 0,
    cleanlinessOrganization: 0,
    studentSafety: 0,
    physicalStructure: 0,
    overallSatisfaction: 0,
  },
  npsScore: null,
  suggestions: {
    whatYouLikeMost: '',
    whatCanImprove: '',
    generalComments: '',
  },
};

export interface SectionMeta {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  shortLabel: string;
}

export const SECTIONS: SectionMeta[] = [
  {
    id: 0,
    slug: 'boas-vindas',
    title: 'Boas-vindas',
    subtitle: 'Sua opinião transforma o nosso colégio!',
    shortLabel: 'Início',
  },
  {
    id: 1,
    slug: 'identificacao',
    title: 'Identificação',
    subtitle: 'Dados para contextualizar sua experiência escolar',
    shortLabel: 'Identificação',
  },
  {
    id: 2,
    slug: 'ensino-aprendizagem',
    title: 'Ensino e Aprendizagem',
    subtitle: 'Avaliação pedagógica, desenvolvimento e corpo docente',
    shortLabel: 'Pedagógico',
  },
  {
    id: 3,
    slug: 'comunicacao-atendimento',
    title: 'Comunicação e Atendimento',
    subtitle: 'Relacionamento, secretaria e coordenação',
    shortLabel: 'Atendimento',
  },
  {
    id: 4,
    slug: 'estrutura-seguranca',
    title: 'Estrutura e Segurança',
    subtitle: 'Ambientes físicos, higiene e bem-estar dos alunos',
    shortLabel: 'Estrutura',
  },
  {
    id: 5,
    slug: 'satisfacao-geral',
    title: 'Satisfação Geral & NPS',
    subtitle: 'Avaliação global e probabilidade de recomendação',
    shortLabel: 'Satisfação',
  },
  {
    id: 6,
    slug: 'sugestoes',
    title: 'Sugestões e Comentários',
    subtitle: 'Espaço aberto para sua voz e ideias de evolução',
    shortLabel: 'Sugestões',
  },
  {
    id: 7,
    slug: 'revisao-envio',
    title: 'Revisão e Envio',
    subtitle: 'Confira suas respostas e contribua com nosso colégio',
    shortLabel: 'Finalização',
  },
];
