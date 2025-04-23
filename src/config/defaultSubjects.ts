import mongoose from 'mongoose';
import Subject from '../models/Subject';

export const defaultSubjects = [
  {
    name: 'UPSC',
    fullName: 'Union Public Service Commission (Civil Services Exam)',
    topics: [
      {
        name: 'History',
        description: 'Comprehensive study of Ancient, Medieval, Modern, and World History with focus on Indian context.'
      },
      {
        name: 'Geography',
        description: 'Indian, World, and Physical Geography including climatology, oceanography, and geomorphology.'
      },
      {
        name: 'Indian Polity & Governance',
        description: 'Constitutional framework, governance structures, and political dynamics of India.'
      },
      {
        name: 'Economics & Social Development',
        description: 'Economic concepts, Indian economy, and social development issues.'
      },
      {
        name: 'General Science & Technology',
        description: 'Basic concepts in science and current technological developments.'
      },
      {
        name: 'Environment & Ecology',
        description: 'Environmental issues, biodiversity, climate change, and ecological concerns.'
      },
      {
        name: 'Current Affairs',
        description: 'National and International current events and their implications.'
      },
      {
        name: 'CSAT',
        description: 'Comprehension, Reasoning, and Quantitative Aptitude skills.'
      }
    ]
  },
  {
    name: 'IIT JEE',
    fullName: 'Indian Institute of Technology Joint Entrance Examination',
    topics: [
      {
        name: 'Physics',
        description: 'Advanced physics concepts including mechanics, thermodynamics, electromagnetism, and modern physics.'
      },
      {
        name: 'Chemistry',
        description: 'Physical, organic, and inorganic chemistry at advanced level.'
      },
      {
        name: 'Mathematics',
        description: 'Advanced mathematics including calculus, algebra, coordinate geometry, and trigonometry.'
      }
    ]
  },
  {
    name: 'NDA',
    fullName: 'National Defence Academy Exam',
    topics: [
      {
        name: 'Mathematics',
        description: 'Mathematics covering algebra, calculus, geometry, and trigonometry.'
      },
      {
        name: 'General Ability Test',
        description: 'English, General Knowledge covering Physics, Chemistry, General Science, History, Geography, and Current Events.'
      }
    ]
  },
  {
    name: 'UGC-NET',
    fullName: 'University Grants Commission National Eligibility Test',
    topics: [
      {
        name: 'Teaching & Research Aptitude',
        description: 'Teaching methodology, research methodology, and academic aptitude.'
      },
      {
        name: 'Comprehension & Communication',
        description: 'Reading comprehension and effective communication skills.'
      },
      {
        name: 'Reasoning & Analysis',
        description: 'Mathematical reasoning, logical reasoning, and data interpretation.'
      },
      {
        name: 'ICT & Environment',
        description: 'Information technology, environmental awareness, and higher education system.'
      },
      {
        name: 'Subject Specific Paper',
        description: 'In-depth knowledge of the chosen subject field.'
      }
    ]
  },
  {
    name: 'IES',
    fullName: 'Indian Engineering Services',
    topics: [
      {
        name: 'General Studies and Engineering Aptitude',
        description: 'Basic engineering concepts, current affairs, and analytical ability.'
      },
      {
        name: 'Engineering Discipline',
        description: 'Specialized topics in Civil, Mechanical, Electrical, or Electronics & Telecommunication Engineering.'
      }
    ]
  },
  {
    name: 'CLAT',
    fullName: 'Common Law Admission Test',
    topics: [
      {
        name: 'English Language',
        description: 'Grammar, vocabulary, comprehension, and verbal ability.'
      },
      {
        name: 'Current Affairs & GK',
        description: 'Current events, general knowledge, and legal awareness.'
      },
      {
        name: 'Legal & Logical Reasoning',
        description: 'Legal analytical ability and logical problem-solving.'
      },
      {
        name: 'Quantitative Techniques',
        description: 'Basic mathematics and numerical ability.'
      }
    ]
  },
  {
    name: 'CA Exam',
    fullName: 'Chartered Accountant Exam',
    topics: [
      {
        name: 'Accounting & Law',
        description: 'Accounting principles, business laws, and corporate laws.'
      },
      {
        name: 'Economics & Mathematics',
        description: 'Business economics and quantitative aptitude.'
      },
      {
        name: 'Advanced Accounting',
        description: 'Cost accounting, management accounting, and financial reporting.'
      },
      {
        name: 'Taxation & Audit',
        description: 'Income tax, GST, auditing standards, and assurance.'
      },
      {
        name: 'Financial Management',
        description: 'Strategic financial management and business analysis.'
      }
    ]
  },
  {
    name: 'NEET',
    fullName: 'National Eligibility cum Entrance Test',
    topics: [
      {
        name: 'Physics',
        description: 'Core physics concepts relevant to medical science.'
      },
      {
        name: 'Chemistry',
        description: 'Organic, inorganic, and physical chemistry for medical entrance.'
      },
      {
        name: 'Biology',
        description: 'Comprehensive study of botany and zoology.'
      }
    ]
  },
  {
    name: 'CAT',
    fullName: 'Common Admission Test',
    topics: [
      {
        name: 'VARC',
        description: 'Verbal Ability and Reading Comprehension for management aptitude.'
      },
      {
        name: 'DILR',
        description: 'Data Interpretation and Logical Reasoning for business analysis.'
      },
      {
        name: 'QA',
        description: 'Quantitative Ability covering advanced mathematics.'
      }
    ]
  },
  {
    name: 'GATE',
    fullName: 'Graduate Aptitude Test in Engineering',
    topics: [
      {
        name: 'General Aptitude',
        description: 'Verbal and numerical ability for engineering graduates.'
      },
      {
        name: 'Engineering Discipline',
        description: 'Specialized topics in chosen engineering or science discipline.'
      }
    ]
  }
];

export const initializeSubjects = async (): Promise<void> => {
  try {
    // Check if subjects already exist
    const existingSubjects = await Subject.countDocuments();
    
    if (existingSubjects === 0) {
      console.log('Initializing default subjects...');
      await Subject.insertMany(defaultSubjects);
      console.log('Default subjects created successfully');
    } else {
      console.log('Subjects already exist, skipping initialization');
    }
  } catch (error) {
    console.error('Error initializing subjects:', error);
    throw error;
  }
};
