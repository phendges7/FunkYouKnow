import "./Contact.css";
import { useEffect, useRef, useState } from "react";
import { sendContactMessage } from "../../services/contactService";

import { useToast } from "../../../../context/ToastContext";

const Contact = () => {
  const { showToast } = useToast();

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [isSending, setIsSending] = useState(false);

  const reloadTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (reloadTimerRef.current) clearTimeout(reloadTimerRef.current);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSending) return;

    setIsSending(true);

    try {
      await sendContactMessage({
        name: form.name,
        email: form.email,
        message: form.message,
      });

      // ✅ Toast centralizado
      // Se seu showToast tiver assinatura diferente, veja nota abaixo
      showToast("Message sent! We’ll get back to you soon.", "success");

      // ✅ refresh após 3s
      reloadTimerRef.current = setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (err) {
      showToast(err?.message || "Something went wrong. Try again.", "error");
      setIsSending(false);
    }
  };

  return (
    <main className="contact">
      <div className="contact__content">
        <h1 className="contact__title">CONTACT US</h1>
        <p className="contact__text">
          If you have any questions, feel free to reach out!
        </p>

        <form className="contact__form" onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              disabled={isSending}
              autoComplete="name"
            />
          </label>

          <label>
            Email:
            <input
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              disabled={isSending}
              autoComplete="email"
            />
          </label>

          <label>
            Message:
            <textarea
              name="message"
              rows="5"
              required
              value={form.message}
              onChange={handleChange}
              disabled={isSending}
            />
          </label>

          <button type="submit" className="form__submit" disabled={isSending}>
            {isSending ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default Contact;
