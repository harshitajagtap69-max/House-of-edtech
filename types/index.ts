export interface NoteType {
  _id: string;
  title: string;
  content: string;
  subject: string;
  tags: string[];
  userId: string;
  aiSummary?: string;
  aiKeyPoints?: string[];
  aiQuestions?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserType {
  id: string;
  name: string;
  email: string;
}

export type AIFeature = "summary" | "keypoints" | "questions";
