import { Link, useNavigate } from "react-router";
import { Button } from "../index";

function CourseSection() {
  const courseData = [
    {
      icon: "🧠",
      badge: "AI & ML",
      title: "Machine Learning Basics",
      description: "Dr. Karim · 12 lectures · 6 weeks",
      rateing: "⭐ 4.9",
      students: "2,140 students",
      parcent: "72",
    },
    {
      icon: "⚙️",
      badge: "CS",
      title: "Data Structures & Algorithms",
      description: "Prof. Nasrin · 18 lectures · 8 weeks",
      rateing: "⭐ 4.8",
      students: "1,820 students",
      parcent: "58",
    },
    {
      icon: "🌐",
      badge: "Web Dev",
      title: "Full Stack Web Development",
      description: "Dr. Hasan · 20 lectures · 10 weeks",
      rateing: "⭐ 4.9",
      students: "3,060 students",
      parcent: "88",
    },
    {
      icon: "🗄️",
      badge: "Data",
      title: "Database Systems",
      description: "Prof. Rina · 14 lectures · 7 weeks",
      rateing: "⭐ 4.7",
      students: "990 students",
      parcent: "44",
    },
    {
      icon: "🔬",
      badge: "AI & ML",
      title: "Deep Learning & Neural Nets",
      description: "Dr. Ahmed · 16 lectures · 9 weeks",
      rateing: "⭐ 4.8",
      students: "1,540 students",
      parcent: "61",
    },
    {
      icon: "💻",
      badge: "CS",
      title: "Operating Systems",
      description: "Dr. Islam · 15 lectures · 8 weeks",
      rateing: "⭐ 4.6",
      students: "780 students",
      parcent: "36",
    },
  ];
  const navigate = useNavigate();

  return (
    <section id="courses" className="bg-navy-3 py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-teal/25 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse"></span>
            <span className="text-[11px] font-bold text-teal font-mono tracking-[0.15em]">
              POPULAR COURSES
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-black font-[Outfit]">
            Start learning<span className="gradient-text"> today</span>
          </h2>
          <p className="text-slate mt-3 text-sm max-w-md mx-auto leading-relaxed">
            Explore university-grade courses built by real instructors.
          </p>
        </div>

        {/* Course grid */}
        <div
          id="course-grid"
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {courseData.map((item, idx) => (
            <div
              key={idx}
              className="course-card glass rounded-2xl overflow-hidden border border-white/6 flex flex-col"
            >
              {/* Thumbnail */}
              <div
                className="h-36 flex items-center justify-center relative overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(15,191,138,.12), rgba(124,90,247,.08))",
                }}
              >
                <div className="text-5xl">{item.icon}</div>
                <div className="absolute top-3 right-3">
                  <span className="tag bg-teal/15 text-teal border border-teal/25">
                    {item.badge}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-white mb-1 font-[Outfit] leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-slate mb-3">{item.description}</p>

                <div className="flex items-center gap-2 text-xs text-slate mb-4">
                  <span>{item.rateing}</span>
                  <span className="w-1 h-1 rounded-full bg-white/15"></span>
                  <span>{item.students}</span>
                </div>

                {/* Progress */}
                <div className="progress-bar mb-1.5">
                  <div
                    className="progress-fill bg-teal"
                    style={{ width: `${item.parcent}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate/60 font-mono mb-5">
                  <span>{item.parcent}% enrolled</span>
                </div>

                {/* CTA */}
                <div className="mt-auto">
                  <Button
                    className="btn-primary w-full py-2.5 rounded-xl text-sm font-semibold text-white"
                    onclick={() => navigate("/login")}
                  >
                    Enroll Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Browse all */}
        <div className="text-center mt-12">
          <Link
            to="/signup"
            className="btn-secondary px-8 py-3 rounded-xl text-sm font-semibold text-slate border border-white/10 inline-flex items-center gap-2"
          >
            Browse all courses
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CourseSection;
