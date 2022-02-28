export function scrollToSection(sections, sectionTitle) {
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  sections[sections.findIndex((section) => section.panel === sectionTitle)].isOpened = true;
}

// add  your util fn below
