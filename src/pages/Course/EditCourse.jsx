import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { fetchCourse, updateCourse } from "../../features/course/courseSlice";
import { CourseForm } from "../../components";
import { useEffect } from "react";

function EditCourse() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courseId } = useParams();

  const { loading, selectedCourse } = useSelector((state) => state.course);

  const handleEditCourse = async ({ courseData, thumbnailFile }) => {
    await dispatch(
      updateCourse({
        courseId,
        courseData,
        thumbnailFile,
        oldThumbnailPath: selectedCourse.thumbnail_url,
      }),
    ).unwrap();

    navigate("/dashboard/my-courses");
  };

  useEffect(() => {
    dispatch(fetchCourse(courseId));
  }, [dispatch, courseId]);
  if (loading && !selectedCourse) {
    return <p>Loading...</p>;
  }
  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Update Course</h1>

      <CourseForm
        initialData={selectedCourse}
        loading={loading}
        submitText="Update Course"
        onSubmit={handleEditCourse}
        onCancel={() => navigate(-1)}
      />
    </div>
  );
}

export default EditCourse;
