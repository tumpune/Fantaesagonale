// FantaEsagonale — script comune a tutte le pagine

document.addEventListener("DOMContentLoaded", () => {
  // Menu mobile
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      links.classList.toggle("open");
    });
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => links.classList.remove("open"))
    );
  }

  // Form contatti: gestione invio (client-side, in attesa di backend/email)
  const contactForm = document.querySelector("#contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const feedback = document.querySelector("#contact-feedback");
      if (feedback) {
        feedback.textContent =
          "Grazie! Il tuo messaggio è stato preparato. Il form è collegato a un semplice invio locale: per la messa online serve collegarlo a un servizio email o backend.";
        feedback.classList.add("visible");
      }
      contactForm.reset();
    });
  }

  // Login area soci: placeholder, nessun backend collegato
  const loginForm = document.querySelector("#login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const feedback = document.querySelector("#login-feedback");
      if (feedback) {
        feedback.textContent =
          "Accesso non ancora attivo: l'Area Soci richiede un sistema di autenticazione da collegare (backend/database soci).";
        feedback.classList.add("visible");
      }
    });
  }

  // Countdown "Italia Campione 2030": dal 31/03/2026 (sconfitta con la Bosnia)
  // al 21/07/2030 (finale Mondiali), challenge di 1572 giorni con un video al giorno.
  const campaignStart = new Date(2026, 2, 31);
  const campaignEnd = new Date(2030, 6, 21);
  const campaignTotalDays = 1572;
  const oneDay = 24 * 60 * 60 * 1000;

  const dayCountEls = document.querySelectorAll('[data-campaign="day-count"]');
  const dayRemainingEls = document.querySelectorAll('[data-campaign="day-remaining"]');
  const progressEls = document.querySelectorAll('[data-campaign="progress-fill"]');

  if (dayCountEls.length || dayRemainingEls.length || progressEls.length) {
    const today = new Date();
    const dayNumber = Math.min(
      campaignTotalDays,
      Math.max(1, Math.floor((today - campaignStart) / oneDay) + 1)
    );
    const daysRemaining = Math.max(0, Math.ceil((campaignEnd - today) / oneDay));
    const progressPercent = Math.min(100, Math.max(0, (dayNumber / campaignTotalDays) * 100));

    dayCountEls.forEach((el) => (el.textContent = `${dayNumber} / ${campaignTotalDays}`));
    dayRemainingEls.forEach((el) => (el.textContent = daysRemaining));
    progressEls.forEach((el) => (el.style.width = `${progressPercent}%`));
  }

  // Widget chat: placeholder — da collegare a WhatsApp/numero reale
  const chatWidget = document.querySelector("#chat-widget");
  if (chatWidget) {
    chatWidget.addEventListener("click", () => {
      alert(
        "Widget chat/WhatsApp: collegare al numero definitivo di FantaEsagonale."
      );
    });
  }
});
