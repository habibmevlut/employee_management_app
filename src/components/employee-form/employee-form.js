import { LitElement, html, css } from 'lit';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../../store/employee-store.js';
import { addEmployee, updateEmployee } from '../../store/employee-store.js';
import { validateEmployeeForm } from '../../utils/validation.js';
import { DEPARTMENTS, POSITIONS } from '../../utils/constants.js';
import enTranslations from '../../i18n/en.js';
import trTranslations from '../../i18n/tr.js';

export class EmployeeForm extends connect(store)(LitElement) {
  static get properties() {
    return {
      employee: { type: Object },
      errors: { type: Object },
      isEdit: { type: Boolean },
      language: { type: String },
      showConfirm: { type: Boolean }
    };
  }

  static styles = css`
    :host {
      display: block;
    }

    .form-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 2rem;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: bold;
    }

    input, select {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    input:focus, select:focus {
      outline: none;
      border-color: #ff4400;
    }

    .error {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .buttons {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
    }

    button {
      padding: 0.5rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
    }

    button[type="submit"] {
      background-color: #ff4400;
      color: white;
    }

    button[type="button"] {
      background-color: #f8f9fa;
    }

    .confirm-dialog {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 2rem;
      border-radius: 4px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      z-index: 1000;
    }

    .confirm-dialog-buttons {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1rem;
    }

    @media (max-width: 768px) {
      .form-container {
        padding: 1rem;
      }

      .buttons {
        flex-direction: column;
      }

      button {
        width: 100%;
      }
    }
  `;

  constructor() {
    super();
    this.employee = {
      firstName: '',
      lastName: '',
      dateOfEmployment: '',
      dateOfBirth: '',
      phone: '',
      email: '',
      department: '',
      position: ''
    };
    this.errors = {};
    this.isEdit = false;
    this.language = 'en';
    this.showConfirm = false;
  }

  stateChanged(state) {
    this.language = state.language;
  }

  onBeforeEnter(location) {
    if (location && location.params && location.params.id) {
      this.isEdit = true;
      const id = location.params.id;
      const state = store.getState();
      const found = state.employees.find(emp => emp.id === id);
      if (found) {
        this.employee = { ...found };
      }
    } else {
      this.isEdit = false;
      this.employee = {
        firstName: '',
        lastName: '',
        dateOfEmployment: '',
        dateOfBirth: '',
        phone: '',
        email: '',
        department: '',
        position: ''
      };
    }
  }

  get translations() {
    return this.language === 'tr' ? trTranslations : enTranslations;
  }

  handleInput(e) {
    const { name, value } = e.target;
    this.employee = {
      ...this.employee,
      [name]: value
    };
    // Clear error when user starts typing
    if (this.errors[name]) {
      this.errors = {
        ...this.errors,
        [name]: ''
      };
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    const errors = validateEmployeeForm(this.employee);
    const hasErrors = Object.values(errors).some(error => error);
    
    if (hasErrors) {
      this.errors = errors;
      return;
    }

    this.showConfirm = true;
  }

  handleConfirm() {
    const t = this.translations.toast;
    if (this.isEdit) {
      store.dispatch(updateEmployee(this.employee));
      this.showToast(t.employeeUpdated, 'success');
    } else {
      store.dispatch(addEmployee(this.employee));
      this.showToast(t.employeeAdded, 'success');
    }
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new CustomEvent('vaadin-router-go', { detail: { pathname: '/' } }));
  }

  showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (toast) toast.show(message, type);
  }

  renderFormField(name, type = 'text') {
    const t = this.translations.employeeList;
    return html`
      <div class="form-group">
        <label for=${name}>${t[name]}</label>
        ${type === 'select' ? html`
          <select
            id=${name}
            name=${name}
            .value=${this.employee[name]}
            @change=${this.handleInput}
          >
            <option value="">Select ${t[name]}</option>
            ${(name === 'department' ? DEPARTMENTS : POSITIONS).map(value => html`
              <option value=${value} ?selected=${this.employee[name] === value}>
                ${value}
              </option>
            `)}
          </select>
        ` : html`
          <input
            type=${type}
            id=${name}
            name=${name}
            .value=${this.employee[name]}
            @input=${this.handleInput}
          >
        `}
        ${this.errors[name] ? html`<div class="error">${this.errors[name]}</div>` : ''}
      </div>
    `;
  }

  renderConfirmDialog() {
    const t = this.translations.confirmDialog || {};
    return html`
      <div class="confirm-dialog">
        <h3 style="margin-bottom:0.7rem; color:#ff8800; font-size:1.2rem;">${this.isEdit ? (t.updateTitle || 'Kaydı Güncelle') : (t.addTitle || 'Kaydı Onayla')}</h3>
        <p style="margin-bottom:1.2rem; color:#444; font-size:1.05rem;">${this.isEdit ? (t.updateMessage || 'Bu çalışan güncellenecek. Devam etmek istiyor musunuz?') : (t.addMessage || 'Bu çalışan kaydedilecek. Devam etmek istiyor musunuz?')}</p>
        <div class="confirm-dialog-buttons">
          <button @click=${() => this.showConfirm = false} style="background:#f8f9fa; color:#222; border:1px solid #ddd; border-radius:6px; padding:0.5rem 1.5rem; font-size:1rem;">${t.cancel || 'İptal'}</button>
          <button @click=${this.handleConfirm} style="background:#ff4400; color:#fff; border:none; border-radius:6px; padding:0.5rem 1.5rem; font-size:1rem; font-weight:500;">${t.confirm || (this.isEdit ? 'Güncelle' : 'Kaydet')}</button>
        </div>
      </div>
    `;
  }

  render() {
    const t = this.translations.employeeForm;
    return html`
      <div class="form-container">
        <h2>${this.isEdit ? t.editTitle : t.addTitle}</h2>
        <form @submit=${this.handleSubmit}>
          ${this.renderFormField('firstName')}
          ${this.renderFormField('lastName')}
          ${this.renderFormField('dateOfEmployment', 'date')}
          ${this.renderFormField('dateOfBirth', 'date')}
          ${this.renderFormField('phone')}
          ${this.renderFormField('email')}
          ${this.renderFormField('department', 'select')}
          ${this.renderFormField('position', 'select')}
          
          <div class="buttons">
            <button type="button" @click=${() => window.history.back()}>
              ${t.cancel}
            </button>
            <button type="submit">
              ${t.save}
            </button>
          </div>
        </form>
      </div>

      ${this.showConfirm ? this.renderConfirmDialog() : ''}
    `;
  }
}

customElements.define('employee-form', EmployeeForm); 