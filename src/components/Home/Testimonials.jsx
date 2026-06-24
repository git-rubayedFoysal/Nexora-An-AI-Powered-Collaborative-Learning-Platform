function SvgStar() {
  return (
    <svg
      className="w-4 h-4 text-amber-400"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

function Testimonials() {
  const reviewData = [
    {
      stars: 4,
      badge: "SK",
      review: `"The AI tutor actually understands my course material. I asked about gradient descent at 2am before an exam and got a perfect explanation grounded in exactly what we covered."`,
      name: "Sadia Khanam",
      title: "CSE Student",
    },
    {
      stars: 5,
      badge: "DK",
      review: `"Grading 80 assignments used to take me hours. The grade center on Nexora lets me score, leave feedback, and move on in minutes. The auto-grading for quizzes is a lifesaver."`,
      name: "Dr. Karim",
      title: "ML Instructor",
    },
    {
      stars: 5,
      badge: "RA",
      review: `"As an admin, the platform stats give me everything I need in one view. Enrollment trends, active courses, user roles — the analytics are clear and actionable."`,
      name: "Rina Ahmed",
      title: "Platform Admin",
    },
  ];
  return (
    <section id="reviews" className="bg-navy-2 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-coral/25 mb-5">
            <span className="text-xs font-semibold text-coral font-mono tracking-wider">
              STUDENT REVIEWS
            </span>
          </div>
          <h2 className="text-4xl font-black font-[Outfit]">
            Loved by <span class="gradient-text">learners</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviewData.map((item) => (
            <div className="testimonial-card glass rounded-2xl p-6 border border-white/6">
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: item.stars }).map((_, index) => (
                  <SvgStar key={index} />
                ))}
              </div>
              <p className="text-sm text-slate-light leading-relaxed mb-5">
                {item.review}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-linear-to-br from-teal to-teal-light flex items-center justify-center text-xs font-bold text-white">
                  {item.badge}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">
                    {item.name}
                  </div>
                  <div className="text-xs text-slate">{item.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
