/* =====================================================
   サイト全体の設定（全ページ共通）。ここを編集してください
   ===================================================== */
const SITE = {
  name: "〇〇研究室",
  language: "ja",
  nav: [
    { label: "研究",           href: "index.html#research" },
    { label: "メンバー",       href: "index.html#members" },
    { label: "お知らせ",       href: "index.html#news" },
    { label: "配属希望の方へ", href: "index.html#join" }
  ],
  footerNote: "〇〇大学 〇〇学部 〇〇研究室",
  theme: {
    // "--accent": "#b97a00",
    // "--deep": "#0e2f3a",
  }
};

/* ===================== 共通処理（通常は編集不要） ===================== */
const $ = id => document.getElementById(id);
const el = (tag, props = {}, children = []) => {
  const e = Object.assign(document.createElement(tag), props);
  [].concat(children).forEach(c => e.append(c));
  return e;
};
const br = t => t.split("\n").flatMap((s, i) => i ? [el("br"), s] : [s]);   // "\n" で改行
const sec = (children, o = {}) => Object.assign(el("section", {}, children), o);
const h2 = text => el("h2", { textContent: text });
const ripples = () => {
  const d = el("div", { className: "ripples" });
  d.setAttribute("aria-hidden", "true");
  d.innerHTML = "<i></i><i></i><i></i><em></em>";
  return d;
};
const avatar = (p, cls = "av") => el("div", { className: cls },
  p.photo ? el("img", { src: p.photo, alt: p.name }) : p.name.trim().charAt(0));

document.documentElement.lang = SITE.language;
Object.entries(SITE.theme).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));

function renderChrome(pageTitle) {
  document.title = pageTitle ? `${pageTitle} | ${SITE.name}` : SITE.name;
  $("site-nav").append(
    el("a", { className: "logo", href: "index.html", textContent: SITE.name }),
    el("div", {}, SITE.nav.map(n => el("a", { href: n.href, textContent: n.label })))
  );
  $("site-footer").append(
    el("span", { textContent: `© ${new Date().getFullYear()} ${SITE.name}` }),
    el("span", { textContent: SITE.footerNote })
  );
}

/* 研究者ページ用の描画 */
function renderResearcher(R) {
  renderChrome(R.name);
  $("main").append(
    el("header", { className: "hero small" }, [
      ripples(),
      avatar(R),
      el("h1", { textContent: R.name }),
      el("p", { textContent: `${R.role}／${R.affiliation}` }),
      el("ul", { className: "tags" }, R.keywords.map(k => el("li", { textContent: k })))
    ]),
    sec([h2("研究概要"), el("div", { className: "text" }, R.summary.map(t => el("p", { textContent: t })))]),
    sec([h2("研究テーマ"), el("div", { className: "themes" }, R.topics.map(t =>
      el("article", { className: "theme" }, [
        el("h3", { textContent: t.title }),
        el("p", { textContent: t.text }),
        t.image ? el("img", { src: t.image, alt: t.title }) : ""
      ])))]),
    sec([h2("主な業績"), el("ul", { className: "pubs" }, R.publications.map(p =>
      el("li", {}, [
        el("span", { className: "year", textContent: p.year }),
        el("div", {}, [
          p.href ? el("a", { href: p.href, textContent: p.text, target: "_blank", rel: "noopener" }) : p.text,
          p.note ? el("span", { className: "note", textContent: p.note }) : ""
        ])
      ])))]),
    sec([
      h2("連絡先"),
      el("p", {}, el("a", { href: `mailto:${R.email}`, textContent: R.email })),
      ...(R.links || []).map(l => el("p", {}, el("a", { href: l.href, textContent: l.label, target: "_blank", rel: "noopener" }))),
      el("a", { className: "back", href: "index.html", textContent: "← ホームに戻る" })
    ], { className: "join" })
  );
}
