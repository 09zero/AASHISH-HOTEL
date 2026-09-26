/* =========================================================
   AASHISH HOTEL
   MAIN JAVASCRIPT
========================================================= */


/* =========================================================
   HELPER
========================================================= */

const $ = (selector) => {
    return document.querySelector(selector);
};

const $$ = (selector) => {
    return document.querySelectorAll(selector);
};


/* =========================================================
   ROOM DATA
========================================================= */

const roomData = {

    "Deluxe Room": {
        price: 4999,
        image:
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1400&q=85",
        description:
            "A comfortable modern room designed for relaxed short and long stays with thoughtful essentials.",
        guests: "2 Guests",
        bed: "King Bed",
        size: "32 m²",
        amenities:
            "Wi-Fi · Air Conditioning · Smart TV · Breakfast · Room Service"
    },

    "Executive Room": {
        price: 6499,
        image:
            "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1400&q=85",
        description:
            "Extra space and a dedicated work area for guests combining business with comfort.",
        guests: "2 Guests",
        bed: "King Bed",
        size: "38 m²",
        amenities:
            "Wi-Fi · Air Conditioning · Work Desk · Smart TV · Breakfast"
    },

    "Premium Suite": {
        price: 8999,
        image:
            "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=85",
        description:
            "A spacious premium suite featuring a separate living area for an elevated stay.",
        guests: "3 Guests",
        bed: "King Bed",
        size: "52 m²",
        amenities:
            "Wi-Fi · Air Conditioning · Living Area · Smart TV · Breakfast"
    },

    "Family Suite": {
        price: 10999,
        image:
            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85",
        description:
            "Generous space designed for families travelling together with room to relax.",
        guests: "4 Guests",
        bed: "Twin + King",
        size: "65 m²",
        amenities:
            "Wi-Fi · Air Conditioning · Living Area · Smart TV · Breakfast"
    }

};


/* =========================================================
   HEADER
========================================================= */

const siteHeader = $("#siteHeader");
const menuToggle = $("#menuToggle");
const mainNav = $("#mainNav");

if (menuToggle && mainNav) {

    menuToggle.addEventListener("click", () => {

        mainNav.classList.toggle("open");

    });

}


/* Close mobile menu after clicking link */

$$(".main-nav a").forEach((link) => {

    link.addEventListener("click", () => {

        mainNav.classList.remove("open");

    });

});


/* Header scroll effect */

window.addEventListener("scroll", () => {

    if (!siteHeader) return;

    if (window.scrollY > 50) {

        siteHeader.classList.add("scrolled");

    } else {

        siteHeader.classList.remove("scrolled");

    }

});


/* =========================================================
   HERO SLIDER
========================================================= */

const heroSlides = $$(".hero-slide");

let currentSlide = 0;

function showNextSlide() {

    if (!heroSlides.length) return;

    heroSlides[currentSlide].classList.remove("active");

    currentSlide =
        (currentSlide + 1) % heroSlides.length;

    heroSlides[currentSlide].classList.add("active");

}

if (heroSlides.length > 1) {

    setInterval(showNextSlide, 5000);

}


/* =========================================================
   DATE SETUP
========================================================= */

const checkIn = $("#checkIn");
const checkOut = $("#checkOut");
const contactDate = $("#contactDate");


function formatDateForInput(date) {

    const year = date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;

}


function addDays(date, days) {

    const result = new Date(date);

    result.setDate(
        result.getDate() + days
    );

    return result;

}


const today = new Date();

const todayString =
    formatDateForInput(today);

const tomorrowString =
    formatDateForInput(
        addDays(today, 1)
    );


if (checkIn) {

    checkIn.min = todayString;

    if (!checkIn.value) {

        checkIn.value = todayString;

    }

}


if (checkOut) {

    checkOut.min = tomorrowString;

    if (!checkOut.value) {

        checkOut.value = tomorrowString;

    }

}


if (contactDate) {

    contactDate.min = todayString;

}


/* Update checkout date */

if (checkIn && checkOut) {

    checkIn.addEventListener("change", () => {

        if (!checkIn.value) return;

        const selectedCheckIn =
            new Date(
                `${checkIn.value}T00:00:00`
            );

        const minimumCheckout =
            formatDateForInput(
                addDays(selectedCheckIn, 1)
            );

        checkOut.min = minimumCheckout;

        if (
            !checkOut.value ||
            checkOut.value <= checkIn.value
        ) {

            checkOut.value = minimumCheckout;

        }

    });

}


/* =========================================================
   BOOKING ELEMENTS
========================================================= */

const bookingForm = $("#bookingForm");
const roomSelect = $("#roomSelect");
const adults = $("#adults");
const children = $("#children");
const roomsCount = $("#roomsCount");

const bookingSummary = $("#bookingSummary");
const guestDetails = $("#guestDetails");

const summaryRoom = $("#summaryRoom");
const summaryDates = $("#summaryDates");
const summaryNights = $("#summaryNights");
const summaryGuests = $("#summaryGuests");
const summaryRooms = $("#summaryRooms");
const summaryPrice = $("#summaryPrice");
const summarySubtotal = $("#summarySubtotal");
const summaryTax = $("#summaryTax");
const summaryTotal = $("#summaryTotal");


let latestBooking = null;


/* =========================================================
   CALCULATE NIGHTS
========================================================= */

function calculateNights(
    checkInValue,
    checkOutValue
) {

    if (!checkInValue || !checkOutValue) {
        return 0;
    }

    const start =
        new Date(
            `${checkInValue}T00:00:00`
        );

    const end =
        new Date(
            `${checkOutValue}T00:00:00`
        );

    const difference =
        end.getTime() - start.getTime();

    const nights =
        Math.ceil(
            difference /
            (1000 * 60 * 60 * 24)
        );

    return nights;

}


/* =========================================================
   CURRENCY
========================================================= */

function formatCurrency(amount) {

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }
    ).format(amount);

}


/* =========================================================
   UPDATE BOOKING SUMMARY
========================================================= */

function updateBookingSummary() {

    const selectedRoom =
        roomSelect.value;

    const room =
        roomData[selectedRoom];

    if (!room) return;

    const nights =
        calculateNights(
            checkIn.value,
            checkOut.value
        );

    const adultsValue =
        Number(adults.value);

    const childrenValue =
        Number(children.value);

    const roomsValue =
        Number(roomsCount.value);

    const subtotal =
        room.price *
        Math.max(nights, 0) *
        roomsValue;

    const tax =
        Math.round(subtotal * 0.12);

    const total =
        subtotal + tax;


    latestBooking = {

        room: selectedRoom,

        checkIn: checkIn.value,

        checkOut: checkOut.value,

        nights,

        adults: adultsValue,

        children: childrenValue,

        rooms: roomsValue,

        price: room.price,

        subtotal,

        tax,

        total

    };


    summaryRoom.textContent =
        selectedRoom;

    summaryDates.textContent =
        `${checkIn.value} → ${checkOut.value}`;

    summaryNights.textContent =
        `${nights} Night${nights !== 1 ? "s" : ""}`;

    summaryGuests.textContent =
        `${adultsValue} Adult${adultsValue !== 1 ? "s" : ""} + ${childrenValue} Child${childrenValue !== 1 ? "ren" : ""}`;

    summaryRooms.textContent =
        `${roomsValue} Room${roomsValue !== 1 ? "s" : ""}`;

    summaryPrice.textContent =
        formatCurrency(room.price);

    summarySubtotal.textContent =
        formatCurrency(subtotal);

    summaryTax.textContent =
        formatCurrency(tax);

    summaryTotal.textContent =
        formatCurrency(total);

}


/* =========================================================
   BOOKING FORM
========================================================= */

if (bookingForm) {

    bookingForm.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            const nights =
                calculateNights(
                    checkIn.value,
                    checkOut.value
                );

            if (nights <= 0) {

                alert(
                    "Please select a valid check-in and check-out date."
                );

                return;

            }

            updateBookingSummary();

            bookingSummary.classList.add("show");

            guestDetails.classList.remove("show");

            bookingSummary.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }
    );

}


/* =========================================================
   GUEST DETAILS
========================================================= */

const proceedGuestBtn =
    $("#proceedGuestBtn");

if (proceedGuestBtn) {

    proceedGuestBtn.addEventListener(
        "click",
        () => {

            guestDetails.classList.add("show");

            guestDetails.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            setTimeout(() => {

                const guestName =
                    $("#guestName");

                if (guestName) {
                    guestName.focus();
                }

            }, 500);

        }
    );

}


/* =========================================================
   GUEST FORM
========================================================= */

const guestDetailsForm =
    $("#guestDetailsForm");

const bookingSuccess =
    $("#bookingSuccess");


if (guestDetailsForm) {

    guestDetailsForm.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            if (!latestBooking) {

                alert(
                    "Please calculate your stay first."
                );

                return;

            }

            bookingSuccess.textContent =
                `Demo enquiry prepared successfully for ${latestBooking.room}. No reservation has been confirmed.`;

            bookingSuccess.classList.add("show");

            guestDetailsForm.reset();

            bookingSuccess.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });

        }
    );

}


/* =========================================================
   ROOM DETAILS MODAL
========================================================= */

const roomModal =
    $("#roomModal");

const modalOverlay =
    $("#modalOverlay");

const modalClose =
    $("#modalClose");

const modalRoomImage =
    $("#modalRoomImage");

const modalRoomName =
    $("#modalRoomName");

const modalRoomPrice =
    $("#modalRoomPrice");

const modalRoomDescription =
    $("#modalRoomDescription");

const modalGuests =
    $("#modalGuests");

const modalBed =
    $("#modalBed");

const modalSize =
    $("#modalSize");

const modalAmenities =
    $("#modalAmenities");

const modalBookButton =
    $("#modalBookButton");


let selectedModalRoom = null;


function openRoomModal(roomName) {

    const room =
        roomData[roomName];

    if (!room || !roomModal) return;

    selectedModalRoom =
        roomName;

    modalRoomImage.src =
        room.image;

    modalRoomImage.alt =
        roomName;

    modalRoomName.textContent =
        roomName;

    modalRoomPrice.textContent =
        formatCurrency(room.price);

    modalRoomDescription.textContent =
        room.description;

    modalGuests.textContent =
        room.guests;

    modalBed.textContent =
        room.bed;

    modalSize.textContent =
        room.size;

    modalAmenities.textContent =
        room.amenities;

    roomModal.classList.add("show");

    roomModal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow =
        "hidden";

}


function closeRoomModal() {

    if (!roomModal) return;

    roomModal.classList.remove("show");

    roomModal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow =
        "";

}


$$(".view-room").forEach((button) => {

    button.addEventListener(
        "click",
        () => {

            openRoomModal(
                button.dataset.room
            );

        }
    );

});


$$(".book-room").forEach((button) => {

    button.addEventListener(
        "click",
        () => {

            const roomName =
                button.dataset.room;

            if (roomSelect) {

                roomSelect.value =
                    roomName;

            }

            closeRoomModal();

            const booking =
                $("#booking");

            if (booking) {

                booking.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        }
    );

});


if (modalClose) {

    modalClose.addEventListener(
        "click",
        closeRoomModal
    );

}


if (modalOverlay) {

    modalOverlay.addEventListener(
        "click",
        closeRoomModal
    );

}


document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape" &&
            roomModal.classList.contains("show")
        ) {

            closeRoomModal();

        }

    }
);


/* Modal book button */

if (modalBookButton) {

    modalBookButton.addEventListener(
        "click",
        () => {

            if (!selectedModalRoom) {
                return;
            }

            if (roomSelect) {

                roomSelect.value =
                    selectedModalRoom;

            }

            closeRoomModal();

            const booking =
                $("#booking");

            if (booking) {

                booking.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        }
    );

}


/* =========================================================
   CONTACT / CONNECT FORM
========================================================= */

const contactForm =
    $("#contactForm");

const contactSuccess =
    $("#contactSuccess");


if (contactForm) {

    contactForm.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            const name =
                $("#contactName").value.trim();

            const inquiry =
                $("#inquiryType").value;

            contactSuccess.textContent =
                `Thank you, ${name}. Your ${inquiry.toLowerCase()} enquiry has been prepared successfully. This is a demo form and is not connected to a live inbox yet.`;

            contactSuccess.classList.add("show");

            contactForm.reset();

        }
    );

}


/* =========================================================
   SMOOTH ANCHOR LINKS
========================================================= */

$$('a[href^="#"]').forEach((link) => {

    link.addEventListener(
        "click",
        (event) => {

            const targetId =
                link.getAttribute("href");

            if (
                !targetId ||
                targetId === "#"
            ) {
                return;
            }

            const target =
                document.querySelector(
                    targetId
                );

            if (!target) {
                return;
            }

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }
    );

});


/* =========================================================
   INITIAL SUMMARY VALUES
========================================================= */

if (
    roomSelect &&
    checkIn &&
    checkOut
) {

    updateBookingSummary();

}


/* =========================================================
   CONSOLE MESSAGE
========================================================= */

console.log(
    "AASHISH HOTEL — Frontend demo loaded successfully."
);