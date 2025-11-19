// src/components/home/StatsSection.jsx
export default function StatsSection({ stats }) {
    return (
      <div className="stats-container my-5">
        {stats.map((stat, i) => (
          <div key={i} className="stat-item text-center">
            <h3 className="fw-bold">{stat.num}</h3>
            <p className="mb-0 opacity-80">{stat.label}</p>
          </div>
        ))}
      </div>
    );
  }