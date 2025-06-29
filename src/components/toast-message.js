import { LitElement, html, css } from 'lit';

export class ToastMessage extends LitElement {
  static properties = {
    open: { type: Boolean },
    message: { type: String },
    type: { type: String }
  };

  static styles = css`
    :host {
      position: fixed;
      top: 32px;
      right: 32px;
      z-index: 9999;
      pointer-events: none;
    }
    .toast {
      min-width: 220px;
      background: #4caf50;
      color: #fff;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.12);
      font-size: 1.1rem;
      opacity: 0;
      transform: translateY(-20px);
      transition: opacity 0.3s, transform 0.3s;
      pointer-events: auto;
    }
    .toast.open {
      opacity: 1;
      transform: translateY(0);
    }
    .toast.error {
      background: #e53935;
    }
  `;

  constructor() {
    super();
    this.open = false;
    this.message = '';
    this.type = 'success';
  }

  show(message, type = 'success') {
    this.message = message;
    this.type = type;
    this.open = true;
    clearTimeout(this._timer);
    this._timer = setTimeout(() => {
      this.open = false;
    }, 2500);
  }

  render() {
    return html`
      <div class="toast ${this.open ? 'open' : ''} ${this.type}">
        ${this.message}
      </div>
    `;
  }
}

customElements.define('toast-message', ToastMessage); 