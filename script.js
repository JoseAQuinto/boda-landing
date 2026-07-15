"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll(".media-frame img").forEach((image) => {
    const markAsMissing = () => image.classList.add("image-missing");
    image.addEventListener("error", markAsMissing);
    if (image.complete && image.naturalWidth === 0) markAsMissing();
  });

  const reveals = document.querySelectorAll(".reveal");
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((section) => section.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px" });
    reveals.forEach((section) => revealObserver.observe(section));
  }

  const locationLink = document.querySelector(".location-link[href='#']");
  locationLink?.addEventListener("click", (event) => event.preventDefault());

  const form = document.querySelector("form[name='confirmacion-boda']");
  if (!form) return;

  const attendanceRadios = [...form.querySelectorAll("input[name='asistencia']")];
  const attendingFields = document.getElementById("campos-asistencia");
  const companionField = document.getElementById("campo-acompanante");
  const guestCount = document.getElementById("numero_asistentes");
  const submitButton = form.querySelector("button[type='submit']");
  const status = document.getElementById("form-status");

  const showSection = (element) => {
    if (!element?.hidden) return;
    element.hidden = false;
    if (!prefersReducedMotion) {
      element.classList.remove("is-entering");
      void element.offsetWidth;
      element.classList.add("is-entering");
    }
  };

  const clearSection = (element) => {
    if (!element) return;
    element.querySelectorAll("input, select, textarea").forEach((field) => {
      if (field.type === "checkbox" || field.type === "radio") field.checked = false;
      else field.value = "";
      clearError(field);
    });
    element.hidden = true;
    element.classList.remove("is-entering");
  };

  const getErrorContainer = (field) => {
    if (field.name === "asistencia") return field.closest("fieldset");
    if (field.name === "privacidad") return field.closest(".privacy-field");
    return field.closest(".form-field");
  };

  const getErrorMessage = (field) => {
    if (field.validity.valueMissing) {
      if (field.name === "asistencia") return "Selecciona si podrás acompañarnos.";
      if (field.name === "privacidad") return "Debes aceptar la información de privacidad.";
      if (field.tagName === "SELECT") return "Selecciona una opción.";
      return "Este campo es obligatorio.";
    }
    if (field.validity.typeMismatch && field.type === "email") return "Introduce un correo electrónico válido.";
    if (field.validity.typeMismatch && field.type === "tel") return "Introduce un número de teléfono válido.";
    return "Revisa este campo.";
  };

  function clearError(field) {
    const container = getErrorContainer(field);
    if (!container) return;
    container.classList.remove("has-error");
    const error = container.querySelector(".field-error");
    if (error) error.textContent = "";
    if (field.name === "asistencia") attendanceRadios.forEach((radio) => radio.removeAttribute("aria-invalid"));
    else field.removeAttribute("aria-invalid");
  }

  const showError = (field) => {
    const container = getErrorContainer(field);
    if (!container) return;
    container.classList.add("has-error");
    const error = container.querySelector(".field-error");
    if (error) error.textContent = getErrorMessage(field);
    if (field.name === "asistencia") attendanceRadios.forEach((radio) => radio.setAttribute("aria-invalid", "true"));
    else field.setAttribute("aria-invalid", "true");
  };

  const updateCompanion = () => {
    if (Number(guestCount.value) > 1) showSection(companionField);
    else clearSection(companionField);
  };

  const updateAttendance = () => {
    const choice = attendanceRadios.find((radio) => radio.checked)?.value;
    attendanceRadios.forEach(clearError);
    if (choice === "Sí, allí estaré") {
      showSection(attendingFields);
      guestCount.required = true;
      updateCompanion();
    } else {
      guestCount.required = false;
      clearSection(attendingFields);
    }
  };

  attendanceRadios.forEach((radio) => radio.addEventListener("change", updateAttendance));
  guestCount.addEventListener("change", updateCompanion);

  form.querySelectorAll("input, select, textarea").forEach((field) => {
    field.addEventListener("blur", () => {
      if (field.willValidate && !field.checkValidity()) showError(field);
    });
    field.addEventListener("input", () => {
      if (field.checkValidity()) clearError(field);
    });
    field.addEventListener("change", () => {
      if (field.checkValidity()) clearError(field);
    });
  });

  form.addEventListener("submit", (event) => {
    status.textContent = "";
    const candidates = [...form.querySelectorAll("input, select, textarea")].filter((field) => field.willValidate);
    const invalidFields = candidates.filter((field) => !field.checkValidity());

    if (invalidFields.length) {
      event.preventDefault();
      invalidFields.forEach(showError);
      status.textContent = "Revisa los campos señalados antes de enviar tu respuesta.";
      invalidFields[0].focus();
      return;
    }

    if (form.dataset.submitting === "true") {
      event.preventDefault();
      return;
    }

    form.dataset.submitting = "true";
    submitButton.disabled = true;
    submitButton.textContent = "Enviando...";
    status.textContent = "Enviando tu respuesta…";
  });
});
