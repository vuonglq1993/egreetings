import { useState, useEffect } from "react";
import { Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";

// Components
import HeroSection from "../components/home/HeroSection";
import StatsSection from "../components/home/StatsSection";
import CategoryCard from "../components/home/CategoryCard";

const STATS = [
    { num: "500+", label: "Templates" },
    { num: "1M+", label: "Cards Sent" },
    { num: "4.9", label: "User Rating" },
];

export default function Home() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);

    // Fetch categories WITH TEMPLATE COUNT
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/category/with-template-count`
                );
                const data = await res.json();
                setCategories(data);
            } catch (err) {
                console.error("Failed to fetch categories:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) {
            navigate(`/search?q=${encodeURIComponent(search)}`);
        }
    };

    return (
        <>
            {/* Hero */}
            <HeroSection search={search} setSearch={setSearch} onSearch={handleSearch} />

            {/* Main */}
            <Container fluid="xxl" className="px-4">
                
                {/* Stats */}
                <StatsSection stats={STATS} />

                {/* Categories */}
                <Row className="mt-4">
                    {categories.map((cat) => (
                        <CategoryCard
                            key={cat.name}
                            category={cat.name}
                            sample={cat.sampleTemplate || null}  
                            count={cat.templateCount}          
                            bgPattern="transparent"
                            onClick={() => navigate(`/category/${cat.name}`)}
                        />
                    ))}
                </Row>
            </Container>
        </>
    );
}
