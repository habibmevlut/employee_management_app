import { LitElement, html, css } from 'lit';
import { Router } from '@vaadin/router';
import './components/navigation/nav-menu.js';
import './components/employee-list/employee-list.js';
import './components/employee-form/employee-form.js';
import './components/toast-message.js';

export class EmployeeApp extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: Arial, sans-serif;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    @media (max-width: 768px) {
      .container {
        padding: 10px;
      }
    }
  `;

  firstUpdated() {
    const router = new Router(this.shadowRoot.querySelector('#outlet'));
    router.setRoutes([
      { path: '/', component: 'employee-list' },
      { path: '/add', component: 'employee-form' },
      { path: '/edit/:id', component: 'employee-form' }
    ]);
  }

  render() {
    return html`
      <div class="container">
        <nav-menu></nav-menu>
        <div id="outlet"></div>
      </div>
    `;
  }
}

customElements.define('employee-app', EmployeeApp); 