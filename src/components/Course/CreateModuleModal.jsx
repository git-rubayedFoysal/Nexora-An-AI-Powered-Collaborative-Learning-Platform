// Create module — thin wrapper around ModuleModal
import { ModuleModal } from "../index";

function CreateModuleModal({ open, onClose, courseId }) {
  return <ModuleModal open={open} onClose={onClose} courseId={courseId} />;
}

export default CreateModuleModal;
