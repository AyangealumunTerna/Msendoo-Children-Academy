// Mobile drawer toggle
const drawer = document.getElementById('drawer');
const hamburger = document.getElementById('hamburger');
const closeBtn = document.getElementById('closeDrawer');

function openDrawer() {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
}
function closeDrawer() {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}
hamburger.addEventListener('click', openDrawer);
closeBtn.addEventListener('click', closeDrawer);

// Close drawer when link clicked and smooth scroll
document.querySelectorAll('.drawer-link').forEach(a => {
    a.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(a.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
        closeDrawer();
    });
});

// Desktop nav smooth scroll
document.querySelectorAll('nav .links a').forEach(a => {
    a.addEventListener('click', (e) => {
        e.preventDefault();
        const el = document.querySelector(a.getAttribute('href'));
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// Small helper: reveal elements with .fade-up when in viewport
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('inview');
    });
}, { threshold: 0.15 });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

function openModal(type, role) {
  const modal = document.getElementById("authModal");
  const title = document.getElementById("modal-title");
  modal.classList.add("show");
  title.textContent = `${type === 'login' ? 'Login' : 'Register'} as ${role}`;

  const form = document.getElementById("authForm");
  form.onsubmit = (e) => {
    e.preventDefault();
    alert(`${type === 'login' ? 'Logging in' : 'Registering'} as ${role}...`);
    closeModal();
  };
}

function closeModal() {
  document.getElementById("authModal").classList.remove("show");
}

// ===============================
// LocalStorage Auth Simulation
// ===============================

// Save or retrieve users
function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}
function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

// Extend your openModal function behavior
function openModal(type, role) {
  const modal = document.getElementById("authModal");
  const title = document.getElementById("modal-title");
  modal.classList.add("show");
  title.textContent = `${type === "login" ? "Login" : "Register"} as ${role}`;

  const form = document.getElementById("authForm");
  form.innerHTML = `
    <input type="email" id="email" placeholder="Email" required />
    <input type="password" id="password" placeholder="Password" required />
    ${
      type === "register"
        ? '<input type="password" id="confirmPassword" placeholder="Confirm Password" required />'
        : ""
    }
    <button type="submit" class="primary-btn">
      ${type === "login" ? "Login" : "Register"}
    </button>
  `;

  form.onsubmit = (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (type === "register") {
      const confirmPassword = document.getElementById("confirmPassword").value.trim();
      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      const users = getUsers();
      if (users.some((u) => u.email === email)) {
        alert("User already exists. Please login instead.");
        return;
      }
      users.push({ email, password, role });
      saveUsers(users);
      alert(`Registered successfully as ${role}!`);
      closeModal();
    } else {
      const users = getUsers();
      const user = users.find((u) => u.email === email && u.password === password && u.role === role);
      if (!user) {
        alert("Invalid credentials or role mismatch!");
        return;
      }
      alert(`Welcome back, ${role}!`);
      closeModal();
    }
  };
}

// // Accessibility: close drawer on ESC
// document.addEventListener('keydown', (ev) => {
//     if (ev.key === 'Escape') closeDrawer();
// });