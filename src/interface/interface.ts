import { Session, User } from '@supabase/supabase-js'

interface Store {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
  session: Session | null
  setSession: (session: Session | null) => void
  user: User | null
  setUser: (user: User | null) => void
}

interface UserProfile {
  avatar_url: string | null;
  bio: string | null;
  emoji: string | null;
  expopushtoken: string | null;
  id: string;
  updated_at: string | null;
  username: string | null;
}

interface Entry {
  color: string;
  description: string;
  favorite: boolean;
  id: number;
  time_updated: string;
  title: string;
  user_id: string;
}



export {
	Store,
	UserProfile,
	Entry
}