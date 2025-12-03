// src/components/home/CategorySection.jsx
import { memo, useMemo } from "react";
import { Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import CategoryCard from "./CategoryCard";

const iconMap = {
  Birthday: "bi-gift-fill",
  Wedding: "bi-heart-fill",
  "New Year": "bi-calendar-event-fill",
};

const bgPatterns = {
  Birthday: "url('data:image/svg+xml,...')",
  Wedding: "url('data:image/svg+xml,...')",
  "New Year": "url('data:image/svg+xml,...')",
};

const CategorySection = memo(({ categories, templates }) => {
  const navigate = useNavigate();

  const categoryData = useMemo(() => {
    return categories.map((cat) => {
      const sample = templates.find((t) => t.category === cat);
      const count = templates.filter((t) => t.category === cat).length;
      return { cat, sample, count };
    });
  }, [categories, templates]);

  return (
    <div className="section-container">
      <div className="text-center mb-5">
        <h2 className="display-5 fw-bold section-title">Browse by Occasion</h2>
        <p className="text-muted mt-3 fs-5">Find the perfect card for every moment</p>
      </div>
      <Row className="g-5">
        {categoryData.map(({ cat, sample, count }) => (
          <CategoryCard
            key={cat}
            category={cat}
            sample={sample}
            count={count}
            icon={iconMap[cat]}
            bgPattern={bgPatterns[cat]}
            onClick={() => navigate(`/category/${cat}`)}
          />
        ))}
      </Row>
    </div>
  );
});

export default CategorySection;