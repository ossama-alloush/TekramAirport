import "../pages/pageCSS/LebanesePlaces.css";

const places = [
  {
    name: "rawsheh",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBsIYgHqn36Gq8KzkRxaoDLSBLCrzZ1UNQsP6J9zs28XGcO2LdKDzc2kDC&s=10",
  },

  {
    name: "Baalbeck",
    image:
      "https://cdn.britannica.com/13/130413-050-1CB25BAC/Temple-of-Bacchus-Baalbeck-Lebanon.jpg",
  },

  {
    name: "Zaytoona Bay",
    image:
      "https://lebaneseamericans.org/wp-content/uploads/2022/06/v75jw1p9lse51.jpg",
  },

  {
    name: "Jbeil",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSO7WcAfrPVEpHSE4_p9LzEhWdPsyvJjH-TGlZDWdphmM6PZ7_S5eyltesa&s=10",
  },

  {
    name: "Rocca Marina",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5atuFfcadWPw3JdpRDhmeqp7Ea2mrisfNguzguJYJaFekUTtrbS5VYvLA&s=10",
  },

  {
    name: "Harissa",
    image:
      "https://jitours.com/uploads/filemanager/lebanon/Harissa-06.jpg",
  },
];


function LebanesePlaces() {
  return (
    <section className="places-section">

      <div className="section-heading">


        <h2>
          Explore The Beautiful
          <br />
          Places Around Jordan
        </h2>

      </div>


      {/* Places */}

      <div className="places-grid">

        {places.map((place) => (

          <article
            className="place-card"
            key={place.name}
          >

            <img
              src={place.image}
              alt={place.name}
            />

            <div className="place-overlay">

              <span>⌖</span>

              <div>
                <strong>
                  {place.name}
                </strong>
              </div>

              

            </div>

          </article>

        ))}

      </div>




      {/* Testimonials */}

      <section className="testimonials">

        <div className="section-heading">

          <h2>
            Our Commitment To
            <br />
            You
          </h2>

        </div>


        <div className="testimonial-grid">

          {[1, 2, 3, 4, 5].map((item) => (

            <article
              className="testimonial-card"
              key={item}
            >

              <span className="quote">
                ● Smooth Experience
              </span>

              <p>
                Amazing airport service.
                Everything was smooth,
                professional and easy.
              </p>

              <div className="mini-logo">
                ✈
                <br />
                <strong>TEKRAM</strong>
              </div>

              <div className="testimonial-user">

                Excellent Service

                <span>
                  Feb 2026
                </span>

              </div>

            </article>

          ))}

        </div>

      </section>

    </section>
  );
}

export default LebanesePlaces;






