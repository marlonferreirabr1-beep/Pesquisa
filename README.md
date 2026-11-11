# 🏫 Pesquisa de Satisfação Escolar Premium

Plataforma institucional de alta qualidade para avaliação de satisfação dos pais e responsáveis escolares, desenvolvida com **React 19**, **Vite**, **TypeScript**, **Tailwind CSS** e **Motion**.

O projeto conta com um **carrossel vertical cinematográfico** guiado por rolagem natural e controles por etapas, além de um **painel administrativo completo e restrito para a direção do colégio**, com métricas de NPS, médias por dimensão e exportação em CSV compatível com Microsoft Excel e Google Sheets.

---

## 🎨 Identidade Visual e Experiência do Usuário

- **Fundo**: Branco acolhedor levemente amarelado (`#FAF7EF`).
- **Cards**: Brancos com cantos arredondados e sombras suaves.
- **Destaques**: Dourado nobre (`#D9BA79` / `#B8964C`).
- **Tipografia**: Verde-escuro institucional (`#283D35`) e títulos elegantes em fonte serifada (*Cormorant Garamond*).
- **Logotipo do Colégio**: Proporções preservadas no topo da apresentação e no painel gestor.
- **Envio Automático por E-mail**: A cada avaliação enviada, um relatório completo de ponta a ponta é disparado diretamente para o e-mail: **Marlon.webcontato@gmail.com**, contendo todas as notas, identificação e comentários.
- **Turno Único**: Configurado para o turno **Vespertino (Tarde)**.
- **Rolagem Natural e Livre**: O usuário pode rolar a página verticalmente para cima ou para baixo quando desejar, com fluidez e sem bloqueios ou saltos involuntários.

---

## 📋 As 8 Etapas da Pesquisa

1. **Boas-vindas**: Abertura institucional calorosa com estimativa de tempo (3 a 5 min) e botão de início.
2. **Identificação**: Turma/Série (obrigatório), Turno (Matutino, Vespertino, Integral) e dados opcionais com aviso de privacidade e LGPD.
3. **Ensino e Aprendizagem**: Avaliação de 1 a 5 estrelas para qualidade do ensino, desenvolvimento do aluno e professores/metodologias.
4. **Comunicação e Atendimento**: Avaliação de 1 a 5 estrelas para comunicação, secretaria e coordenação pedagógica.
5. **Estrutura e Segurança**: Avaliação de 1 a 5 estrelas para limpeza, segurança dos alunos e ambientes físicos.
6. **Satisfação Geral & NPS**: Nota geral de 1 a 5 estrelas e escala interativa de recomendação de 0 a 10 (Net Promoter Score).
7. **Espaço Aberto / Sugestões**: Três áreas de texto livre para pontos fortes, oportunidades de melhoria e elogios.
8. **Revisão e Envio**: Conferência das respostas, proteção contra envios acidentais e tela de gratidão com assinatura da Equipe Gestora.

---

## 🔐 Painel Administrativo da Direção

Acesse clicando no botão **"Área Administrativa"** no topo da tela ou pelo endereço com hash `#admin`.

- **Credenciais de Acesso (Modo Homologação)**:
  - **E-mail**: `direcao@colegio.edu.br` (ou `admin@colegio.edu.br`)
  - **Senha**: `colegio2026`
- **Recursos da Gestão**:
  - Total de avaliações recebidas.
  - Média geral de satisfação calculada dinamicamente.
  - Indicador e régua de **NPS** (% Promotores, % Neutros, % Detratores).
  - Médias por dimensão (Ensino, Atendimento, Estrutura).
  - Filtros avançados por turma, turno e período.
  - Busca por nome do aluno ou responsável.
  - Visualizador individual de respostas.
  - **Exportação de Relatório CSV** com encoding UTF-8 BOM (compatível com acentos no Excel e Google Planilhas).

---

## 🚀 Como Executar Localmente

### 1. Clonar o repositório e instalar dependências
```bash
git clone <URL_DO_REPOSITORIO>
cd pesquisa-satisfacao-escolar
npm install
```

### 2. Rodar o servidor de desenvolvimento
```bash
npm run dev
```
Abra o navegador em `http://localhost:3000`.

### 3. Compilar para produção
```bash
npm run build
```
Os arquivos prontos para publicação serão gerados na pasta `dist/`.

---

## ☁️ Configuração do Firebase Firestore e Authentication

A plataforma funciona imediatamente com armazenamento persistente e dados demonstrativos para você testar tudo de imediato. Para sincronizar com a sua nuvem Firebase definitiva:

1. Acesse o [Firebase Console](https://console.firebase.google.com/).
2. Crie um projeto Firebase (ex: `colegio-pesquisa`).
3. Em **Build > Firestore Database**, crie um banco de dados no modo de produção.
4. Em **Build > Authentication**, ative o provedor **Email/Senha**.
5. Crie as credenciais da Web em **Configurações do Projeto > Geral > Seus aplicativos**.
6. Copie as credenciais para o seu arquivo `.env` (ou `.env.local`):

```env
VITE_FIREBASE_API_KEY="AIzaSy..."
VITE_FIREBASE_AUTH_DOMAIN="colegio-pesquisa.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="colegio-pesquisa"
VITE_FIREBASE_STORAGE_BUCKET="colegio-pesquisa.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="123456789012"
VITE_FIREBASE_APP_ID="1:123456789012:web:abcdef123456"
```

7. No Firebase Console > Firestore > **Regras**, publique o conteúdo do arquivo `firestore.rules` presente na raiz deste projeto.

---

## 📦 Como Enviar para o GitHub e Publicar na Vercel

### 1. Enviar para o GitHub
```bash
git init
git add .
git commit -m "feat: Pesquisa de Satisfação Escolar Premium com Carrossel Vertical"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/pesquisa-satisfacao-escolar.git
git push -u origin main
```

### 2. Publicar na Vercel
1. Conecte sua conta do GitHub na [Vercel](https://vercel.com).
2. Clique em **"Add New..." > "Project"** e importe o repositório.
3. Nas configurações do projeto:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Na seção **Environment Variables**, adicione as variáveis com prefixo `VITE_FIREBASE_*` (conforme o `.env.example`).
5. Clique em **Deploy**.

O arquivo `vercel.json` incluído no projeto já assegura que todas as rotas e recarregamentos funcionem sem erro 404.

---

## 🛡️ Segurança e LGPD

- O código no navegador nunca expõe chaves secretas ou credenciais privadas.
- O envio das avaliações pode ser 100% anônimo pelos responsáveis.
- As regras de segurança do Firestore (`firestore.rules`) garantem que os dados só possam ser visualizados por administradores autenticados.
