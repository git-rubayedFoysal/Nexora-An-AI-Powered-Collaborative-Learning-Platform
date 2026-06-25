import { useOutletContext } from "react-router";
import TeacherContent from "./content/TeacherContent";
import StudentContent from "./content/StudentContent";
import AdminContent from "./content/AdminContent";

export default function DashboardHome() {
  const { role, name } = useOutletContext();
  console.log(name);
  switch (role.toLowerCase()) {
    case "teacher":
      return <TeacherContent user={name} role={role} />;
    case "admin":
      return <AdminContent role={role} />;
    default:
      return <StudentContent user={name} role={role} />;
  }
}
