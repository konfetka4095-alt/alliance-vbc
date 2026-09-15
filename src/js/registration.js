const ALLIANCE_REGISTRATION_ENDPOINT =
  window.ALLIANCE_REGISTRATION_CONFIG?.endpoint || "";


/*
 * Interactive Registration Wizard
 * Alliance Volleyball Club
 */
const RegistrationModule = {

  currentStep: 1,

  selectedCategory: "15u",

  submitting: false,

  requestId: null,

  formData: {
    category: "Rep Tryouts",
    division: "14U Girls (Born 2013)",
    athleteName: "",
    athleteDob: "",
    athletePosition: "Setter",
    experienceYears: "2",
    parentName: "",
    parentEmail: "",
    parentPhone: "",
    comments: ""
  },


  init() {
    this.bindEvents();
  },


  bindEvents() {

    /* Open registration modal */

    document
      .querySelectorAll(
        "[data-open-reg]"
      )
      .forEach(btn => {

        btn.addEventListener(
          "click",
          e => {

            e.preventDefault();

            const preselected =
              btn.getAttribute(
                "data-program-type"
              ) || "tryouts";

            this.openModal(
              preselected
            );
          }
        );
      });


    /* Close modal */

    const modalBackdrop =
      document.getElementById(
        "registrationModal"
      );

    const closeBtn =
      document.getElementById(
        "regModalClose"
      );


    if (closeBtn) {

      closeBtn.addEventListener(
        "click",
        () => this.closeModal()
      );
    }


    if (modalBackdrop) {

      modalBackdrop.addEventListener(
        "click",
        e => {

          if (
            e.target ===
            modalBackdrop
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
          this.submitRegistration(
            e
          )
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
              .forEach(c =>
                c.classList.remove(
                  "selected"
                )
              );


            card.classList.add(
              "selected"
            );


            this.selectedCategory =
              card.getAttribute(
                "data-cat-value"
              );


            const program =
              window
                .ALLIANCE_PROGRAMS[
                  this.selectedCategory
                ];


            if (program) {

              this.formData.category =
                program.category;

            }


            /*
             * A new category must receive
             * a new request ID.
             */
            this.requestId =
              null;


            document
              .querySelectorAll(
                ".reg-cat-card"
              )
              .forEach(c =>
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


  openModal(
    categoryKey = "tryouts"
  ) {

    this.currentStep = 1;

    categoryKey =
      window.ALLIANCE_PROGRAMS[
        categoryKey
      ]
        ? categoryKey
        : "15u";


    this.selectedCategory =
      categoryKey;


    this.requestId =
      null;


    this.submitting =
      false;


    const submit =
      document.getElementById(
        "regSubmitBtn"
      );


    if (submit) {

      submit.disabled =
        false;

      submit.textContent =
        "Complete Registration ✓";
    }


    document
      .querySelectorAll(
        ".reg-cat-card"
      )
      .forEach(card => {

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
      });


    const program =
      window
        .ALLIANCE_PROGRAMS[
          categoryKey
        ];


    if (program) {

      this.formData.category =
        program.category;
    }


    this.updateDivisions();

    this.renderStep(1);


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


  closeModal() {

    if (this.submitting) {
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


  nextStep() {

    if (
      this.currentStep === 1
    ) {

      this.currentStep = 2;

    } else if (
      this.currentStep === 2
    ) {

      const athleteName =
        document
          .getElementById(
            "regAthleteName"
          )
          .value
          .trim();


      const athleteDob =
        document
          .getElementById(
            "regAthleteDob"
          )
          .value;


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


      this.formData.division =
        document
          .getElementById(
            "regDivisionSelect"
          )
          .value;


      this.formData.athletePosition =
        document
          .getElementById(
            "regAthletePos"
          )
          .value;


      this.formData.experienceYears =
        document
          .getElementById(
            "regAthleteExp"
          )
          .value;


      this.currentStep = 3;


    } else if (
      this.currentStep === 3
    ) {

      const parentName =
        document
          .getElementById(
            "regParentName"
          )
          .value
          .trim();


      const parentEmail =
        document
          .getElementById(
            "regParentEmail"
          )
          .value
          .trim();


      const parentPhone =
        document
          .getElementById(
            "regParentPhone"
          )
          .value
          .trim();


      const emailInput =
        document.getElementById(
          "regParentEmail"
        );


      if (
        !parentName ||
        !parentEmail ||
        !parentPhone ||
        !emailInput.checkValidity()
      ) {

        alert(
          "Please fill in parent/guardian contact details."
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
        document
          .getElementById(
            "regComments"
          )
          .value
          .trim();


      this.populateReview();


      this.currentStep = 4;
    }


    this.renderStep(
      this.currentStep
    );
  },


  prevStep() {

    if (
      this.currentStep > 1
    ) {

      this.currentStep--;

      this.renderStep(
        this.currentStep
      );
    }
  },


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
      .forEach(view => {

        view.style.display =
          "none";
      });


    const currentView =
      document.getElementById(
        `regStepView${step}`
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

      const ind =
        document.getElementById(
          `regInd${i}`
        );


      if (!ind) {
        continue;
      }


      ind.classList.remove(
        "active",
        "completed"
      );


      if (i === step) {

        ind.classList.add(
          "active"
        );

      } else if (
        i < step
      ) {

        ind.classList.add(
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


  sessionMarkup() {

    const p =
      window.ALLIANCE_PROGRAMS[
        this.selectedCategory
      ];


    if (!p) {
      return "";
    }


    return (

      `<strong>${p.name}</strong>` +

      `<p>${p.date}<br>${p.time}</p>` +

      `<p>${p.venue}<br>${p.address}</p>` +

      (
        p.entrance
          ? `<div class="entrance-note">${p.entrance}</div>`
          : ""
      ) +

      `<p>${p.payment}</p>`
    );
  },


  updateDivisions() {

    const p =
      window.ALLIANCE_PROGRAMS[
        this.selectedCategory
      ];


    if (!p) {
      return;
    }


    const select =
      document.getElementById(
        "regDivisionSelect"
      );


    if (select) {

      select.replaceChildren(
        new Option(
          p.name,
          p.name
        )
      );
    }


    this.formData.division =
      p.name;


    const summary =
      document.getElementById(
        "regSessionSummary"
      );


    if (summary) {

      summary.innerHTML =
        this.sessionMarkup();
    }
  },


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

        const el =
          document.getElementById(
            id
          );


        if (el) {

          el.textContent =
            value || "";
        }
      }
    );
  },


  /*
   * --------------------------------------------------
   * SUBMIT REGISTRATION
   * --------------------------------------------------
   */
  async submitRegistration(e) {

    e.preventDefault();


    if (this.submitting) {
      return;
    }


    if (
      !ALLIANCE_REGISTRATION_ENDPOINT
    ) {

      alert(
        "Online registration is being updated. Please contact info@alliancevbc.ca to register."
      );

      return;
    }


    this.submitting =
      true;


    /*
     * Keep the same request ID if the
     * browser has to retry/read the response.
     */
    this.requestId =
      this.requestId ||
      crypto.randomUUID();


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


    const payload =
      new URLSearchParams({

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
      });


    try {

      console.log(
        "Submitting Alliance registration:",
        {
          programId:
            this.selectedCategory,

          requestId:
            this.requestId
        }
      );


      const response =
        await fetch(
          ALLIANCE_REGISTRATION_ENDPOINT,
          {
            method:
              "POST",

            body:
              payload,

            redirect:
              "follow",

            cache:
              "no-store"
          }
        );


      /*
       * Some Apps Script responses can take
       * a little longer to become readable.
       *
       * Read as TEXT first instead of calling
       * response.json() directly.
       */
      const rawText =
        await response.text();


      console.log(
        "Alliance registration HTTP status:",
        response.status
      );


      console.log(
        "Alliance registration raw response:",
        rawText
      );


      let result = null;


      try {

        result =
          JSON.parse(
            rawText
          );

      } catch (
        parseError
      ) {

        console.error(
          "Could not parse Apps Script response:",
          parseError
        );


        /*
         * IMPORTANT:
         *
         * At this point the POST may already have
         * been saved successfully.
         *
         * Do NOT immediately tell the parent
         * that the registration failed.
         *
         * The same requestId prevents duplicates
         * if the user submits again.
         */
        throw new Error(
          "The registration server responded with an unreadable response."
        );
      }


      if (
        !response.ok ||
        !result ||
        !result.ok
      ) {

        throw new Error(
          (
            result &&
            result.error
          ) ||
          "Registration was not saved."
        );
      }


      /*
       * SUCCESS
       */
      const emailStatus =
        result.emailStatus ||
        "pending";


      const emailStatusEl =
        document.getElementById(
          "confirmationEmailStatus"
        );


      if (emailStatusEl) {

        emailStatusEl.textContent =
          emailStatus === "sent"

            ? "Your confirmation email has been sent. Please check your inbox and spam folder."

            : "Your registration has been saved. Your confirmation email is being processed. Please check your inbox shortly.";
      }


      const successName =
        document.getElementById(
          "confirmAthleteName"
        );


      if (successName) {

        successName.textContent =
          this.formData
            .athleteName;
      }


      this.currentStep =
        5;


      this.renderStep(5);


    } catch (error) {

      console.error(
        "Registration submission failed:",
        error
      );


      /*
       * IMPORTANT:
       *
       * If the server may have received the
       * POST but the browser couldn't read the
       * response, do not encourage the parent
       * to immediately submit another form.
       */
      const message =
        String(
          error?.message ||
            ""
        );


      if (
        message.includes(
          "unreadable response"
        )
      ) {

        alert(
          "Your registration may already have been saved. Please do not submit it again yet. Check for the confirmation email or contact info@alliancevbc.ca."
        );

      } else {

        alert(
          "Registration could not be submitted. Please try again or contact Alliance directly."
        );
      }


      if (submitBtn) {

        submitBtn.innerHTML =
          originalText;

        submitBtn.disabled =
          false;
      }

    } finally {

      this.submitting =
        false;
    }
  }
};


window.RegistrationModule =
  RegistrationModule;
