import React from "react";

const Home: React.FC = () => {
  return (
    <div className="font-sans text-gray-800">
      {/* ====== Navigation ====== */}
      <nav className="fixed w-full bg-white shadow z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">EventVibe</h1>
          <ul className="hidden md:flex space-x-6 font-medium">
            <li><a href="#home" className="hover:text-indigo-600">Home</a></li>
            <li><a href="#about" className="hover:text-indigo-600">About</a></li>
            <li><a href="#services" className="hover:text-indigo-600">Services</a></li>
            <li><a href="#gallery" className="hover:text-indigo-600">Gallery</a></li>
            <li><a href="#sponsors" className="hover:text-indigo-600">Sponsors</a></li>
            <li><a href="#contact" className="hover:text-indigo-600">Contact</a></li>
          </ul>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm">
            Buy Ticket
          </button>
        </div>
      </nav>

      {/* ====== Hero Section ====== */}
      <section
        id="home"
        className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-indigo-600 to-purple-600 text-white text-center px-6"
      >
        <h2 className="text-4xl md:text-6xl font-bold mb-4">
          The Ultimate Music Festival
        </h2>
        <p className="max-w-2xl mb-6 text-lg text-gray-100">
          Join thousands of music lovers for a weekend of unforgettable performances, food, and fun.
        </p>
        <div>
          <button className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200">
            Get Tickets
          </button>
        </div>
      </section>

      {/* ====== About Section ====== */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold mb-4">About The Event</h3>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Experience three days of live performances, workshops, and cultural exhibitions from world-renowned artists and creators.
          </p>
        </div>
      </section>

      {/* ====== Services Section ====== */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-center mb-12">What We Offer</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Live Concerts", text: "Watch performances from global artists and local talents." },
              { title: "Food & Drinks", text: "Enjoy a variety of cuisines and refreshing beverages." },
              { title: "Workshops", text: "Join sessions to learn about music, art, and creativity." },
            ].map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-md p-8 hover:shadow-lg transition"
              >
                <h4 className="text-xl font-semibold mb-3 text-indigo-600">{service.title}</h4>
                <p className="text-gray-600">{service.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== Gallery Section ====== */}
      <section id="gallery" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold mb-12">Event Highlights</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-48 bg-gray-200 rounded-xl hover:scale-105 transition-transform duration-300"
              >
                <span className="text-gray-400 text-sm flex items-center justify-center h-full">
                  Image {i + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== Sponsors Section ====== */}
      <section id="sponsors" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold mb-12">Our Sponsors</h3>
          <div className="flex flex-wrap justify-center gap-10">
            {["Spotify", "CocaCola", "Adidas", "RedBull", "Sony"].map((brand) => (
              <div
                key={brand}
                className="text-gray-400 text-xl font-semibold hover:text-indigo-600 transition"
              >
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== Contact Section ====== */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold mb-6">Get In Touch</h3>
          <p className="text-gray-600 mb-8">
            Have questions? Contact our team for details about tickets, partnerships, or events.
          </p>
          <form className="grid gap-4 max-w-md mx-auto">
            <input
              type="text"
              placeholder="Your Name"
              className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <textarea
              placeholder="Your Message"
              className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              rows={4}
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* ====== Footer ====== */}
      <footer className="bg-gray-900 text-gray-400 py-8 text-center">
        <p>&copy; {new Date().getFullYear()} EventVibe. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
