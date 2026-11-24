// =========================
// FRIENDS IN SYNC
// Website interactions
// =========================

// =========================
// EMAILJS INITIALISATION
// =========================

emailjs.init({
    publicKey: "qnGDEyFB-9Ib0nC5q"
});
// =========================
// MOBILE MENU
// =========================

const menuToggle = document.querySelector(".menu-toggle");

const fullscreenMenu =
    document.querySelector(".fullscreen-menu");

const menuLinks =
    document.querySelectorAll(".mobile-nav a");


menuToggle.addEventListener("click", function() {

    fullscreenMenu.classList.toggle("active");

    menuToggle.classList.toggle("active");

});


menuLinks.forEach(function(link) {

    link.addEventListener("click", function() {

        fullscreenMenu.classList.remove("active");

        menuToggle.classList.remove("active");

    });

});

const livePlayer = document.querySelector(".live-player");
const liveVideo = document.querySelector(".live-video");
const livePlayButton = document.querySelector(".live-play-button");
const liveOverlay = document.querySelector(".live-overlay");

// Play and pause
livePlayButton.addEventListener("click", async function () {
    if (liveVideo.paused) {
        try {
            await liveVideo.play();
        } catch (error) {
            console.error("Video playback failed:", error);
            liveOverlay.style.opacity = "1";
        }
    } else {
        liveVideo.pause();
    }
});
// Tap video display to play or pause
liveVideo.addEventListener("click", function () {
    if (liveVideo.paused) {
        liveVideo.play().catch(error => {
            console.error("Video playback failed:", error);
        });
    } else {
        liveVideo.pause();
    }
});

// Hide overlay when video plays
liveVideo.addEventListener("playing", function () {
    liveOverlay.style.opacity = "0";
    liveOverlay.style.pointerEvents = "none";
});

// Restore overlay when video pauses
liveVideo.addEventListener("pause", function () {
    liveOverlay.style.opacity = "1";
});

// Restore overlay when video finishes
liveVideo.addEventListener("ended", function () {
    liveOverlay.style.opacity = "1";
    liveOverlay.style.pointerEvents = "auto";
});

// Handle missing or unavailable video
liveVideo.addEventListener("error", function () {
    liveOverlay.style.opacity = "1";
    livePlayButton.textContent = "↻";
    livePlayButton.setAttribute("aria-label", "Video unavailable");
    console.error("Live performance video is unavailable.");
});

// Check whether a video source exists
if (!liveVideo.querySelector("source")?.getAttribute("src")) {
    livePlayButton.disabled = true;
    livePlayButton.textContent = "—";
    livePlayButton.setAttribute("aria-label", "No video available yet");
}
// =========================
// BOOKING FORM
// EMAILJS INTEGRATION
// =========================

const bookingForm =
    document.querySelector(".booking-form");

    // Prevent customers from selecting past event dates
const eventDateInput = document.querySelector("#date");

const today = new Date();
const localToday = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
).toISOString().split("T")[0];

eventDateInput.min = localToday;

bookingForm.addEventListener("submit", async function(event) {

    event.preventDefault();
    
    // Reject submissions that trigger the honeypot
    const honeypotField = bookingForm.querySelector("#company");

    if (honeypotField.value.trim() !== "") {
        console.warn("Spam submission blocked.");
        return;
    }
    // Validate international phone number (optional field)
const phoneInput = document.querySelector("#phone");
let validatedPhone = "";

if (phoneInput.value.trim() !== "") {

    const parsedPhone =
        libphonenumber.parsePhoneNumberFromString(phoneInput.value);

    if (!parsedPhone || !parsedPhone.isValid()) {

        alert(
            "Please enter a valid international phone number, " +
            "including your country code (e.g. +27 or +44)."
        );

        phoneInput.focus();
        return;
    }

    validatedPhone = parsedPhone.formatInternational();
}
    const submitButton =
        bookingForm.querySelector(".submit-button");

    const originalButtonHTML = submitButton.innerHTML;

    const templateParams = {
        name: document.querySelector("#name").value,
        email: document.querySelector("#email").value,
        phone: validatedPhone,
        contact_method: document.querySelector("#contact-method").value,
        event: document.querySelector("#event").value,
        date: document.querySelector("#date").value,
        location: document.querySelector("#location").value,
        message: document.querySelector("#message").value
    };

    submitButton.disabled = true;
    submitButton.textContent = "SENDING...";

    try {

        await emailjs.send(
            "service_dawuyw5",
            "template_ivi050d",
            templateParams
        );

        alert(
            "Thank you! Your booking enquiry has been sent successfully. " +
            "Friends In Sync will be in touch."
        );

        bookingForm.reset();

    } catch (error) {

    console.error("Booking submission failed:", {
        status: error.status,
        text: error.text,
        message: error.message
    });

        alert(
            "Sorry, your enquiry could not be sent. " +
            "Please try again or contact us directly."
        );

    } finally {

        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonHTML;

    }

});