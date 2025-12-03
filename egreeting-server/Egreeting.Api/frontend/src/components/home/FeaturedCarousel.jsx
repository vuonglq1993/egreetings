// src/components/home/FeaturedCarousel.jsx
import { memo } from "react";
import { Carousel, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";

const FeaturedCarousel = memo(({ featured, loading }) => {
  if (!featured.length) return null;

  return (
    <div className="section-container mb-5">
      <h2 className="text-center mb-5 fw-bold text-primary section-title">
        Featured This Week
      </h2>
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Carousel indicators={false} interval={4000} pause="hover" className="carousel-container">
          {featured.map((t) => (
            <Carousel.Item key={t.id}>
              <Link to={`/edit/${t.id}`} className="text-decoration-none">
                <div className="position-relative overflow-hidden rounded-3">
                  <img
                    className="d-block w-100 carousel-img"
                    src={t.image}
                    alt={t.title}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  />
                  <div className="position-absolute bottom-0 start-0 end-0 p-4 text-white carousel-overlay">
                    <h3 className="mb-1 fw-bold">{t.title}</h3>
                    <p className="mb-0 small opacity-90">{t.category} • {t.style}</p>
                  </div>
                </div>
              </Link>
            </Carousel.Item>
          ))}
        </Carousel>
      )}
    </div>
  );
});

export default FeaturedCarousel;