export type Lesson = {
  title: string;
  icon: string;
};

export type Chapter = {
  id: string;
  order: string;
  title: string;
  summary: string;
  lessons: Lesson[];
};
