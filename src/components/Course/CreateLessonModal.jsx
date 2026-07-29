import { LessonModal } from "../index";

/**
 * CreateLessonModal
 *
 * Thin wrapper around LessonModal that handles both create and edit modes.
 * Used by CourseCurriculum for:
 *  - Adding a new lesson to a module (no `lesson` prop)
 *  - Editing an existing lesson (passes `lesson` prop)
 *
 * Props:
 *  - open     : boolean — controls modal visibility
 *  - onClose  : () => void — called after successful save or cancel
 *  - moduleId : string — the parent module this lesson belongs to
 *  - lesson   : object | null — null = create mode, object = edit mode
 */
function CreateLessonModal({ open, onClose, moduleId, lesson = null }) {
  return (
    <LessonModal open={open} onClose={onClose} moduleId={moduleId} lesson={lesson} />
  );
}

export default CreateLessonModal;
