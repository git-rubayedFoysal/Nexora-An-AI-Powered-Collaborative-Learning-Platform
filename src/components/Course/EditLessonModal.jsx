// Edit lesson — thin wrapper around LessonModal
import { LessonModal } from "../index";

function EditLessonModal({ open, onClose, moduleId, lesson }) {
  return (
    <LessonModal
      open={open}
      onClose={onClose}
      moduleId={moduleId}
      lesson={lesson}
    />
  );
}

export default EditLessonModal;
