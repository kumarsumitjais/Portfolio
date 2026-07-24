export interface SkillCategory {
  title: string;
  proficiency: number;
  items: string[];
}

export const skills: Record<string, SkillCategory> = {
  languages: {
    title: "Languages",
    proficiency: 85,
    items: ["C/C++", "Python", "HTML", "JS", "CSS"]
  },
  databases: {
    title: "Databases",
    proficiency: 85,
    items: ["SQL", "DBMS"]
  },
  tools: {
    title: "Tools",
    proficiency: 88,
    items: ["GitHub", "MySQL", "MS Excel", "MS PowerPoint", "Canva", "Bootstrap", "MS Word"]
  },
  libraries: {
    title: "Libraries",
    proficiency: 88,
    items: ["Pandas", "NumPy", "Scikit-learn", "Matplotlib"]
  },
  generativeAi: {
    title: "Generative AI",
    proficiency: 80,
    items: ["Prompt Engineering", "LangChain", "RAG (FAISS, HuggingFace)", "LangGraph", "Vertex AI"]
  },
  machineLearning: {
    title: "Machine Learning",
    proficiency: 77,
    items: ["EDA", "Feature Engineering", "Classification", "Regression", "Model Evaluation", "Sentiment Analysis", "Feature Selection", "Clustering (Basics)"]
  },
  dataAnalysis: {
    title: "Data Analysis",
    proficiency: 80,
    items: ["Power BI", "Interactive Dashboards", "Trend Analysis", "Reporting & Presentation", "Tableau", "Seaborn", "Matplotlib"]
  },
  soft: {
    title: "Soft Skills",
    proficiency: 90,
    items: ["Problem-Solving", "Teamwork & Leadership", "Adaptability", "Strategic Planning", "Decision Making", "Technical Writing", "Public Speaking", "Creative Thinking", "Stakeholder Communication"]
  }
};
