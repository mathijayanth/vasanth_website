/** Cross-feature shapes. Feature-specific types live in `src/features/<feature>`. */

export interface NavLink {
  href: string;
  label: string;
}

export interface ContentAuthor {
  name: string;
  slug: string;
  avatarUrl?: string;
  title?: string;
  specialty?: string;
}
