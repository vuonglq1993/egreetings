// File: src/pages/Home.tsx
import React from "react";

const Home: React.FC = () => {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        background: "white",
        padding: "20px 40px",
      }}
    >
      {/* Main heading */}
      <main style={{ paddingBottom: 40 }}>
        <h1 style={{ fontWeight: 700, fontSize: "3rem", marginBottom: 10 }}>
          <span style={{ color: "#2ebf66" }}>Card</span> maker
        </h1>
        <p
          style={{
            fontWeight: 400,
            fontSize: "1.1rem",
            marginBottom: 40,
            color: "#444",
          }}
        >
          Create personalized greeting cards for every special moment
        </p>

        {/* Card grid */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 22,
            maxWidth: 1000,
            margin: "auto",
          }}
        >
          {cardList.map((card) => (
            <div key={card.label} className={`card ${card.class}`} style={cardStyle(card.bg)}>
              <img src={card.img} alt={card.label} style={cardImgStyle} />
              <p style={cardLabelStyle}>{card.label}</p>
            </div>
          ))}
        </section>
      </main>

      {/* Find your perfect match */}
      <h2
        style={{
          textAlign: "center",
          fontWeight: 700,
          fontSize: 28,
          marginBottom: 40,
          color: "#222",
        }}
      >
        Find your perfect match
      </h2>

      <section
        style={{
          maxWidth: 1060,
          margin: "0 auto 80px",
          display: "flex",
          flexWrap: "wrap",
          borderRadius: "0 40px 40px 40px",
          overflow: "hidden",
          boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
        }}
      >
        {/* Left panel */}
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
          <h3
            style={{
              margin: 0,
              fontWeight: 700,
              fontSize: 22,
              color: "#222",
            }}
          >
            Birthday
          </h3>

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
                  (e.currentTarget.style.backgroundColor = "#ffe3d1")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f9f4f0")
                }
              >
                <span>{item.label}</span>
                <span style={iconCircleStyle}>{item.icon}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right panel with images */}
        <div
          style={{
            flex: "1 1 520px",
            backgroundColor: "#ffe9dd",
            position: "relative",
            minHeight: 360,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "visible",
          }}
        >
          {imageLayers.map((img, i) => (
            <img
              key={i}
              src={img.src}
              alt={`Card layer ${i}`}
              draggable={false}
              style={img.style}
              onMouseOver={img.hoverIn}
              onMouseOut={img.hoverOut}
            />
          ))}
        </div>
      </section>

      {/* Need Help button */}
      <button
        style={{
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
        }}
      >
        Need Help?
      </button>
    </div>
  );
};

export default Home;

// -------------------- Data & Styles --------------------

const cardList = [
  {
    label: "Birthday",
    class: "birthday",
    bg: "#ffdfd0",
    img: "https://cdn.greetingsisland.com/63e763313066a5020a5d8174/images/2023/card-set-happy-birthday-2023/pink-black-gold-stars-61ee4ec6a1264.jpeg",
  },
  {
    label: "Thank you",
    class: "thankyou",
    bg: "#b9e9d9",
    img: "https://cdn.greetingsisland.com/63e763313066a5020a5d8174/images/2023/thank-you-cards/colorful-thanks-62573ad5652e9.jpeg",
  },
  {
    label: "Anniversary",
    class: "anniversary",
    bg: "#caf0f8",
    img: "https://cdn.greetingsisland.com/63e763313066a5020a5d8174/images/2023/anniversary-cards/fox-rabbit-dance-together.jpeg",
  },
  {
    label: "Wedding",
    class: "wedding",
    bg: "#f9d1d9",
    img: "https://cdn.greetingsisland.com/63e763313066a5020a5d8174/images/2023/wedding-cards/golden-wreath-couple.jpeg",
  },
  {
    label: "Get well",
    class: "getwell",
    bg: "#fff0cc",
    img: "https://cdn.greetingsisland.com/63e763313066a5020a5d8174/images/2023/get-well-cards/red-tulips.jpeg",
  },
  {
    label: "New baby",
    class: "newbaby",
    bg: "#caf0f8",
    img: "https://cdn.greetingsisland.com/63e763313066a5020a5d8174/images/2023/new-baby-cards/elephant-hello-baby.jpeg",
  },
  {
    label: "Sympathy",
    class: "sympathy",
    bg: "#f9d1d9",
    img: "https://cdn.greetingsisland.com/63e763313066a5020a5d8174/images/2023/sympathy-cards/wreath-butterfly.jpeg",
  },
  {
    label: "Good luck",
    class: "goodluck",
    bg: "#c9b9f9",
    img: "https://cdn.greetingsisland.com/63e763313066a5020a5d8174/images/2023/good-luck-cards/rainbow-flowers-good-luck.jpeg",
  },
  {
    label: "Christmas",
    class: "christmas",
    bg: "#b9e9d9",
    img: "https://cdn.greetingsisland.com/63e763313066a5020a5d8174/images/2022/christmas-cards/tree-ornaments.jpeg",
  },
  {
    label: "AI Magic photo",
    class: "aiphoto",
    bg: "#ffd9b9",
    img: "https://cdn.greetingsisland.com/63e763313066a5020a5d8174/images/ai-magic-photo/wanted-poster.jpeg",
  },
];

const cardStyle = (bgColor: string): React.CSSProperties => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: 18,
  borderRadius: 12,
  cursor: "pointer",
  userSelect: "none",
  boxShadow: "0 0 3px rgb(0 0 0 / 0.1)",
  backgroundColor: bgColor,
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
};

const perfectMatchBtnStyle: React.CSSProperties = {
  backgroundColor: "#f9f4f0",
  borderRadius: 30,
  border: "none",
  fontSize: 16,
  fontWeight: 600,
  padding: "12px 20px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  cursor: "pointer",
  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
  color: "#222",
  transition: "background-color 0.3s ease",
};

const iconCircleStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#ff967c",
  color: "white",
  fontSize: 18,
  width: 28,
  height: 28,
  borderRadius: "50%",
  flexShrink: 0,
  marginLeft: 12,
};

// Image stack (3 ảnh nghiêng)
const imageLayers = [
  {
    src: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=80",
    style: {
      width: 160,
      borderRadius: 16,
      position: "absolute" as const,
      left: 36,
      top: 80,
      boxShadow: "0 10px 25px rgba(0,0,0,0.18)",
      transform: "rotate(-12deg)",
      zIndex: 1,
      transition: "transform 250ms ease, box-shadow 250ms ease",
      objectFit: "cover" as const,
      backgroundColor: "white",
    },
    hoverIn: (e: any) => {
      e.currentTarget.style.transform = "rotate(-12deg) translateY(-6px)";
      e.currentTarget.style.boxShadow = "0 18px 40px rgba(0,0,0,0.24)";
    },
    hoverOut: (e: any) => {
      e.currentTarget.style.transform = "rotate(-12deg)";
      e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.18)";
    },
  },
  {
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=80",
    style: {
      width: 200,
      borderRadius: 18,
      position: "absolute" as const,
      left: 140,
      top: 40,
      boxShadow: "0 14px 34px rgba(0,0,0,0.22)",
      transform: "rotate(6deg)",
      zIndex: 2,
      transition: "transform 250ms ease, box-shadow 250ms ease",
      objectFit: "cover" as const,
      backgroundColor: "white",
    },
    hoverIn: (e: any) => {
      e.currentTarget.style.transform = "rotate(6deg) translateY(-8px) scale(1.03)";
      e.currentTarget.style.boxShadow = "0 22px 48px rgba(0,0,0,0.28)";
    },
    hoverOut: (e: any) => {
      e.currentTarget.style.transform = "rotate(6deg)";
      e.currentTarget.style.boxShadow = "0 14px 34px rgba(0,0,0,0.22)";
    },
  },
  {
    src: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=900&q=80",
    style: {
      width: 260,
      borderRadius: 20,
      position: "absolute" as const,
      right: 36,
      top: 40,
      boxShadow: "0 20px 50px rgba(0,0,0,0.30)",
      transform: "rotate(2deg)",
      zIndex: 3,
      transition: "transform 250ms ease, box-shadow 250ms ease",
      objectFit: "cover" as const,
      backgroundColor: "white",
    },
    hoverIn: (e: any) => {
      e.currentTarget.style.transform = "rotate(2deg) translateY(-10px) scale(1.02)";
      e.currentTarget.style.boxShadow = "0 30px 70px rgba(0,0,0,0.36)";
    },
    hoverOut: (e: any) => {
      e.currentTarget.style.transform = "rotate(2deg)";
      e.currentTarget.style.boxShadow = "0 20px 50px rgba(0,0,0,0.30)";
    },
  },
];
