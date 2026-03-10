export interface SocialLink {
  platform: string;
  url: string;
}

export interface Story {
  id: string;
  title?: string;
  names?: string[];
  content?: string;
  images?: string[];
  socialLinks?: SocialLink[];
}

export const storiesData: Story[] = [];
