// Create lesson — thin wrapper around LessonModal
import { LessonModal } from "../index";
function CreateLessonModal({ open, onClose, moduleId, lesson = null }) {
  return (
    <LessonModal
      open={open}
      onClose={onClose}
      moduleId={moduleId}
      lesson={lesson}
    />
  );
}

export default CreateLessonModal;
