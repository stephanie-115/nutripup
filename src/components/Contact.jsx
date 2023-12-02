import React from "react";

export default function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    fetch(`http://localhost:8080/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  return (
    <div>
      <h2>Contact Us:</h2>
      <p>
        Have queries, suggestions, or just want to send some puppy love our way?
        Contact us here! We’re all ears (just like your pup) for anything you
        have to say.
      </p>
      <form
        className="contact-us-form"
        id="contactUsForm"
        onSubmit={handleSubmit}
      >
        <div className="input-row">
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Your name"
            required
          />
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Your email"
            required
          />
        </div>
        <textarea
          id="message"
          name="message"
          placeholder="Your message"
          required
        ></textarea>
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
