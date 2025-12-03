import { useState, useEffect } from "react";
import { Container, Row, Col, Spinner, Alert, Pagination } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import TemplateCard from "../components/templates/TemplateCard";

const PAGE_SIZE = 12;

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q")?.trim() || "";
  const page = parseInt(searchParams.get("page") || "1", 10);

  const [templates, setTemplates] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) {
      setTemplates([]);
      setTotalCount(0);
      return;
    }

    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/template/search?q=${encodeURIComponent(query)}&pageNumber=${page}&pageSize=${PAGE_SIZE}`
        );

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(errText || "Failed to fetch templates");
        }

        const data = await res.json();
        setTemplates(data.items || []);
        setTotalCount(data.totalCount || 0);
      } catch (err) {
        setError(err.message);
        setTemplates([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, page]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const handlePageChange = (newPage) => {
    setSearchParams({ q: query, page: newPage });
    window.scrollTo(0, 0);
  };

  return (
    <Container className="py-5">
      <h2 className="mb-4">
        {query ? (
          <>
            Search results for: <strong className="text-primary">"{query}"</strong>
            {totalCount > 0 && (
              <span className="text-muted ms-2">({totalCount} results)</span>
            )}
          </>
        ) : (
          <>Enter a keyword to search templates</>
        )}
      </h2>

      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && templates.length === 0 && query && (
        <Alert variant="light">
          No templates found for "<strong>{query}</strong>".
        </Alert>
      )}

      <Row className="mt-4">
        {templates.map((template) => (
          <Col key={template.id} md={6} lg={4} xl={3} className="mb-4">
            <TemplateCard template={template} />
          </Col>
        ))}
      </Row>

      {totalPages > 1 && (
        <Pagination className="justify-content-center mt-4">
          <Pagination.Prev
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
          />
          {[...Array(totalPages)].map((_, i) => (
            <Pagination.Item
              key={i + 1}
              active={i + 1 === page}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
          />
        </Pagination>
      )}
    </Container>
  );
}
