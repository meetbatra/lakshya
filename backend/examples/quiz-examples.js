// Quiz Schema Usage Examples

const Quiz = require('../models/Quiz');

// Example 1: Class 10 Quiz (Stream Selection)
const class10QuizExample = {
  title: "Career Aptitude Assessment",
  description: "Discover your ideal stream based on your interests and aptitude",
  targetClass: "10",
  // No stream required for class 10
  purpose: "stream-selection", // Auto-set if not provided
  estimatedTime: 20,
  difficulty: "medium",
  questions: [
    {
      question: "Which subject do you find most interesting?",
      type: "multiple-choice",
      options: [
        "Mathematics and Physics",
        "Biology and Chemistry", 
        "History and Literature",
        "Economics and Business Studies"
      ],
      correctAnswer: 0, // For scoring purposes
      category: "interest",
      weightage: 3
    },
    {
      question: "What type of career appeals to you most?",
      type: "multiple-choice", 
      options: [
        "Engineering and Technology",
        "Medicine and Healthcare",
        "Arts and Humanities",
        "Business and Finance"
      ],
      correctAnswer: 0,
      category: "aptitude",
      weightage: 4
    }
  ],
  tags: ["career", "stream-selection", "class-10"]
};

// Example 2: Class 12 Science PCM Quiz (Field Recommendation)
const class12SciencePCMQuizExample = {
  title: "Engineering & Technology Field Assessment",
  description: "Find your perfect engineering specialization based on your interests",
  targetClass: "12", 
  stream: "science-pcm", // Required for class 12
  purpose: "field-recommendation",
  estimatedTime: 25,
  difficulty: "medium",
  questions: [
    {
      question: "Which area of engineering interests you most?",
      type: "multiple-choice",
      options: [
        "Computer Science and AI",
        "Mechanical and Automotive", 
        "Electronics and Communication",
        "Civil and Architecture"
      ],
      correctAnswer: 0,
      category: "subject-specific",
      weightage: 5
    },
    {
      question: "What type of problems do you enjoy solving?",
      type: "multiple-choice",
      options: [
        "Software algorithms and coding",
        "Physical design and mechanics",
        "Circuit design and signals", 
        "Structural design and planning"
      ],
      correctAnswer: 0,
      category: "aptitude",
      weightage: 4
    }
  ],
  tags: ["engineering", "field-recommendation", "science-pcm"]
};

// Example 3: Class 12 Science PCB Quiz (Field Recommendation)
const class12SciencePCBQuizExample = {
  title: "Medical & Life Sciences Field Assessment", 
  description: "Discover your ideal specialization in medical and biological sciences",
  targetClass: "12",
  stream: "science-pcb", // Required for class 12
  purpose: "field-recommendation", 
  estimatedTime: 20,
  difficulty: "medium",
  questions: [
    {
      question: "Which medical field appeals to you most?",
      type: "multiple-choice",
      options: [
        "Clinical Medicine (MBBS)",
        "Dentistry and Oral Health",
        "Pharmacy and Drug Development",
        "Biotechnology and Research"
      ],
      correctAnswer: 0,
      category: "subject-specific", 
      weightage: 5
    }
  ],
  tags: ["medical", "field-recommendation", "science-pcb"]
};

// Example 4: Class 12 Commerce Quiz (Field Recommendation)
const class12CommerceQuizExample = {
  title: "Business & Finance Field Assessment",
  description: "Find your perfect career path in business and finance",
  targetClass: "12",
  stream: "commerce",
  purpose: "field-recommendation",
  estimatedTime: 18,
  difficulty: "medium", 
  questions: [
    {
      question: "Which business area interests you most?",
      type: "multiple-choice",
      options: [
        "Accounting and Finance",
        "Marketing and Sales",
        "Human Resources",
        "Operations and Management"
      ],
      correctAnswer: 0,
      category: "subject-specific",
      weightage: 4
    }
  ],
  tags: ["business", "field-recommendation", "commerce"]
};

// Example 5: Class 12 Arts Quiz (Field Recommendation)  
const class12ArtsQuizExample = {
  title: "Arts & Humanities Field Assessment",
  description: "Explore career opportunities in arts and humanities",
  targetClass: "12",
  stream: "arts", 
  purpose: "field-recommendation",
  estimatedTime: 15,
  difficulty: "medium",
  questions: [
    {
      question: "Which creative field appeals to you most?", 
      type: "multiple-choice",
      options: [
        "Literature and Writing",
        "Visual Arts and Design",
        "Performing Arts and Music",
        "Social Sciences and Psychology"
      ],
      correctAnswer: 0,
      category: "subject-specific",
      weightage: 4
    }
  ],
  tags: ["arts", "field-recommendation", "humanities"]
};

module.exports = {
  class10QuizExample,
  class12SciencePCMQuizExample, 
  class12SciencePCBQuizExample,
  class12CommerceQuizExample,
  class12ArtsQuizExample
};