import "../pages/pageCSS/Footer.css";

function Footer() {
  return (
    <footer
      className="footer"
      id="contact"
    >

      {/* Footer Links */}

      <div className="footer-grid">

        <div>

          <h3>Company</h3>

          <a href="#about">
            About us
          </a>

          <a href="#contact">
            Contact
          </a>

        </div>


        <div>

          <h3>Explore</h3>

          <a href="#services">
            Company Listing
          </a>

          <a href="#services">
            Meet & Greet
          </a>

          <a href="#services">
            Food Services
          </a>

        </div>


        <div>

          <h3>Quick Links</h3>

          <a href="#terms">
            Terms
          </a>

          <a href="#privacy">
            Privacy
          </a>

          <a href="#about">
            About Us
          </a>

        </div>


        <div>

          <h3>Contact</h3>

          <p>
            Airport Services,
            Amman, Jordan
          </p>

          <p>
            TEKRAM for Airport Services
          </p>

          <p>
            +962 7 0000 0000
          </p>

        </div>

      </div>


      {/* Newsletter */}

      <div className="newsletter">

        <div className="newsletter-logo">

          ✈ <strong>TEKRAM</strong>

          <p>
            Premium airport services
            designed for a better journey.
          </p>

        </div>


        <div>

          <strong>
            Subscribe Our Newsletter
          </strong>

          <div className="subscribe-form">

            <input
              placeholder="Enter Your Email"
            />

            <button>
              Subscribe
            </button>

          </div>

        </div>

      </div>


      {/* Copyright */}

      <div className="copyright">

        <span>
          © 2026 Tekram.
          All rights reserved
        </span>

        <span>
          Powered by
          <b> Website Project</b>
        </span>

      </div>

    </footer>
  );
}

export default Footer;