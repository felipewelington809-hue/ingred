/* ===== CONFIGURAÇÃO ===== */
const CONFIG = {
  whatsapp: "553399055489", // confirme o número antes de publicar
  mensagem: "Olá, Ingrid! Vi seu site e gostaria de conversar sobre um projeto."
};

/* Imagens: troque cada endereço por uma foto real, por exemplo "images/hero.jpg".
   Tamanhos sugeridos: hero 1600x1000 (horizontal, funciona bem em celular e desktop), about 800x1000, contact 1600x1000. */
const IMAGES = {
  hero:     "images/hero.jpg",
  hero2:    "images/hero2.jpg",
  about:    "images/about.jpg",
  about2:   "images/about2.jpg",
  services: "images/services.jpg",
  why:      "images/why.jpg",
  contact:  "images/contact.jpg"
};

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* imagens */
$$("img[data-img]").forEach(img => {
  img.src = IMAGES[img.dataset.img] || "";
  img.addEventListener("error", () => { img.style.visibility = "hidden"; }, { once: true });
});

/* WhatsApp */
const waUrl = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(CONFIG.mensagem)}`;
$$("[data-wa]").forEach(a => { a.href = waUrl; a.target = "_blank"; a.rel = "noopener"; });

/* ano */
$("#ano").textContent = new Date().getFullYear();

/* menu mobile */
const burger = $("#burger"), menu = $("#menu"), nav = $("#nav");
const setMenu = open => {
  menu.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", open);
  burger.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  document.body.style.overflow = open ? "hidden" : "";
};
burger.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
$$("a", menu).forEach(a => a.addEventListener("click", () => setMenu(false)));
addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });

/* revelação ao rolar */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
}, { threshold: .15, rootMargin: "0px 0px -8% 0px" });
$$(".reveal").forEach((el, i) => { el.style.transitionDelay = (i % 3) * 90 + "ms"; io.observe(el); });

/* serviços */
$$(".svc button").forEach(btn => btn.addEventListener("click", () => {
  const item = btn.parentElement, open = !item.classList.contains("is-open");
  $$(".svc").forEach(s => { s.classList.remove("is-open"); $("button", s).setAttribute("aria-expanded", "false"); });
  if (open) { item.classList.add("is-open"); btn.setAttribute("aria-expanded", "true"); }
}));

/* parallax e barra superior */
const par = $$("[data-speed]");
let tick = false;
const update = () => {
  nav.classList.toggle("scrolled", scrollY > 40);
  if (!reduce && innerWidth > 700) {
    par.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const d = (r.top + r.height / 2 - innerHeight / 2) * parseFloat(el.dataset.speed);
      el.style.transform = `translate3d(0,${d.toFixed(1)}px,0)`;
    });
  }
  tick = false;
};
addEventListener("scroll", () => { if (!tick) { tick = true; requestAnimationFrame(update); } }, { passive: true });
addEventListener("resize", update);
update();
