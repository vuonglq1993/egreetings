import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        background: "#fff",
        padding: "20px 40px",
      }}
    >
      {/* Hero Section */}
      <main
        style={{
          textAlign: "center",
          padding: "80px 20px 60px",
          background:
            "linear-gradient(135deg, #f9f9f9 0%, #e9f9ef 50%, #fff 100%)",
          borderRadius: "0 0 40px 40px",
          marginBottom: 50,
        }}
      >
        <h1
          style={{
            fontWeight: 700,
            fontSize: "3rem",
            marginBottom: 10,
            color: "#222",
          }}
        >
          Create & Send{" "}
          <span style={{ color: "#2ebf66" }}>Personalized E-Greetings</span>
        </h1>
        <p
          style={{
            fontSize: "1.1rem",
            color: "#444",
            maxWidth: 600,
            margin: "0 auto 40px",
          }}
        >
          Choose from beautiful templates, add your message or photo, and send
          joy instantly — paperless and effortless!
        </p>

        <Link
          to="/category/birthday"
          style={{
            display: "inline-block",
            backgroundColor: "#2ebf66",
            color: "white",
            padding: "14px 28px",
            borderRadius: 28,
            textDecoration: "none",
            fontWeight: 600,
            fontSize: 16,
          }}
        >
          Explore Cards
        </Link>
      </main>

      {/* Card Category Grid */}
      <section style={{ marginBottom: 80 }}>
        <h2
          style={{
            textAlign: "center",
            fontWeight: 700,
            fontSize: 28,
            marginBottom: 40,
            color: "#222",
          }}
        >
          All Out Card
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 24,
            maxWidth: 1000,
            margin: "auto",
          }}
        >
          {cardCategories.map((cat) => (
            <Link
              key={cat.label}
              to={`/category/${cat.path}`}
              style={{ textDecoration: "none" }}
            >
              <div style={cardStyle(cat.bg)}>
                <img src={cat.img} alt={cat.label} style={cardImgStyle} />
                <p style={cardLabelStyle}>{cat.label}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <h1 style={{ fontWeight: 700, fontSize: 50, color: "#222", marginLeft: 425 }}>
        Find Your Perfect Match
      </h1>
      {/* “Find Your Perfect Match” Section */}
      <section
        style={{
          maxWidth: 1060,
          margin: "0 auto 100px",
          height: 450,
          display: "flex",
          flexWrap: "wrap",
          borderRadius: "0 40px 40px 40px",
          overflow: "hidden",
          boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
        }}
      >
        
        {/* Left: Text */}
        <div
          style={{
            flex: "1 1 400px",
            backgroundColor: "white",
            padding: "40px 50px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 30,
          }}
        >
          
          <p style={{ fontSize: 15, color: "#555" }}>
            Explore our themed collections — from heartfelt birthdays to funny
            memes and wedding wishes. Choose the perfect card for your moment.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "16px 30px",
            }}
          >
            {[
              { label: "All Birthday", icon: "🎉" },
              { label: "Kids", icon: "🧸" },
              { label: "Add a photo", icon: "📸" },
              { label: "Funny", icon: "😂" },
            ].map((item) => (
              <button
                key={item.label}
                style={perfectMatchBtnStyle}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#eafbea")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f9f9f9")
                }
              >
                <span>{item.label}</span>
                <span style={iconCircleStyle}>{item.icon}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Image Collage */}
        <div
          style={{
            flex: "1 1 520px",
            backgroundColor: "#d8f5e0",
            position: "relative",
            minHeight: 360,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {imageLayers.map((img, i) => (
            <img
              key={i}
              src={img.src}
              alt={`Card ${i}`}
              style={img.style}
              onMouseOver={img.hoverIn}
              onMouseOut={img.hoverOut}
            />
          ))}
        </div>
      </section>

      {/* CTA Subscribe */}
      <section
        style={{
          textAlign: "center",
          padding: "60px 20px 100px",
          backgroundColor: "#f8f8ff",
          borderRadius: 32,
          marginBottom: 60,
        }}
      >
        <h2 style={{ fontWeight: 700, fontSize: 26, color: "#333" }}>
          Want to Send Cards Automatically?
        </h2>
        <p style={{ color: "#555", marginBottom: 30 }}>
          Subscribe to our monthly service — pick up to 10 recipients and never
          miss a special day again!
        </p>
        <Link
          to="/subscribe"
          style={{
            backgroundColor: "#7b51ff",
            color: "white",
            textDecoration: "none",
            padding: "12px 26px",
            borderRadius: 28,
            fontWeight: 600,
          }}
        >
          Subscribe Now
        </Link>
      </section>

      {/* Floating Help */}
      <button style={helpBtnStyle}>Need Help?</button>
    </div>
  );
};

export default Home;

// ---------------- Styles & Data ----------------
const cardCategories = [
  {
    label: "Birthday",
    path: "birthday",
    bg: "#ffdfd0",
    img: "https://cdn.greetingsisland.com/63e763313066a5020a5d8174/images/2023/card-set-happy-birthday-2023/pink-black-gold-stars-61ee4ec6a1264.jpeg",
  },
  {
    label: "Wedding",
    path: "wedding",
    bg: "#f9d1d9",
    img: "https://cdn.greetingsisland.com/63e763313066a5020a5d8174/images/2023/wedding-cards/golden-wreath-couple.jpeg",
  },
  {
    label: "New Year",
    path: "newyear",
    bg: "#fff0cc",
    img: "https://cdn.greetingsisland.com/63e763313066a5020a5d8174/images/2022/new-year-cards/fireworks-celebration.jpeg",
  },
  {
    label: "Festivals",
    path: "festivals",
    bg: "#caf0f8",
    img: "https://cdn.greetingsisland.com/63e763313066a5020a5d8174/images/2023/festival-cards/diwali-lamps.jpeg",
  },
  {
    label: "Thank You",
    path: "thankyou",
    bg: "#b9e9d9",
    img: "https://cdn.greetingsisland.com/63e763313066a5020a5d8174/images/2023/thank-you-cards/colorful-thanks-62573ad5652e9.jpeg",
  },
  {
    label: "Anniversary",
    path: "anniversary",
    bg: "#ffe9dd",
    img: "https://cdn.greetingsisland.com/63e763313066a5020a5d8174/images/2023/anniversary-cards/fox-rabbit-dance-together.jpeg",
  },
  {
  label: "Thanksgiving",
  path: "thanksgiving",
  bg: "#f5d6a3",
  img: "https://cdn.greetingsisland.com/63e763313066a5020a5d8174/images/2023/thanksgiving-cards/autumn-leaves.jpeg",
},
{
  label: "Love & Romance",
  path: "love",
  bg: "#ffd6e0",
  img: "https://cdn.greetingsisland.com/63e763313066a5020a5d8174/images/2023/love-cards/heart-balloon-romantic.jpeg",
},
{
  label: "Christmas",
  path: "christmas",
  bg: "#ffd6e0",
  img: "https://cdn.greetingsisland.com/63e763313066a5020a5d8174/images/2023/love-cards/heart-balloon-romantic.jpeg",
},
{
  label: "Good Luck",
  path: "good-luck",
  bg: "#ffd6e0",
  img: "https://cdn.greetingsisland.com/63e763313066a5020a5d8174/images/2023/love-cards/heart-balloon-romantic.jpeg",
},
];

const cardStyle = (bg: string): React.CSSProperties => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: 18,
  borderRadius: 12,
  cursor: "pointer",
  backgroundColor: bg,
  boxShadow: "0 0 3px rgb(0 0 0 / 0.1)",
  transition: "transform 0.25s ease, box-shadow 0.25s ease",
});

const cardImgStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: 8,
  marginBottom: 12,
  objectFit: "cover",
  boxShadow: "0 2px 8px rgb(0 0 0 / 0.15)",
};

const cardLabelStyle: React.CSSProperties = {
  fontWeight: 600,
  color: "#222",
  fontSize: 16,
};

const perfectMatchBtnStyle: React.CSSProperties = {
  backgroundColor: "#f9f9f9",
  borderRadius: 30,
  border: "none",
  fontSize: 15,
  fontWeight: 600,
  padding: "12px 20px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  cursor: "pointer",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  color: "#222",
  transition: "background-color 0.3s ease",
};

const iconCircleStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#2ebf66",
  color: "white",
  fontSize: 18,
  width: 28,
  height: 28,
  borderRadius: "50%",
  flexShrink: 0,
  marginLeft: 12,
};

const imageLayers = [
  {
    src: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=80",
    style: {
      width: 160,
      borderRadius: 16,
      position: "absolute" as const,
      left: 36,
      top: 80,
      transform: "rotate(-12deg)",
      zIndex: 1,
      transition: "transform 250ms ease, box-shadow 250ms ease",
      boxShadow: "0 10px 25px rgba(0,0,0,0.18)",
    },
    hoverIn: (e: any) =>
      (e.currentTarget.style.transform =
        "rotate(-12deg) translateY(-6px) scale(1.02)"),
    hoverOut: (e: any) =>
      (e.currentTarget.style.transform = "rotate(-12deg)"),
  },
  {
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=80",
    style: {
      width: 200,
      borderRadius: 18,
      position: "absolute" as const,
      left: 140,
      top: 40,
      transform: "rotate(6deg)",
      zIndex: 2,
      transition: "transform 250ms ease, box-shadow 250ms ease",
      boxShadow: "0 14px 34px rgba(0,0,0,0.22)",
    },
    hoverIn: (e: any) =>
      (e.currentTarget.style.transform =
        "rotate(6deg) translateY(-8px) scale(1.04)"),
    hoverOut: (e: any) => (e.currentTarget.style.transform = "rotate(6deg)"),
  },
  {
    src: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=900&q=80",
    style: {
      width: 260,
      borderRadius: 20,
      position: "absolute" as const,
      right: 36,
      top: 40,
      transform: "rotate(2deg)",
      zIndex: 3,
      transition: "transform 250ms ease, box-shadow 250ms ease",
      boxShadow: "0 20px 50px rgba(0,0,0,0.30)",
    },
    hoverIn: (e: any) =>
      (e.currentTarget.style.transform =
        "rotate(2deg) translateY(-10px) scale(1.05)"),
    hoverOut: (e: any) => (e.currentTarget.style.transform = "rotate(2deg)"),
  },
];

const helpBtnStyle: React.CSSProperties = {
  position: "fixed",
  bottom: 20,
  right: 20,
  background: "white",
  borderRadius: 28,
  border: "1px solid #ccc",
  padding: "10px 18px",
  boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: 14,
};