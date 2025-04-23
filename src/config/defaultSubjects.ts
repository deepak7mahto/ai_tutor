import mongoose from "mongoose";
import Subject from "../models/Subject";

export const defaultSubjects = [
  // --- Existing Exams ---
  {
    name: "UPSC",
    fullName: "Union Public Service Commission (Civil Services Exam)",
    topics: [
      {
        name: "History",
        description:
          "Comprehensive study of Ancient, Medieval, Modern, and World History with focus on Indian context.",
      },
      {
        name: "Geography",
        description:
          "Indian, World, and Physical Geography including climatology, oceanography, and geomorphology.",
      },
      {
        name: "Indian Polity & Governance",
        description:
          "Constitutional framework, governance structures, public policy, rights issues, and political dynamics of India.",
      },
      {
        name: "Economics & Social Development",
        description:
          "Economic concepts, Indian economy, planning, growth, development, inclusion, demographics, poverty, and social sector initiatives.",
      },
      {
        name: "General Science & Technology",
        description:
          "Basic concepts in Physics, Chemistry, Biology and current scientific/technological developments.",
      },
      {
        name: "Environment & Ecology",
        description:
          "Environmental issues, biodiversity, climate change, pollution control, and ecological conservation.",
      },
      {
        name: "Current Affairs",
        description:
          "National and International current events of significance, government schemes, and their implications.",
      },
      {
        name: "CSAT (Civil Services Aptitude Test)",
        description:
          "Comprehension, Interpersonal skills including communication skills, Logical reasoning and analytical ability, Decision making and problem solving, General mental ability, Basic numeracy (numbers and their relations, orders of magnitude, etc. - Class X level), Data interpretation (charts, graphs, tables, data sufficiency etc. - Class X level).",
      },
    ],
  },
  {
    name: "IIT JEE",
    fullName:
      "Indian Institute of Technology Joint Entrance Examination (JEE Advanced)",
    topics: [
      {
        name: "Physics",
        description:
          "Advanced physics concepts including Mechanics, Thermodynamics, Electromagnetism, Optics, and Modern Physics relevant for engineering entrance.",
      },
      {
        name: "Chemistry",
        description:
          "Physical, Organic, and Inorganic chemistry covering principles, reactions, and applications at an advanced level.",
      },
      {
        name: "Mathematics",
        description:
          "Advanced mathematics including Calculus (Differential and Integral), Algebra, Coordinate Geometry, Vectors, 3D Geometry, and Trigonometry.",
      },
    ],
  },
  {
    name: "NDA",
    fullName: "National Defence Academy & Naval Academy Examination",
    topics: [
      {
        name: "Mathematics",
        description:
          "Mathematics covering Algebra, Matrices and Determinants, Trigonometry, Analytical Geometry (2D & 3D), Differential Calculus, Integral Calculus and Differential Equations, Vector Algebra, Statistics and Probability.",
      },
      {
        name: "General Ability Test (GAT)",
        description:
          "Part A: English (Vocabulary, Grammar, Comprehension). Part B: General Knowledge covering Physics, Chemistry, General Science, History, Freedom Movement, Geography, and Current Events.",
      },
    ],
  },
  {
    name: "UGC-NET",
    fullName: "University Grants Commission National Eligibility Test",
    topics: [
      {
        name: "Teaching Aptitude",
        description:
          "Concepts, objectives, levels of teaching, learner characteristics, factors affecting teaching, methods, teaching aids, evaluation systems.",
      },
      {
        name: "Research Aptitude",
        description:
          "Meaning, types, characteristics, steps of research, methods, research ethics, thesis writing, application of ICT in research.",
      },
      {
        name: "Reading Comprehension",
        description:
          "Ability to understand and answer questions based on a given passage.",
      },
      {
        name: "Communication",
        description:
          "Meaning, types, characteristics, effective communication (verbal/non-verbal), barriers, mass-media and society.",
      },
      {
        name: "Reasoning (incl. Mathematical)",
        description:
          "Number series, letter series, codes, relationships, classification, mathematical aptitude (fraction, time & distance, ratio, proportion, percentage, profit & loss, interest, averages).",
      },
      {
        name: "Logical Reasoning",
        description:
          "Understanding arguments, deductive/inductive reasoning, analogies, Venn diagrams, Indian Logic (Pramanas), fallacies.",
      },
      {
        name: "Data Interpretation",
        description:
          "Sources, acquisition and classification of data; Quantitative and Qualitative data; Graphical representation (bar-chart, histograms, pie-chart, table-chart) and mapping of data, Data interpretation, Data and Governance.",
      },
      {
        name: "Information & Communication Technology (ICT)",
        description:
          "General abbreviations and terminology, basics of Internet, Intranet, E-mail, Audio and Video-conferencing, Digital initiatives in higher education, ICT and Governance.",
      },
      {
        name: "People, Development & Environment",
        description:
          "Development and environment (Millennium development and Sustainable development goals), Human and environment interaction, Environmental issues, Impacts of pollutants, Natural and energy resources, Natural hazards and disasters, Environmental Protection Act.",
      },
      {
        name: "Higher Education System",
        description:
          "Institutions of higher learning and education in ancient India, Evolution post-independence, Oriental, Conventional and Non-conventional learning programmes, Professional, Technical and Skill Based education, Value education and environmental education, Policies, Governance, and Administration.",
      },
      {
        name: "Subject Specific Paper",
        description:
          "In-depth knowledge based on the specific Master's level subject chosen by the candidate.",
      },
    ],
  },
  {
    name: "IES/ESE",
    fullName: "Indian Engineering Services / Engineering Services Examination",
    topics: [
      {
        name: "General Studies and Engineering Aptitude",
        description:
          "Current issues (National/International), Engineering Aptitude (Logical reasoning, Analytical ability), Engineering Mathematics, General Principles of Design, Drawing, Importance of Safety, Standards and Quality practices, Basics of Energy and Environment, Project Management, Basics of Material Science, ICT basics, Ethics and Values in Engineering.",
      },
      {
        name: "Specific Engineering Discipline",
        description:
          "In-depth technical syllabus covering the chosen engineering branch: Civil, Mechanical, Electrical, or Electronics & Telecommunication Engineering.",
      },
    ],
  },
  {
    name: "CLAT",
    fullName: "Common Law Admission Test",
    topics: [
      {
        name: "English Language",
        description:
          "Reading comprehension passages focusing on contemporary or historically significant fiction and non-fiction, understanding main idea, drawing inferences, grammar and vocabulary in context.",
      },
      {
        name: "Current Affairs including General Knowledge",
        description:
          "Awareness of current events of national and international significance, often based on reading passages from news/journalistic sources. Static GK related to law, history, arts, and culture.",
      },
      {
        name: "Legal Reasoning",
        description:
          "Applying legal principles (provided in passages) to factual situations. Identifying rules, applying them, and understanding how changes might affect application. No prior legal knowledge required.",
      },
      {
        name: "Logical Reasoning",
        description:
          "Analyzing arguments, identifying premises and conclusions, critical reasoning, identifying assumptions, drawing inferences, evaluating arguments based on short passages.",
      },
      {
        name: "Quantitative Techniques",
        description:
          "Basic algebra, mensuration, statistics, numerical ability, and data interpretation based on graphs, charts, and text passages (Class 10 level mathematics).",
      },
    ],
  },
  {
    name: "CA Exam",
    fullName: "Chartered Accountant Exam (ICAI)",
    topics: [
      // Note: Topics span across Foundation, Intermediate, and Final levels. This is a summarized list.
      {
        name: "Principles and Practice of Accounting",
        description:
          "Fundamental accounting concepts, bookkeeping, financial statement preparation, company accounts, special accounting areas.",
      },
      {
        name: "Business Laws & Business Correspondence and Reporting",
        description:
          "Indian Contract Act, Sale of Goods Act, Partnership Act, Companies Act basics, LLP Act. Communication skills, report writing, formal correspondence.",
      },
      {
        name: "Business Mathematics, Logical Reasoning & Statistics",
        description:
          "Ratio, proportion, indices, logarithms, equations, inequalities, permutations, combinations, calculus basics, correlation, regression, probability, theoretical distributions, logical reasoning.",
      },
      {
        name: "Business Economics & Business and Commercial Knowledge",
        description:
          "Micro and macroeconomics concepts, demand, supply, production, cost, markets, business cycles. Understanding business environment, organizations, government policies.",
      },
      {
        name: "Corporate and Other Laws",
        description:
          "Detailed study of Companies Act, Contract Act, Negotiable Instruments Act, General Clauses Act, Interpretation of Statutes.",
      },
      {
        name: "Cost and Management Accounting",
        description:
          "Cost ascertainment, analysis, control, marginal costing, standard costing, budgeting, decision making.",
      },
      {
        name: "Taxation",
        description:
          "Income Tax Law (computation of income, deductions, TDS, returns) and Goods and Services Tax (GST) Law.",
      },
      {
        name: "Advanced Accounting",
        description:
          "Accounting standards (Ind AS), specific company accounts issues (amalgamation, liquidation), financial instruments, business combinations.",
      },
      {
        name: "Auditing and Assurance",
        description:
          "Auditing concepts, procedures, standards on auditing, vouching, verification, company audit, internal controls, audit reports.",
      },
      {
        name: "Enterprise Information Systems & Strategic Management",
        description:
          "Automated business processes, financial and accounting systems, IT risks and controls. Business strategy formulation, implementation, competitive analysis.",
      },
      {
        name: "Financial Management & Economics for Finance",
        description:
          "Capital budgeting, working capital management, cost of capital, leverage, dividend decisions. Macroeconomic analysis, public finance, international trade.",
      },
      {
        name: "Strategic Cost Management and Performance Evaluation",
        description:
          "Advanced cost management techniques, performance measurement and evaluation, strategic decision making, risk management.",
      },
      {
        name: "Financial Reporting",
        description:
          "Advanced application of Ind AS, corporate financial reporting, accounting for business combinations, financial instruments, CSR reporting.",
      },
      {
        name: "Strategic Financial Management",
        description:
          "Advanced capital budgeting, portfolio management, derivatives, mergers & acquisitions, international financial management.",
      },
      {
        name: "Direct Tax Laws & International Taxation",
        description:
          "Comprehensive study of Income Tax law including international taxation aspects like transfer pricing, DTAA, non-resident taxation.",
      },
      {
        name: "Indirect Tax Laws",
        description: "Comprehensive study of GST law and Customs law.",
      },
    ],
  },
  {
    name: "NEET",
    fullName: "National Eligibility cum Entrance Test (UG)",
    topics: [
      {
        name: "Physics",
        description:
          "Core physics concepts based on Class 11 & 12 syllabus including Mechanics, Thermodynamics, Electromagnetism, Optics, Modern Physics with application focus relevant to medical science.",
      },
      {
        name: "Chemistry",
        description:
          "Organic, Inorganic, and Physical Chemistry based on Class 11 & 12 syllabus covering structure, properties, reactions, and principles relevant for medical entrance.",
      },
      {
        name: "Biology (Botany & Zoology)",
        description:
          "Comprehensive study of Botany and Zoology based on Class 11 & 12 NCERT syllabus covering diversity, structure, function, reproduction, genetics, evolution, ecology.",
      },
    ],
  },
  {
    name: "CAT",
    fullName: "Common Admission Test",
    topics: [
      {
        name: "VARC (Verbal Ability & Reading Comprehension)",
        description:
          "Reading comprehension passages, para jumbles, sentence completion, summary questions, critical reasoning within verbal context.",
      },
      {
        name: "DILR (Data Interpretation & Logical Reasoning)",
        description:
          "Interpretation and analysis of data presented in tables, graphs (bar, line, pie), caselets. Logical reasoning sets involving puzzles, arrangements, venn diagrams, network diagrams.",
      },
      {
        name: "QA (Quantitative Ability)",
        description:
          "Arithmetic, Algebra, Geometry, Mensuration, Modern Math (Permutation & Combination, Probability, Set Theory, Logarithms) primarily based on Class 8-10 concepts with higher difficulty.",
      },
    ],
  },
  {
    name: "GATE",
    fullName: "Graduate Aptitude Test in Engineering",
    topics: [
      {
        name: "General Aptitude (GA)",
        description:
          "Verbal Ability (English grammar, sentence completion, verbal analogies, word groups, critical reasoning, comprehension) and Numerical Ability (Numerical computation, estimation, reasoning, data interpretation).",
      },
      {
        name: "Specific Engineering/Science Discipline",
        description:
          "Comprehensive technical syllabus covering core subjects of the chosen branch (e.g., Computer Science, Mechanical, Electrical, Civil, Chemical, etc.) or Science subject (e.g., Physics, Chemistry, Mathematics, Life Sciences).",
      },
      {
        name: "Engineering Mathematics (Common for many branches)",
        description:
          "Linear Algebra, Calculus, Differential Equations, Complex variables, Probability and Statistics, Numerical Methods (Specific topics vary slightly by branch).",
      },
    ],
  },

  // --- Added Exams ---

  {
    name: "IBPS PO",
    fullName:
      "Institute of Banking Personnel Selection Probationary Officer Exam",
    topics: [
      {
        name: "Preliminary: English Language",
        description:
          "Reading Comprehension, Cloze Test, Para jumbles, Spotting Errors, Sentence Improvement/Correction, Fillers.",
      },
      {
        name: "Preliminary: Quantitative Aptitude",
        description:
          "Number Series, Data Interpretation (Bar, Line, Pie, Tabular), Simplification/Approximation, Quadratic Equations, Arithmetic problems (Percentage, Ratio, Profit/Loss, Time & Work, Time Speed Distance, SI/CI, etc.).",
      },
      {
        name: "Preliminary: Reasoning Ability",
        description:
          "Puzzles (Linear, Circular, Floor based), Seating Arrangements, Syllogism, Inequality, Blood Relations, Direction Sense, Coding-Decoding, Order & Ranking, Alphanumeric Series.",
      },
      {
        name: "Mains: Reasoning & Computer Aptitude",
        description:
          "Advanced Puzzles, Logical Reasoning (Statement-Assumption, Inference, Course of Action), Input-Output, Data Sufficiency. Basic Computer Knowledge (Hardware, Software, Networking, MS Office, History).",
      },
      {
        name: "Mains: General/ Economy/ Banking Awareness",
        description:
          "Current Affairs (last 4-6 months), Banking & Financial Awareness (RBI, Banking Terms, Financial Institutions, Schemes), Static GK (Awards, Books, Important Days, Capitals, Currencies).",
      },
      {
        name: "Mains: English Language",
        description:
          "Advanced Reading Comprehension, New pattern Cloze Test, Error Spotting, Sentence Correction/Improvement, Para Completion/Starters/Connectors, Vocabulary based questions.",
      },
      {
        name: "Mains: Data Analysis & Interpretation",
        description:
          "Advanced Data Interpretation sets (including Caselets, Missing DI, Radar/Web charts), Data Sufficiency, Quantity Comparison, Arithmetic problems with DI focus.",
      },
      {
        name: "Descriptive Paper",
        description:
          "English Language test involving Letter Writing (Formal/Informal) and Essay writing on current/banking related topics.",
      },
    ],
  },
  {
    name: "SBI PO",
    fullName: "State Bank of India Probationary Officer Exam",
    topics: [
      // Topics are very similar to IBPS PO, but SBI often sets a higher difficulty level and introduces new pattern questions.
      {
        name: "Preliminary: English Language",
        description:
          "Reading Comprehension, Cloze Test, Para jumbles, Spotting Errors, Sentence Improvement, Fillers, Vocabulary based questions.",
      },
      {
        name: "Preliminary: Quantitative Aptitude",
        description:
          "Data Interpretation, Number Series, Simplification/Approximation, Quadratic Equations, Arithmetic Problems (Percentage, Ratio, Profit/Loss, Time & Work, etc.).",
      },
      {
        name: "Preliminary: Reasoning Ability",
        description:
          "Puzzles, Seating Arrangements, Syllogism, Inequality, Blood Relations, Direction Sense, Coding-Decoding, Logical Reasoning elements.",
      },
      {
        name: "Mains: Reasoning & Computer Aptitude",
        description:
          "High-level Puzzles, Logical Reasoning, Input-Output, Data Sufficiency, Coding, Critical Reasoning. Basic Computer concepts.",
      },
      {
        name: "Mains: Data Analysis & Interpretation",
        description:
          "Complex Data Interpretation sets (Caselets, Mixed DI), Data Sufficiency, Quantity Comparison, Probability, Permutation & Combination, Mensuration, Arithmetic problems.",
      },
      {
        name: "Mains: General/ Economy/ Banking Awareness",
        description:
          "Current Affairs, Financial & Banking Awareness (emphasis on recent news), Static GK.",
      },
      {
        name: "Mains: English Language",
        description:
          "Advanced Reading Comprehension, Vocabulary usage, Grammar based questions (Error Spotting, Phrase Replacement), Sentence Rearrangement, Cloze Test (new patterns).",
      },
      {
        name: "Descriptive Test",
        description:
          "Letter Writing and Essay writing, evaluated for structure, grammar, and content relevance.",
      },
      {
        name: "Psychometric Test / Group Exercise & Interview",
        description:
          "Evaluation of personality traits, group dynamics, communication skills, and overall suitability for the PO role.",
      },
    ],
  },
  {
    name: "SSC CGL",
    fullName: "Staff Selection Commission Combined Graduate Level Examination",
    topics: [
      {
        name: "Tier-I: General Intelligence & Reasoning",
        description:
          "Analogies, Similarities/Differences, Space visualization, Problem solving, Analysis, Judgment, Decision making, Visual memory, Discrimination, Observation, Relationship concepts, Arithmetical reasoning, Verbal and figure classification, Arithmetical number series, Non-verbal series.",
      },
      {
        name: "Tier-I: General Awareness",
        description:
          "Current events, India and its neighboring countries (History, Culture, Geography, Economic Scene, General Polity, Scientific Research), Static GK.",
      },
      {
        name: "Tier-I: Quantitative Aptitude",
        description:
          "Whole numbers, Decimals, Fractions, Relationships between numbers, Percentage, Ratio & Proportion, Square roots, Averages, Interest, Profit and Loss, Discount, Partnership Business, Mixture and Alligation, Time and distance, Time & Work, Basic algebraic identities, Graphs of Linear Equations, Triangle and its various kinds of centres, Congruence and similarity of triangles, Circle and its chords, tangents, angles subtended by chords, common tangents, Triangle, Quadrilaterals, Regular Polygons, Circle, Right Prism, Right Circular Cone, Right Circular Cylinder, Sphere, Hemispheres, Rectangular Parallelepiped, Regular Right Pyramid, Trigonometric ratio, Degree and Radian Measures, Standard Identities, Complementary angles, Heights and Distances, Histogram, Frequency polygon, Bar diagram & Pie chart.",
      },
      {
        name: "Tier-I: English Comprehension",
        description:
          "Candidates' ability to understand correct English, basic comprehension and writing ability. Spot the Error, Fill in the Blanks, Synonyms/Homonyms, Antonyms, Spellings/Detecting mis-spelt words, Idioms & Phrases, One word substitution, Improvement of Sentences, Active/Passive Voice, Direct/Indirect narration, Shuffling of Sentence parts, Shuffling of Sentences in a passage, Cloze Passage, Comprehension Passage.",
      },
      {
        name: "Tier-II: Mathematical Abilities",
        description:
          "Advanced topics from Tier-I Quantitative Aptitude, focusing more on Arithmetic, Algebra, Geometry, Mensuration, Trigonometry, Statistics & Probability.",
      },
      {
        name: "Tier-II: Reasoning and General Intelligence",
        description:
          "Advanced topics from Tier-I Reasoning, including critical thinking, problem-solving, emotional intelligence, social intelligence, coding and decoding, numerical operations.",
      },
      {
        name: "Tier-II: English Language and Comprehension",
        description:
          "Advanced topics from Tier-I English, with higher difficulty level, focus on vocabulary, grammar, sentence structure, comprehension skills, spotting errors, fill in the blanks, synonyms, antonyms, cloze test, reading comprehension.",
      },
      {
        name: "Tier-II: General Awareness",
        description:
          "Broader coverage than Tier-I, focusing on current affairs, static GK, science, civics, history, geography, economics.",
      },
      {
        name: "Tier-II: Computer Knowledge Test",
        description:
          "Computer Basics (Organization, CPU, I/O devices, memory, keyboard shortcuts), Software (Windows OS, MS Office - Word, Excel, PowerPoint), Working with Internet and E-mail (Web Browsing, Downloading/Uploading, Email account management), Basics of Networking and Cyber Security (Networking devices, protocols, Viruses, Malware).",
      },
      {
        name: "Tier-II: Statistics (For JSO post)",
        description:
          "Collection, Classification and Presentation of Statistical Data, Measures of Central Tendency, Measures of Dispersion, Moments, Skewness and Kurtosis, Correlation and Regression, Probability Theory, Random Variable and Probability Distributions, Sampling Theory, Statistical Inference, Analysis of Variance, Time Series Analysis, Index Numbers.",
      },
      {
        name: "Tier-II: General Studies - Finance & Economics (For AAO post)",
        description:
          "Financial Accounting (Basic concepts, Accounting Standards), Economics and Governance (Comptroller & Auditor General of India - Role, Finance Commission - Role, Basic Concept of Economics, Demand and Supply, Production and Cost, Forms of Market, Indian Economy, Economic Reforms, Money and Banking, Fiscal Policy).",
      },
    ],
  },
  {
    name: "CDS",
    fullName: "Combined Defence Services Examination",
    topics: [
      {
        name: "English",
        description:
          "Understanding of English language, vocabulary, grammar, sentence structure, synonyms, antonyms, reading comprehension, spotting errors, ordering of words/sentences.",
      },
      {
        name: "General Knowledge",
        description:
          "Current events, scientific aspects, History of India, Geography of India and the World. Includes Physics, Chemistry, General Science, Social Studies, Geography and Current Events.",
      },
      {
        name: "Elementary Mathematics (For IMA, INA, AFA)",
        description:
          "Arithmetic (Number System, Elementary Number Theory), Algebra (Basic Operations, Polynomials, Equations), Trigonometry (Sine, Cosine, Tangent functions, Heights and Distances), Geometry (Lines, Angles, Triangles, Circles, Quadrilaterals), Mensuration (Areas, Volumes), Statistics.",
      },
      {
        name: "SSB Interview",
        description:
          "Multi-stage personality and intelligence test including screening (OIR, PPDT), psychological tests (TAT, WAT, SRT, SDT), Group Tasks (GTO - GD, GPE, PGT, HGT, IO, Command Task, FGT), and Personal Interview.",
      },
    ],
  },
  {
    name: "RBI Grade B",
    fullName: "Reserve Bank of India Grade B Officer Exam",
    topics: [
      {
        name: "Phase-I: General Awareness",
        description:
          "Current Affairs (National & International), Banking/Financial/Economic News, Static GK, RBI Functions, Monetary Policy, Banking Terms.",
      },
      {
        name: "Phase-I: English Language",
        description:
          "Reading Comprehension, Cloze Test, Error Spotting, Sentence Improvement, Para Jumbles, Fillers, Vocabulary.",
      },
      {
        name: "Phase-I: Quantitative Aptitude",
        description:
          "Data Interpretation, Number Series, Simplification/Approximation, Arithmetic Problems (Percentage, Ratio, Profit/Loss, etc.), Quantity Comparison.",
      },
      {
        name: "Phase-I: Reasoning Ability",
        description:
          "Puzzles, Seating Arrangements, Syllogism, Inequality, Input-Output, Blood Relations, Direction Sense, Logical/Analytical Reasoning, Data Sufficiency.",
      },
      {
        name: "Phase-II: Paper-I: Economic and Social Issues (ESI)",
        description:
          "Growth and Development, Poverty Alleviation, Employment Generation, Sustainable Development, Indian Economy (History, Challenges, Reforms), Globalization, Social Structure in India, Social Justice, Human Development, Demographics, Urbanization.",
      },
      {
        name: "Phase-II: Paper-II: English (Writing Skills)",
        description:
          "Essay writing, Précis writing, Reading Comprehension based on economic/financial topics.",
      },
      {
        name: "Phase-II: Paper-III: Finance and Management (F&M)",
        description:
          "Financial System (Regulators, Markets, Institutions), Financial Instruments, Risk Management in Banking Sector, Basics of Derivatives, Public Finance, Corporate Governance. Management (Fundamentals, Motivation, Leadership, Communication, HRD, Corporate Strategy, Ethics at Workplace).",
      },
      {
        name: "Interview",
        description:
          "Assessment of personality, communication skills, current affairs knowledge, domain knowledge (Economics/Finance/Management), and suitability for the role.",
      },
    ],
  },
  {
    name: "CTET",
    fullName: "Central Teacher Eligibility Test",
    topics: [
      {
        name: "Paper-I (Classes I-V): Child Development and Pedagogy",
        description:
          "Concept of development, Principles of child development, Influence of Heredity & Environment, Socialization processes, Piaget, Kohlberg, Vygotsky constructs, Child-centered education, Concept of Intelligence, Language & Thought, Gender issues, Individual differences, Assessment and Evaluation, Inclusive education concepts, Addressing diverse learners, Learning and motivation.",
      },
      {
        name: "Paper-I: Language I (Chosen Language)",
        description:
          "Reading unseen passages (prose/drama/poem), questions on comprehension, inference, grammar and verbal ability. Pedagogy of Language Development: Learning and acquisition, Principles of language Teaching, Role of listening and speaking, Critical perspective on grammar, Challenges of teaching language in a diverse classroom, Language Skills, Evaluating language comprehension and proficiency, Teaching-learning materials, Remedial Teaching.",
      },
      {
        name: "Paper-I: Language II (Chosen Language)",
        description:
          "Comprehension, grammar and verbal ability based on unseen prose passages. Pedagogy of Language Development (similar focus as Language I but potentially different emphasis based on language choice).",
      },
      {
        name: "Paper-I: Mathematics",
        description:
          "Content: Geometry, Shapes & Spatial Understanding, Solids, Numbers, Addition/Subtraction, Multiplication/Division, Measurement, Weight, Time, Volume, Data Handling, Patterns, Money. Pedagogical issues: Nature of Mathematics/Logical thinking, Place of Mathematics in Curriculum, Language of Mathematics, Community Mathematics, Evaluation, Problems of Teaching, Error analysis, Diagnostic and Remedial Teaching.",
      },
      {
        name: "Paper-I: Environmental Studies (EVS)",
        description:
          "Content: Family and Friends, Food, Shelter, Water, Travel, Things We Make and Do. Pedagogical Issues: Concept and scope of EVS, Significance, Integrated EVS, Environmental Studies & Education, Learning Principles, Scope & relation to Science & Social Science, Approaches of presenting concepts, Activities, Experimentation/Practical Work, Discussion, CCE, Teaching material/Aids, Problems.",
      },
      {
        name: "Paper-II (Classes VI-VIII): Child Development and Pedagogy",
        description:
          "Similar to Paper-I but focused on the 11-14 years age group. Includes concepts of adolescent development, learning theories application for older children.",
      },
      {
        name: "Paper-II: Language I",
        description:
          "Similar structure and pedagogical focus as Paper-I Language I, with passages and questions appropriate for the upper primary level.",
      },
      {
        name: "Paper-II: Language II",
        description:
          "Similar structure and pedagogical focus as Paper-I Language II, with passages and questions appropriate for the upper primary level.",
      },
      {
        name: "Paper-II: Mathematics and Science (For Maths/Science Teacher)",
        description:
          "Mathematics Content: Number System, Algebra, Geometry, Mensuration, Data Handling. Pedagogical issues similar to Paper-I. Science Content: Food (Sources, Components, Cleaning), Materials (Materials of daily use), The World of the Living, Moving Things People and Ideas, How things work (Electric current, Magnets), Natural Phenomena, Natural Resources. Pedagogical issues: Nature & Structure of Sciences, Aims & Objectives, Understanding & Appreciating Science, Approaches/Integrated Approach, Observation/Experiment/Discovery, Innovation, Text Material/Aids, Evaluation, Problems, Remedial Teaching.",
      },
      {
        name: "Paper-II: Social Studies/Social Science (For Social Studies Teacher)",
        description:
          "Content: History (When, Where and How, Earliest Societies, First Farmers, First Cities, Early States, New Ideas, First Empire, Contacts with Distant lands, Political Developments, Culture and Science, New Kings and Kingdoms, Sultans of Delhi, Architecture, Creation of an Empire, Social Change, Regional Cultures, The Establishment of Company Power, Rural Life and Society, Colonialism and Tribal Societies, The Revolt of 1857-58, Women and reform, Challenging the Caste System, The Nationalist Movement, India After Independence). Geography (Geography as a social study and as a science, Planet Earth in the solar system, Globe, Environment in its totality, Air, Water, Human Environment, Resources, Agriculture). Social and Political Life (Diversity, Government, Local Government, Making a Living, Democracy, State Government, Understanding Media, Unpacking Gender, The Constitution, Parliamentary Government, The Judiciary, Social Justice and the Marginalized). Pedagogical issues: Concept & Nature of Social Science/Social Studies, Class Room Processes, activities and discourse, Developing Critical thinking, Enquiry/Empirical Evidence, Problems of teaching Social Science/Social Studies, Sources – Primary & Secondary, Projects Work, Evaluation.",
      },
    ],
  },
];

export const initializeSubjects = async (): Promise<void> => {
  try {
    // Check if subjects already exist
    const existingSubjects = await Subject.countDocuments();

    if (existingSubjects === 0) {
      console.log("Initializing default subjects...");
      await Subject.insertMany(defaultSubjects);
      console.log("Default subjects created successfully");
    } else {
      console.log("Subjects already exist, skipping initialization");
    }
  } catch (error) {
    console.error("Error initializing subjects:", error);
    throw error;
  }
};
