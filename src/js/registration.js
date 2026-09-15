```javascript
const ALLIANCE_REGISTRATION_ENDPOINT =
  window.ALLIANCE_REGISTRATION_CONFIG?.endpoint || "";


/* =========================================================
   REGISTRATION MODULE
   ========================================================= */

const RegistrationModule = {

  currentStep: 1,

  selectedCategory: "15u",

  submitting: false,

  requestId: null,

  formData: {
    category: "Rep Tryouts",
    division: "",
    athleteName: "",
    athleteDob: "",
    athletePosition: "Setter",
    experienceYears: "2",
    parentName: "",
    parentEmail: "",
    parentPhone: "",
    comments: ""
  },


  /* =======================================================
     INIT
     ======================================================= */

  init() {
    this.bindEvents();
  },


  /* =======================================================
     EVENTS
     ======================================================= */

  bindEvents() {

    /* Open registration */

    document
      .querySelectorAll("[data-open-reg]")
      .forEach(btn => {

        btn.addEventListener(
          "click",
          e => {

            e.preventDefault();

            const preselected =
              btn.getAttribute(
                "data-program-type"
              ) || "15u";

            this.openModal(
              preselected
            );
          }
        );
      });


    /* Close modal */

    const closeBtn =
      document.getElementById(
        "regModalClose"
      );

    const modal =
      document.getElementById(
        "registrationModal"
      );


    if (closeBtn) {

      closeBtn.addEventListener(
        "click",
        () => this.closeModal()
      );
    }


    if (modal) {

      modal.addEventListener(
        "click",
        e => {

          if (
            e.target === modal
          ) {

            this.closeModal();
          }
        }
      );
    }


    /* Wizard buttons */

    const nextBtn =
      document.getElementById(
        "regNextBtn"
      );

    const prevBtn =
      document.getElementById(
        "regPrevBtn"
      );

    const submitBtn =
      document.getElementById(
        "regSubmitBtn"
      );


    if (nextBtn) {

      nextBtn.addEventListener(
        "click",
        () => this.nextStep()
      );
    }


    if (prevBtn) {

      prevBtn.addEventListener(
        "click",
        () => this.prevStep()
      );
    }


    if (submitBtn) {

      submitBtn.addEventListener(
        "click",
        e =>
          this.submitRegistration(e)
      );
    }


    /* Category cards */

    document
      .querySelectorAll(
        ".reg-cat-card"
      )
      .forEach(card => {

        card.addEventListener(
          "click",
          () => {

            document
              .querySelectorAll(
                ".reg-cat-card"
              )
              .forEach(
                c =>
                  c.classList.remove(
                    "selected"
                  )
              );


            card.classList.add(
              "selected"
            );


            const category =
              card.getAttribute(
                "data-cat-value"
              );


            if (category) {

              this.selectedCategory =
                category;
            }


            const program =
              window.ALLIANCE_PROGRAMS?.[
                this.selectedCategory
              ];


            if (program) {

              this.formData.category =
                program.category;

              this.formData.division =
                program.name;
            }


            /*
             * A new category receives a new
             * registration ID.
             */
            this.requestId =
              null;


            document
              .querySelectorAll(
                ".reg-cat-card"
              )
              .forEach(
                c =>
                  c.setAttribute(
                    "aria-pressed",
                    String(
                      c === card
                    )
                  )
              );


            this.updateDivisions();
          }
        );
      });
  },


  /* =======================================================
     OPEN MODAL
     ======================================================= */

  openModal(
    categoryKey = "15u"
  ) {

    this.currentStep =
      1;

    this.submitting =
      false;

    this.requestId =
      null;


    if (
      !window.ALLIANCE_PROGRAMS?.[
        categoryKey
      ]
    ) {

      categoryKey =
        "15u";
    }


    this.selectedCategory =
      categoryKey;


    const program =
      window.ALLIANCE_PROGRAMS?.[
        categoryKey
      ];


    if (program) {

      this.formData.category =
        program.category;

      this.formData.division =
        program.name;
    }


    const submitBtn =
      document.getElementById(
        "regSubmitBtn"
      );


    if (submitBtn) {

      submitBtn.disabled =
        false;

      submitBtn.innerHTML =
        "Complete Registration ✓";
    }


    document
      .querySelectorAll(
        ".reg-cat-card"
      )
      .forEach(
        card => {

          const selected =
            card.getAttribute(
              "data-cat-value"
            ) ===
            categoryKey;


          card.setAttribute(
            "aria-pressed",
            String(selected)
          );


          if (selected) {

            card.classList.add(
              "selected"
            );

          } else {

            card.classList.remove(
              "selected"
            );
          }
        }
      );


    this.updateDivisions();

    this.renderStep(
      1
    );


    const modal =
      document.getElementById(
        "registrationModal"
      );


    if (modal) {

      modal.classList.add(
        "open"
      );
    }


    document.body.style.overflow =
      "hidden";
  },


  /* =======================================================
     CLOSE MODAL
     ======================================================= */

  closeModal() {

    if (
      this.submitting
    ) {
      return;
    }


    const modal =
      document.getElementById(
        "registrationModal"
      );


    if (modal) {

      modal.classList.remove(
        "open"
      );
    }


    document.body.style.overflow =
      "";
  },


  /* =======================================================
     NEXT STEP
     ======================================================= */

  nextStep() {

    /* STEP 1 → STEP 2 */

    if (
      this.currentStep ===
      1
    ) {

      this.currentStep =
        2;
    }


    /* STEP 2 → STEP 3 */

    else if (
      this.currentStep ===
      2
    ) {

      const nameInput =
        document.getElementById(
          "regAthleteName"
        );

      const dobInput =
        document.getElementById(
          "regAthleteDob"
        );


      const athleteName =
        nameInput
          ? nameInput.value.trim()
          : "";


      const athleteDob =
        dobInput
          ? dobInput.value
          : "";


      if (
        !athleteName ||
        !athleteDob
      ) {

        alert(
          "Please provide the athlete's full name and date of birth."
        );

        return;
      }


      this.formData.athleteName =
        athleteName;

      this.formData.athleteDob =
        athleteDob;


      const division =
        document.getElementById(
          "regDivisionSelect"
        );

      const position =
        document.getElementById(
          "regAthletePos"
        );

      const experience =
        document.getElementById(
          "regAthleteExp"
        );


      if (division) {

        this.formData.division =
          division.value;
      }


      if (position) {

        this.formData.athletePosition =
          position.value;
      }


      if (experience) {

        this.formData.experienceYears =
          experience.value;
      }


      this.currentStep =
        3;
    }


    /* STEP 3 → STEP 4 */

    else if (
      this.currentStep ===
      3
    ) {

      const parentNameInput =
        document.getElementById(
          "regParentName"
        );

      const parentEmailInput =
        document.getElementById(
          "regParentEmail"
        );

      const parentPhoneInput =
        document.getElementById(
          "regParentPhone"
        );

      const commentsInput =
        document.getElementById(
          "regComments"
        );


      const parentName =
        parentNameInput
          ? parentNameInput.value.trim()
          : "";


      const parentEmail =
        parentEmailInput
          ? parentEmailInput.value.trim()
          : "";


      const parentPhone =
        parentPhoneInput
          ? parentPhoneInput.value.trim()
          : "";


      if (
        !parentName ||
        !parentEmail ||
        !parentPhone
      ) {

        alert(
          "Please fill in parent/guardian contact details."
        );

        return;
      }


      if (
        parentEmailInput &&
        !parentEmailInput.checkValidity()
      ) {

        alert(
          "Please provide a valid email address."
        );

        return;
      }


      this.formData.parentName =
        parentName;

      this.formData.parentEmail =
        parentEmail;

      this.formData.parentPhone =
        parentPhone;

      this.formData.comments =
        commentsInput
          ? commentsInput.value.trim()
          : "";


      this.populateReview();


      this.currentStep =
        4;
    }


    this.renderStep(
      this.currentStep
    );
  },


  /* =======================================================
     PREVIOUS STEP
     ======================================================= */

  prevStep() {

    if (
      this.currentStep > 1 &&
      this.currentStep < 5
    ) {

      this.currentStep--;

      this.renderStep(
        this.currentStep
      );
    }
  },


  /* =======================================================
     RENDER STEP
     ======================================================= */

  renderStep(step) {

    const container =
      document.querySelector(
        "#registrationModal .modal-container"
      );


    if (container) {

      container.scrollTop =
        0;
    }


    document
      .querySelectorAll(
        ".reg-step-view"
      )
      .forEach(
        view => {

          view.style.display =
            "none";
        }
      );

const currentView =
  document.getElementById(
    "regStepView" + step
  );

    if (currentView) {

      currentView.style.display =
        "block";
    }


    for (
      let i = 1;
      i <= 4;
      i++
    ) {

      const indicator =
        document.getElementById(
          `regInd${i}`
        );


      if (!indicator) {
        continue;
      }


      indicator.classList.remove(
        "active",
        "completed"
      );


      if (
        i === step
      ) {

        indicator.classList.add(
          "active"
        );

      } else if (
        i < step
      ) {

        indicator.classList.add(
          "completed"
        );
      }
    }


    const prevBtn =
      document.getElementById(
        "regPrevBtn"
      );

    const nextBtn =
      document.getElementById(
        "regNextBtn"
      );

    const submitBtn =
      document.getElementById(
        "regSubmitBtn"
      );


    if (prevBtn) {

      prevBtn.style.display =
        step === 1 ||
        step === 5
          ? "none"
          : "inline-flex";
    }


    if (nextBtn) {

      nextBtn.style.display =
        step >= 4
          ? "none"
          : "inline-flex";
    }


    if (submitBtn) {

      submitBtn.style.display =
        step === 4
          ? "inline-flex"
          : "none";
    }
  },


  /* =======================================================
     SESSION MARKUP
     ======================================================= */

  sessionMarkup() {

    const program =
      window.ALLIANCE_PROGRAMS?.[
        this.selectedCategory
      ];


    if (!program) {

      return "";
    }


    return (

      `<strong>${escapeHtml_(program.name)}</strong>` +

      `<p>${escapeHtml_(program.date)}<br>${escapeHtml_(program.time)}</p>` +

      `<p>${escapeHtml_(program.venue)}<br>${escapeHtml_(program.address)}</p>` +

      (
        program.entrance
          ? `<div class="entrance-note">${escapeHtml_(program.entrance)}</div>`
          : ""
      ) +

      `<p>${escapeHtml_(program.payment)}</p>`
    );
  },


  /* =======================================================
     UPDATE DIVISIONS
     ======================================================= */

  updateDivisions() {

    const program =
      window.ALLIANCE_PROGRAMS?.[
        this.selectedCategory
      ];


    if (!program) {
      return;
    }


    const select =
      document.getElementById(
        "regDivisionSelect"
      );


    if (select) {

      select.replaceChildren(
        new Option(
          program.name,
          program.name
        )
      );

      select.value =
        program.name;
    }


    this.formData.division =
      program.name;


    const summary =
      document.getElementById(
        "regSessionSummary"
      );


    if (summary) {

      summary.innerHTML =
        this.sessionMarkup();
    }
  },


  /* =======================================================
     REVIEW
     ======================================================= */

  populateReview() {

    const summary =
      document.getElementById(
        "revSessionSummary"
      );


    if (summary) {

      summary.innerHTML =
        this.sessionMarkup();
    }


    const fields = {

      revCategory:
        this.formData.category,

      revDivision:
        this.formData.division,

      revAthleteName:
        this.formData.athleteName,

      revAthleteDob:
        this.formData.athleteDob,

      revPosition:
        this.formData.athletePosition,

      revParentName:
        this.formData.parentName,

      revParentEmail:
        this.formData.parentEmail,

      revParentPhone:
        this.formData.parentPhone
    };


    Object.entries(
      fields
    ).forEach(
      ([id, value]) => {

        const element =
          document.getElementById(
            id
          );


        if (element) {

          element.textContent =
            value || "";
        }
      }
    );
  },


  /* =======================================================
     SUBMIT REGISTRATION
     SAFARI-SAFE VERSION
     ======================================================= */

  async submitRegistration(e) {

    e.preventDefault();


    if (this.submitting) {
      return;
    }


    if (!ALLIANCE_REGISTRATION_ENDPOINT) {

      alert(
        "Online registration is temporarily unavailable. Please contact info@alliancevbc.ca."
      );

      return;
    }


    if (
      !window.ALLIANCE_PROGRAMS?.[
        this.selectedCategory
      ]
    ) {

      alert(
        "Please select a registration program."
      );

      return;
    }


    this.submitting =
      true;


    /*
     * Create one registration ID
     * for the entire submission.
     */

    this.requestId =
      this.requestId ||
      (
        window.crypto &&
        typeof window.crypto.randomUUID ===
          "function"

          ? window.crypto.randomUUID()

          : "ALLIANCE-" +
            Date.now() +
            "-" +
            Math.random()
              .toString(36)
              .slice(2)
      );


    const submitBtn =
      document.getElementById(
        "regSubmitBtn"
      );


    const originalText =
      submitBtn
        ? submitBtn.innerHTML
        : "Complete Registration ✓";


    if (submitBtn) {

      submitBtn.innerHTML =
        "Submitting...";

      submitBtn.disabled =
        true;
    }


    /*
     * Build registration data.
     */

    const data = {

      formType:
        "registration",

      programId:
        this.selectedCategory,

      requestId:
        this.requestId,

      category:
        this.formData.category ||
        "",

      division:
        this.formData.division ||
        "",

      athleteName:
        this.formData.athleteName ||
        "",

      athleteDob:
        this.formData.athleteDob ||
        "",

      athletePosition:
        this.formData
          .athletePosition ||
        "",

      experienceYears:
        this.formData
          .experienceYears ||
        "",

      parentName:
        this.formData.parentName ||
        "",

      parentEmail:
        this.formData.parentEmail ||
        "",

      parentPhone:
        this.formData.parentPhone ||
        "",

      comments:
        this.formData.comments ||
        "",

      website:
        "",

      sourceUrl:
        window.location.href
    };


    /* =====================================================
       CREATE HIDDEN IFRAME
       ===================================================== */

    const iframeName =
      "allianceRegistrationFrame_" +
      Date.now();


    const iframe =
      document.createElement(
        "iframe"
      );


    iframe.name =
      iframeName;

    iframe.id =
      iframeName;

    iframe.style.position =
      "fixed";

    iframe.style.width =
      "1px";

    iframe.style.height =
      "1px";

    iframe.style.border =
      "0";

    iframe.style.opacity =
      "0";

    iframe.style.pointerEvents =
      "none";

    iframe.setAttribute(
      "aria-hidden",
      "true"
    );


    /* =====================================================
       CREATE REAL HTML FORM
       ===================================================== */

    const form =
      document.createElement(
        "form"
      );


    form.method =
      "POST";

    form.action =
      ALLIANCE_REGISTRATION_ENDPOINT;

    form.target =
      iframeName;

    form.style.display =
      "none";


    Object.entries(
      data
    ).forEach(
      ([name, value]) => {

        const input =
          document.createElement(
            "input"
          );


        input.type =
          "hidden";

        input.name =
          name;

        input.value =
          String(
            value
          );


        form.appendChild(
          input
        );
      }
    );


    /*
     * Append both elements before submitting.
     */

    document.body.appendChild(
      iframe
    );

    document.body.appendChild(
      form
    );


    /* =====================================================
       SUBMISSION STATE
       ===================================================== */

    let finished =
      false;

    let submitted =
      false;

    let fallbackTimer = null;


    const cleanup =
      () => {

        setTimeout(
          () => {

            if (
              iframe &&
              iframe.parentNode
            ) {

              iframe.parentNode.removeChild(
                iframe
              );
            }


            if (
              form &&
              form.parentNode
            ) {

              form.parentNode.removeChild(
                form
              );
            }

          },
          1000
        );
      };


    const finishSuccess =
      message => {

        if (finished) {
          return;
        }


        finished =
          true;


        if (fallbackTimer) {

          clearTimeout(
            fallbackTimer
          );
        }


        this.submitting =
          false;


        /*
         * Show actual athlete name.
         */

        const successName =
          document.getElementById(
            "confirmAthleteName"
          );


        if (successName) {

          successName.textContent =
            this.formData.athleteName;
        }


        /*
         * Show confirmation message.
         */

        const statusElement =
          document.getElementById(
            "confirmationEmailStatus"
          );


        if (statusElement) {

          statusElement.textContent =
            message;
        }


        /*
         * Move to success screen.
         */

        this.currentStep =
          5;


        this.renderStep(
          5
        );


        if (submitBtn) {

          submitBtn.disabled =
            false;

          submitBtn.innerHTML =
            originalText;
        }


        cleanup();
      };


    /* =====================================================
       IFRAME LOAD HANDLER
       ===================================================== */

    const handleIframeLoad =
      () => {

        /*
         * Ignore the iframe's initial blank load.
         */

        if (!submitted) {
          return;
        }


        finishSuccess(
          "Your registration has been saved. Your confirmation email is being processed."
        );
      };


    iframe.addEventListener(
      "load",
      handleIframeLoad
    );


    /* =====================================================
       SUBMIT
       ===================================================== */

    try {

      /*
       * Mark as submitted immediately before
       * the actual form submission.
       */

      submitted =
        true;


      form.submit();


      /*
       * Safari fallback.
       *
       * The Apps Script backend saves the registration
       * before returning. We therefore avoid resubmitting.
       */

      fallbackTimer =
        setTimeout(
          () => {

            if (finished) {
              return;
            }


            finishSuccess(
              "Your registration has been submitted and is being processed. Please check your email shortly."
            );

          },
          10000
        );

    } catch (error) {

      if (fallbackTimer) {

        clearTimeout(
          fallbackTimer
        );
      }


      console.error(
        "Alliance registration form submission failed:",
        error
      );


      this.submitting =
        false;


      if (submitBtn) {

        submitBtn.disabled =
          false;

        submitBtn.innerHTML =
          originalText;
      }


      cleanup();


      alert(
        "Registration could not be submitted. Please contact Alliance directly."
      );
    }
  }
};


/* =========================================================
   HTML ESCAPING
   ========================================================= */

function escapeHtml_(value) {

  return String(
    value ?? ""
  ).replace(
    /[&<>"']/g,
    char =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[char])
  );
}


/* =========================================================
   GLOBAL
   ========================================================= */

window.RegistrationModule =
  RegistrationModule;
```
