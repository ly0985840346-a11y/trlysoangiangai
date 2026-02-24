export interface LessonPlan {
  title: string;
  ageGroup: string;
  method: string;
  developmentField: string;
  objectives: {
    knowledge: string[];
    skills: string[];
    attitude: string[];
  };
  preparation: {
    teacher: string[];
    students: string[];
  };
  procedure: {
    step: string;
    teacherActivity: string;
    studentActivity: string;
  }[];
}

export interface LessonPlanFormData {
  topic: string;
  ageGroup: string;
  method: string;
  developmentField: string;
  teacher: string;
  className: string;
  school: string;
  date: string;
  location: string;
  notes: string;
}
