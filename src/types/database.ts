export type Task = {
  id: string;
  user_id: string;
  title: string;
  category: string;
  start_time: string;
  end_time: string | null;
  duration: number;
  is_productive: boolean;
  notes: string;
  created_at: string;
};

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  study_goal: number;
  created_at: string;
};