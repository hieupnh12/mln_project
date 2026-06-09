import type { LucideIcon } from "lucide-react";

export type LandingNavItem = {
  label: string;
  href: string;
};

export type TimelineEvent = {
  period: string;
  title: string;
  description: string;
};

export type LearningPreviewFeature = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export type LandingStatistic = {
  label: string;
  value: number;
  suffix?: string;
};

export type FooterLink = {
  label: string;
  href: string;
};

export type FooterLinkGroup = {
  title: string;
  links: FooterLink[];
};
