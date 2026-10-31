(function () {
  const S = window.SITE;
  const app = document.getElementById("app");
  const money = (n) => "$" + n.toFixed(2);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const byId = (id) => S.products.find((p) => p.id === id);

  // ---------- cart (kept in localStorage when available) ----------
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* private mode: memory only */ } },
  };
  let cart = store.get("pd_cart", {});
  let checkout = store.get("pd_checkout", {});
  let lastOrder = store.get("pd_last_order", null);
  const saveCart = () => { store.set("pd_cart", cart); updateCount(); };
  const cartItems = () => Object.entries(cart).map(([id, qty]) => ({ p: byId(id), qty })).filter((x) => x.p && x.qty > 0);
  const totals = () => {
    const sub = cartItems().reduce((s, x) => s + x.p.price * x.qty, 0);
    const ship = sub === 0 || sub >= S.freeShippingOver ? 0 : S.shippingFlat;
    const tax = Math.round(sub * S.taxRate * 100) / 100;
    return { sub, ship, tax, total: sub + ship + tax };
  };
  function updateCount() { document.getElementById("cartCount").textContent = cartItems().reduce((s, x) => s + x.qty, 0); }
  function add(id, qty = 1, fromEl) { cart[id] = (cart[id] || 0) + qty; saveCart(); flyToCart(fromEl); toast("Added to cart: " + byId(id).name); }
  function toast(msg) { const t = document.getElementById("toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("show"), 1800); }


  // ---------- animation helpers ----------
  const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const KERNEL = '<svg viewBox="0 0 32 32" aria-hidden="true"><g fill="#fff8ec" stroke="#3a2418" stroke-width="1.4"><circle cx="16" cy="18" r="8"/><circle cx="10" cy="13" r="6"/><circle cx="22" cy="13" r="6"/><circle cx="16" cy="9" r="6"/></g><circle cx="16" cy="22" r="3" fill="#f28c38"/></svg>';
  const CHOC = '<svg viewBox="0 0 32 32" aria-hidden="true"><g fill="#5a3424" stroke="#3a2418" stroke-width="1.4"><circle cx="16" cy="18" r="8"/><circle cx="10" cy="13" r="6"/><circle cx="22" cy="13" r="6"/><circle cx="16" cy="9" r="6"/></g><circle cx="13" cy="12" r="1.3" fill="#fff"/><circle cx="20" cy="17" r="1.1" fill="#fff"/></svg>';
  const rand = (a, b) => a + Math.random() * (b - a);
  function popField() {
    const hero = app.querySelector(".hero");
    if (!hero || reduced) return;
    const field = document.createElement("div");
    field.className = "popfield";
    for (let i = 0; i < 18; i++) {
      const k = document.createElement("div");
      k.className = "kernel";
      k.innerHTML = i % 3 === 0 ? CHOC : KERNEL;
      k.style.left = rand(2, 96) + "%";
      k.style.setProperty("--delay", rand(0, 6).toFixed(2) + "s");
      k.style.setProperty("--dur", rand(5, 9).toFixed(2) + "s");
      k.style.setProperty("--dx", rand(-120, 120).toFixed(0) + "px");
      k.style.setProperty("--spin", rand(2, 5).toFixed(2) + "s");
      const sz = rand(18, 34).toFixed(0) + "px";
      k.style.width = sz; k.style.height = sz;
      field.appendChild(k);
    }
    hero.prepend(field);
  }
  function splitHeadline() {
    const h = app.querySelector(".hero h1");
    if (!h || reduced) return;
    h.innerHTML = h.textContent.split(" ").map((w, i) => `<span class="word" style="--i:${i}">${esc(w)}</span>`).join(" ");
  }
  let io;
  function reveals() {
    const els = app.querySelectorAll(".feature, .product-card, .panel, .story > div, .detail > div, h2");
    if (reduced || !("IntersectionObserver" in window)) return;
    io && io.disconnect();
    io = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.12 });
    els.forEach((el, i) => { el.classList.add("reveal"); el.style.setProperty("--rd", (i % 4) * 90 + "ms"); io.observe(el); });
  }
  function flyToCart(fromEl) {
    const count = document.getElementById("cartCount");
    if (reduced || !fromEl) { count.classList.remove("bump"); void count.offsetWidth; count.classList.add("bump"); return; }
    const a = fromEl.getBoundingClientRect(), b = count.getBoundingClientRect();
    for (let i = 0; i < 6; i++) {
      const s = document.createElement("div");
      s.className = "burst";
      s.innerHTML = i % 2 ? CHOC : KERNEL;
      s.style.left = a.left + a.width / 2 - 9 + "px"; s.style.top = a.top + a.height / 2 - 9 + "px";
      s.style.setProperty("--bx", rand(-70, 70).toFixed(0) + "px"); s.style.setProperty("--by", rand(-80, -20).toFixed(0) + "px");
      document.body.appendChild(s); setTimeout(() => s.remove(), 750);
    }
    const f = document.createElement("div");
    f.className = "flyer"; f.innerHTML = CHOC;
    f.style.left = a.left + a.width / 2 - 15 + "px"; f.style.top = a.top + a.height / 2 - 15 + "px";
    document.body.appendChild(f);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      f.style.transform = `translate(${b.left + b.width / 2 - (a.left + a.width / 2)}px, ${b.top + b.height / 2 - (a.top + a.height / 2)}px) scale(0.5) rotate(360deg)`;
      f.style.opacity = "0.4";
    }));
    setTimeout(() => { f.remove(); count.classList.remove("bump"); void count.offsetWidth; count.classList.add("bump"); }, 760);
  }
  function confetti() {
    if (reduced) return;
    for (let i = 0; i < 40; i++) {
      const c = document.createElement("div");
      c.className = "confetti"; c.innerHTML = i % 3 === 0 ? CHOC : KERNEL;
      c.style.left = rand(0, 100) + "vw";
      c.style.setProperty("--fd", rand(2, 3.6).toFixed(2) + "s"); c.style.setProperty("--fdl", rand(0, 0.8).toFixed(2) + "s");
      c.style.setProperty("--fx", rand(-120, 120).toFixed(0) + "px"); c.style.setProperty("--fr", rand(200, 900).toFixed(0) + "deg");
      document.body.appendChild(c); setTimeout(() => c.remove(), 4600);
    }
  }

  // ---------- views ----------
  const productCard = (p) => `
    <article class="product-card">
      <a class="media" href="#/product/${p.id}"><img src="${p.image}" alt="${esc(p.name)} box"></a>
      <div class="body">
        <div>${p.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
        <h3>${esc(p.name)}</h3>
        <p class="muted">${esc(p.short)}</p>
        <div class="price">${money(p.price)} <span class="muted" style="font-weight:400;font-size:14px">/ ${esc(p.size)}</span></div>
        <div class="card-actions">
          <button class="btn small" data-add="${p.id}" aria-label="${p.tags.includes("Coming later") ? "Pre-order" : "Add"} ${esc(p.name)}">${p.tags.includes("Coming later") ? "Pre-order" : "Add to cart"}</button>
          <a class="btn small secondary" href="#/product/${p.id}">Details</a>
        </div>
      </div>
    </article>`;

  const views = {
    home: () => `
      <section class="hero"><div class="wrap hero-grid">
        <div>
          <span class="eyebrow">New breakfast cereal</span>
          <h1>${esc(S.tagline)}</h1>
          <p class="lead">${esc(S.heroLead)}</p>
          <div class="btn-row"><a class="btn" href="#/shop">Shop the cereal</a><a class="btn secondary" href="#/about">Our story</a></div>
        </div>
        <div class="hero-art"><img src="${S.products[0].image}" alt="${esc(S.products[0].name)} box"></div>
      </div></section>
      <section><div class="wrap">
        <div class="features">
          <div class="feature"><div class="icon" aria-hidden="true">🍿</div><h3>Popcorn, not puffs</h3><p class="muted">Our whole-grain popcorn clusters give a light, satisfying crunch, in a bowl or by the handful.</p></div>
          <div class="feature"><div class="icon" aria-hidden="true">🍫</div><h3>Real dark chocolate</h3><p class="muted">A sweet and salty combo, aiming for less sugar than regular chocolate cereals.</p></div>
          <div class="feature"><div class="icon" aria-hidden="true">🌱</div><h3>Plant-based</h3><p class="muted">No dairy here. Delicious with oat milk, mixed into yogurt, or on its own.</p></div>
        </div>
      </div></section>
      <section style="padding-top:0"><div class="wrap">
        <h2>The lineup</h2>
        <div class="grid-products">${S.products.map(productCard).join("")}</div>
      </div></section>`,

    shop: () => `
      <section><div class="wrap">
        <h1>Shop</h1>
        <p class="muted">Free shipping on orders over ${money(S.freeShippingOver)}.</p>
        <div class="grid-products">${S.products.map(productCard).join("")}</div>
      </div></section>`,

    product: (id) => {
      const p = byId(id);
      if (!p) return views.notfound();
      return `
      <section><div class="wrap">
        <p><a href="#/shop">← Back to shop</a></p>
        <div class="detail">
          <div class="media"><img src="${p.image}" alt="${esc(p.name)} box"></div>
          <div>
            <div>${p.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
            <h1>${esc(p.name)}</h1>
            <p class="lead">${esc(p.short)}</p>
            <div class="price" style="font-size:26px">${money(p.price)} <span class="muted" style="font-weight:400;font-size:15px">/ ${esc(p.size)}</span></div>
            <div class="btn-row" style="align-items:center">
              <div class="qty" role="group" aria-label="Quantity"><button data-qty="-1" aria-label="Decrease quantity">−</button><span id="qty" aria-live="polite">1</span><button data-qty="1" aria-label="Increase quantity">+</button></div>
              <button class="btn" data-add-qty="${p.id}">Add to cart</button>
            </div>
            <table class="facts" aria-label="Product details">${p.facts.map(([k, v]) => `<tr><td>${esc(k)}</td><td>${esc(v)}</td></tr>`).join("")}</table>
            <p class="note">Protein and sugar goals are product-development targets for this prototype. Exact nutrition facts come after lab testing.</p>
            <p class="note"><strong>Popcorn can be a choking risk. Not for children under 4.</strong></p>
          </div>
        </div>
      </div></section>`;
    },

    cart: () => {
      const items = cartItems();
      if (!items.length) return `<section><div class="wrap"><h1>Your cart</h1><div class="panel"><p>Your cart is empty.</p><a class="btn" href="#/shop">Shop the cereal</a></div></div></section>`;
      const t = totals();
      return `
      <section><div class="wrap two-col">
        <div class="panel">
          <h1 style="font-size:32px">Your cart</h1>
          ${items.map(({ p, qty }) => `
            <div class="cart-row">
              <img src="${p.image}" alt="">
              <div><strong>${esc(p.name)}</strong><br><span class="muted">${money(p.price)} · ${esc(p.size)}</span><br><button class="link-btn" data-remove="${p.id}" aria-label="Remove ${esc(p.name)}">Remove</button></div>
              <div class="qty" role="group" aria-label="${esc(p.name)} quantity"><button data-cart="${p.id}" data-d="-1" aria-label="Decrease ${esc(p.name)} quantity">−</button><span>${qty}</span><button data-cart="${p.id}" data-d="1" aria-label="Increase ${esc(p.name)} quantity">+</button></div>
              <strong>${money(p.price * qty)}</strong>
            </div>`).join("")}
        </div>
        <div class="panel">
          <h3>Order summary</h3>
          ${summaryHtml(t)}
          <div class="btn-row"><a class="btn" href="#/checkout">Checkout</a></div>
          <p class="note">${t.ship === 0 ? "You get free shipping." : "Add " + money(S.freeShippingOver - t.sub) + " more for free shipping."}</p>
        </div>
      </div></section>`;
    },

    checkout: () => {
      if (!cartItems().length) return views.cart();
      const c = checkout;
      const t = totals();
      return `
      <section><div class="wrap two-col">
        <div class="panel">
          <div class="steps"><span>1 Cart</span><span class="on">2 Shipping &amp; payment</span><span>3 Confirmation</span></div>
          <h1 style="font-size:32px">Checkout</h1>
          <form id="checkoutForm" novalidate>
            <div class="row">
              <div><label for="name">Full name</label><input id="name" name="name" autocomplete="name" value="${esc(c.name || "")}"><div class="error" data-err="name"></div></div>
              <div><label for="email">Email</label><input id="email" name="email" type="email" autocomplete="email" value="${esc(c.email || "")}"><div class="error" data-err="email"></div></div>
            </div>
            <label for="address">Street address</label><input id="address" name="address" autocomplete="street-address" value="${esc(c.address || "")}"><div class="error" data-err="address"></div>
            <div class="row">
              <div><label for="city">City</label><input id="city" name="city" autocomplete="address-level2" value="${esc(c.city || "")}"><div class="error" data-err="city"></div></div>
              <div><label for="zip">ZIP code</label><input id="zip" name="zip" inputmode="numeric" autocomplete="postal-code" value="${esc(c.zip || "")}"><div class="error" data-err="zip"></div></div>
            </div>
            <label for="pay">Payment (simulation)</label>
            <select id="pay" name="pay">
              <option value="demo-card">Demo card •••• 4242 (no real charge)</option>
              <option value="demo-wallet">Demo digital wallet (no real charge)</option>
            </select>
            <p class="note">This is a class prototype. No payment details are collected and nothing is charged or shipped.</p>
            <div class="btn-row"><button class="btn" type="submit">Place demo order · ${money(t.total)}</button><a class="btn secondary" href="#/cart">Back to cart</a></div>
          </form>
        </div>
        <div class="panel"><h3>Order summary</h3>${cartItems().map(({ p, qty }) => `<div style="display:flex;justify-content:space-between;gap:10px"><span>${qty} × ${esc(p.name)}</span><span>${money(p.price * qty)}</span></div>`).join("")}${summaryHtml(t)}</div>
      </div></section>`;
    },

    confirm: (id) => {
      const o = lastOrder;
      if (!o || o.id !== id) return views.notfound();
      return `
      <section><div class="wrap confirm panel">
        <div class="big" aria-hidden="true">🎉</div>
        <div class="steps" style="justify-content:center"><span>1 Cart</span><span>2 Shipping &amp; payment</span><span class="on">3 Confirmation</span></div>
        <h1>Thanks, ${esc(o.name.split(" ")[0])}!</h1>
        <p>Your demo order <strong>${esc(o.id)}</strong> is confirmed. A confirmation would go to <strong>${esc(o.email)}</strong>.</p>
        <div style="text-align:left">${o.lines.map((l) => `<div style="display:flex;justify-content:space-between"><span>${l.qty} × ${esc(l.name)}</span><span>${money(l.total)}</span></div>`).join("")}
        <div class="summary"><div class="total"><span>Total (simulated)</span><span>${money(o.total)}</span></div></div></div>
        <p class="note">Estimated delivery to ${esc(o.city)}: 3 to 5 business days. Nothing was charged; this is a prototype.</p>
        <div class="btn-row" style="justify-content:center"><a class="btn" href="#/shop">Keep shopping</a></div>
      </div></section>`;
    },

    about: () => `
      <section><div class="wrap story">
        <div>
          <h1>Our story</h1>
          <p>Pop &amp; Dawn started with a sea salt dark chocolate popcorn cluster, inspired by our teammate's market research. Sweet and salty snacks are a hit, and our search found no popcorn breakfast cereal on U.S. shelves. So we made one.</p>
          <p>We plan to make each box with YouBar, a cereal maker in Los Angeles, using whole-grain popcorn, pea-protein crisps, dark chocolate and sea salt, with no dairy.</p>
          <p class="muted">We used AI tools to explore the market, test early ideas with a simulated consumer panel and build this site. Real people made every final decision, and we plan real taste tests before launch.</p>
          <div class="btn-row"><a class="btn" href="#/shop">Try it</a></div>
        </div>
        <div class="hero-art"><img src="${S.products[1].image}" alt="${esc(S.products[1].name)} box"></div>
      </div></section>`,

    notfound: () => `<section><div class="wrap"><h1>Page not found</h1><a class="btn" href="#/">Go home</a></div></section>`,
  };

  function summaryHtml(t) {
    return `<div class="summary">
      <div><span>Subtotal</span><span>${money(t.sub)}</span></div>
      <div><span>Shipping</span><span>${t.ship === 0 ? "Free" : money(t.ship)}</span></div>
      <div><span>Tax (est.)</span><span>${money(t.tax)}</span></div>
      <div class="total"><span>Total</span><span>${money(t.total)}</span></div>
    </div>`;
  }

  // ---------- router ----------
  function route(soft) {
    const parts = (location.hash.replace(/^#\/?/, "") || "").split("/");
    const name = parts[0] || "home";
    const view = Object.prototype.hasOwnProperty.call(views, name) ? views[name] : views.notfound;
    app.innerHTML = view(parts[1]);
    if (soft === true) return;
    app.classList.remove("page-enter"); void app.offsetWidth; app.classList.add("page-enter");
    if (name === "home") { popField(); splitHeadline(); }
    reveals();
    if (name === "confirm" && app.querySelector(".confirm")) confetti();
    document.querySelectorAll("[data-nav]").forEach((a) => a.classList.toggle("active", a.dataset.nav === (name === "product" ? "shop" : name)));
    const h1 = app.querySelector("h1");
    document.title = (name === "home" || !h1 ? "" : h1.textContent.trim() + " | ") + "Pop & Dawn";
    window.scrollTo(0, 0);
    app.focus({ preventScroll: true });
  }
  window.addEventListener("hashchange", route);

  // ---------- events ----------
  app.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.add) add(b.dataset.add, 1, b);
    if (b.dataset.qty) { const q = document.getElementById("qty"); q.textContent = Math.max(1, Math.min(20, +q.textContent + +b.dataset.qty)); }
    if (b.dataset.addQty) add(b.dataset.addQty, +document.getElementById("qty").textContent, b);
    if (b.dataset.cart) {
      const id = b.dataset.cart, d = b.dataset.d;
      cart[id] = Math.max(0, (cart[id] || 0) + +d); if (!cart[id]) delete cart[id];
      saveCart(); route(true);
      const again = app.querySelector(`[data-cart="${id}"][data-d="${d}"]`);
      (again || app).focus();
    }
    if (b.dataset.remove) { delete cart[b.dataset.remove]; saveCart(); route(true); app.focus(); }
  });

  app.addEventListener("submit", (e) => {
    if (e.target.id !== "checkoutForm") return;
    e.preventDefault();
    const f = Object.fromEntries([...new FormData(e.target).entries()].map(([k, v]) => [k, String(v).trim()]));
    const errs = {};
    if (!f.name.trim()) errs.name = "Enter your name.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email)) errs.email = "Enter a valid email.";
    if (!f.address.trim()) errs.address = "Enter a street address.";
    if (!f.city.trim()) errs.city = "Enter a city.";
    if (!/^\d{5}$/.test(f.zip)) errs.zip = "Enter a 5-digit ZIP code.";
    document.querySelectorAll("[data-err]").forEach((el) => {
      const k = el.dataset.err, input = document.getElementById(k);
      el.id = "err-" + k; el.textContent = errs[k] || "";
      if (input) { input.setAttribute("aria-describedby", el.id); input.setAttribute("aria-invalid", errs[k] ? "true" : "false"); }
    });
    checkout = { name: f.name, email: f.email, address: f.address, city: f.city, zip: f.zip };
    store.set("pd_checkout", checkout);
    const firstErr = Object.keys(errs)[0];
    if (firstErr) { document.getElementById(firstErr).focus(); return; }
    const t = totals();
    const id = "PD-" + Date.now().toString(36).toUpperCase().slice(-6);
    lastOrder = { id, name: f.name, email: f.email, city: f.city, total: t.total, lines: cartItems().map(({ p, qty }) => ({ name: p.name, qty, total: p.price * qty })) };
    store.set("pd_last_order", lastOrder);
    cart = {}; saveCart();
    location.hash = "#/confirm/" + id;
  });

  updateCount();
  route();
})();
