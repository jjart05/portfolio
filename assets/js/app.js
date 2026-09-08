/**
 * Renders the portfolio from content.js and wires up every interaction.
 *
 * Structure:
 *   helpers -> render passes -> behaviours -> boot
 *
 * Nothing here needs editing to change the site's content; edit content.js.
 */
(function () {
  "use strict";

  var DATA = window.PORTFOLIO || {};
  var identity = DATA.identity || {};
  var contact = DATA.contact || {};
  var settings = DATA.settings || {};
  var THEME_KEY = "portfolio-theme";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ======================= HELPERS ====================================== */

  function $(sel, scope) { return (scope || document).querySelector(sel); }
  function $$(sel, scope) { return Array.prototype.slice.call((scope || document).querySelectorAll(sel)); }

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        var value = attrs[key];
        if (value === null || value === undefined || value === false) return;
        if (key === "class") node.className = value;
        else if (key === "text") node.textContent = value;
        else if (value === true) node.setAttribute(key, "");
        else node.setAttribute(key, value);
      });
    }
    (children || []).forEach(function (child) {
      if (!child && child !== 0) return;
      node.appendChild(typeof child === "string" || typeof child === "number"
        ? document.createTextNode(String(child))
        : child);
    });
    return node;
  }

  function icon(name, className) {
    var NS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("class", className || "icon");
    svg.setAttribute("aria-hidden", "true");
    var use = document.createElementNS(NS, "use");
    use.setAttribute("href", "#i-" + name);
    svg.appendChild(use);
    return svg;
  }

  function list(value) { return Array.isArray(value) ? value : []; }

  function toggleSection(selector, hasContent) {
    var section = $(selector);
    if (section) section.hidden = !hasContent;
    return !!hasContent;
  }

  function initialsFrom(name) {
    var parts = String(name || "").replace(/[\[\]]/g, "").trim().split(/\s+/);
    if (!parts[0]) return "—";
    var first = parts[0].charAt(0);
    var last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : "";
    return (first + last).toUpperCase();
  }

  function splitName(name) {
    var parts = String(name || "").trim().split(/\s+/).filter(Boolean);
    return {
      first: parts[0] || "",
      last: parts.slice(1).join(" "),
    };
  }

  function isExternal(url) { return /^https?:\/\//i.test(url || ""); }

  function hostnameFrom(url) {
    try { return new URL(url).hostname.replace(/^www\./, ""); }
    catch (e) { return ""; }
  }

  function yearOf(entry) {
    if (entry && entry.year) return String(entry.year);
    var match = String((entry && entry.period) || "").match(/\d{4}/);
    return match ? match[0] : "";
  }

  function padStat(value) {
    if (typeof value !== "number" || value % 1 !== 0) return String(value);
    return value < 10 ? "0" + value : String(value);
  }

  function liveLink(project) {
    return list(project.links).filter(function (l) { return l && l.url; })[0] || null;
  }

  /* ==================== RENDER: HEAD & IDENTITY ========================= */

  function renderMeta() {
    var name = identity.name || "Portfolio";
    var role = identity.kicker || "";
    var title = settings.seoTitle || (role ? name + " — " + role : name);
    var description = settings.seoDescription || identity.lede || identity.summary || "";

    document.title = title;

    var pairs = [
      ["meta[name='description']", "content", description],
      ["meta[name='author']", "content", name],
      ["meta[property='og:title']", "content", title],
      ["meta[property='og:description']", "content", description],
      ["meta[name='twitter:card']", "content", "summary_large_image"],
      ["meta[name='twitter:title']", "content", title],
      ["meta[name='twitter:description']", "content", description],
    ];
    pairs.forEach(function (pair) {
      var node = $(pair[0]);
      if (node && pair[2]) node.setAttribute(pair[1], pair[2]);
    });

    if (settings.siteUrl && settings.siteUrl.indexOf("[") === -1) {
      document.head.appendChild(el("link", { rel: "canonical", href: settings.siteUrl }));
      document.head.appendChild(el("meta", { property: "og:url", content: settings.siteUrl }));
    }

    if (identity.photo) {
      document.head.appendChild(el("meta", { property: "og:image", content: identity.photo }));
      document.head.appendChild(el("meta", { name: "twitter:image", content: identity.photo }));
    }

    var schema = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: name,
      jobTitle: role,
      description: description,
      email: contact.email ? "mailto:" + contact.email : undefined,
      url: settings.siteUrl,
      image: identity.photo || undefined,
      address: identity.location ? { "@type": "PostalAddress", addressLocality: identity.location } : undefined,
      sameAs: list(contact.socials).map(function (s) { return s.url; }),
    };
    var script = el("script", { type: "application/ld+json" });
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  function renderIdentity() {
    var names = splitName(identity.name);
    var values = {
      name: identity.name,
      firstName: names.first,
      lastName: names.last,
      kicker: identity.kicker,
      eyebrow: identity.eyebrow || [identity.kicker, identity.location].filter(Boolean).join(" · "),
      headline: identity.headline,
      lede: identity.lede,
      summary: identity.summary,
      location: identity.location,
      availability: identity.availability,
      initials: initialsFrom(identity.name),
      email: contact.email,
      pitch: contact.pitch,
    };

    Object.keys(values).forEach(function (key) {
      if (!values[key]) return;
      $$("[data-bind='" + key + "']").forEach(function (node) {
        node.textContent = values[key];
      });
    });

    if (identity.availability) $("[data-availability]").hidden = false;
    if (identity.location) $("[data-location]").hidden = false;

    if (identity.photo) {
      var img = $("[data-portrait-img]");
      img.src = identity.photo;
      img.alt = identity.name ? "Portrait of " + identity.name : "Portrait";
      img.hidden = false;
      var fallback = $(".portrait__initials");
      if (fallback) fallback.hidden = true;
    }

    if (identity.resume) {
      var cv = $("[data-resume-link]");
      cv.href = identity.resume;
      cv.hidden = false;
    }

    if (contact.email) {
      var subject = encodeURIComponent("Hello " + (identity.name || "") + " — from your portfolio");
      $("[data-mail-link]").href = "mailto:" + contact.email + "?subject=" + subject;
    }

    var year = $("[data-year]");
    if (year) year.textContent = new Date().getFullYear();
  }

  function renderSocials() {
    var socials = list(contact.socials).filter(function (s) { return s && s.url; });
    if (!socials.length) return;

    $$("[data-socials], [data-socials-footer]").forEach(function (container) {
      container.innerHTML = "";
      socials.forEach(function (social) {
        var link = el("a", {
          href: social.url,
          target: "_blank",
          rel: "noopener noreferrer",
          "aria-label": social.label || "Profile",
          title: social.label || "Profile",
        }, [icon(social.icon || "link")]);
        container.appendChild(el("li", null, [link]));
      });
    });
  }

  function renderSectionHeads() {
    var config = DATA.sections || {};
    var counter = 0;

    $$("[data-section-head]").forEach(function (head) {
      var key = head.getAttribute("data-section-head");
      var copy = config[key] || {};
      var section = head.closest("section");
      if (section && section.hidden) return;
      counter++;

      var label = $(".section__label", head);
      var title = $(".section__title, .contact__title", head);
      var sub = $(".section__sub", head);

      if (label) {
        if (copy.label) {
          var number = ("0" + counter).slice(-2);
          label.textContent = number + " — " + copy.label;
        } else {
          label.remove();
        }
      }
      if (title && copy.title) title.textContent = copy.title;
      if (sub) {
        if (copy.sub) sub.textContent = copy.sub;
        else sub.remove();
      }
    });
  }

  function renderFloaters() {
    var host = $("[data-floaters]");
    if (!host) return;

    var items = list(DATA.marquee).filter(Boolean).slice(0, 6);
    if (!items.length) return;

    var slots = [
      { top: "16%", right: "6%", depth: 0.22 },
      { top: "28%", right: "24%", depth: 0.45 },
      { top: "48%", right: "3%", depth: 0.18 },
      { top: "62%", right: "21%", depth: 0.38 },
      { top: "76%", right: "8%", depth: 0.28 },
      { top: "38%", right: "36%", depth: 0.55 },
    ];

    items.forEach(function (label, i) {
      var slot = slots[i] || slots[0];
      var node = el("span", { class: "hero__floater", text: label });
      node.style.top = slot.top;
      node.style.right = slot.right;
      node.style.setProperty("--depth", String(slot.depth));
      host.appendChild(node);
    });
  }

  function renderManifesto() {
    var words = list(identity.hook).filter(Boolean);
    if (!words.length) words = ["Build", "Ship", "Learn"];
    var host = $("[data-manifesto]");
    if (!host) return;

    words.forEach(function (word, i) {
      if (i > 0) {
        host.appendChild(el("span", {
          class: "manifesto__sep",
          "aria-hidden": "true",
          text: "·",
        }));
      }
      host.appendChild(el("span", {
        class: "manifesto__word" + (i === 1 ? " is-solid" : ""),
        text: word,
      }));
    });
  }

  /* ======================= RENDER: SECTIONS ============================= */

  function renderStats() {
    var container = $("[data-stats]");
    var stats = list(DATA.stats);
    if (!container) return;
    if (!stats.length) { container.remove(); return; }

    stats.forEach(function (stat, i) {
      var start = prefersReducedMotion ? padStat(stat.value) + (stat.suffix || "") : padStat(0);
      container.appendChild(el("div", {
        class: "stat",
        "data-reveal": true,
        style: "--reveal-delay:" + (i * 0.08) + "s",
      }, [
        el("span", {
          class: "stat__value",
          "data-count-to": stat.value,
          "data-count-suffix": stat.suffix || "",
          text: start,
        }),
        el("span", { class: "stat__label", text: stat.label || "" }),
      ]));
    });
  }

  function renderMarquee() {
    var items = list(DATA.marquee).filter(Boolean);
    if (!toggleSection("[data-marquee-section]", items.length >= 3)) return;

    var track = $("[data-marquee]");
    for (var pass = 0; pass < 2; pass++) {
      items.forEach(function (label) {
        track.appendChild(el("span", {
          class: "marquee__item",
          text: label,
          "aria-hidden": pass === 1 ? "true" : null,
        }));
      });
    }
  }

  function renderServices() {
    var container = $("[data-services]");
    var services = list(DATA.services);
    if (!container) return;
    if (!services.length) { container.remove(); return; }

    services.forEach(function (service, i) {
      var item = el("li", {
        class: "service",
        "data-reveal": true,
        style: "--reveal-delay:" + (i * 0.1) + "s",
      }, [
        el("span", { class: "service__index", text: ("0" + (i + 1)).slice(-2) }),
        el("div", null, [
          el("h3", { class: "service__title", text: service.title || "" }),
          el("p", { class: "service__body", text: service.body || "" }),
        ]),
      ]);
      container.appendChild(item);
    });
  }

  function renderSkills() {
    var groups = list(DATA.skills).filter(function (g) { return g && list(g.items).length; });
    if (!toggleSection("[data-skills-section]", groups.length)) return;

    var container = $("[data-skills]");
    groups.forEach(function (group, i) {
      var block = el("div", {
        class: "skill-group",
        "data-reveal": true,
        style: "--reveal-delay:" + (i * 0.07) + "s",
      }, [
        el("h3", { class: "skill-group__title", text: group.group || "" }),
        el("ul", { class: "skill-group__items" }, list(group.items).map(function (item) {
          return el("li", { text: item });
        })),
      ]);
      container.appendChild(block);
    });
  }

  function linkButtons(project) {
    var links = list(project.links).filter(function (l) { return l && l.url; });
    if (!links.length) return null;
    return el("div", { class: "card__links showcase__links" }, links.map(function (link) {
      return el("a", {
        class: "btn btn--sm " + (link.type === "primary" ? "btn--primary" : "btn--ghost"),
        href: link.url,
        target: isExternal(link.url) ? "_blank" : null,
        rel: isExternal(link.url) ? "noopener noreferrer" : null,
      }, [
        document.createTextNode(link.label || "View"),
        icon(isExternal(link.url) ? "external" : "arrow"),
      ]);
    }));
  }

  function stackRow(project, className) {
    var stack = list(project.stack);
    if (!stack.length) return null;
    return el("div", { class: className || "card__stack" }, stack.map(function (tech) {
      return el("span", { class: "chip", text: tech });
    }));
  }

  function gallerySlides(project) {
    var slides = list(project.gallery).filter(function (slide) {
      return slide && (slide.src || slide.image);
    }).map(function (slide) {
      return {
        src: slide.src || slide.image,
        label: slide.label || slide.title || "",
      };
    });
    if (!slides.length && project.image) {
      slides = [{ src: project.image, label: project.title || "" }];
    }
    return slides;
  }

  function deviceChrome(project, slide) {
    var live = list(project.links).filter(function (l) {
      return l && l.url && (l.type === "primary" || /live|demo|site/i.test(l.label || ""));
    })[0] || liveLink(project);
    var host = live ? hostnameFrom(live.url) : "";
    var src = slide && slide.src;
    var label = (slide && slide.label) || project.title || "Project screenshot";

    var screen = el("div", { class: "device__screen" });
    var fallback = el("div", { class: "device__fallback" }, [
      el("span", { class: "device__fallback-kicker", text: list(project.tags)[0] || "Project" }),
      el("span", { class: "device__fallback-title", text: project.title || "" }),
    ]);

    if (src) {
      var img = el("img", {
        src: src,
        alt: project.title ? project.title + " — " + label : label,
        loading: "lazy",
        decoding: "async",
      });
      img.addEventListener("error", function () {
        screen.classList.add("is-fallback");
      });
      screen.appendChild(img);
    } else {
      screen.classList.add("is-fallback");
    }
    screen.appendChild(fallback);
    screen.appendChild(el("div", { class: "device__shine" }));

    return el("div", { class: "device" }, [
      el("div", { class: "device__chrome" }, [
        el("div", { class: "device__dots" }, [el("span"), el("span"), el("span")]),
        host ? el("span", { class: "device__url", text: host }) : null,
      ]),
      screen,
    ]);
  }

  function deviceFrame(project) {
    var slides = gallerySlides(project);
    return el("div", { class: "device-stage" }, [
      deviceChrome(project, slides[0] || { src: project.image, label: project.title }),
    ]);
  }

  function stackCarousel(project) {
    var slides = gallerySlides(project);
    var title = project.title || "Project";

    var cards = slides.map(function (slide, i) {
      return el("button", {
        class: "stack__card" + (i === 0 ? " is-active" : ""),
        type: "button",
        "data-index": String(i),
        "data-label": slide.label || ("Screen " + (i + 1)),
        "aria-label": "Next screen, currently " + (slide.label || "screen " + (i + 1)),
        tabindex: i === 0 ? "0" : "-1",
      }, [deviceChrome(project, slide)]);
    });

    var caption = el("p", {
      class: "stack__caption",
      "data-stack-caption": true,
      text: slides[0] && slides[0].label ? slides[0].label : title,
    });
    var status = el("span", {
      class: "stack__status",
      "data-stack-status": true,
      text: "01 / " + ("0" + slides.length).slice(-2),
    });

    return el("div", {
      class: "stack",
      "data-stack": true,
      "data-count": String(slides.length),
      tabindex: "0",
      role: "region",
      "aria-roledescription": "carousel",
      "aria-label": title + " screens",
    }, [
      el("p", { class: "stack__hint", text: "Click the stack for the next screen" }),
      el("div", { class: "stack__stage" }, [
        el("div", { class: "stack__scene", "data-stack-scene": true }, cards),
      ]),
      el("div", { class: "stack__bar" }, [
        el("button", {
          class: "stack__nav",
          type: "button",
          "data-stack-prev": true,
          "aria-label": "Previous screen",
        }, [icon("arrow")]),
        el("div", { class: "stack__meta" }, [caption, status]),
        el("button", {
          class: "stack__nav stack__nav--next",
          type: "button",
          "data-stack-next": true,
          "aria-label": "Next screen",
        }, [icon("arrow")]),
      ]),
      el("div", {
        class: "stack__dots",
        role: "tablist",
        "aria-label": title + " screens",
      }, slides.map(function (slide, i) {
        return el("button", {
          class: "stack__dot" + (i === 0 ? " is-active" : ""),
          type: "button",
          role: "tab",
          "data-index": String(i),
          "aria-label": slide.label || ("Screen " + (i + 1)),
          "aria-selected": i === 0 ? "true" : "false",
        });
      })),
    ]);
  }

  function projectShowcase(project, index) {
    var tags = list(project.tags);
    var metrics = list(project.metrics).filter(function (m) { return m && m.value; });
    var number = ("0" + (index + 1)).slice(-2);

    var copy = el("div", { class: "showcase__copy" }, [
      el("span", { class: "showcase__index", text: number }),
      el("div", { class: "showcase__top" }, [
        tags.length ? el("span", { class: "chip chip--tint", text: tags[0] }) : null,
        project.year ? el("span", { class: "showcase__year", text: project.year }) : null,
      ]),
      el("h3", { class: "showcase__title", text: project.title || "Untitled project" }),
      project.tagline ? el("p", { class: "showcase__tagline", text: project.tagline }) : null,
      project.body ? el("p", { class: "showcase__text", text: project.body }) : null,
      metrics.length
        ? el("div", { class: "showcase__metrics" }, metrics.map(function (m) {
            return el("div", { class: "metric" }, [
              el("span", { class: "metric__value", text: m.value }),
              el("span", { class: "metric__label", text: m.label || "" }),
            ]);
          }))
        : null,
      stackRow(project, "showcase__stack"),
      linkButtons(project),
    ]);

    var slides = gallerySlides(project);
    var media = slides.length > 1 ? stackCarousel(project) : deviceFrame(project);

    return el("article", {
      class: "showcase" + (slides.length > 1 ? " showcase--gallery" : ""),
      "data-tags": tags.join("|"),
      "data-reveal": true,
      style: "--reveal-delay:" + Math.min(index * 0.08, 0.24) + "s",
    }, [
      copy,
      el("div", { class: "showcase__media" }, [media]),
    ]);
  }

  function projectCard(project, index) {
    var tags = list(project.tags);

    var textCol = el("div", { class: "card__col" }, [
      el("div", { class: "card__top" }, [
        tags.length ? el("span", { class: "chip chip--tint", text: tags[0] }) : null,
        project.year ? el("span", { class: "card__year", text: project.year }) : null,
      ]),
      el("h3", { class: "card__title" }, [
        document.createTextNode(project.title || "Untitled project"),
        icon("arrow", "icon card__arrow"),
      ]),
      project.tagline ? el("p", { class: "card__tagline", text: project.tagline }) : null,
      stackRow(project),
      linkButtons(project),
    ]);

    return el("article", {
      class: "card",
      "data-tags": tags.join("|"),
      "data-reveal": true,
      style: "--reveal-delay:" + Math.min(index * 0.08, 0.4) + "s",
    }, [textCol]);
  }

  function renderProjects() {
    var projects = list(DATA.projects).filter(function (p) { return p && p.title; });
    if (!toggleSection("[data-work-section]", projects.length)) return;

    var tags = [];
    projects.forEach(function (p) {
      list(p.tags).forEach(function (tag) {
        if (tags.indexOf(tag) === -1) tags.push(tag);
      });
    });

    var featuredHost = $("[data-featured]");
    var cardHost = $("[data-projects]");
    var featuredIndex = 0;

    projects.forEach(function (project, i) {
      if (project.featured) {
        featuredHost.appendChild(projectShowcase(project, featuredIndex));
        featuredIndex += 1;
      } else {
        cardHost.appendChild(projectCard(project, i));
      }
    });

    if (!featuredIndex && featuredHost) featuredHost.remove();
    if (!cardHost.children.length && cardHost) cardHost.remove();

    var filterBar = $("[data-filters]");
    if (!filterBar) return;
    if (tags.length < 2) { filterBar.remove(); return; }

    ["All"].concat(tags).forEach(function (tag, i) {
      var button = el("button", {
        class: "filter",
        type: "button",
        "data-filter": tag,
        "aria-pressed": i === 0 ? "true" : "false",
        text: tag,
      });
      filterBar.appendChild(button);
    });
  }

  function renderExperience() {
    var jobs = list(DATA.experience).filter(function (j) { return j && (j.role || j.company); });
    if (!toggleSection("[data-experience-section]", jobs.length)) return;

    var container = $("[data-experience]");
    jobs.forEach(function (job, i) {
      var bullets = list(job.bullets);
      var stack = list(job.stack);
      var year = yearOf(job);

      var entry = el("li", {
        class: "tl-item",
        "data-reveal": true,
        style: "--reveal-delay:" + (i * 0.08) + "s",
      }, [
        el("span", { class: "tl-item__year", text: year || "" }),
        el("div", { class: "tl-item__body" }, [
          el("h3", { class: "tl-item__role" }, [
            document.createTextNode(job.role || ""),
            job.company ? el("span", { class: "tl-item__company", text: "  ·  " + job.company }) : null,
          ]),
          job.period ? el("span", { class: "tl-item__period", text: job.period }) : null,
          job.location ? el("p", { class: "tl-item__place", text: job.location }) : null,
          bullets.length
            ? el("ul", { class: "tl-item__bullets" }, bullets.map(function (b) {
                return el("li", { text: b });
              }))
            : null,
          stack.length
            ? el("div", { class: "tl-item__stack" }, stack.map(function (tech) {
                return el("span", { class: "chip", text: tech });
              }))
            : null,
        ]),
      ]);
      container.appendChild(entry);
    });
  }

  function renderEducation() {
    var entries = list(DATA.education).filter(function (e) { return e && e.title; });
    if (!toggleSection("[data-education-section]", entries.length)) return;

    var container = $("[data-education]");
    entries.forEach(function (entry, i) {
      container.appendChild(el("li", {
        class: "edu",
        "data-reveal": true,
        style: "--reveal-delay:" + (i * 0.08) + "s",
      }, [
        el("div", null, [
          el("h3", { class: "edu__title", text: entry.title }),
          entry.org ? el("p", { class: "edu__org", text: entry.org }) : null,
        ]),
        entry.period ? el("p", { class: "edu__meta", text: entry.period }) : null,
        entry.detail ? el("p", { class: "edu__detail", text: entry.detail }) : null,
      ]));
    });
  }

  function renderTestimonials() {
    var quotes = list(DATA.testimonials).filter(function (t) { return t && t.quote; });
    if (!toggleSection("[data-testimonials-section]", quotes.length)) return;

    var container = $("[data-testimonials]");
    quotes.forEach(function (item, i) {
      container.appendChild(el("li", {
        class: "quote",
        "data-reveal": true,
        style: "--reveal-delay:" + (i * 0.1) + "s",
      }, [
        icon("quote", "icon quote__icon"),
        el("blockquote", { class: "quote__text", text: item.quote }),
        el("p", { class: "quote__author", text: item.author || "" }),
        item.title ? el("p", { class: "quote__role", text: item.title }) : null,
      ]));
    });
  }

  /* ========================= BEHAVIOURS ================================= */

  function initTheme() {
    var stored = null;
    try { stored = localStorage.getItem(THEME_KEY); } catch (e) { /* ignore */ }

    var initial = stored || (settings.defaultTheme === "light" ? "light" : "dark");
    document.documentElement.setAttribute("data-theme", initial);

    var toggle = $("[data-theme-toggle]");
    if (!toggle) return;

    function sync(theme) {
      toggle.setAttribute("aria-label",
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
    }
    sync(initial);

    toggle.addEventListener("click", function () {
      var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      sync(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* ignore */ }
    });
  }

  function initReveal() {
    var targets = $$("[data-reveal]");
    if (!("IntersectionObserver" in window) || prefersReducedMotion) {
      targets.forEach(function (t) { t.classList.add("is-visible"); });
      startCounters($$("[data-count-to]"));
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        startCounters($$("[data-count-to]", entry.target));
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -60px 0px" });

    targets.forEach(function (t) { observer.observe(t); });
  }

  function startCounters(nodes) {
    nodes.forEach(function (node) {
      if (node.dataset.counted) return;
      node.dataset.counted = "1";

      var target = parseFloat(node.getAttribute("data-count-to"));
      var suffix = node.getAttribute("data-count-suffix") || "";
      if (isNaN(target)) { node.textContent = node.getAttribute("data-count-to") + suffix; return; }

      if (prefersReducedMotion) {
        node.textContent = padStat(target) + suffix;
        return;
      }

      var duration = 1400;
      var startedAt = null;

      function tick(now) {
        if (startedAt === null) startedAt = now;
        var progress = Math.min((now - startedAt) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var value = target * eased;
        var shown = target % 1 === 0 ? Math.round(value) : value.toFixed(1);
        node.textContent = (target % 1 === 0 ? padStat(shown) : shown) + suffix;
        if (progress < 1) window.requestAnimationFrame(tick);
      }
      window.requestAnimationFrame(tick);
    });
  }

  function initRoles() {
    var host = $("[data-roles]");
    var roles = list(identity.roles).filter(Boolean);
    if (!host || !roles.length) return;

    if (prefersReducedMotion || roles.length === 1) {
      host.textContent = roles[0];
      return;
    }

    var index = 0;
    var chars = 0;
    var deleting = false;

    function tick() {
      var text = roles[index];
      chars += deleting ? -1 : 1;
      host.textContent = text.slice(0, chars);

      var delay = deleting ? 26 : 52;
      if (!deleting && chars === text.length) {
        deleting = true;
        delay = 2100;
      } else if (deleting && chars === 0) {
        deleting = false;
        index = (index + 1) % roles.length;
        delay = 320;
      }
      window.setTimeout(tick, delay);
    }
    window.setTimeout(tick, 700);
  }

  function initStack() {
    $$("[data-stack]").forEach(function (root) {
      var cards = $$(".stack__card", root);
      var dots = $$(".stack__dot", root);
      var caption = $("[data-stack-caption]", root);
      var status = $("[data-stack-status]", root);
      var prev = $("[data-stack-prev]", root);
      var next = $("[data-stack-next]", root);
      var scene = $("[data-stack-scene]", root);
      var total = cards.length;
      if (total < 2) return;

      var active = 0;
      var startX = 0;
      var tracking = false;
      var swiped = false;
      var scatter = [
        { rz: -1.8, x: -3, y: 9 },
        { rz: 2.2, x: 4, y: 16 },
        { rz: -2.4, x: -2, y: 22 },
        { rz: 1.8, x: 3, y: 28 },
        { rz: -2.0, x: -2, y: 33 },
      ];

      function names() {
        return cards.map(function (card) {
          return card.getAttribute("data-label") || "";
        });
      }

      function layout() {
        var labels = names();
        cards.forEach(function (card, i) {
          var depth = (i - active + total) % total;
          var s = scatter[i % scatter.length];
          var front = depth === 0;
          card.style.setProperty("--depth", String(depth));
          card.style.setProperty("--ox", (front ? 0 : s.x) + "px");
          card.style.setProperty("--oy", (front ? 6 : s.y) + "px");
          card.style.setProperty("--rz", (s.rz * (front ? 0.12 : 1)) + "deg");
          card.style.zIndex = String(40 - depth);
          card.classList.toggle("is-active", front);
          card.tabIndex = front ? 0 : -1;
          card.style.pointerEvents = front ? "auto" : "none";
          card.style.opacity = "1";
          card.style.visibility = "visible";
          card.setAttribute(
            "aria-label",
            "Next screen, currently " + (labels[i] || ("screen " + (i + 1)))
          );
        });
        dots.forEach(function (dot, i) {
          var on = i === active;
          dot.classList.toggle("is-active", on);
          dot.setAttribute("aria-selected", on ? "true" : "false");
        });
        if (caption) caption.textContent = labels[active] || "";
        if (status) {
          status.textContent =
            ("0" + (active + 1)).slice(-2) + " / " + ("0" + total).slice(-2);
        }
      }

      function go(index) {
        if (!total) return;
        var nextIndex = ((index % total) + total) % total;
        if (nextIndex === active) return;
        active = nextIndex;
        layout();
      }

      function step(dir) {
        active = (active + dir + total) % total;
        layout();
      }

      root.addEventListener("click", function (event) {
        if (swiped) {
          swiped = false;
          event.preventDefault();
          return;
        }
        var dot = event.target.closest(".stack__dot");
        if (dot && root.contains(dot)) {
          go(Number(dot.getAttribute("data-index")), true);
          return;
        }
        if (event.target.closest("[data-stack-scene]")) step(1);
      });

      if (prev) prev.addEventListener("click", function (event) {
        event.stopPropagation();
        step(-1);
      });
      if (next) next.addEventListener("click", function (event) {
        event.stopPropagation();
        step(1);
      });

      root.addEventListener("keydown", function (event) {
        if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
          event.preventDefault();
          step(-1);
        } else if (event.key === "ArrowRight" || event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          step(1);
        } else if (event.key === "Home") {
          event.preventDefault();
          go(0, false);
        } else if (event.key === "End") {
          event.preventDefault();
          go(total - 1, false);
        }
      });

      if (scene) {
        scene.addEventListener("pointerdown", function (event) {
          if (event.pointerType === "mouse" && event.button !== 0) return;
          tracking = true;
          swiped = false;
          startX = event.clientX;
        });
      }
      window.addEventListener("pointerup", function (event) {
        if (!tracking) return;
        tracking = false;
        var dx = event.clientX - startX;
        if (Math.abs(dx) < 48) return;
        swiped = true;
        step(dx < 0 ? 1 : -1);
      });
      window.addEventListener("pointercancel", function () {
        tracking = false;
        swiped = false;
      });

      layout();
    });
  }

  function initFilters() {
    var bar = $("[data-filters]");
    if (!bar) return;

    var empty = $("[data-projects-empty]");

    bar.addEventListener("click", function (event) {
      var button = event.target.closest(".filter");
      if (!button) return;

      var active = button.getAttribute("data-filter");
      $$(".filter", bar).forEach(function (b) {
        b.setAttribute("aria-pressed", b === button ? "true" : "false");
      });

      var shown = 0;
      $$("[data-tags]").forEach(function (card) {
        var tags = (card.getAttribute("data-tags") || "").split("|");
        var match = active === "All" || tags.indexOf(active) !== -1;
        card.classList.toggle("is-hidden", !match);
        if (match) shown++;
      });

      if (empty) empty.hidden = shown > 0;
    });
  }

  function initHeader() {
    var header = $("[data-header]");
    var bar = $("[data-progress-bar]");
    var indexNode = $("[data-progress-index]");
    var sections = $$("main section[id]").filter(function (s) { return !s.hidden; });
    var navLinks = $$("[data-nav] a, [data-mobile-nav] a");
    var ticking = false;

    function update() {
      var y = window.scrollY || 0;
      if (header) {
        header.classList.toggle("is-stuck", y > 8);
        header.classList.toggle("is-compact", y > 48);
      }

      if (bar) {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.height = (max > 0 ? Math.min(y / max, 1) * 100 : 0) + "%";
      }

      if (indexNode && sections.length) {
        var current = 0;
        sections.forEach(function (section, i) {
          if (section.getBoundingClientRect().top <= window.innerHeight * 0.42) current = i;
        });
        indexNode.textContent =
          ("0" + (current + 1)).slice(-2) + " / " + ("0" + sections.length).slice(-2);
      }
      ticking = false;
    }

    window.addEventListener("scroll", function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }, { passive: true });
    update();

    if ("IntersectionObserver" in window && sections.length) {
      var navHrefs = navLinks.map(function (link) { return link.getAttribute("href"); });
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = entry.target.id;
          navLinks.forEach(function (link) {
            var isCurrent = link.getAttribute("href") === "#" + id;
            if (isCurrent) link.setAttribute("aria-current", "true");
            else link.removeAttribute("aria-current");
          });
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      sections.forEach(function (s) {
        if (navHrefs.indexOf("#" + s.id) !== -1) spy.observe(s);
      });
    }
  }

  function initMobileNav() {
    var toggle = $("[data-nav-toggle]");
    var panel = $("[data-mobile-nav]");
    if (!toggle || !panel) return;

    function setOpen(open) {
      panel.hidden = !open;
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }

    toggle.addEventListener("click", function () {
      setOpen(panel.hidden);
    });

    panel.addEventListener("click", function (event) {
      if (event.target.tagName === "A") setOpen(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !panel.hidden) {
        setOpen(false);
        toggle.focus();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 760 && !panel.hidden) setOpen(false);
    }, { passive: true });
  }

  function initCardSpotlight() {
    if (!canHover) return;

    document.addEventListener("pointermove", function (event) {
      var card = event.target.closest(".card, .showcase");
      if (!card) return;
      var rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", (event.clientX - rect.left) + "px");
      card.style.setProperty("--my", (event.clientY - rect.top) + "px");
    }, { passive: true });
  }

  function initDepth() {
    var hero = $("[data-hero]");
    if (!hero || prefersReducedMotion || !canHover) return;

    var portrait = $("[data-portrait]");
    var ticking = false;
    var px = 0;
    var py = 0;

    hero.addEventListener("pointermove", function (event) {
      var rect = hero.getBoundingClientRect();
      px = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      py = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        hero.style.setProperty("--mx", px.toFixed(3));
        hero.style.setProperty("--my", py.toFixed(3));
        if (portrait) {
          portrait.style.transform =
            "translate3d(" + (px * 10).toFixed(1) + "px," + (py * 8).toFixed(1) + "px,0)";
        }
        ticking = false;
      });
    }, { passive: true });

    hero.addEventListener("pointerleave", function () {
      hero.style.setProperty("--mx", "0");
      hero.style.setProperty("--my", "0");
      if (portrait) portrait.style.transform = "";
    });
  }

  function initCursor() {
    var cursor = $("[data-cursor]");
    if (!cursor || prefersReducedMotion || !canHover) return;

    cursor.hidden = false;
    document.body.classList.add("has-cursor");

    var x = window.innerWidth / 2;
    var y = window.innerHeight / 2;
    var cx = x;
    var cy = y;
    var frame = null;

    function loop() {
      cx += (x - cx) * 0.2;
      cy += (y - cy) * 0.2;
      cursor.style.transform = "translate3d(" + cx + "px," + cy + "px,0)";
      frame = window.requestAnimationFrame(loop);
    }

    window.addEventListener("pointermove", function (event) {
      x = event.clientX;
      y = event.clientY;
      var hot = event.target.closest("a, button");
      cursor.classList.toggle("is-hover", !!hot);
    }, { passive: true });

    document.addEventListener("mouseleave", function () { cursor.style.opacity = "0"; });
    document.addEventListener("mouseenter", function () { cursor.style.opacity = "1"; });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden && frame) {
        window.cancelAnimationFrame(frame);
        frame = null;
      } else if (!document.hidden && frame === null) {
        frame = window.requestAnimationFrame(loop);
      }
    });

    frame = window.requestAnimationFrame(loop);
  }

  function toast(message) {
    var node = $("[data-toast]");
    if (!node) return;
    node.textContent = message;
    node.classList.add("is-shown");
    window.clearTimeout(node._timer);
    node._timer = window.setTimeout(function () {
      node.classList.remove("is-shown");
    }, 2600);
  }

  function initCopyEmail() {
    var button = $("[data-copy-email]");
    if (!button) return;
    if (!contact.email) { button.remove(); return; }

    var label = $("[data-copy-label]", button);

    function copied() {
      button.classList.add("is-copied");
      if (label) label.textContent = "Copied";
      toast("Email copied to your clipboard");
      window.setTimeout(function () {
        button.classList.remove("is-copied");
        if (label) label.textContent = "Copy Email";
      }, 2200);
    }

    button.addEventListener("click", function () {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(contact.email).then(copied, legacyCopy);
      } else {
        legacyCopy();
      }
    });

    function legacyCopy() {
      var field = el("textarea", { text: contact.email, readonly: true });
      field.style.cssText = "position:fixed;top:-1000px;opacity:0";
      document.body.appendChild(field);
      field.select();
      try { document.execCommand("copy"); copied(); }
      catch (e) { toast(contact.email); }
      document.body.removeChild(field);
    }
  }

  function initBackground() {
    var canvases = $$("[data-bg-canvas]");
    if (settings.animatedBackground === false || !window.HeroBackground) {
      canvases.forEach(function (canvas) { canvas.remove(); });
      return;
    }
    canvases.forEach(function (canvas) {
      window.HeroBackground.start(canvas);
    });
  }

  function checkPlaceholders() {
    if (!window.PORTFOLIO) {
      console.error("[portfolio] content.js did not load — check that the file sits next to index.html.");
      return;
    }
    if (String(identity.name || "").indexOf("[") !== -1) {
      console.info("[portfolio] Still showing placeholders. Open content.js and replace anything in [square brackets].");
    }
  }

  /* ============================ BOOT ==================================== */

  function boot() {
    checkPlaceholders();
    initTheme();
    renderMeta();
    renderIdentity();
    renderSocials();
    renderFloaters();
    renderManifesto();
    renderStats();
    renderMarquee();
    renderServices();
    renderSkills();
    renderProjects();
    renderExperience();
    renderEducation();
    renderTestimonials();
    renderSectionHeads();

    initRoles();
    initReveal();
    initFilters();
    initStack();
    initHeader();
    initMobileNav();
    initCardSpotlight();
    initDepth();
    initCopyEmail();
    initBackground();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
