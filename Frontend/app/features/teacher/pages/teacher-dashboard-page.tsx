import { useState } from "react";

import type { TeacherSectionId } from "../types/teacher-dashboard.types";
import { CourseStructureManager } from "../components/course-structure-manager";
import { FlashcardManager } from "../components/flashcard-manager";
import { MindmapManager } from "../components/mindmap-manager";
import { PdfManager } from "../components/pdf-manager";
import { QuestionLibraryManager } from "../components/question-library-manager";
import { QuizManagementManager } from "../components/quiz-management-manager";
import { TeacherMobileNav } from "../components/teacher-mobile-nav";
import { TeacherOverview } from "../components/teacher-overview";
import { TeacherSidebar } from "../components/teacher-sidebar";
import { TeacherTopbar } from "../components/teacher-topbar";

export function TeacherDashboardPage() {
  const [activeSection, setActiveSection] =
    useState<TeacherSectionId>("course-structure");

  return (
    <div className="min-h-svh overflow-x-hidden bg-background font-body-md text-on-surface">
      <TeacherSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <TeacherTopbar />

      <main className="px-margin-mobile pb-xl pt-md md:px-margin-desktop lg:ml-64 lg:mt-xl">
        <TeacherMobileNav
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        {activeSection === "dashboard" && <TeacherOverview />}
        {activeSection === "course-structure" && <CourseStructureManager />}
        {activeSection === "pdf-documents" && <PdfManager />}
        {activeSection === "mindmap" && <MindmapManager />}
        {activeSection === "flashcard" && <FlashcardManager />}
        {activeSection === "question-bank" && <QuestionLibraryManager />}
        {activeSection === "quiz-management" && <QuizManagementManager />}
      </main>
    </div>
  );
}
