import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { createCourse } from "../../features/course/courseSlice";
import { CourseForm } from "../../components";

function CreateCourse() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.course);

  const handleCreateCourse = async ({ courseData, thumbnailFile }) => {
    await dispatch(
      createCourse({
        courseData,
        thumbnailFile,
      }),
    ).unwrap();

    navigate("/dashboard/my-courses");
  };
  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Create Course</h1>

      <CourseForm
        loading={loading}
        submitText="Create Course"
        onSubmit={handleCreateCourse}
        onCancel={() => navigate(-1)}
      />
    </div>
  );
}

export default CreateCourse;
