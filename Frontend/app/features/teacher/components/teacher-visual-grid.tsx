import { teacherVisualCards } from "../constants/teacher-dashboard.constants";

export function TeacherVisualGrid() {
  return (
    <div className="mt-xl grid grid-cols-1 gap-md sm:grid-cols-2">
      {teacherVisualCards.map((card) => (
        <article
          className="group relative h-48 overflow-hidden rounded-2xl shadow-sm"
          key={card.title}
        >
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 to-transparent" />
          <img
            alt={card.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            src={card.imageUrl}
          />
          <div className="absolute bottom-md left-md z-20 text-white">
            <p className="text-label-sm font-semibold opacity-80">{card.label}</p>
            <p className="text-headline-md font-bold">{card.title}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
