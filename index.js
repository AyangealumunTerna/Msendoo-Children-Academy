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

// ==================== REGISTER ====================
document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('registerEmail').value.trim();
  const password = document.getElementById('registerPassword').value.trim();
  const confirm = document.getElementById('registerConfirm').value.trim();

  if (password !== confirm) {
    alert("Passwords do not match!");
    return;
  }

  try {
    const res = await fetch('msendoo-children-academy-production.up.railway.app/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email, password })
    });

    const data = await res.json();
    alert(data.message);
  } catch (err) {
    console.error(err);
    alert("Error connecting to server.");
  }
});


// ==================== LOGIN ====================
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();

  try {
    const res = await fetch('msendoo-children-academy-production.up.railway.app/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email, password })
    });

    const data = await res.json();
    alert(data.message);

    if (res.ok && data.token) {
      localStorage.setItem('token', data.token);
      // Redirect to dashboard page (if you have one)
      window.location.href = 'dashboard.html';
    }
  } catch (err) {
    console.error(err);
    alert("Error connecting to server.");
  }
});

// // Accessibility: close drawer on ESC
// document.addEventListener('keydown', (ev) => {
//     if (ev.key === 'Escape') closeDrawer();
// });

// === AUTH MODALS ===
function openModal(id) {
  document.getElementById(id).classList.add("show");
}
function closeModal(id) {
  document.getElementById(id).classList.remove("show");
}
function switchModal(current, next) {
  closeModal(current);
  openModal(next);
}

// // Login form behavior
// document.getElementById("loginForm").addEventListener("submit", (e) => {
//   e.preventDefault();
//   alert("Logging in... (backend coming soon 😎)");
//   closeModal("loginModal");
// });

// // Register form behavior
// document.getElementById("registerForm").addEventListener("submit", (e) => {
//   e.preventDefault();
//   alert("Registering... (backend coming soon 😎)");
//   closeModal("registerModal");
// });


