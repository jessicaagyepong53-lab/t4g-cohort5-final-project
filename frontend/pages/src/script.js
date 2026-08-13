document.addEventListener("DOMContentLoaded", () => {
    initLandingMobileNav();
    initDashboardSidebar();
    initLogout();
    initNotifications();
    initSearch();
    initUserFilters();
    initModalTriggers();
    initModalClosers();
    initUserDetailModal();
    initGenericModalForms();
    initProfileForm();
    initPasswordForm();
    initCancelButtons();
    initStatCountUp();
    initProgressBars();
    initManagementDate();
    initManagementGreeting();
    initActivityRefresh();
    initIconButtons();
    initPanelMoreButtons();
    initTableActions();
    initExtraProfileButtons();
    initMarkAsTaken();
    initPasswordToggles();
    initPasswordRequirements();
    initLoginForm();
    initSignupForm();
});

/* ==================== LANDING / ABOUT MOBILE NAV ==================== */

function initLandingMobileNav() {
    const btn = document.getElementById("mobileMenuBtn");
    const nav = document.getElementById("mobileNav");

    if (!btn || !nav) return;

    btn.addEventListener("click", () => {
        nav.classList.toggle("show");

        const icon = btn.querySelector("i");
        if (icon) {
            icon.classList.toggle("fa-bars");
            icon.classList.toggle("fa-xmark");
        }
    });

    nav.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => nav.classList.remove("show"));
    });
}

/* ==================== DASHBOARD SIDEBAR (MOBILE) ==================== */

function initDashboardSidebar() {
    const sidebar = document.getElementById("sidebar");
    const openBtn = document.getElementById("mobileSidebarBtn");
    const closeBtn = document.getElementById("sidebarClose");

    if (openBtn && sidebar) {
        openBtn.addEventListener("click", () => {
            sidebar.classList.add("sidebar-open");
        });
    }

    if (closeBtn && sidebar) {
        closeBtn.addEventListener("click", () => {
            sidebar.classList.remove("sidebar-open");
        });
    }

    document.addEventListener("click", event => {
        if (!sidebar || !sidebar.classList.contains("sidebar-open")) return;

        if (!sidebar.contains(event.target) && !openBtn?.contains(event.target)) {
            sidebar.classList.remove("sidebar-open");
        }
    });
}

/* ==================== LOGOUT ==================== */

function initLogout() {
    const logoutButtons = document.querySelectorAll("#logoutBtn, #profileLogoutBtn");

    logoutButtons.forEach(logoutBtn => {
        logoutBtn.addEventListener("click", event => {
            event.preventDefault();

            const confirmLogout = confirm("Are you sure you want to logout?");

            if (confirmLogout) {
                localStorage.removeItem("afraUser");
                localStorage.removeItem("afraManagement");
                window.location.href = "../../index.html";
            }
        });
    });
}

/* ==================== NOTIFICATIONS ==================== */

function initNotifications() {
    const notificationBtn = document.querySelector(".notification-btn");

    if (!notificationBtn) return;

    notificationBtn.addEventListener("click", () => {
        alert("You have new notifications.");
    });
}

/* ==================== SEARCH ==================== */

function initSearch() {
    const searchMap = {
        userSearch: { table: "usersTable", empty: "usersEmptyState" },
        testKitSearch: { table: "testKitsTable", empty: "testKitsEmptyState" },
        productSearch: { table: "productsTable", empty: "productsEmptyState" }
    };

    Object.keys(searchMap).forEach(inputId => {
        const input = document.getElementById(inputId);

        if (!input) return;

        const { table, empty } = searchMap[inputId];

        input.addEventListener("input", () => {
            filterTable(input, table, empty);
        });
    });
}

function filterTable(input, tableId, emptyId) {
    const table = document.getElementById(tableId);
    const emptyState = document.getElementById(emptyId);

    if (!table) return;

    const searchTerm = input.value.toLowerCase().trim();
    const rows = table.querySelectorAll("tr");
    let visibleRows = 0;

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const matches = text.includes(searchTerm);

        row.style.display = matches ? "" : "none";

        if (matches) visibleRows++;
    });

    if (emptyState) {
        emptyState.classList.toggle("show", visibleRows === 0);
    }
}

/* ==================== USER FILTERS (management/users.html) ==================== */

function initUserFilters() {
    const filterBtn = document.getElementById("userFilterBtn");
    const filterPanel = document.getElementById("userFilterPanel");
    const clearBtn = document.getElementById("clearUserFilters");

    if (filterBtn && filterPanel) {
        filterBtn.addEventListener("click", () => {
            filterPanel.classList.toggle("show");
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            const status = document.getElementById("userStatusFilter");
            const gender = document.getElementById("userGenderFilter");

            if (status) status.value = "all";
            if (gender) gender.value = "all";

            applyUserFilters();
        });
    }

    const statusFilter = document.getElementById("userStatusFilter");
    const genderFilter = document.getElementById("userGenderFilter");

    if (statusFilter) statusFilter.addEventListener("change", applyUserFilters);
    if (genderFilter) genderFilter.addEventListener("change", applyUserFilters);
}

function applyUserFilters() {
    const table = document.getElementById("usersTable");

    if (!table) return;

    const statusFilter = document.getElementById("userStatusFilter")?.value || "all";
    const genderFilter = document.getElementById("userGenderFilter")?.value || "all";
    const rows = table.querySelectorAll("tr");

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();

        const statusMatch = statusFilter === "all" || text.includes(statusFilter);
        const genderMatch = genderFilter === "all" || text.includes(genderFilter);

        row.style.display = statusMatch && genderMatch ? "" : "none";
    });
}

/* ==================== MODAL TRIGGERS (open) ==================== */

const modalTriggers = {
    addProductBtn: "productModal",
    addTestKitBtn: "testKitModal",
    addBirthControlBtn: "birthControlModal",
    editBirthControlBtn: "birthControlModal",
    addTestResultBtn: "testResultModal",
    editProfileBtn: "profileModal",
    changePasswordBtn: "passwordModal"
};

function initModalTriggers() {
    Object.keys(modalTriggers).forEach(btnId => {
        const btn = document.getElementById(btnId);
        const modal = document.getElementById(modalTriggers[btnId]);

        if (!btn || !modal) return;

        btn.addEventListener("click", () => {
            modal.classList.add("show");
        });
    });
}

/* ==================== MODAL CLOSERS ==================== */

function initModalClosers() {
    document.querySelectorAll(".modal-close").forEach(btn => {
        btn.addEventListener("click", () => {
            btn.closest(".modal-overlay")?.classList.remove("show");
        });
    });

    document.querySelectorAll(".modal-overlay").forEach(overlay => {
        overlay.addEventListener("click", event => {
            if (event.target === overlay) {
                overlay.classList.remove("show");
            }
        });
    });
}

function initCancelButtons() {
    document.querySelectorAll('[id^="cancel"]').forEach(btn => {
        btn.addEventListener("click", () => {
            const modal = btn.closest(".modal-overlay");

            if (modal) {
                modal.classList.remove("show");
            } else {
                window.location.reload();
            }
        });
    });
}

/* ==================== USER DETAIL MODAL (management/users.html) ==================== */

function initUserDetailModal() {
    const userModal = document.getElementById("userModal");

    document.querySelectorAll(".user-action-btn").forEach(button => {
        button.addEventListener("click", () => {
            const userName = button.dataset.user || "User";

            const modalName = document.getElementById("modalUserName");
            const displayName = document.getElementById("modalUserDisplayName");
            const avatar = document.getElementById("modalUserAvatar");

            if (modalName) modalName.textContent = userName;
            if (displayName) displayName.textContent = userName;

            if (avatar) {
                const initials = userName
                    .split(" ")
                    .map(name => name.charAt(0))
                    .join("")
                    .substring(0, 2)
                    .toUpperCase();

                avatar.textContent = initials;
            }

            userModal?.classList.add("show");
        });
    });

    document.getElementById("closeUserDetails")?.addEventListener("click", () => {
        userModal?.classList.remove("show");
    });
}

/* ==================== GENERIC MODAL FORM SUBMISSION ==================== */

function initGenericModalForms() {
    const customFormIds = new Set(["profileForm", "passwordForm"]);

    document.querySelectorAll(".modal form").forEach(form => {
        if (customFormIds.has(form.id)) return;

        form.addEventListener("submit", event => {
            event.preventDefault();
            alert("Saved successfully.");
            form.reset();
            form.closest(".modal-overlay")?.classList.remove("show");
        });
    });
}

/* ==================== PROFILE FORM (management page + user modal) ==================== */

function initProfileForm() {
    const form = document.getElementById("profileForm");

    if (!form) return;

    form.addEventListener("submit", event => {
        event.preventDefault();
        alert("Profile changes saved successfully.");

        const modal = form.closest(".modal-overlay");
        if (modal) modal.classList.remove("show");
    });
}

/* ==================== PASSWORD CHANGE FORM ==================== */

function initPasswordForm() {
    const form = document.getElementById("passwordForm");

    if (!form) return;

    form.addEventListener("submit", event => {
        event.preventDefault();

        const current = document.getElementById("currentPassword")?.value;
        const newPassword = document.getElementById("newPassword")?.value;
        const confirm =
            document.getElementById("confirmPassword")?.value ??
            document.getElementById("confirmNewPassword")?.value;

        if (!current || !newPassword || !confirm) {
            alert("Please complete all password fields.");
            return;
        }

        if (newPassword !== confirm) {
            alert("New passwords do not match.");
            return;
        }

        if (newPassword.length < 8) {
            alert("Password must contain at least 8 characters.");
            return;
        }

        alert("Password updated successfully.");

        form.reset();
        form.closest(".modal-overlay")?.classList.remove("show");
    });
}

/* ==================== DASHBOARD STAT ANIMATIONS ==================== */

function initStatCountUp() {
    const statEls = document.querySelectorAll("[data-count]");

    statEls.forEach(el => {
        const target = parseInt(el.dataset.count, 10) || 0;
        const duration = 1200;
        const startTime = performance.now();

        function tick(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = Math.floor(eased * target);

            el.textContent = value.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                el.textContent = target.toLocaleString();
            }
        }

        requestAnimationFrame(tick);
    });
}

function initProgressBars() {
    document.querySelectorAll("[data-progress]").forEach(bar => {
        const value = bar.dataset.progress;

        requestAnimationFrame(() => {
            bar.style.width = `${value}%`;
        });
    });
}

/* ==================== MANAGEMENT DASHBOARD: DATE + GREETING ==================== */

function initManagementDate() {
    const dateEl = document.querySelector("#managementDate span");

    if (!dateEl) return;

    const today = new Date();
    dateEl.textContent = today.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

function initManagementGreeting() {
    const greetingLabel = document.querySelector(".dashboard-greeting");

    if (!greetingLabel || !greetingLabel.textContent.includes("MANAGEMENT PORTAL")) return;

    const hour = new Date().getHours();
    let timeGreeting = "GOOD MORNING";

    if (hour >= 12 && hour < 17) timeGreeting = "GOOD AFTERNOON";
    else if (hour >= 17) timeGreeting = "GOOD EVENING";

    greetingLabel.textContent = `${timeGreeting} · MANAGEMENT PORTAL`;
}

function initActivityRefresh() {
    const refreshBtn = document.getElementById("refreshActivityBtn");
    const activityList = document.getElementById("activityList");

    if (!refreshBtn || !activityList) return;

    refreshBtn.addEventListener("click", () => {
        const icon = refreshBtn.querySelector("i");

        if (icon) {
            icon.style.transition = "transform .5s ease";
            icon.style.transform = "rotate(360deg)";
        }

        activityList.style.opacity = "0.4";

        setTimeout(() => {
            activityList.style.opacity = "1";
            if (icon) icon.style.transform = "rotate(0deg)";
        }, 500);
    });
}

/* ==================== "COMING SOON" PLACEHOLDER BUTTONS ==================== */

function initIconButtons() {
    document.querySelectorAll(".icon-button").forEach(btn => {
        if (modalTriggers[btn.id]) return;

        btn.addEventListener("click", () => {
            alert("This feature is coming soon.");
        });
    });
}

function initPanelMoreButtons() {
    document.querySelectorAll(".panel-more-btn").forEach(btn => {
        if (btn.id === "refreshActivityBtn") return;

        btn.addEventListener("click", () => {
            alert("More options coming soon.");
        });
    });
}

function initTableActions() {
    document.querySelectorAll(".table-action:not(.user-action-btn)").forEach(btn => {
        btn.addEventListener("click", () => {
            alert("More options coming soon.");
        });
    });
}

function initExtraProfileButtons() {
    document.getElementById("twoFactorBtn")?.addEventListener("click", () => {
        alert("Two-factor authentication setup is coming soon.");
    });

    document.getElementById("loginActivityBtn")?.addEventListener("click", () => {
        alert("Login activity view is coming soon.");
    });
}

/* ==================== BIRTH CONTROL: MARK AS TAKEN ==================== */

function initMarkAsTaken() {
    document.querySelectorAll(".next-reminder .btn").forEach(btn => {
        btn.addEventListener("click", () => {
            btn.textContent = "Taken ✓";
            btn.disabled = true;
        });
    });
}

/* ==================== AUTH: PASSWORD VISIBILITY TOGGLE ==================== */

function initPasswordToggles() {
    document.querySelectorAll(".password-toggle").forEach(btn => {
        btn.addEventListener("click", () => {
            const wrapper = btn.closest(".input-wrapper");
            const input = wrapper?.querySelector("input");
            const icon = btn.querySelector("i");

            if (!input) return;

            const show = input.type === "password";
            input.type = show ? "text" : "password";

            if (icon) {
                icon.classList.toggle("fa-eye", !show);
                icon.classList.toggle("fa-eye-slash", show);
            }
        });
    });
}

/* ==================== AUTH: PASSWORD REQUIREMENTS (signup) ==================== */

function initPasswordRequirements() {
    const pwInput = document.getElementById("signupPassword");
    const lengthReq = document.getElementById("lengthRequirement");
    const numberReq = document.getElementById("numberRequirement");

    if (!pwInput) return;

    pwInput.addEventListener("input", () => {
        const val = pwInput.value;

        lengthReq?.classList.toggle("met", val.length >= 8);
        numberReq?.classList.toggle("met", /\d/.test(val));
    });
}

/* ==================== AUTH: LOGIN FORM ==================== */

function initLoginForm() {
    const form = document.getElementById("loginForm");
    const errorBox = document.getElementById("loginError");

    if (!form) return;

    form.addEventListener("submit", event => {
        event.preventDefault();

        const email = document.getElementById("email")?.value.trim();
        const password = document.getElementById("password")?.value;

        if (!email || !password) {
            if (errorBox) {
                errorBox.textContent = "Please enter your email and password.";
                errorBox.classList.add("error-message");
            }
            return;
        }

        if (errorBox) errorBox.textContent = "";

        saveUser({ email });

        window.location.href = "user/dashboard.html";
    });
}

/* ==================== AUTH: SIGNUP FORM ==================== */

function initSignupForm() {
    const form = document.getElementById("signupForm");
    const messageBox = document.getElementById("signupMessage");

    if (!form) return;

    form.addEventListener("submit", event => {
        event.preventDefault();

        const fullName = document.getElementById("fullName")?.value.trim();
        const email = document.getElementById("signupEmail")?.value.trim();
        const password = document.getElementById("signupPassword")?.value;
        const confirm = document.getElementById("confirmPassword")?.value;
        const terms = document.getElementById("terms")?.checked;

        if (!fullName || !email || !password || !confirm) {
            showSignupMessage(messageBox, "Please complete all required fields.", true);
            return;
        }

        if (password.length < 8 || !/\d/.test(password)) {
            showSignupMessage(messageBox, "Password must be at least 8 characters and include a number.", true);
            return;
        }

        if (password !== confirm) {
            showSignupMessage(messageBox, "Passwords do not match.", true);
            return;
        }

        if (!terms) {
            showSignupMessage(messageBox, "Please agree to the Terms of Service and Privacy Policy.", true);
            return;
        }

        saveUser({ fullName, email });

        showSignupMessage(messageBox, "Account created successfully. Redirecting to login...", false);

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1200);
    });
}

function showSignupMessage(box, text, isError) {
    if (!box) return;

    box.textContent = text;
    box.classList.remove("error-message", "success-message");
    box.classList.add(isError ? "error-message" : "success-message");
}

/* ==================== LOCAL STORAGE HELPERS ==================== */

function saveUser(user) {
    localStorage.setItem("afraUser", JSON.stringify(user));
}

function getUser() {
    const user = localStorage.getItem("afraUser");

    if (!user) return null;

    try {
        return JSON.parse(user);
    } catch {
        return null;
    }
}

function saveManagementUser(user) {
    localStorage.setItem("afraManagement", JSON.stringify(user));
}

function getManagementUser() {
    const user = localStorage.getItem("afraManagement");

    if (!user) return null;

    try {
        return JSON.parse(user);
    } catch {
        return null;
    }
}