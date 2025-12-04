import "./About.css";
import usePageFade from "../../../hooks/usePageFade";
import calendar from "../../../assets/icons/calendar-icon.svg";
import headphone from "../../../assets/icons/headphone-icon.svg";
import community from "../../../assets/icons/community-icon.svg";

const About = () => {
  usePageFade();

  return (
    <main className="about">
      <section className="about__intro">
        <div className="about__intro-header">
          <h1 className="about__title">OUR MANIFESTO</h1>
          <h3 className="about__subtitle">
            FUNK YOU KNOW is more than a party — it's a movement.
          </h3>
        </div>
        <h2 className="about__heading">Our Story</h2>
        <p className="about__text">
          Born in the UK and fueled by Brazil's raw energy, We started as 3
          friends who wanted to bring the authentic sounds of Brazilian funk to
          the British scene. What began as one intimate gathering quickly
          evolved into something bigger — a cultural phenomenon, uniting diverse
          crowds through the infectious Brazilian beats.
        </p>
        <p className="about__text">
          This isn't a tourist version of Brazil — it's the heartbeat of the
          streets, the sound of resistance, the style of those who turn chaos
          into rhythm.
        </p>
      </section>
      <section className="about__actions">
        <h1 className="about__actions-title">WHAT WE DO</h1>
        <div className="about__actions-container">
          <div className="about__action">
            <img src={calendar} alt="Event Icon" className="action__icon" />
            <h2 className="action__title">EPIC PARTIES</h2>
            <p className="action__text">
              Every event turns the club into a cross-cultural dancefloor, where
              favela meets underground, and people from every background move
              together to the beat of 150 BPM, tamborzão, and trap-funk heat.
            </p>
          </div>
          <div className="about__action">
            <img src={headphone} alt="Music Icon" className="action__icon" />
            <h2 className="action__title">TOP DJs</h2>
            <p className="action__text">
              Our lineup features the best DJs, spinning the hottest tracks to
              keep you dancing all night long.
            </p>
          </div>
          <div className="about__action">
            <img
              src={community}
              alt="Community Icon"
              className="action__icon"
            />
            <h2 className="action__title">COMMUNITY</h2>
            <p className="action__text">
              We aim to build a vibrant community of music lovers who share a
              passion for great music, great vibes, and unforgettable
              experiences.
            </p>
          </div>
        </div>
      </section>
      <section className="about__mission">
        <h3 className="about__mission-title">Our mission is simple:</h3>
        <p className="about__mission-text">
          To take Brazilian culture beyond borders — respecting its roots while
          reinventing its future.
        </p>

        <h1 className="about__from-title">FROM BRS TO THE WRLD</h1>
      </section>
    </main>
  );
};
export default About;
