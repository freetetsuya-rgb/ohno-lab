/* =====================================================
   サイト全体の設定（全ページ共通）。ここを編集してください
   ===================================================== */
const SITE = {
  name: "大野研究室",
  language: "ja",
  nav: [
    { label: "研究",           href: "index.html#research" },
    { label: "活動内容",       href: "index.html#activities" },
    { label: "メンバー",       href: "index.html#members" },
    { label: "お知らせ",       href: "index.html#news" },
    { label: "配属希望の方へ", href: "index.html#join" }
  ],
  footerNote: "鹿児島大学 工学部 大野研究室",
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
/* 画像の読み込み。images フォルダに無いときは同じ場所も探し、無ければ場所を表示 */
const safeImg = (src, alt) => {
  const img = el("img", { alt });
  const flat = src.split("/").pop();
  let tried = false;
  img.onerror = () => {
    if (!tried && flat !== src) { tried = true; img.src = flat; return; }
    img.replaceWith(el("div", { className: "ph", textContent: `画像が見つかりません：${src}` }));
  };
  img.src = src;
  return img;
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

/* 図：図1, 図2… と登場順に自動で番号を付ける */
let figNo = 0;
const fig = f => {
  const label = `図${++figNo}` + (f.caption ? `　${f.caption}` : "");
  const fg = el("figure", {}, [
    f.src ? safeImg(f.src, label) : el("div", { className: "ph", textContent: "画像を入れてください" }),
    el("figcaption", { textContent: label })
  ]);
  if (f.width) fg.style.maxWidth = f.width;   // 画像の最大幅（例: "400px" や "50%"）
  return fg;
};

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
    sec([h2("研究テーマ"), el("div", { className: "themes one" }, R.topics.map(t =>
      el("article", { className: "theme" }, [
        el("h3", { textContent: t.title }),
        t.text ? el("p", { textContent: t.text }) : "",
        t.image ? safeImg(t.image, t.title) : ""
      ])))]),
    sec([
      h2("研究概要"),
      el("div", { className: "text" }, [
        ...R.summary.map(item => Array.isArray(item)
          ? el("div", { className: "figures" + (item.length === 1 ? " one" : "") }, item.map(fig))   // 画像を横に並べる
          : (typeof item === "object" ? fig(item) : el("p", { textContent: item }))),               // 画像 or 文章
        ...((R.figures && R.figures.length) ? [el("div", { className: "figures" + (R.figures.length === 1 ? " one" : "") }, R.figures.map(fig))] : [])   // 文章の後ろに置く画像（任意）
      ])
    ]),
    sec([
      h2("連絡先"),
      el("p", {}, el("a", { href: `mailto:${R.email}`, textContent: R.email })),
      ...(R.links || []).map(l => el("p", {}, el("a", { href: l.href, textContent: l.label, target: "_blank", rel: "noopener" }))),
      el("a", { className: "back", href: "index.html", textContent: "← ホームに戻る" })
    ], { className: "join" })
  );
}
