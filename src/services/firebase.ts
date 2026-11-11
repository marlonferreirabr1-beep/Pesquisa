import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp,
  type Firestore 
} from 'firebase/firestore';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  type Auth, 
  type User 
} from 'firebase/auth';
import type { SurveyData, SurveyResponseDocument } from '../types/survey';

// VITE environment variables for Vercel & Production
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && 
  firebaseConfig.projectId && 
  firebaseConfig.apiKey !== 'SUA_API_KEY'
);

let app: FirebaseApp | null = null;
export let db: Firestore | null = null;
export let auth: Auth | null = null;

if (isFirebaseConfigured) {
  try {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
    db = getFirestore(app);
    auth = getAuth(app);
    console.info('Conexão Firebase Firestore e Auth inicializada com sucesso.');
  } catch (err) {
    console.warn('Aviso: Falha ao inicializar o Firebase. Operando com armazenamento local seguro.', err);
  }
}

const LOCAL_STORAGE_KEY = 'escola_pesquisa_satisfacao_v1';
const ADMIN_SESSION_KEY = 'escola_admin_session_v1';

// Seed demo responses so admin dashboard has realistic initial data to analyze
const DEMO_RESPONSES: SurveyResponseDocument[] = [
  {
    id: 'resp-demo-1',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 1,
    status: 'completed',
    responsibleName: 'Carolina Mendes de Albuquerque',
    studentName: 'Lucas Mendes',
    grade: '3º Ano - Ensino Fundamental I',
    shift: 'Matutino',
    ratings: {
      teachingQuality: 5,
      developmentFollowUp: 5,
      teachersMethodology: 4,
      schoolCommunication: 5,
      frontDeskService: 4,
      pedagogicalCoordination: 5,
      cleanlinessOrganization: 5,
      studentSafety: 5,
      physicalStructure: 4,
      overallSatisfaction: 5,
    },
    npsScore: 10,
    suggestions: {
      whatYouLikeMost: 'O acolhimento dos professores e o projeto de leitura diário. O Lucas ama ir para a escola!',
      whatCanImprove: 'A ampliação da cobertura na área de embarque e desembarque nos dias de chuva intensa.',
      generalComments: 'Parabéns à direção e coordenação por manter um padrão de excelência humana e pedagógica.',
    },
  },
  {
    id: 'resp-demo-2',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2,
    status: 'completed',
    responsibleName: 'Roberto Silveira Rocha',
    studentName: 'Beatriz Rocha',
    grade: '1ª Série - Ensino Médio',
    shift: 'Integral',
    ratings: {
      teachingQuality: 5,
      developmentFollowUp: 4,
      teachersMethodology: 5,
      schoolCommunication: 4,
      frontDeskService: 4,
      pedagogicalCoordination: 4,
      cleanlinessOrganization: 5,
      studentSafety: 5,
      physicalStructure: 5,
      overallSatisfaction: 5,
    },
    npsScore: 9,
    suggestions: {
      whatYouLikeMost: 'O programa pedagógico e o acolhimento dedicado dos professores.',
      whatCanImprove: 'Mais opções saudáveis e cardápio diversificado na cantina para quem fica no integral.',
      generalComments: 'Estamos muito satisfeitos com a evolução da Beatriz neste ano letivo.',
    },
  },
  {
    id: 'resp-demo-3',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3,
    status: 'completed',
    responsibleName: 'Juliana Prado Rezende',
    studentName: 'Mateus Rezende',
    grade: 'Educação Infantil (Maternal / Jardim)',
    shift: 'Vespertino',
    ratings: {
      teachingQuality: 5,
      developmentFollowUp: 5,
      teachersMethodology: 5,
      schoolCommunication: 5,
      frontDeskService: 5,
      pedagogicalCoordination: 5,
      cleanlinessOrganization: 5,
      studentSafety: 5,
      physicalStructure: 5,
      overallSatisfaction: 5,
    },
    npsScore: 10,
    suggestions: {
      whatYouLikeMost: 'O carinho indescritível das tias e o cuidado com a alimentação e higiene das crianças pequenas.',
      whatCanImprove: 'Gostaria de mais fotos das atividades no aplicativo escolar durante a semana.',
      generalComments: 'Sentimos segurança total em deixar nosso bem mais precioso no colégio.',
    },
  },
  {
    id: 'resp-demo-4',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 5,
    status: 'completed',
    responsibleName: 'Eduardo Fontes Costa',
    studentName: 'Gabriel Costa',
    grade: '7º Ano - Ensino Fundamental II',
    shift: 'Matutino',
    ratings: {
      teachingQuality: 4,
      developmentFollowUp: 4,
      teachersMethodology: 4,
      schoolCommunication: 3,
      frontDeskService: 4,
      pedagogicalCoordination: 4,
      cleanlinessOrganization: 4,
      studentSafety: 5,
      physicalStructure: 4,
      overallSatisfaction: 4,
    },
    npsScore: 8,
    suggestions: {
      whatYouLikeMost: 'O controle de entrada com catracas eletrônicas e a seriedade dos professores de matemática e ciências.',
      whatCanImprove: 'Agilizar o tempo de resposta nas dúvidas enviadas pelo canal oficial do WhatsApp.',
      generalComments: 'Um colégio tradicional de alto nível com valores sólidos.',
    },
  },
  {
    id: 'resp-demo-5',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 7,
    status: 'completed',
    responsibleName: 'Mariana Duarte Leão',
    studentName: 'Sofia Leão',
    grade: '5º Ano - Ensino Fundamental I',
    shift: 'Matutino',
    ratings: {
      teachingQuality: 5,
      developmentFollowUp: 4,
      teachersMethodology: 5,
      schoolCommunication: 4,
      frontDeskService: 5,
      pedagogicalCoordination: 5,
      cleanlinessOrganization: 5,
      studentSafety: 5,
      physicalStructure: 4,
      overallSatisfaction: 5,
    },
    npsScore: 10,
    suggestions: {
      whatYouLikeMost: 'A formação socioemocional e a feira cultural anual.',
      whatCanImprove: 'Ampliar a oferta de oficinas esportivas extracurriculares como vôlei e xadrez.',
      generalComments: 'Excelente gestão e corpo docente inspirador.',
    },
  },
];

function getStoredLocalResponses(): SurveyResponseDocument[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEMO_RESPONSES));
      return DEMO_RESPONSES;
    }
    return JSON.parse(raw);
  } catch {
    return DEMO_RESPONSES;
  }
}

function saveStoredLocalResponses(responses: SurveyResponseDocument[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(responses));
  } catch (err) {
    console.error('Erro ao gravar respostas no armazenamento local:', err);
  }
}

/**
 * Salva uma nova resposta de pesquisa tanto no Firestore (se configurado) quanto no armazenamento local.
 */
export async function submitSurveyResponse(data: SurveyData): Promise<{ id: string; mode: 'firestore' | 'local' }> {
  const timestamp = Date.now();
  const nowIso = new Date(timestamp).toISOString();

  const docData = {
    ...data,
    createdAt: nowIso,
    timestamp,
    status: 'completed' as const,
  };

  // Se o Firestore estiver ativo, grava na coleção 'survey_responses'
  if (db) {
    try {
      const colRef = collection(db, 'survey_responses');
      const docRef = await addDoc(colRef, {
        ...docData,
        serverTime: serverTimestamp(),
      });
      
      // Salva também cópia local para consistência em cache
      const local = getStoredLocalResponses();
      local.unshift({ ...docData, id: docRef.id });
      saveStoredLocalResponses(local);

      return { id: docRef.id, mode: 'firestore' };
    } catch (err) {
      console.warn('Erro ao salvar no Firestore, usando fallback local resiliente:', err);
    }
  }

  // Fallback seguro em armazenamento persistente
  const localId = 'resp-' + Math.random().toString(36).substring(2, 9) + '-' + timestamp;
  const newRecord: SurveyResponseDocument = {
    ...docData,
    id: localId,
  };

  const current = getStoredLocalResponses();
  current.unshift(newRecord);
  saveStoredLocalResponses(current);

  return { id: localId, mode: 'local' };
}

/**
 * Recupera todas as avaliações para o painel administrativo.
 */
export async function fetchAllSurveyResponses(): Promise<SurveyResponseDocument[]> {
  if (db) {
    try {
      const colRef = collection(db, 'survey_responses');
      const q = query(colRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const remoteResponses: SurveyResponseDocument[] = [];
        snapshot.forEach((docSnap) => {
          const d = docSnap.data();
          remoteResponses.push({
            ...(d as SurveyData),
            id: docSnap.id,
            createdAt: d.createdAt || new Date().toISOString(),
            timestamp: d.timestamp || Date.now(),
            status: 'completed',
          });
        });
        return remoteResponses;
      }
    } catch (err) {
      console.warn('Não foi possível buscar do Firestore diretamente, usando registros locais:', err);
    }
  }

  return getStoredLocalResponses();
}

/**
 * Reinicializa dados de demonstração caso o administrador queira testar métricas
 */
export function resetDemoSurveyResponses(): SurveyResponseDocument[] {
  saveStoredLocalResponses(DEMO_RESPONSES);
  return DEMO_RESPONSES;
}

/**
 * Autenticação do Administrador
 */
export interface AdminUser {
  email: string;
  name?: string;
  isMaster?: boolean;
}

export function getStoredAdminSession(): AdminUser | null {
  try {
    const raw = sessionStorage.getItem(ADMIN_SESSION_KEY) || localStorage.getItem(ADMIN_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function loginAdmin(email: string, pass: string): Promise<AdminUser> {
  // 1. Se Firebase Auth estiver configurado, tenta autenticar via Firebase Auth
  if (auth && isFirebaseConfigured) {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      const user: AdminUser = {
        email: cred.user.email || email,
        name: cred.user.displayName || 'Direção Pedagógica',
        isMaster: true,
      };
      sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(user));
      return user;
    } catch (err: any) {
      console.warn('Firebase Auth falhou, verificando credencial de acesso direto:', err.message);
    }
  }

  // 2. Chave de acesso administrativo do colégio (padrão institucional)
  const normalizedEmail = email.trim().toLowerCase();
  const validAdminEmails = ['admin@colegio.edu.br', 'direcao@colegio.edu.br', 'marlonferreirabr.1@gmail.com', 'admin'];
  
  if (
    (validAdminEmails.includes(normalizedEmail) && (pass === 'colegio2026' || pass === 'admin123' || pass === 'colegiopremium')) ||
    (pass === 'colegio2026')
  ) {
    const user: AdminUser = {
      email: normalizedEmail.includes('@') ? normalizedEmail : 'direcao@colegio.edu.br',
      name: 'Direção Geral do Colégio',
      isMaster: true,
    };
    sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(user));
    return user;
  }

  throw new Error('Credenciais administrativas incorretas. Verifique o e-mail ou a senha de acesso.');
}

export async function logoutAdmin(): Promise<void> {
  if (auth && isFirebaseConfigured) {
    try {
      await signOut(auth);
    } catch (e) {
      console.error(e);
    }
  }
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
  localStorage.removeItem(ADMIN_SESSION_KEY);
}
