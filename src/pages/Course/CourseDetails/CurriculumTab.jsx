/**
 * CurriculumTab
 *
 * Curriculum tab content: wrapper around CourseCurriculum with a Create Module button.
 *
 * Props:
 *  - courseId          — the course ID
 *  - isEnrolled        — whether current student is enrolled
 *  - isStudent         — whether current user is a student
 *  - onCreateModule    — callback to open Create Module modal
 */

import { CourseCurriculum } from "../../../components";

function CurriculumTab({ courseId, isEnrolled, isStudent, onCreateModule }) {
  return (
    <div className="glass rounded-2xl border border-border p-5 sm:p-6">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-sm font-bold text-white font-display">
          Course Curriculum
        </h2>
        {!isStudent && (
          <button
            className="btn-secondary border py-2 px-3 rounded-lg text-xs font-semibold text-white flex gap-1 justify-center items-center"
            onClick={onCreateModule}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
              fill="#e3e3e3"
            >
              <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
            </svg>{" "}
            Create Module
          </button>
        )}
      </div>
      <CourseCurriculum courseId={courseId} isEnrolled={isEnrolled} />
    </div>
  );
}

export default CurriculumTab;
