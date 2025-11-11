import "./Contact.css";
import usePageFade from "../../utils/usePageFade";

const Contact = () => {
  usePageFade();
  return (
    <main className="contact">
      <div className="contact__content">
        <h1 className="contact__title">CONTACT US</h1>
        <p className="contact__text">
          If you have any questions, feel free to reach out!
        </p>

        <form className="contact__form">
          <label>
            Name:
            <input type="text" name="name" required />
          </label>
          <label>
            Email:
            <input type="email" name="email" required />
          </label>
          <label>
            Message:
            <textarea name="message" rows="5" required></textarea>
          </label>
          <button type="submit" className="form__submit">
            Send Message
          </button>
        </form>
      </div>
    </main>
  );
};

export default Contact;
