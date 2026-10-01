import React from "react";
import "../pages/pageCSS/PopularServices.css";
import gold from "../assets/gold.jpg";
import transit from "../assets/Transit.jpg";
import silver from "../assets/silver.jpg";
import platinum from "../assets/platinum.jpg";
import { Link } from "react-router-dom";
const popular = [
  {
    title: "Gold Meet & Greet",
    price: "60 $",
    image: gold,
  },
  {
    title: "Transit Meet & Greet",
    price: "25 $",
    image: transit,
  },
  {
    title: "Silver Meet & Greet",
    price: "35 $",
    image: silver,
  },
  {
    title: "Platinum Meet & Greet",
    price: "35 $",
    image: platinum,
  },
];

const destinations = [
  { city: "Bergamo", airline: "RYANAIR", type: "Departure", flightNo: "FR881" },
  { city: "London", airline: "Wizz Air", type: "Departure", flightNo: "W95170" },
  { city: "Doha", airline: "Royal Jordanian", type: "Departure", flightNo: "RJ650" },
  { city: "Istanbul", airline: "Royal Jordanian", type: "Arrival", flightNo: "RJ164" },
  { city: "Cairo", airline: "Jordan Aviation", type: "Arrival", flightNo: "R5812" },
  { city: "Dubai", airline: "Emirates Airline", type: "Arrival", flightNo: "EK905" },
];

const services = [
  {
    title: "Fast Track Service",
    text: "Avoid long airport queues and enjoy a smooth and comfortable journey.",
    image:
      "https://skyvip-prod.nyc3.digitaloceanspaces.com/uploads/blog/articles/what-is-fast-track-at-the-airport-and-is-it-worth-it-2.jpg",
  },
  {
    title: "Porter Service",
    text: "Our trained team handles your luggage from arrival to departure.",
    image:
      "https://www.murgencyairportassistance.com/images/blog/0355910048eb4acaf58333b447d8c235",
  },
  {
    title: "Baggage Wrapping",
    text: "Protect your luggage with our professional wrapping service.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3wAXMvm2Q8zus10ssHkN00DSue95ZCwyRGUWbOJlwSuXmtqCdh3d2I2D1&s=10",
  },
];

function PopularServices() {
  return (
    <section className="popular-section">
      <div className="section-heading">
        <h2>
          Our Most Popular
          <br />
          Services
        </h2>
      </div>

      {/* Popular Services */}
      <div className="popular-grid">
        {popular.map((item) => (
          <article className="popular-card" key={item.title}>
            <img src={item.image} alt={item.title} />

            <div className="card-body">
              <h3>{item.title}</h3>

              <div className="tags">
                <span>One Way</span>
                <span>Airport Service</span>
              </div>

              <div className="card-bottom">
                <strong>{item.price}</strong>
                <button>Book Now</button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* All Services */}
      <div className="section-heading services-heading">
        <h2>
          View All Meet &
          <br />
          Greet
        </h2>
      </div>

      <div className="service-grid">
        {services.map((service) => (
          <article className="service-card" key={service.title}>
            <img src={service.image} alt={service.title} />

            <h3>{service.title}</h3>

            <p>{service.text}</p>

            <a href="#services">Read more →</a>
          </article>
        ))}

        
      </div>
      <div>         <Link to="/meet-and-greet" className="primary-btn">
  See all Meet & Greet →
</Link></div>

      {/* Destinations */}
      <section className="destinations-section">
        <div className="section-heading destinations-heading">
          <span className="subtitle">Enjoy Trip</span>
          <h2>
            Top Domestic
            <br />
            Destinations
          </h2>
        </div>

        <div className="destination-grid">
          {destinations.map((item, index) => (
            <article className="destination-card" key={index}>
              <div className="left-box">
                <strong>{item.city}</strong>
                <span>{item.airline}</span>
              </div>

              <div className="plane-divider">
                <span className="line-dashed"></span>
                <div className="plane-badge">
                  <span className="plane-icon">✈</span>
                </div>
              </div>

              <div className="right-box">
                <strong>{item.type}</strong>
                <span>{item.flightNo}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* About */}
      <section className="about-section">
        <div className="about-text">
          <span>About Us</span>

          <h2>
            Travel with a Smile
            <br />
            and Great With Tekram
          </h2>

          <p>
            We make every airport journey smoother with premium assistance and
            personalized support.
          </p>

          <p>
            From meet and greet to luggage services, our team is ready to
            provide a memorable experience.
          </p>

          <Link to="/about" className="primary-btn">
  Learn More →
</Link>
          
        </div>

        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpp3RFo8ockKNvP4xVfJ2YSSlID80k8q6ghzJ_JaXjDncxNZ8gcZp6FwE&s=10"
          alt="Airport lounge"
        />
      </section>
    </section>
  );
}

export default PopularServices;