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

  /* Efecto ambiental: luciérnagas y halo lunar con movimiento muy ligero. */
  const hero = document.querySelector(".hero");
  if (hero && !prefersReducedMotion) {
    const lightLayer = document.createElement("div");
    lightLayer.className = "ambient-lights";
    lightLayer.setAttribute("aria-hidden", "true");

    const lightCount = window.innerWidth < 700 ? 9 : 16;
    for (let index = 0; index < lightCount; index += 1) {
      const light = document.createElement("span");
      light.className = "firefly";
      light.style.setProperty("--x", `${8 + Math.random() * 84}%`);
      light.style.setProperty("--y", `${8 + Math.random() * 80}%`);
      light.style.setProperty("--size", `${2 + Math.random() * 2.4}px`);
      light.style.setProperty("--duration", `${5.5 + Math.random() * 5}s`);
      light.style.setProperty("--delay", `${Math.random() * -8}s`);
      light.style.setProperty("--drift", `${-18 + Math.random() * 36}px`);
      lightLayer.appendChild(light);
    }
    hero.appendChild(lightLayer);

    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      hero.addEventListener("pointermove", (event) => {
        const bounds = hero.getBoundingClientRect();
        const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 12;
        const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 12;
        hero.style.setProperty("--parallax-x", `${x}px`);
        hero.style.setProperty("--parallax-y", `${y}px`);
      });
      hero.addEventListener("pointerleave", () => {
        hero.style.setProperty("--parallax-x", "0px");
        hero.style.setProperty("--parallax-y", "0px");
      });
    }
  }

  /* Galería ampliable: solo se activa cuando las fotografías reales existen. */
  const galleryImages = [...document.querySelectorAll(".gallery__item img")];
  if (galleryImages.length) {
    const lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.hidden = true;
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Fotografía ampliada");
    lightbox.innerHTML = `
      <button class="lightbox__close" type="button" aria-label="Cerrar fotografía">×</button>
      <img class="lightbox__image" alt="">
      <p class="lightbox__caption"></p>
    `;
    document.body.appendChild(lightbox);

    const expandedImage = lightbox.querySelector(".lightbox__image");
    const caption = lightbox.querySelector(".lightbox__caption");
    const closeButton = lightbox.querySelector(".lightbox__close");
    let previousFocus = null;

    const closeLightbox = () => {
      lightbox.classList.remove("is-open");
      document.body.classList.remove("lightbox-open");
      window.setTimeout(() => { lightbox.hidden = true; }, prefersReducedMotion ? 0 : 260);
      previousFocus?.focus();
    };

    galleryImages.forEach((image) => {
      image.tabIndex = 0;
      image.setAttribute("role", "button");
      image.setAttribute("aria-label", `${image.alt}. Ampliar fotografía`);

      const openLightbox = () => {
        if (!image.naturalWidth || image.classList.contains("image-missing")) return;
        previousFocus = image;
        expandedImage.src = image.currentSrc || image.src;
        expandedImage.alt = image.alt;
        caption.textContent = image.alt;
        lightbox.hidden = false;
        document.body.classList.add("lightbox-open");
        requestAnimationFrame(() => lightbox.classList.add("is-open"));
        closeButton.focus();
      };

      image.addEventListener("click", openLightbox);
      image.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openLightbox();
        }
      });
    });

    closeButton.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !lightbox.hidden) closeLightbox();
    });
  }

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
