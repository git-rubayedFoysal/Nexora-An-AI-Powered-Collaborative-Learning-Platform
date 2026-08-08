/**
 * AssignmentsPage
 *
 * Role-aware wrapper that renders the appropriate assignment list:
 *  - Teacher/Admin: TeacherAssignments (with create/edit/delete)
 *  - Student: StudentAssignments (with submission status)
 *
 * No props — reads role from Redux auth state.
 */

import { useSelector } from "react-redux";
import TeacherAssignments from "./Assignment";
import StudentAssignments from "./StudentAssignments";

function AssignmentsPage() {
  const { userData } = useSelector((state) => state.auth);
  const role = userData?.role?.toLowerCase();

  if (role === "student") {
    return <StudentAssignments />;
  }

  return <TeacherAssignments />;
}

export default AssignmentsPage;
