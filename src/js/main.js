// Google Apps Script endpoint for contact submissions
const ALLIANCE_CONTACT_ENDPOINT =
  "https://script.google.com/macros/s/AKfycby1DLrLFTpxZRFeOqxtIFBNTnwLZJC8rAq2bMRrurbvZMv0GC2NY5m2Q68SLFtLN_uI/exec";



// Main Orchestration & Global UI interactions

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Modules
  if (window.RouterModule) window.RouterModule.init();
  if (window.RegistrationModule) window.RegistrationModule.init();
  if (window.ScheduleModule) window.ScheduleModule.init();
  if (window.FaqModule) window.FaqModule.init();

    /* Program skills: expanded desktop, collapsed mobile */
  const programDropdownMedia = window.matchMedia('(max-width: 640px)');

  const updateProgramDropdowns = (media) => {
    document
      .querySelectorAll('.program-skills-dropdown')
      .forEach((dropdown) => {
        if (media.matches) {
          dropdown.removeAttribute('open');
        } else {
          dropdown.setAttribute('open', '');
        }
      });
  };

  updateProgramDropdowns(programDropdownMedia);
  programDropdownMedia.addEventListener(
    'change',
    updateProgramDropdowns
  );

  // Mobile Navigation Drawer
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileNavDrawer');
  const drawerOverlay = document.getElementById('mobileDrawerOverlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .mobile-drawer-btn');

  function openMobileMenu() {
    mobileToggle.classList.add('open');
    mobileDrawer.classList.add('open');
    drawerOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileToggle.classList.remove('open');
    mobileDrawer.classList.remove('open');
    drawerOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      if (mobileDrawer.classList.contains('open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (drawerOverlay) drawerOverlay.addEventListener('click', closeMobileMenu);
  mobileNavLinks.forEach(link => link.addEventListener('click', closeMobileMenu));

  // Sticky Header Scroll effect
  const siteHeader = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  });

  // Contact Form Submission Handler
const contactForm =
  document.getElementById("contactUsForm");

const contactSuccess =
  document.getElementById("contactSuccessMsg");

if (contactForm) {
  contactForm.addEventListener(
    "submit",
    async (e) => {
      e.preventDefault();

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      const submitBtn =
        contactForm.querySelector(
          'button[type="submit"]'
        );

      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = "Sending Message...";
      submitBtn.disabled = true;

      const payload = new URLSearchParams({
        formType: "contact",

        name:
          document
            .getElementById("cntName")
            .value.trim(),

        email:
          document
            .getElementById("cntEmail")
            .value.trim(),

        phone:
          document
            .getElementById("cntPhone")
            .value.trim(),

        program:
          document
            .getElementById("cntSubject")
            .value,

        athlete:
          document
            .getElementById("cntAthlete")
            .value.trim(),

        message:
          document
            .getElementById("cntMsg")
            .value.trim(),

        website: "",
        sourceUrl: window.location.href
      });

      try {
        await fetch(
          ALLIANCE_CONTACT_ENDPOINT,
          {
            method: "POST",
            mode: "no-cors",
            body: payload
          }
        );

        contactForm.reset();

        if (contactSuccess) {
          contactSuccess.style.display = "block";

          setTimeout(() => {
            contactSuccess.style.display = "none";
          }, 6000);
        }

      } catch (error) {
        console.error(
          "Contact submission failed:",
          error
        );

        alert(
          "Your message could not be sent. Please try again or email us directly."
        );

      } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    }
  );
}
  
  // Newsletter Form Handler
  const newsForms = document.querySelectorAll('.newsletter-form');
  newsForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (input && input.value) {
        alert(`Thank you for subscribing! Updates will be sent to ${input.value}.`);
        form.reset();
      }
    });
  });
});
