/* Navigation mobile et formulaire de demande de rendez-vous WhatsApp */
document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".main-nav");

  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Ouvrir le menu" : "Fermer le menu");
      navigation.classList.toggle("is-open", !isOpen);
    });

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Ouvrir le menu");
        navigation.classList.remove("is-open");
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Ouvrir le menu");
        navigation.classList.remove("is-open");
      }
    });
  }

  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  const dateInput = document.querySelector("#appointment-date");
  if (dateInput) {
    const today = new Date();
    const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
      .toISOString().split("T")[0];
    dateInput.min = localToday;
  }

  const appointmentForm = document.querySelector("#appointment-form");
  if (appointmentForm) {
    const params = new URLSearchParams(window.location.search);
    const serviceFromLink = params.get("service");
    const serviceSelect = document.querySelector("#client-service");
    if (serviceFromLink && serviceSelect) {
      const matchingOption = Array.from(serviceSelect.options).find((option) =>
        option.text.toLowerCase().includes(serviceFromLink.toLowerCase())
      );
      if (matchingOption) serviceSelect.value = matchingOption.value;
    }

    appointmentForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const errorMessage = document.querySelector("#form-error");
      errorMessage.textContent = "";

      if (!appointmentForm.reportValidity()) return;

      const formData = new FormData(appointmentForm);
      const clientName = String(formData.get("name") || "").trim();
      const clientPhone = String(formData.get("phone") || "").trim();
      const service = String(formData.get("service") || "").trim();
      const date = String(formData.get("date") || "").trim();
      const time = String(formData.get("time") || "").trim();
      const message = String(formData.get("message") || "").trim();

      if (!clientName || !clientPhone || !service || !date || !time) {
        errorMessage.textContent = "Veuillez compléter tous les champs obligatoires.";
        return;
      }

      const formattedDate = new Date(`${date}T12:00:00`).toLocaleDateString("fr-FR", {
        day: "2-digit", month: "long", year: "numeric"
      });

      const whatsappMessage = [
        "Bonjour Massy's Relaxation Place & Spa Y4, je souhaite demander un rendez-vous.",
        "",
        `Nom : ${clientName}`,
        `Téléphone : ${clientPhone}`,
        `Prestation : ${service}`,
        `Date souhaitée : ${formattedDate}`,
        `Heure souhaitée : ${time}`,
        message ? `Précisions : ${message}` : "",
        "",
        "Merci de me confirmer la disponibilité et le tarif."
      ].filter(Boolean).join("\n");

      const whatsappNumber = "2250507719668";
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
      const newWindow = window.open(whatsappUrl, "_blank", "noopener,noreferrer");

      if (!newWindow) {
        window.location.href = whatsappUrl;
      }
    });
  }
});
