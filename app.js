const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();
const enquiry=document.getElementById('enquiry-form');
if (enquiry) {
  const es = document.documentElement.lang === 'es';
  const contact = enquiry.elements.namedItem('contact');
  const requiredFields = [...enquiry.querySelectorAll('[required]')];
  requiredFields.forEach(field => field.addEventListener('input', () => field.setCustomValidity('')));
  enquiry.addEventListener('submit', (event) => {
    event.preventDefault();
    for (const field of requiredFields) {
      field.setCustomValidity(field.value.trim() ? '' : (es ? 'Completa este campo.' : 'Uzupełnij to pole.'));
    }
    const value = contact.value.trim();
    const email = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(value);
    const digits = value.replace(/\D/g, '');
    const phone = /^\+?[\d\s().-]+$/.test(value) && digits.length >= 7 && digits.length <= 15;
    if (value && !email && !phone) {
      contact.setCustomValidity(es ? 'Introduce un correo electrónico o un teléfono válido (7–15 dígitos).' : 'Podaj poprawny adres e-mail lub numer telefonu (7–15 cyfr).');
    }
    if (!enquiry.reportValidity()) return;
    const fields = new FormData(enquiry);
    const labels = es ? ['Nombre','Localidad / barrio','Contacto','Fecha prevista','Trabajos'] : ['Imię','Miejscowość / dzielnica','Kontakt','Preferowany termin','Zakres prac'];
    const keys = ['name','place','contact','when','scope'];
    const lines = keys.map((key, i) => labels[i] + ': ' + String(fields.get(key) || '').trim());
    const subject = es ? 'Consulta sobre reforma — RENOMASTRO' : 'Zapytanie o remont — RENOMASTRO';
    window.location.href = 'mailto:info@renomastro.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\r\n\r\n'));
    enquiry.querySelector('.enquiry-status').textContent = es ? 'Si se abre tu aplicación de correo, revisa y envía el mensaje allí. Este formulario no lo envía automáticamente. También puedes escribir directamente a info@renomastro.com.' : 'Jeśli otworzy się poczta, sprawdź i wyślij wiadomość w tej aplikacji. Ten formularz nie wysyła jej automatycznie. Możesz też napisać bezpośrednio na info@renomastro.com.';
  });
  // Enable data entry only after the handler that prevents native submission is installed.
  enquiry.querySelector('fieldset').disabled = false;
  enquiry.querySelector('[type="submit"]').disabled = false;
  enquiry.querySelector('.enquiry-unavailable').hidden = true;
}

// Keep project photos on the page instead of navigating to raw image files.
const projectPhotos = [...document.querySelectorAll('.bathroom-photo-grid img, .tile-photo-grid img, .project-steps .step-photo img, .project-final img, #sochaczew-preview [data-photo] img')];
if (projectPhotos.length) {
  const es = document.documentElement.lang === 'es';
  const viewer = document.createElement('dialog');
  viewer.className = 'photo-viewer';
  viewer.setAttribute('aria-label', es ? 'Galería de fotos' : 'Galeria zdjęć');
  viewer.innerHTML = '<div class="photo-viewer-bar"><span class="photo-viewer-count" aria-live="polite"></span><button type="button" class="photo-viewer-close"></button></div><div class="photo-viewer-stage"><button type="button" class="photo-viewer-prev">‹</button><img class="photo-viewer-image" alt=""><button type="button" class="photo-viewer-next">›</button></div><p class="photo-viewer-caption"></p>';
  document.body.append(viewer);
  const picture = viewer.querySelector('.photo-viewer-image');
  const caption = viewer.querySelector('.photo-viewer-caption');
  const count = viewer.querySelector('.photo-viewer-count');
  const close = viewer.querySelector('.photo-viewer-close');
  const previous = viewer.querySelector('.photo-viewer-prev');
  const next = viewer.querySelector('.photo-viewer-next');
  close.textContent = es ? 'Cerrar ×' : 'Zamknij ×';
  previous.setAttribute('aria-label', es ? 'Foto anterior' : 'Poprzednie zdjęcie');
  next.setAttribute('aria-label', es ? 'Foto siguiente' : 'Następne zdjęcie');
  let current = 0;
  let opener;
  const show = (index) => {
    current = (index + projectPhotos.length) % projectPhotos.length;
    const source = projectPhotos[current];
    picture.src = source.closest('a')?.getAttribute('href') || source.src;
    picture.alt = source.alt;
    caption.textContent = source.closest('figure')?.querySelector('figcaption')?.textContent || source.alt;
    count.textContent = `${current + 1} / ${projectPhotos.length}`;
  };
  projectPhotos.forEach((photo, index) => {
    let trigger = photo.closest('a');
    if (!trigger) {
      trigger = document.createElement('button');
      trigger.type = 'button';
      trigger.className = 'photo-open';
      photo.replaceWith(trigger);
      trigger.append(photo);
    }
    trigger.setAttribute('aria-label', (es ? 'Ampliar foto: ' : 'Powiększ zdjęcie: ') + photo.alt);
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      opener = trigger;
      show(index);
      viewer.showModal();
      document.body.classList.add('photo-viewer-open');
      close.focus();
    });
  });
  close.addEventListener('click', () => viewer.close());
  previous.addEventListener('click', () => show(current - 1));
  next.addEventListener('click', () => show(current + 1));
  viewer.addEventListener('click', (event) => { if (event.target === viewer) viewer.close(); });
  viewer.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      show(current + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });
  viewer.addEventListener('close', () => {
    document.body.classList.remove('photo-viewer-open');
    opener?.focus();
  });
}
