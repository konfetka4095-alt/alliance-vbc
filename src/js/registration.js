var ALLIANCE_REGISTRATION_ENDPOINT = "";

if (
  window.ALLIANCE_REGISTRATION_CONFIG &&
  window.ALLIANCE_REGISTRATION_CONFIG.endpoint
) {
  ALLIANCE_REGISTRATION_ENDPOINT =
    window.ALLIANCE_REGISTRATION_CONFIG.endpoint;
}


/* =========================================================
   REGISTRATION MODULE
   ========================================================= */

var RegistrationModule = {

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
  init: function () {

    if (this._initialized) {
      return;
    }

    this._initialized = true;

    this.bindEvents();
  },

  /* =======================================================
     EVENTS
     ======================================================= */

  bindEvents: function () {

    var self = this;


    /* Open registration buttons */

    var openButtons =
      document.querySelectorAll("[data-open-reg]");


    for (var i = 0; i < openButtons.length; i++) {

      (function (btn) {

        btn.addEventListener("click", function (e) {

          e.preventDefault();

          var preselected =
            btn.getAttribute("data-program-type") ||
            "15u";

          self.openModal(preselected);

        });

      })(openButtons[i]);
    }


    /* Close modal */

    var closeBtn =
      document.getElementById("regModalClose");

    var modal =
      document.getElementById("registrationModal");


    if (closeBtn) {

      closeBtn.addEventListener(
        "click",
        function () {
          self.closeModal();
        }
      );
    }


    if (modal) {

      modal.addEventListener(
        "click",
        function (e) {

          if (e.target === modal) {
            self.closeModal();
          }

        }
      );
    }


    /* Wizard buttons */

    var nextBtn =
      document.getElementById("regNextBtn");

    var prevBtn =
      document.getElementById("regPrevBtn");

    var submitBtn =
      document.getElementById("regSubmitBtn");


    if (nextBtn) {

      nextBtn.addEventListener(
        "click",
        function () {
          self.nextStep();
        }
      );
    }


    if (prevBtn) {

      prevBtn.addEventListener(
        "click",
        function () {
          self.prevStep();
        }
      );
    }


    if (submitBtn) {

      submitBtn.addEventListener(
        "click",
        function (e) {
          self.submitRegistration(e);
        }
      );
    }


    /* Category cards */

    var categoryCards =
      document.querySelectorAll(".reg-cat-card");


    for (var j = 0; j < categoryCards.length; j++) {

      (function (card) {

        card.addEventListener(
          "click",
          function (e) {

            e.preventDefault();
            e.stopPropagation();

            var cards =
              document.querySelectorAll(".reg-cat-card");


            for (var x = 0; x < cards.length; x++) {

              cards[x].classList.remove("selected");

            }


            card.classList.add("selected");


            var category =
              card.getAttribute("data-cat-value");


            if (category) {
              self.selectedCategory = category;
            }


            var programs =
              window.ALLIANCE_PROGRAMS || {};

            var program =
              programs[self.selectedCategory];


            if (program) {

              self.formData.category =
                program.category;

              self.formData.division =
                program.name;
            }


            self.requestId = null;


            for (var y = 0; y < cards.length; y++) {

              cards[y].setAttribute(
                "aria-pressed",
                String(cards[y] === card)
              );
            }


            self.updateDivisions();

          }
        );

      })(categoryCards[j]);
    }
  },


  /* =======================================================
     OPEN MODAL
     ======================================================= */

  openModal: function (categoryKey) {

    if (!categoryKey) {
      categoryKey = "15u";
    }


    this.currentStep = 1;

    this.submitting = false;

    this.requestId = null;


    var programs =
      window.ALLIANCE_PROGRAMS || {};


    if (!programs[categoryKey]) {
      categoryKey = "15u";
    }


    this.selectedCategory =
      categoryKey;


    var program =
      programs[categoryKey];


    if (program) {

      this.formData.category =
        program.category;

      this.formData.division =
        program.name;
    }


    var submitBtn =
      document.getElementById("regSubmitBtn");


    if (submitBtn) {

      submitBtn.disabled = false;

      submitBtn.innerHTML =
        "Complete Registration ✓";
    }


    var cards =
      document.querySelectorAll(".reg-cat-card");


    for (var i = 0; i < cards.length; i++) {

      var selected =
        cards[i].getAttribute("data-cat-value") ===
        categoryKey;


      cards[i].setAttribute(
        "aria-pressed",
        String(selected)
      );


      if (selected) {
        cards[i].classList.add("selected");
      } else {
        cards[i].classList.remove("selected");
      }
    }


    this.updateDivisions();

    this.renderStep(1);


    var modal =
      document.getElementById("registrationModal");


    if (modal) {
      modal.classList.add("open");
    }


    document.body.style.overflow = "hidden";
  },


  /* =======================================================
     CLOSE MODAL
     ======================================================= */

  closeModal: function () {

    if (this.submitting) {
      return;
    }


    var modal =
      document.getElementById("registrationModal");


    if (modal) {
      modal.classList.remove("open");
    }


    document.body.style.overflow = "";
  },


  /* =======================================================
     NEXT STEP
     ======================================================= */

  nextStep: function () {

    /* STEP 1 -> STEP 2 */

    if (this.currentStep === 1) {

      this.currentStep = 2;

      this.renderStep(this.currentStep);

      return;
    }


    /* STEP 2 -> STEP 3 */

    if (this.currentStep === 2) {

      var nameInput =
        document.getElementById("regAthleteName");

      var dobInput =
        document.getElementById("regAthleteDob");


      var athleteName =
        nameInput
          ? nameInput.value.trim()
          : "";


      var athleteDob =
        dobInput
          ? dobInput.value
          : "";


      if (!athleteName || !athleteDob) {

        alert(
          "Please provide the athlete's full name and date of birth."
        );

        return;
      }


      this.formData.athleteName =
        athleteName;

      this.formData.athleteDob =
        athleteDob;


      var division =
        document.getElementById("regDivisionSelect");

      var position =
        document.getElementById("regAthletePos");

      var experience =
        document.getElementById("regAthleteExp");


      if (division) {
        this.formData.division = division.value;
      }


      if (position) {
        this.formData.athletePosition = position.value;
      }


      if (experience) {
        this.formData.experienceYears = experience.value;
      }


      this.currentStep = 3;

      this.renderStep(this.currentStep);

      return;
    }


    /* STEP 3 -> STEP 4 */

    if (this.currentStep === 3) {

      var parentNameInput =
        document.getElementById("regParentName");

      var parentEmailInput =
        document.getElementById("regParentEmail");

      var parentPhoneInput =
        document.getElementById("regParentPhone");

      var commentsInput =
        document.getElementById("regComments");


      var parentName =
        parentNameInput
          ? parentNameInput.value.trim()
          : "";


      var parentEmail =
        parentEmailInput
          ? parentEmailInput.value.trim()
          : "";


      var parentPhone =
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

      this.currentStep = 4;

      this.renderStep(this.currentStep);

      return;
    }
  },


  /* =======================================================
     PREVIOUS STEP
     ======================================================= */

  prevStep: function () {

    if (
      this.currentStep > 1 &&
      this.currentStep < 5
    ) {

      this.currentStep--;

      this.renderStep(this.currentStep);
    }
  },


  /* =======================================================
     RENDER STEP
     ======================================================= */

  renderStep: function (step) {

    var container =
      document.querySelector(
        "#registrationModal .modal-container"
      );


    if (container) {
      container.scrollTop = 0;
    }


    var views =
      document.querySelectorAll(".reg-step-view");


    for (var i = 0; i < views.length; i++) {

      views[i].style.display = "none";
    }


    /*
     * Plain string concatenation.
     * No template literals.
     */

    var currentView =
      document.getElementById(
        "regStepView" + step
      );


    if (currentView) {
      currentView.style.display = "block";
    }


    for (var j = 1; j <= 4; j++) {

      var indicator =
        document.getElementById(
          "regInd" + j
        );


      if (!indicator) {
        continue;
      }


      indicator.classList.remove(
        "active",
        "completed"
      );


      if (j === step) {

        indicator.classList.add("active");

      } else if (j < step) {

        indicator.classList.add("completed");
      }
    }


    var prevBtn =
      document.getElementById("regPrevBtn");

    var nextBtn =
      document.getElementById("regNextBtn");

    var submitBtn =
      document.getElementById("regSubmitBtn");


    if (prevBtn) {

      if (step === 1 || step === 5) {
        prevBtn.style.display = "none";
      } else {
        prevBtn.style.display = "inline-flex";
      }
    }


    if (nextBtn) {

      if (step >= 4) {
        nextBtn.style.display = "none";
      } else {
        nextBtn.style.display = "inline-flex";
      }
    }


    if (submitBtn) {

      if (step === 4) {
        submitBtn.style.display = "inline-flex";
      } else {
        submitBtn.style.display = "none";
      }
    }
  },


  /* =======================================================
     SESSION MARKUP
     ======================================================= */

  sessionMarkup: function () {

    var programs =
      window.ALLIANCE_PROGRAMS || {};

    var program =
      programs[this.selectedCategory];


    if (!program) {
      return "";
    }


    var html = "";


    html +=
      "<strong>" +
      escapeHtml_(program.name) +
      "</strong>";


    html +=
      "<p>" +
      escapeHtml_(program.date) +
      "<br>" +
      escapeHtml_(program.time) +
      "</p>";


    html +=
      "<p>" +
      escapeHtml_(program.venue) +
      "<br>" +
      escapeHtml_(program.address) +
      "</p>";


    if (program.entrance) {

      html +=
        "<div class=\"entrance-note\">" +
        escapeHtml_(program.entrance) +
        "</div>";
    }


    html +=
      "<p>" +
      escapeHtml_(program.payment) +
      "</p>";


    return html;
  },


  /* =======================================================
     UPDATE DIVISIONS
     ======================================================= */

  updateDivisions: function () {

    var programs =
      window.ALLIANCE_PROGRAMS || {};

    var program =
      programs[this.selectedCategory];


    if (!program) {
      return;
    }


    var select =
      document.getElementById("regDivisionSelect");


    if (select) {

      select.innerHTML = "";

      var option =
        document.createElement("option");


      option.value =
        program.name;

      option.textContent =
        program.name;


      select.appendChild(option);

      select.value =
        program.name;
    }


    this.formData.division =
      program.name;


    var summary =
      document.getElementById("regSessionSummary");


    if (summary) {

      summary.innerHTML =
        this.sessionMarkup();
    }
  },


  /* =======================================================
     REVIEW
     ======================================================= */

  populateReview: function () {

    var summary =
      document.getElementById("revSessionSummary");


    if (summary) {

      summary.innerHTML =
        this.sessionMarkup();
    }


    var fields = {

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


    for (
      var id in fields
    ) {

      if (!fields.hasOwnProperty(id)) {
        continue;
      }


      var element =
        document.getElementById(id);


      if (element) {

        element.textContent =
          fields[id] || "";
      }
    }
  },


  /* =======================================================
     SUBMIT REGISTRATION
     ======================================================= */

  submitRegistration: function (e) {

    e.preventDefault();


    var self = this;


    if (this.submitting) {
      return;
    }


    if (!ALLIANCE_REGISTRATION_ENDPOINT) {

      alert(
        "Online registration is temporarily unavailable. Please contact info@alliancevbc.ca."
      );

      return;
    }


    var programs =
      window.ALLIANCE_PROGRAMS || {};


    if (!programs[this.selectedCategory]) {

      alert(
        "Please select a registration program."
      );

      return;
    }


    this.submitting = true;


    /*
     * Registration ID
     */

    if (!this.requestId) {

      if (
        window.crypto &&
        window.crypto.randomUUID
      ) {

        this.requestId =
          window.crypto.randomUUID();

      } else {

        this.requestId =
          "ALLIANCE-" +
          Date.now() +
          "-" +
          Math.random()
            .toString(36)
            .substring(2);
      }
    }


    var submitBtn =
      document.getElementById("regSubmitBtn");


    var originalText =
      submitBtn
        ? submitBtn.innerHTML
        : "Complete Registration ✓";


    if (submitBtn) {

      submitBtn.innerHTML =
        "Submitting...";

      submitBtn.disabled = true;
    }


    /*
     * Build data
     */

    var data = {

      formType:
        "registration",

      programId:
        this.selectedCategory,

      requestId:
        this.requestId,

      category:
        this.formData.category || "",

      division:
        this.formData.division || "",

      athleteName:
        this.formData.athleteName || "",

      athleteDob:
        this.formData.athleteDob || "",

      athletePosition:
        this.formData.athletePosition || "",

      experienceYears:
        this.formData.experienceYears || "",

      parentName:
        this.formData.parentName || "",

      parentEmail:
        this.formData.parentEmail || "",

      parentPhone:
        this.formData.parentPhone || "",

      comments:
        this.formData.comments || "",

      website:
        "",

      sourceUrl:
        window.location.href
    };


    /*
     * IFRAME
     */

    var iframeName =
      "allianceRegistrationFrame_" +
      Date.now();


    var iframe =
      document.createElement("iframe");


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


    /*
     * FORM
     */

    var form =
      document.createElement("form");


    form.method =
      "POST";

    form.action =
      ALLIANCE_REGISTRATION_ENDPOINT;

    form.target =
      iframeName;

    form.style.display =
      "none";


    for (
      var name in data
    ) {

      if (!data.hasOwnProperty(name)) {
        continue;
      }


      var input =
        document.createElement("input");


      input.type =
        "hidden";

      input.name =
        name;

      input.value =
        String(data[name]);


      form.appendChild(input);
    }


    document.body.appendChild(iframe);

    document.body.appendChild(form);


    var finished =
      false;


    var fallbackTimer =
      null;


    function cleanup() {

      setTimeout(
        function () {

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
    }


    function finishSuccess(message) {

      if (finished) {
        return;
      }


      finished = true;


      if (fallbackTimer) {

        clearTimeout(
          fallbackTimer
        );
      }


      self.submitting = false;


      var successName =
        document.getElementById(
          "confirmAthleteName"
        );


      if (successName) {

        successName.textContent =
          self.formData.athleteName;
      }


      var statusElement =
        document.getElementById(
          "confirmationEmailStatus"
        );


      if (statusElement) {

        statusElement.textContent =
          message;
      }


      self.currentStep = 5;

      self.renderStep(5);


      if (submitBtn) {

        submitBtn.disabled = false;

        submitBtn.innerHTML =
          originalText;
      }


      cleanup();
    }


    /*
     * The iframe load is only used after the
     * actual form submission has started.
     */

    var submitted =
      false;


    iframe.addEventListener(
      "load",
      function () {

        if (!submitted) {
          return;
        }


        finishSuccess(
          "Your registration has been saved. Your confirmation email is being processed."
        );

      }
    );


    /*
     * SUBMIT
     */

    try {

      submitted = true;

      form.submit();


      /*
       * Safari fallback.
       * Do not submit twice.
       */

      fallbackTimer =
        setTimeout(
          function () {

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


      self.submitting = false;


      if (submitBtn) {

        submitBtn.disabled = false;

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

  if (value === null || value === undefined) {
    value = "";
  }


  return String(value).replace(
    /[&<>"']/g,
    function (char) {

      if (char === "&") {
        return "&amp;";
      }

      if (char === "<") {
        return "&lt;";
      }

      if (char === ">") {
        return "&gt;";
      }

      if (char === '"') {
        return "&quot;";
      }

      return "&#39;";
    }
  );
}


/* =========================================================
   GLOBAL
   ========================================================= */

window.RegistrationModule =
  RegistrationModule;


/* =========================================================
   AUTO INITIALIZE
   ========================================================= */

function initAllianceRegistration() {

  if (
    window.RegistrationModule &&
    typeof window.RegistrationModule.init === "function"
  ) {

    window.RegistrationModule.init();

  }
}


if (document.readyState === "loading") {

  document.addEventListener(
    "DOMContentLoaded",
    initAllianceRegistration
  );

} else {

  initAllianceRegistration();
}
