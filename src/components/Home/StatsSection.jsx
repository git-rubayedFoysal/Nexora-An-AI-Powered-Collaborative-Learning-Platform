function StatsSection() {
  const statsData = [
    {
      title: "Active learners",
      sign: "+",
      statNum: "2.4k",
    },
    {
      title: "Courses available",
      sign: "+",
      statNum: "48",
    },
    {
      title: "Satisfaction rate",
      sign: "%",
      statNum: "98",
    },
    {
      title: "Average rating",
      sign: "*",
      statNum: "4.9",
    },
  ];
  return (
    <section id="stats" className="bg-navy-2 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {statsData.map((item) => (
            <>
              <div className="stat-card glass rounded-2xl p-6 text-center border border-white/6">
                <div className="text-4xl font-black text-white mb-1 font-[Outfit]">
                  {item.statNum}
                  <span className="text-violet">{item.sign}</span>
                </div>
                <div className="text-sm text-slate">{item.title}</div>
              </div>
            </>
          ))}
        </div>
      </div>
    </section>
  );
}

export default StatsSection;
