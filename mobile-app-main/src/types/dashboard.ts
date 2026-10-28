export interface Course {
  id: string;
  code: string;
  name: string;
  progress: number;
  percent: string;
  barColor: string;
}

export interface PlanItem {
  id: string;
  time: string;
  title: string;
  tag: string;
  tagBg: string;
  tagColor: string;
  route: string;
}

export interface QuickStudyItem {
  id: string;
  label: string;
  icon: string;
  bg: string;
  textColor: string;
  route: string;
}

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  prompt: string;
  options: QuizOption[];
  correctOptionId: string;
}

export interface ChatMessage {
  id: string;
  sender: 'me' | 'them';
  text: string;
  time: string;
  image?: boolean;
  read?: boolean;
}

export interface CampusPlace {
  id: string;
  name: string;
  status: string;
  distance: string;
  category: string;
  bgColor: string;
}

export interface StudyGroup {
  id: string;
  name: string;
  tag: string;
  tagBg: string;
  tagColor: string;
  members: string;
  preview: string;
  extraAvatars: number;
  thumbBg: string;
}

export interface VideoLecture {
  id: string;
  number: string;
  title: string;
  duration: string | null;
  status: string;
  statusColor: string;
  current: boolean;
  locked?: boolean;
  thumbBg: string;
}
