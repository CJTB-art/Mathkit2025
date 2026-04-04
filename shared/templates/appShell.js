import { icon } from "../scripts/helpers.js";

function createPricingSection({ includeHeader = true } = {}) {
  return `
    <section class="pricing-section" id="pricing">
      ${includeHeader ? `
        <div class="section-tag">Pricing</div>
        <div class="section-title">Start for free. Own it forever.</div>
      ` : ""}
      <div class="pricing-grid">
        <div class="pricing-card pricing-card-free">
          <div class="pricing-card-head">
            <div class="pricing-eyebrow">Start Here</div>
          </div>
          <div class="pricing-name">Free</div>
          <div class="pricing-price-row">
            <div class="pricing-price">PHP 0</div>
            <div class="pricing-value-pill">1 lesson</div>
          </div>
          <div class="pricing-per">forever</div>
          <div class="pricing-summary">
            Try the full MathKit experience on one live lesson before spending anything.
          </div>
          <ul class="pricing-features">
            <li>${icon("check", "icon icon-sm chk")} 1 free lesson of your choice</li>
            <li>${icon("check", "icon icon-sm chk")} Full LP + PPT + worksheet download</li>
            <li>${icon("check", "icon icon-sm chk")} Full web-based game activity access</li>
            <li>${icon("check", "icon icon-sm chk")} Zip bundle download</li>
          </ul>
          <button
            type="button"
            class="pricing-cta pricing-cta-outline"
            data-action="cta-free-plan"
          >
            ${icon("gift", "icon icon-sm")}
            <span class="pricing-cta-copy">Start Free</span>
          </button>
        </div>
        <div class="pricing-card pricing-card-single">
          <div class="pricing-card-head">
            <div class="pricing-eyebrow">Low Commitment</div>
          </div>
          <div class="pricing-name">Single Lesson</div>
          <div class="pricing-price-row">
            <div class="pricing-price">PHP 99</div>
            <div class="pricing-value-pill">1 topic</div>
          </div>
          <div class="pricing-per">one-time - choose one ready lesson</div>
          <div class="pricing-summary">
            Best for teachers who only need one strong lesson pack for this week.
          </div>
          <ul class="pricing-features">
            <li>${icon("check", "icon icon-sm chk")} 1 lesson bundle of your choice</li>
            <li>${icon("check", "icon icon-sm chk")} Full LP + PPT + worksheet download</li>
            <li>${icon("check", "icon icon-sm chk")} Full web-based game activity access</li>
            <li>${icon("check", "icon icon-sm chk")} Best for trying one more topic</li>
          </ul>
          <button
            type="button"
            class="pricing-cta pricing-cta-outline"
            data-action="cta-single-lesson"
          >
            ${icon("book-open", "icon icon-sm")}
            <span class="pricing-cta-copy">Buy 1 Lesson</span>
          </button>
        </div>
        <div class="pricing-card pricing-card-grade featured">
          <div class="pricing-badge">Most Popular</div>
          <div class="pricing-card-head">
            <div class="pricing-eyebrow">Teacher Favorite</div>
          </div>
          <div class="pricing-name">Per Grade Pack</div>
          <div class="pricing-price-row">
            <div class="pricing-price">PHP 299</div>
            <div class="pricing-value-pill">Full grade</div>
          </div>
          <div class="pricing-per">one-time - pick any grade level</div>
          <div class="pricing-summary">
            The sweet spot for solo teachers who want depth without buying everything at once.
          </div>
          <ul class="pricing-features">
            <li>${icon("check", "icon icon-sm chk")} All lessons for your chosen grade</li>
            <li>${icon("check", "icon icon-sm chk")} LP + PPT + worksheet for every lesson</li>
            <li>${icon("check", "icon icon-sm chk")} All web-based game activities</li>
            <li>${icon("check", "icon icon-sm chk")} All four quarters included</li>
            <li>${icon("check", "icon icon-sm chk")} Download as zip bundles</li>
          </ul>
          <button
            type="button"
            class="pricing-cta pricing-cta-filled"
            data-action="cta-grade-pack"
          >
            ${icon("arrow-right", "icon icon-sm")}
            <span class="pricing-cta-copy">Choose Grade Pack</span>
          </button>
        </div>
        <div class="pricing-card pricing-card-bundle">
          <div class="pricing-card-head">
            <div class="pricing-eyebrow">Highest Value</div>
          </div>
          <div class="pricing-name">All Grades Bundle</div>
          <div class="pricing-price-row">
            <div class="pricing-price">PHP 799</div>
            <div class="pricing-value-pill">4 grades</div>
          </div>
          <div class="pricing-per">one-time - Grades 7, 8, 9 and 10</div>
          <div class="pricing-summary">
            Built for teachers, schools, or long-term planning across multiple grade levels.
          </div>
          <ul class="pricing-features">
            <li>${icon("check", "icon icon-sm chk")} Every lesson across all grades</li>
            <li>${icon("check", "icon icon-sm chk")} LP + PPT + worksheet for every lesson</li>
            <li>${icon("check", "icon icon-sm chk")} All web-based game activities</li>
            <li>${icon("check", "icon icon-sm chk")} Teacher dashboard</li>
            <li>${icon("check", "icon icon-sm chk")} Save PHP 397 vs buying separately</li>
          </ul>
          <button
            type="button"
            class="pricing-cta pricing-cta-outline"
            data-action="cta-all-grades"
          >
            ${icon("package", "icon icon-sm")}
            <span class="pricing-cta-copy">Get Full Bundle</span>
          </button>
        </div>
      </div>
      <div class="pricing-note">
        All packs are one-time purchases. No subscriptions and no renewals.
      </div>
    </section>
  `;
}

function createHomeDetailsSection() {
  return `
    <section class="home-details">
      <div class="home-details-inner">
        <div class="home-details-head">
          <div class="section-tag">About MathKit PH</div>
          <h2 class="home-details-title">
            Built for teachers who need clearer prep, steadier lessons, and less friction in class.
          </h2>
          <p class="home-details-sub">
            MathKit PH is a classroom-first resource library designed to make daily teaching more practical, more consistent, and easier to sustain through thin-sliced lesson packs, printable worksheets, and web-based game activities.
          </p>
        </div>
        <div class="home-details-grid">
          <article class="home-detail-card">
            <div class="home-detail-label">About</div>
            <p>
              We create DepEd-aligned math materials that are ready to use, easy to scan, and realistic for everyday teaching.
            </p>
          </article>
          <article class="home-detail-card">
            <div class="home-detail-label">Technology</div>
            <p>
              Activities are designed as web-based games so technology supports learning directly instead of being added as an afterthought.
            </p>
          </article>
          <article class="home-detail-card">
            <div class="home-detail-label">Worksheets</div>
            <p>
              Ready-to-print worksheets can be paired with every lesson for practice, reinforcement, and offline classroom use.
            </p>
          </article>
          <article class="home-detail-card">
            <div class="home-detail-label">Mission</div>
            <p>
              Help teachers spend less time assembling resources and more time teaching with confidence through complete lesson packs broken into realistic 45-minute slices.
            </p>
          </article>
        </div>
      </div>
    </section>
  `;
}

function createSiteFooter(extraClass = "") {
  const footerClass = extraClass
    ? `site-footer ${extraClass}`
    : "site-footer";

  return `
    <footer class="${footerClass}">
      <div>
        <div class="footer-logo">
          <img
            class="brand-logo"
            src="./shared/assets/logo.png"
            alt="MathKit PH logo"
          />
          <span>MathKit PH</span>
        </div>
        <div class="footer-copy">
          Made by a Math teacher, for Math teachers.
        </div>
      </div>
      <div class="footer-links">
        <button
          type="button"
          class="footer-link"
          data-action="open-gumroad"
        >
          ${icon("shopping-bag", "icon icon-sm")}
          Gumroad
        </button>
        <button
          type="button"
          class="footer-link"
          data-action="contact-support"
        >
          ${icon("mail", "icon icon-sm")}
          Contact
        </button>
      </div>
    </footer>
  `;
}

export function createAppShell() {
  return `
    <nav>
      <button type="button" class="logo-button" data-action="show-home">
        <img
          class="brand-logo"
          src="./shared/assets/logo.png"
          alt="MathKit PH logo"
        />
        <span>MathKit PH</span>
      </button>
      <div class="nav-links" id="navLinks">
        <button
          type="button"
          class="nav-link nav-link-button"
          data-action="show-home"
        >
          Home
        </button>
        <button
          type="button"
          class="nav-link nav-link-button"
          data-action="show-lessons"
        >
          Lessons
        </button>
        <button
          type="button"
          class="nav-link nav-link-button"
          data-action="show-pricing"
        >
          Pricing
        </button>
      </div>
      <div class="nav-right">
        <button
          type="button"
          class="theme-btn"
          data-action="toggle-theme"
          id="themeBtn"
        >
          Light
        </button>
        <button
          type="button"
          class="btn-sm"
          id="adminNavBtn"
          data-action="show-admin"
        >
          Admin
        </button>
      </div>
    </nav>

    <div class="toast" id="toast" role="status" aria-live="polite"></div>

    <div class="modal-overlay" id="claimModal" aria-hidden="true">
      <div class="modal-box">
        <div class="modal-title">
          ${icon("gift", "icon icon-lg")}
          <span>Claim Your Free Lesson</span>
        </div>
        <div class="modal-sub">
          You get <strong>one free micro-lesson</strong> of your choice. You will
          receive the full LP, PPT, printable worksheet, and any interactive
          game access that is already available for that lesson at no cost.
        </div>
        <div class="modal-lesson-preview">
          <div class="topic" id="claimPreviewTopic"></div>
          <div class="meta" id="claimPreviewMeta"></div>
        </div>
        <div class="modal-actions">
          <button
            type="button"
            class="modal-btn modal-btn-cancel"
            data-action="close-claim-modal"
          >
            Cancel
          </button>
          <button
            type="button"
            class="modal-btn modal-btn-confirm"
            data-action="confirm-claim"
          >
            ${icon("gift", "icon icon-sm")}
            Yes, claim this free
          </button>
        </div>
      </div>
    </div>

    <div class="modal-overlay lesson-preview-overlay" id="lessonPreviewModal" aria-hidden="true">
      <div class="modal-box lesson-preview-box">
        <div class="lesson-preview-top">
          <div>
            <div class="lesson-preview-label">Lesson Sequence</div>
            <div class="lesson-preview-title" id="lessonPreviewTitle"></div>
            <div class="lesson-preview-meta" id="lessonPreviewMeta"></div>
          </div>
          <button
            type="button"
            class="lesson-preview-close"
            data-action="close-lesson-details"
            aria-label="Close lesson details"
          >
            ${icon("x", "icon icon-md")}
          </button>
        </div>
        <div class="lesson-preview-summary" id="lessonPreviewSummary"></div>
        <div class="lesson-preview-list" id="lessonPreviewList"></div>
      </div>
    </div>

    <div class="view" id="loginView">
      <div class="login-wrap">
        <div class="login-card">
          <h2 class="modal-title">
            ${icon("lock", "icon icon-lg")}
            <span>Admin Login</span>
          </h2>
          <p>Sign in with your Supabase admin account to manage lesson uploads.</p>
          <div class="field">
            <label for="adminEmailInput">Email</label>
            <input
              type="email"
              id="adminEmailInput"
              placeholder="teacher@mathkit.ph"
              autocomplete="username"
            />
          </div>
          <div class="field">
            <label for="adminPasswordInput">Password</label>
            <input
              type="password"
              id="adminPasswordInput"
              placeholder="********"
              autocomplete="current-password"
            />
          </div>
          <button
            type="button"
            class="login-btn"
            id="loginSubmitBtn"
            data-action="submit-login"
          >
            ${icon("shield", "icon icon-sm")}
            Sign in
          </button>
          <div class="login-tip" id="loginHelp"></div>
          <div class="login-err" id="loginErr">Unable to sign in.</div>
          <div class="login-actions">
            <button type="button" class="btn-sm" data-action="show-home">
              ${icon("arrow-left", "icon icon-sm")}
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="view" id="adminView">
      <div class="admin-wrap">
        <div class="admin-header">
          <div class="admin-header-row">
            <div>
              <h2 class="modal-title">
                ${icon("shield", "icon icon-lg")}
                <span>Lesson Manager</span>
              </h2>
              <div class="admin-sync-pill" id="adminSyncStatus"></div>
            </div>
            <div class="admin-toolbar">
              <button
                type="button"
                class="btn-sm"
                id="adminRefreshBtn"
                data-action="refresh-assets"
              >
                ${icon("refresh-cw", "icon icon-sm")}
                Refresh
              </button>
              <button
                type="button"
                class="btn-sm"
                id="adminSignOutBtn"
                data-action="sign-out-admin"
              >
                ${icon("log-out", "icon icon-sm")}
                Sign out
              </button>
              <button type="button" class="btn-sm" data-action="show-home">
                ${icon("arrow-left", "icon icon-sm")}
                Back to Home
              </button>
            </div>
          </div>
          <p>
            Upload PPT, LP, Worksheet, and Web Game for each micro-lesson. A
            slice goes live once all four are set, and each broad topic should
            stay broken into a thin-sliced 45-minute teaching sequence.<br />
            <span class="admin-help">
              ${icon("info", "icon icon-sm")}
              Hover a row to reveal the remove button for each file.
              Re-uploading replaces the old file.
            </span>
          </p>
          <div class="admin-session-meta" id="adminSessionMeta"></div>
        </div>
        <div class="admin-stats" id="adminStats"></div>
        <div id="adminCatalog"></div>
      </div>
    </div>

    <div class="view active" id="homeView">
      <div class="public-hero">
        <div class="hero-layout">
          <div class="hero-copy">
            <div class="hero-kicker">DepEd-aligned Math Resource Library</div>
            <h1>
              Lesson plans that<br />
              <span class="hero-type-line">
                <span id="typewriter-word"></span><span class="tw-cursor">|</span>
              </span><br />
              your students.
            </h1>
            <p>
              Download ready-to-use LPs, PPTs, and printable worksheets. Then
              let students play with web-based game activities built for each
              lesson. No setup. No prep. Just teach.
            </p>
            <div class="hero-actions">
              <button
                type="button"
                class="hero-cta hero-cta-primary"
                data-action="browse-lessons"
              >
                ${icon("search", "icon icon-sm")}
                Browse Lessons
              </button>
            </div>
            <div class="hero-note">
              Built for quick browsing during planning time, after class, or on your phone at home.
            </div>
          </div>
          <div class="hero-visual">
            <img
              class="hero-image hero-image-light"
              src="./client/assets/hero-light.png"
              alt="Math teacher working at a laptop with math symbols"
            />
            <img
              class="hero-image hero-image-dark"
              src="./client/assets/hero-dark.png"
              alt="Math teacher working at a laptop with math symbols"
            />
          </div>
        </div>
      </div>
      ${createHomeDetailsSection()}
      ${createSiteFooter("home-footer")}
    </div>

    <div class="view" id="clientView">
      <section class="lessons-page">
        <div class="lessons-page-head">
          <div class="lessons-page-copy">
            <h2 class="lessons-page-title">Browse lessons</h2>
            <p class="lessons-page-sub">
              Filter by grade, quarter, and availability, claim one free micro-lesson, buy a single lesson when you only need one topic, or unlock complete packs with LPs, PPTs, printable worksheets, and lesson-specific interactive activities shown on each catalog entry.
            </p>
          </div>
          <button
            type="button"
            class="btn-sm lessons-back"
            data-action="show-home"
          >
            ${icon("arrow-left", "icon icon-sm")}
            Back to Home
          </button>
        </div>

        <div class="free-claim-banner" id="freeClaimBanner"></div>

        <div class="filter-bar">
          <span class="filter-label">Grade</span>
          <button
            type="button"
            class="ftab active"
            data-action="set-filter"
            data-filter="grade"
            data-value="all"
          >
            All
          </button>
          <button
            type="button"
            class="ftab"
            data-action="set-filter"
            data-filter="grade"
            data-value="7"
          >
            7
          </button>
          <button
            type="button"
            class="ftab"
            data-action="set-filter"
            data-filter="grade"
            data-value="8"
          >
            8
          </button>
          <button
            type="button"
            class="ftab"
            data-action="set-filter"
            data-filter="grade"
            data-value="9"
          >
            9
          </button>
          <button
            type="button"
            class="ftab"
            data-action="set-filter"
            data-filter="grade"
            data-value="10"
          >
            10
          </button>
          <div class="filter-sep"></div>
          <span class="filter-label">Quarter</span>
          <button
            type="button"
            class="ftab active"
            data-action="set-filter"
            data-filter="quarter"
            data-value="all"
          >
            All
          </button>
          <button
            type="button"
            class="ftab"
            data-action="set-filter"
            data-filter="quarter"
            data-value="Q1"
          >
            Q1
          </button>
          <button
            type="button"
            class="ftab"
            data-action="set-filter"
            data-filter="quarter"
            data-value="Q2"
          >
            Q2
          </button>
          <button
            type="button"
            class="ftab"
            data-action="set-filter"
            data-filter="quarter"
            data-value="Q3"
          >
            Q3
          </button>
          <button
            type="button"
            class="ftab"
            data-action="set-filter"
            data-filter="quarter"
            data-value="Q4"
          >
            Q4
          </button>
          <div class="filter-sep"></div>
          <span class="filter-label">Status</span>
          <button
            type="button"
            class="ftab active"
            data-action="set-filter"
            data-filter="status"
            data-value="all"
          >
            All
          </button>
          <button
            type="button"
            class="ftab"
            data-action="set-filter"
            data-filter="status"
            data-value="live"
          >
            Available
          </button>
          <button
            type="button"
            class="ftab"
            data-action="set-filter"
            data-filter="status"
            data-value="coming"
          >
            Coming Soon
          </button>
        </div>

        <div class="catalog" id="publicCatalog"></div>
      </section>

      ${createSiteFooter()}
    </div>

    <div class="view" id="pricingView">
      <section class="pricing-page">
        <div class="pricing-page-head">
          <div class="pricing-page-copy">
            <div class="section-tag">Pricing</div>
            <h2 class="pricing-page-title">Simple one-time access for teachers and grade-level needs.</h2>
            <p class="pricing-page-sub">
              Choose a free lesson, a single lesson, a grade pack, or the full bundle for LPs, PPTs, printable worksheets, and web-based game activities. No subscriptions and no renewals.
            </p>
          </div>
          <button
            type="button"
            class="btn-sm lessons-back"
            data-action="show-home"
          >
            ${icon("arrow-left", "icon icon-sm")}
            Back to Home
          </button>
        </div>
        ${createPricingSection({ includeHeader: false })}
      </section>

      ${createSiteFooter()}
    </div>
  `;
}
