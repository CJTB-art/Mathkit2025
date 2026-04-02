import { icon } from "../scripts/helpers.js";

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
          You get <strong>one free lesson</strong> of your choice. You will
          receive the full LP, PPT, and interactive activity bundled for
          download at no cost.
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

    <div class="view" id="loginView">
      <div class="login-wrap">
        <div class="login-card">
          <h2 class="modal-title">
            ${icon("lock", "icon icon-lg")}
            <span>Admin Login</span>
          </h2>
          <p>Enter your password to manage lesson uploads.</p>
          <div class="field">
            <label for="pwInput">Password</label>
            <input
              type="password"
              id="pwInput"
              placeholder="********"
              autocomplete="current-password"
            />
          </div>
          <button type="button" class="login-btn" data-action="submit-login">
            ${icon("shield", "icon icon-sm")}
            Sign in
          </button>
          <div class="login-err" id="loginErr">Incorrect password. Try again.</div>
          <div class="login-actions">
            <button type="button" class="btn-sm" data-action="show-home">
              ${icon("arrow-left", "icon icon-sm")}
              &larr; Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="view" id="adminView">
      <div class="admin-wrap">
        <div class="admin-header">
          <div class="admin-header-row">
            <h2 class="modal-title">
              ${icon("shield", "icon icon-lg")}
              <span>Lesson Manager</span>
            </h2>
            <button type="button" class="btn-sm" data-action="show-home">
              ${icon("arrow-left", "icon icon-sm")}
              &larr; Back to Home
            </button>
          </div>
          <p>
            Upload PPT, LP, and Activity for each lesson. A lesson goes live
            once all three are set.<br />
            <span class="admin-help">
              ${icon("info", "icon icon-sm")}
              Hover a row to reveal the remove button for each file.
              Re-uploading replaces the old file.
            </span>
          </p>
        </div>
        <div class="admin-stats" id="adminStats"></div>
        <div id="adminCatalog"></div>
      </div>
    </div>

    <div class="view active" id="homeView">
      <div class="public-hero">
        <div class="hero-layout">
          <div class="hero-copy">
            <h1>
              Lesson plans that<br />
              <span class="hero-type-line">
                <span id="typewriter-word"></span><span class="tw-cursor">|</span>
              </span><br />
              your students.
            </h1>
            <p>
              Download ready-to-use LPs and PPTs. Then let students play with
              live interactive activities built for each lesson. No setup. No
              prep. Just teach.
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
    </div>

    <div class="view" id="clientView">
      <section class="lessons-page">
        <div class="lessons-page-head">
          <div class="lessons-page-copy">
            <h2 class="lessons-page-title">Browse lessons</h2>
            <p class="lessons-page-sub">
              Filter by grade and availability, claim one free lesson, then use the packs below when you need full access.
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

        <hr class="divider lessons-divider" />
        <section class="pricing-section" id="pricing">
          <div class="section-tag">Pricing</div>
          <div class="section-title">Start for free. Own it forever.</div>
          <div class="pricing-grid">
            <div class="pricing-card">
              <div class="pricing-name">Free</div>
              <div class="pricing-price">PHP 0</div>
              <div class="pricing-per">forever</div>
              <ul class="pricing-features">
                <li>${icon("check", "icon icon-sm chk")} 1 free lesson of your choice</li>
                <li>${icon("check", "icon icon-sm chk")} Full LP + PPT download</li>
                <li>${icon("check", "icon icon-sm chk")} Full activity access</li>
                <li>${icon("check", "icon icon-sm chk")} Zip bundle download</li>
              </ul>
              <button
                type="button"
                class="pricing-cta pricing-cta-outline"
                data-action="cta-free-plan"
              >
                ${icon("gift", "icon icon-sm")}
                Get started free
              </button>
            </div>
            <div class="pricing-card featured">
              <div class="pricing-badge">Most Popular</div>
              <div class="pricing-name">Per Grade Pack</div>
              <div class="pricing-price">PHP 299</div>
              <div class="pricing-per">one-time - pick any grade level</div>
              <ul class="pricing-features">
                <li>${icon("check", "icon icon-sm chk")} All lessons for your chosen grade</li>
                <li>${icon("check", "icon icon-sm chk")} LP + PPT for every lesson</li>
                <li>${icon("check", "icon icon-sm chk")} All interactive activities</li>
                <li>${icon("check", "icon icon-sm chk")} All four quarters included</li>
                <li>${icon("check", "icon icon-sm chk")} Download as zip bundles</li>
              </ul>
              <button
                type="button"
                class="pricing-cta pricing-cta-filled"
                data-action="cta-grade-pack"
              >
                ${icon("arrow-right", "icon icon-sm")}
                Get a Grade Pack - PHP 299
              </button>
            </div>
            <div class="pricing-card">
              <div class="pricing-name">All Grades Bundle</div>
              <div class="pricing-price">PHP 799</div>
              <div class="pricing-per">one-time - Grades 7, 8, 9 and 10</div>
              <ul class="pricing-features">
                <li>${icon("check", "icon icon-sm chk")} Every lesson across all grades</li>
                <li>${icon("check", "icon icon-sm chk")} LP + PPT for every lesson</li>
                <li>${icon("check", "icon icon-sm chk")} All interactive activities</li>
                <li>${icon("check", "icon icon-sm chk")} Teacher dashboard</li>
                <li>
                  ${icon("check", "icon icon-sm chk")} Save PHP 397 vs buying separately
                </li>
              </ul>
              <button
                type="button"
                class="pricing-cta pricing-cta-outline"
                data-action="cta-all-grades"
              >
                ${icon("package", "icon icon-sm")}
                Get the Bundle - PHP 799
              </button>
            </div>
          </div>
          <div class="pricing-note">
            All packs are one-time purchases. No subscriptions and no renewals.
          </div>
        </section>
      </section>

      <footer class="site-footer">
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
    </div>
  `;
}
