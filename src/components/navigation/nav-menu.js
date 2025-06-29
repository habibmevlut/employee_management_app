import { LitElement, html, css } from 'lit';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { store, setLanguage } from '../../store/employee-store.js';
import enTranslations from '../../i18n/en.js';
import trTranslations from '../../i18n/tr.js';

export class NavMenu extends connect(store)(LitElement) {
  static properties = {
    language: { type: String }
  };

  static styles = css`
    :host {
      display: block;
      margin-bottom: 18px;
    }
    .nav-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 24px;
      background: #fff;
      min-height: 54px;
      box-shadow: none;
    }
    .nav-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .logo-box {
      background: #ff8800;
      border-radius: 7px;
      padding: 3px 7px 3px 3px;
      display: flex;
      align-items: center;
      gap: 0;
    }
    .logo-img {
      width: 22px;
      height: 22px;
      border-radius: 4px;
      background: #fff;
      object-fit: contain;
      display: block;
    }
    .brand {
      font-size: 1.08rem;
      font-weight: 600;
      color: #222;
      letter-spacing: 0.5px;
      margin-left: 10px;
      background: none;
      padding: 0;
      border-radius: 0;
    }
    .nav-right {
      display: flex;
      align-items: center;
      gap: 28px;
    }
    .nav-link {
      display: flex;
      align-items: center;
      gap: 5px;
      color: #ff8800;
      text-decoration: none;
      font-weight: 500;
      font-size: 1rem;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      transition: color 0.2s;
    }
    .nav-link:hover {
      color: #ff4400;
    }
    .nav-link svg {
      width: 18px;
      height: 18px;
      stroke-width: 1.5;
    }
    .add-new {
      display: flex;
      align-items: center;
      gap: 5px;
      color: #ff8800;
      font-weight: 500;
      font-size: 1rem;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      transition: color 0.2s;
      text-decoration: none;
    }
    .add-new:hover {
      color: #ff4400;
    }
    .add-new svg {
      width: 18px;
      height: 18px;
      stroke-width: 1.5;
    }
    .lang-flag {
      margin-left: 10px;
      display: flex;
      align-items: center;
      cursor: pointer;
      border: none;
      background: none;
      padding: 0;
      height: 22px;
      transition: none;
    }
    .lang-flag img {
      width: 20px;
      height: 14px;
      border-radius: 2px;
      object-fit: cover;
      display: block;
      border: none;
      background: none;
    }
    @media (max-width: 700px) {
      .nav-bar {
        flex-direction: column;
        gap: 10px;
        padding: 0 6px;
      }
      .nav-right {
        gap: 14px;
      }
    }
  `;

  constructor() {
    super();
    this.language = 'en';
  }

  stateChanged(state) {
    this.language = state.language;
  }

  get t() {
    return this.language === 'tr' ? trTranslations.navigation : enTranslations.navigation;
  }

  handleLanguageChange(lang) {
    if (lang !== this.language) {
      store.dispatch(setLanguage(lang));
      }
    }

  render() {
    return html`
      <div class="nav-bar">
        <div class="nav-left">
          <span class="logo-box">
            <img class="logo-img" src="/src/assets/logo.png" alt="ING Logo" />
          </span>
          <span class="brand">ING</span>
          </div>
        <div class="nav-right">
          <a href="/" class="nav-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" stroke="currentColor"/></svg>
            ${this.t.employees}
          </a>
          <a href="/add" class="add-new">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 5v14M5 12h14" stroke="currentColor"/></svg>
            ${this.t.addNew}
          </a>
          <span class="lang-flag" @click=${() => this.handleLanguageChange(this.language === 'tr' ? 'en' : 'tr')} title="${this.language === 'tr' ? 'Türkçe' : 'English'}">
            <img src="${this.language === 'tr' ? 'https://flagcdn.com/w20/tr.png' : 'https://flagcdn.com/w20/gb.png'}" alt="${this.language.toUpperCase()}" />
          </span>
        </div>
      </div>
    `;
  }
}

customElements.define('nav-menu', NavMenu); 