const API_BASE_URL = "http://127.0.0.1:8000";

document.addEventListener("DOMContentLoaded", () => {
    initAuthGuard();
    initDashboardUserInfo();
    initManagementTestKits();
    initUserTestKits();
    initLandingMobileNav();
    initDashboardSidebar();
    initLogout();
    initContactForm();
    initNotifications();
    initSearch();
    initThemeToggle();
    initFAQAccordion();
    initInlineValidation();
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

/* ==================== CONTACT ==================== */

function initContactForm() {
    const form = document.getElementById("contactForm");
    const messageBox = document.getElementById("contactFormMessage");

    if (!form) return;

    form.addEventListener("submit", event => {
        event.preventDefault();

        const name = document.getElementById("contactName")?.value.trim();
        const email = document.getElementById("contactEmail")?.value.trim();
        const message = document.getElementById("contactMessage")?.value.trim();

        if (!name || !email || !message) {
            messageBox.textContent = "Please fill in your name, email and message.";
            messageBox.classList.remove("success-message");
            messageBox.classList.add("error-message");
            return;
        }

        messageBox.textContent = "Thanks! Your message has been received — we'll get back to you within 24 hours.";
        messageBox.classList.remove("error-message");
        messageBox.classList.add("success-message");

        form.reset();
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
        showToast("You have 3 unread notifications.", "success", "Notifications");
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
    const customFormIds = new Set(["profileForm", "passwordForm", "testKitForm"]);

    document.querySelectorAll(".modal form").forEach(form => {
        if (customFormIds.has(form.id)) return;

        form.addEventListener("submit", event => {
            event.preventDefault();
            showToast("Saved successfully.");
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
        showToast("Your profile changes have been saved.");

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
            showToast("Please complete all password fields.", "error");
            return;
        }

        if (newPassword !== confirm) {
            showToast("New passwords do not match.", "error");
            return;
        }

        if (newPassword.length < 8) {
            showToast("Password must contain at least 8 characters.", "error");
            return;
        }

        showToast("Your password has been updated.");

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
            showToast("This feature is coming soon.", "success", "Coming soon");
        });
    });
}

function initPanelMoreButtons() {
    document.querySelectorAll(".panel-more-btn").forEach(btn => {
        if (btn.id === "refreshActivityBtn") return;

        btn.addEventListener("click", () => {
            showToast("More options coming soon.", "success", "Coming soon");
        });
    });
}

function initTableActions() {
    document.querySelectorAll(".table-action:not(.user-action-btn)").forEach(btn => {
        btn.addEventListener("click", () => {
            showToast("More options coming soon.", "success", "Coming soon");
        });
    });
}

function initExtraProfileButtons() {
    document.getElementById("twoFactorBtn")?.addEventListener("click", () => {
        showToast("Two-factor authentication setup is coming soon.", "success", "Coming soon");
    });

    document.getElementById("loginActivityBtn")?.addEventListener("click", () => {
        showToast("Login activity view is coming soon.", "success", "Coming soon");
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

    form.addEventListener("submit", async event => {
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

        if (errorBox) {
            errorBox.textContent = "";
            errorBox.classList.remove("error-message");
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;

        try {
            const response = await fetch(`${API_BASE_URL}/users/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                if (errorBox) {
                    errorBox.textContent = data.detail || "Invalid email or password.";
                    errorBox.classList.add("error-message");
                }
                return;
            }

            if (data.user.role === "management") {
                saveManagementUser(data.user);
                window.location.href = "management/dashboard.html";
            } else {
                saveUser(data.user);
                window.location.href = "user/dashboard.html";
            }
        } catch (error) {
            if (errorBox) {
                errorBox.textContent = "Could not connect to the server. Please try again.";
                errorBox.classList.add("error-message");
            }
        } finally {
            if (submitBtn) submitBtn.disabled = false;
        }
    });
}

/* ==================== AUTH: SIGNUP FORM ==================== */

function initSignupForm() {
    const form = document.getElementById("signupForm");
    const messageBox = document.getElementById("signupMessage");

    if (!form) return;

    form.addEventListener("submit", async event => {
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

        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;

        try {
            const response = await fetch(`${API_BASE_URL}/users/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: fullName, email, password, role: "user" })
            });

            const data = await response.json();

            if (!response.ok) {
                showSignupMessage(messageBox, data.detail || "Signup failed. Please try again.", true);
                return;
            }

            saveUser(data);

            showSignupMessage(messageBox, "Account created successfully. Redirecting to login...", false);

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1200);
        } catch (error) {
            showSignupMessage(messageBox, "Could not connect to the server. Please try again.", true);
        } finally {
            if (submitBtn) submitBtn.disabled = false;
        }
    });
}

function showSignupMessage(box, text, isError) {
    if (!box) return;

    box.textContent = text;
    box.classList.remove("error-message", "success-message");
    box.classList.add(isError ? "error-message" : "success-message");
}

/* ==================== TOAST NOTIFICATIONS ==================== */

function ensureToastContainer() {
    let container = document.querySelector(".toast-container");

    if (!container) {
        container = document.createElement("div");
        container.className = "toast-container";
        document.body.appendChild(container);
    }

    return container;
}

function showToast(message, type = "success", title = null) {
    const container = ensureToastContainer();

    const toast = document.createElement("div");
    toast.className = `toast${type === "error" ? " toast-error" : ""}`;

    const iconClass = type === "error" ? "fa-triangle-exclamation" : "fa-circle-check";
    const heading = title || (type === "error" ? "Something went wrong" : "Success");

    toast.innerHTML = `
        <div class="toast-icon"><i class="fa-solid ${iconClass}"></i></div>
        <div class="toast-body">
            <strong>${heading}</strong>
            <span>${message}</span>
        </div>
        <button class="toast-close" aria-label="Dismiss"><i class="fa-solid fa-xmark"></i></button>
    `;

    container.appendChild(toast);

    const remove = () => {
        toast.classList.add("toast-out");
        setTimeout(() => toast.remove(), 300);
    };

    toast.querySelector(".toast-close").addEventListener("click", remove);

    setTimeout(remove, 4500);
}

/* ==================== THEME TOGGLE (DARK MODE) ==================== */

function initThemeToggle() {
    const toggle = document.getElementById("themeToggle");
    const root = document.documentElement;

    if (localStorage.getItem("afraTheme") === "dark") {
        root.setAttribute("data-theme", "dark");
    }

    updateThemeIcon(root.getAttribute("data-theme") === "dark");

    if (!toggle) return;

    toggle.addEventListener("click", () => {
        const isDark = root.getAttribute("data-theme") === "dark";

        if (isDark) {
            root.removeAttribute("data-theme");
            localStorage.setItem("afraTheme", "light");
        } else {
            root.setAttribute("data-theme", "dark");
            localStorage.setItem("afraTheme", "dark");
        }

        updateThemeIcon(!isDark);
    });
}

function updateThemeIcon(isDark) {
    const icon = document.querySelector("#themeToggle i");

    if (!icon) return;

    icon.classList.toggle("fa-moon", !isDark);
    icon.classList.toggle("fa-sun", isDark);
}

/* ==================== FAQ ACCORDION ==================== */

function initFAQAccordion() {
    document.querySelectorAll(".faq-question").forEach(question => {
        question.addEventListener("click", () => {
            const item = question.closest(".faq-item");
            const answer = item.querySelector(".faq-answer");
            const isOpen = item.classList.contains("open");

            document.querySelectorAll(".faq-item.open").forEach(openItem => {
                if (openItem !== item) {
                    openItem.classList.remove("open");
                    openItem.querySelector(".faq-answer").style.maxHeight = null;
                }
            });

            if (isOpen) {
                item.classList.remove("open");
                answer.style.maxHeight = null;
            } else {
                item.classList.add("open");
                answer.style.maxHeight = `${answer.scrollHeight}px`;
            }
        });
    });
}

/* ==================== INLINE FORM VALIDATION ==================== */

function initInlineValidation() {
    document.querySelectorAll(".auth-form input, #contactForm input, #contactForm textarea").forEach(input => {
        input.addEventListener("blur", () => validateSingleField(input));
        input.addEventListener("input", () => {
            const wrapper = input.closest(".input-wrapper") || input.parentElement;
            if (wrapper?.classList.contains("input-error")) {
                validateSingleField(input);
            }
        });
    });
}

function validateSingleField(input) {
    const wrapper = input.closest(".input-wrapper") || input.parentElement;
    const existingError = wrapper.parentElement.querySelector(".field-error");

    let isValid = true;
    let message = "";

    if (input.hasAttribute("required") && !input.value.trim()) {
        isValid = false;
        message = "This field is required.";
    } else if (input.type === "email" && input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
        isValid = false;
        message = "Enter a valid email address.";
    } else if (input.type === "tel" && input.value && input.value.replace(/\D/g, "").length < 9) {
        isValid = false;
        message = "Enter a valid phone number.";
    }

    wrapper.classList.remove("input-error", "input-success");

    if (existingError) existingError.remove();

    if (!input.value && !input.hasAttribute("required")) return true;

    if (isValid) {
        wrapper.classList.add("input-success");
    } else {
        wrapper.classList.add("input-error");
        const errorEl = document.createElement("span");
        errorEl.className = "field-error";
        errorEl.textContent = message;
        wrapper.parentElement.appendChild(errorEl);
    }

    return isValid;
}

/* ==================== SKELETON LOADING (example helper) ==================== */

function showTableSkeleton(tableBodyId, rows = 5, columns = 5) {
    const tbody = document.getElementById(tableBodyId);

    if (!tbody) return;

    let rowsHtml = "";

    for (let i = 0; i < rows; i++) {
        let cellsHtml = "";
        for (let c = 0; c < columns; c++) {
            cellsHtml += `<td><div class="skeleton skeleton-line" style="width:${60 + Math.random() * 30}%"></div></td>`;
        }
        rowsHtml += `<tr class="skeleton-row">${cellsHtml}</tr>`;
    }

    tbody.innerHTML = rowsHtml;
}

/* ==================== AUTH GUARD (PROTECT DASHBOARD PAGES) ==================== */

function initAuthGuard() {
    const path = window.location.pathname;

    const isManagementPage = path.includes("/management/");
    const isUserPage = path.includes("/user/") && !path.includes("/management/");

    if (isManagementPage) {
        const managementUser = getManagementUser();
        if (!managementUser) {
            window.location.href = "../login.html";
        }
        return;
    }

    if (isUserPage) {
        const user = getUser();
        if (!user) {
            window.location.href = "../login.html";
        }
    }
}

/* ==================== DASHBOARD: SHOW REAL LOGGED-IN USER INFO ==================== */

function initDashboardUserInfo() {
    const path = window.location.pathname;

    const isManagementPage = path.includes("/management/");
    const isUserPage = path.includes("/user/") && !isManagementPage;

    let account = null;

    if (isManagementPage) {
        account = getManagementUser();
    } else if (isUserPage) {
        account = getUser();
    }

    if (!account) return;

    const name = account.name || account.fullName || "";
    const firstName = name.split(" ")[0] || (isManagementPage ? "Admin" : "there");

    // The management page's h1 is a page title ("Dashboard"), not a greeting —
    // only rewrite the welcome heading on the user dashboard.
    if (isUserPage) {
        const heading = document.querySelector(".dashboard-header-left h1");
        if (heading) heading.textContent = `Welcome back, ${firstName} 👋`;
    }

    const nameLabel = document.querySelector(".user-profile-info strong");
    if (nameLabel) nameLabel.textContent = firstName;

    const avatar = document.querySelector(".user-profile .user-avatar");
    if (avatar) {
        const initials = name
            .split(" ")
            .map(part => part.charAt(0))
            .join("")
            .substring(0, 2)
            .toUpperCase();

        avatar.textContent = initials || (isManagementPage ? "AD" : "U");
    }
}

/* ==================== MANAGEMENT: TEST KITS CATALOGUE ==================== */

function initManagementTestKits() {
    const table = document.getElementById("testKitsTable");
    if (!table) return; // not on management/test-kits.html

    loadManagementTestKits(table);

    const form = document.getElementById("testKitForm");
    if (!form) return;

    form.addEventListener("submit", async event => {
        event.preventDefault();

        const managementUser = getManagementUser();
        if (!managementUser) {
            showToast("You must be logged in as management to add a test kit.", "error");
            return;
        }

        const payload = {
            name: document.getElementById("testKitName")?.value.trim(),
            kit_type: document.getElementById("testKitType")?.value,
            manufacturer: document.getElementById("testKitManufacturer")?.value.trim() || null,
            kit_code: document.getElementById("testKitCode")?.value.trim() || null,
            status: document.getElementById("testKitStatus")?.value || "active",
            description: document.getElementById("testKitDescription")?.value.trim() || null,
            instructions: document.getElementById("testKitInstructions")?.value.trim() || null,
            added_by: managementUser.id
        };

        if (!payload.name || !payload.kit_type || !payload.manufacturer) {
            showToast("Please complete the required fields.", "error");
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;

        try {
            const response = await fetch(`${API_BASE_URL}/test-kits/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                showToast(data.detail || "Could not add test kit.", "error");
                return;
            }

            showToast("Test kit added successfully.");
            form.reset();
            form.closest(".modal-overlay")?.classList.remove("show");
            loadManagementTestKits(table);
        } catch (error) {
            showToast("Could not connect to the server.", "error");
        } finally {
            if (submitBtn) submitBtn.disabled = false;
        }
    });
}

async function loadManagementTestKits(table) {
    try {
        const response = await fetch(`${API_BASE_URL}/test-kits/`);
        if (!response.ok) return;

        const kits = await response.json();
        renderManagementTestKitsTable(table, kits);
    } catch (error) {
        // Leave the existing static rows in place if the backend is unreachable
    }
}

function renderManagementTestKitsTable(table, kits) {
    if (!Array.isArray(kits) || kits.length === 0) return;

    table.innerHTML = kits.map(kit => {
        const statusClass = kit.status === "active" ? "status-active" : "status-review";
        const updated = kit.created_at
            ? new Date(kit.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
            : "";

        return `
            <tr>
                <td>
                    <div class="table-product">
                        <div class="table-product-icon green-icon">
                            <i class="fa-solid fa-vial"></i>
                        </div>
                        <div>
                            <strong>${escapeHtml(kit.name)}</strong>
                            <span>Kit ID: ${escapeHtml(kit.kit_code || "N/A")}</span>
                        </div>
                    </div>
                </td>
                <td>${escapeHtml(kit.kit_type)}</td>
                <td>${escapeHtml(kit.manufacturer || "—")}</td>
                <td>
                    <span class="table-status ${statusClass}">
                        <i class="fa-solid fa-circle"></i>
                        ${escapeHtml(kit.status)}
                    </span>
                </td>
                <td>${updated}</td>
                <td>
                    <button class="table-action" aria-label="Test kit options">
                        <i class="fa-solid fa-ellipsis"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join("");
}

/* ==================== USER: MY TEST KITS ==================== */

function initUserTestKits() {
    const list = document.querySelector(".test-kit-list");
    if (!list) return; // not on user/test-kits.html

    loadUserTestKits(list);

    const form = document.getElementById("testKitForm");
    if (!form) return;

    form.addEventListener("submit", async event => {
        event.preventDefault();

        const user = getUser();
        if (!user) {
            showToast("You must be logged in to register a test kit.", "error");
            return;
        }

        const payload = {
            user_id: user.id,
            kit_type: document.getElementById("testKitType")?.value,
            serial_number: document.getElementById("kitId")?.value.trim(),
            manufacturer: document.getElementById("manufacturer")?.value.trim() || null,
            purchase_date: document.getElementById("purchaseDate")?.value || null,
            expiry_date: document.getElementById("expiryDate")?.value || null,
            notes: document.getElementById("testKitNotes")?.value.trim() || null
        };

        if (!payload.kit_type || !payload.serial_number) {
            showToast("Please complete the required fields.", "error");
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;

        try {
            const response = await fetch(`${API_BASE_URL}/user-test-kits/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                showToast(data.detail || "Could not register test kit.", "error");
                return;
            }

            showToast("Test kit registered successfully.");
            form.reset();
            form.closest(".modal-overlay")?.classList.remove("show");
            loadUserTestKits(list);
        } catch (error) {
            showToast("Could not connect to the server.", "error");
        } finally {
            if (submitBtn) submitBtn.disabled = false;
        }
    });
}

async function loadUserTestKits(list) {
    const user = getUser();
    if (!user) return;

    try {
        const response = await fetch(`${API_BASE_URL}/user-test-kits/user/${user.id}`);
        if (!response.ok) return;

        const kits = await response.json();
        renderUserTestKitsList(list, kits);
    } catch (error) {
        // Leave the existing static cards in place if the backend is unreachable
    }
}

function renderUserTestKitsList(list, kits) {
    const emptyState = document.getElementById("testKitEmptyState");

    if (!Array.isArray(kits) || kits.length === 0) {
        list.innerHTML = "";
        emptyState?.classList.add("show");
        return;
    }

    emptyState?.classList.remove("show");

    list.innerHTML = kits.map(kit => {
        const registered = kit.created_at
            ? new Date(kit.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
            : "";

        return `
            <article class="test-kit-card">
                <div class="test-kit-icon lavender-icon">
                    <i class="fa-solid fa-vial"></i>
                </div>
                <div class="test-kit-info">
                    <span class="test-kit-category">HOME TEST KIT</span>
                    <h3>${escapeHtml(kit.kit_type)}</h3>
                    <div class="test-kit-meta">
                        <span>
                            <i class="fa-solid fa-barcode"></i>
                            Kit ID: ${escapeHtml(kit.serial_number)}
                        </span>
                        <span>
                            <i class="fa-regular fa-calendar"></i>
                            Registered: ${registered}
                        </span>
                    </div>
                </div>
                <div class="test-kit-status">
                    <span class="status-badge status-pending">Not used</span>
                    <button class="icon-button" aria-label="Test kit options">
                        <i class="fa-solid fa-ellipsis"></i>
                    </button>
                </div>
            </article>
        `;
    }).join("");
}

function escapeHtml(value) {
    if (value === null || value === undefined) return "";
    const div = document.createElement("div");
    div.textContent = String(value);
    return div.innerHTML;
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