const setupOverlay = document.getElementById("setup-overlay");
const usernameInput = document.getElementById("username-input");
const saveUsernameBtn = document.getElementById("save-username");

const welcomeScreen = document.getElementById("welcome-screen");
const welcomeTitle = document.getElementById("welcome-title");
const welcomeMessage = document.getElementById("welcome-message");

const helloText = document.getElementById("hello-text");
const greetingText = document.getElementById("greeting-text");

const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");

const ipEl = document.getElementById("ip");
const networkStatus = document.getElementById("network-status");
const statusDot = document.getElementById("status-dot");

const aboutBtn = document.getElementById("about-btn");
const aboutModal = document.getElementById("about-modal");
const closeAbout = document.getElementById("close-about");

const backgrounds = [
    "images/bg1.webp",
    "images/bg2.webp",
    "images/bg3.webp",
    "images/bg4.webp"
];

document.addEventListener("DOMContentLoaded", () => {

    loadUser();

    updateClock();

    setInterval(updateClock, 1000);

    updateNetworkStatus();

    window.addEventListener("online", updateNetworkStatus);

    window.addEventListener("offline", updateNetworkStatus);

    loadIP();

    loadRandomBackground();

    initParallax();

    initAboutModal();

});

function loadUser() {

    chrome.storage.local.get(["username"], (result) => {

        if (!result.username) {

            setupOverlay.style.display = "flex";

            usernameInput.focus();

        } else {

            showWelcome(result.username);

        }

    });

}

saveUsernameBtn.addEventListener("click", saveUsername);

usernameInput.addEventListener("keydown", (e) => {

    if (e.key === "Enter") {

        saveUsername();

    }

});

function saveUsername() {

    const username = usernameInput.value.trim();

    if (!username) {

        usernameInput.focus();

        return;

    }

    chrome.storage.local.set({

        username: username

    }, () => {

        setupOverlay.style.display = "none";

        showWelcome(username);

    });

}

function showWelcome(username) {

    const hour = new Date().getHours();

    let title = "";
    let message = "";

    if (hour >= 5 && hour < 12) {

        title = `صبح بخیر ${username}`;

        message = "امروز فرصت تازه‌ای برای ساختن چیزهای بزرگه.";

    } else if (hour >= 12 && hour < 18) {

        title = `روز بخیر ${username}`;

        message = "وقتشه ایده‌هات رو به واقعیت تبدیل کنی.";

    } else {

        title = `شب بخیر ${username}`;

        message = "آروم جلو برو، ولی هیچ‌وقت متوقف نشو.";

    }

    helloText.textContent = `سلام ${username}`;

    greetingText.textContent = message;

    welcomeTitle.textContent = title;

    welcomeMessage.textContent = message;

    if (!sessionStorage.getItem("devmod_welcome")) {

        welcomeScreen.style.display = "flex";

        sessionStorage.setItem("devmod_welcome", "1");

        setTimeout(() => {

            welcomeScreen.style.display = "none";

        }, 2600);

    }

}

function updateClock() {

    const now = new Date();

    timeEl.textContent = now.toLocaleTimeString("fa-IR", {

        hour: "2-digit",
        minute: "2-digit"

    });

    dateEl.textContent = now.toLocaleDateString("fa-IR", {

        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"

    });

}

function updateNetworkStatus() {

    if (navigator.onLine) {

        networkStatus.textContent = "متصل";

        networkStatus.className = "status-online";

        statusDot.style.background = "#22c55e";

        statusDot.style.boxShadow = "0 0 14px #22c55e";

    } else {

        networkStatus.textContent = "بدون اتصال";

        networkStatus.className = "status-offline";

        statusDot.style.background = "#ef4444";

        statusDot.style.boxShadow = "0 0 14px #ef4444";

    }

}
async function loadIP() {

    try {

        const response = await fetch("https://api.ipify.org?format=json");

        const data = await response.json();

        ipEl.textContent = `IP: ${data.ip}`;

    } catch {

        ipEl.textContent = "IP: نامشخص";

    }

}

function loadRandomBackground() {

    const savedBackground = sessionStorage.getItem("devmod_background");

    if (savedBackground) {

        document.body.style.backgroundImage =
            `url("${savedBackground}")`;

        return;

    }

    const randomIndex = Math.floor(
        Math.random() * backgrounds.length
    );

    const selectedBackground = backgrounds[randomIndex];

    document.body.style.backgroundImage =
        `url("${selectedBackground}")`;

    sessionStorage.setItem(
        "devmod_background",
        selectedBackground
    );

}

function initParallax() {

    document.body.classList.add("parallax");

    document.addEventListener("mousemove", (e) => {

        const x =
            (e.clientX / window.innerWidth - 0.5) * 16;

        const y =
            (e.clientY / window.innerHeight - 0.5) * 16;

        document.body.style.backgroundPosition =
            `${50 + x}% ${50 + y}%`;

        document.body.style.backgroundSize =
            "112%";

    });

    document.addEventListener("mouseleave", () => {

        document.body.style.backgroundPosition =
            "center";

        document.body.style.backgroundSize =
            "110%";

    });

}

function initAboutModal() {

    aboutBtn.addEventListener("click", () => {

        aboutModal.style.display = "flex";

        document.body.style.overflow = "hidden";

    });

    closeAbout.addEventListener("click", closeAboutModal);

    aboutModal.addEventListener("click", (e) => {

        if (e.target === aboutModal) {

            closeAboutModal();

        }

    });

    document.addEventListener("keydown", (e) => {

        if (
            e.key === "Escape" &&
            aboutModal.style.display === "flex"
        ) {

            closeAboutModal();

        }

    });

}

function closeAboutModal() {

    aboutModal.style.display = "none";

    document.body.style.overflow = "";

}