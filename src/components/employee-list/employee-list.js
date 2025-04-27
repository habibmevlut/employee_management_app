import { LitElement, html, css } from 'lit';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../../store/employee-store.js';
import { setViewMode, setCurrentPage, setSearchTerm, deleteEmployee } from '../../store/employee-store.js';
import { ITEMS_PER_PAGE } from '../../utils/constants.js';
import enTranslations from '../../i18n/en.js';
import trTranslations from '../../i18n/tr.js';

export class EmployeeList extends connect(store)(LitElement) {
  static get properties() {
    return {
      employees: { type: Array },
      viewMode: { type: String },
      currentPage: { type: Number },
      searchTerm: { type: String },
      language: { type: String },
      showDeleteConfirm: { type: Boolean },
      selectedEmployeeId: { type: String }
    };
  }

  static styles = css`
    :host {
      display: block;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .view-toggle {
      display: flex;
      gap: 0.5rem;
    }

    .search-bar {
      margin: 1rem 0;
    }

    input[type="text"] {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      background-color: #f8f9fa;
    }

    button.active {
      background-color: #ff4400;
      color: white;
    }

    .table-container {
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }

    th {
      background-color: #f8f9fa;
    }

    .list-view {
      display: grid;
      gap: 1rem;
    }

    .list-item {
      padding: 1rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .pagination {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    .action-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .edit-btn {
      background-color: #ffc107;
      color: black;
    }

    .delete-btn {
      background-color: #dc3545;
      color: white;
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
    }

    .confirm-dialog-buttons {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1rem;
    }

    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        gap: 1rem;
      }

      th, td {
        padding: 0.5rem;
      }

      .action-buttons {
        flex-direction: column;
      }
    }
  `;

  constructor() {
    super();
    this.employees = [];
    this.viewMode = 'table';
    this.currentPage = 1;
    this.searchTerm = '';
    this.language = 'en';
    this.showDeleteConfirm = false;
    this.selectedEmployeeId = null;
  }

  stateChanged(state) {
    this.employees = state.employees;
    this.viewMode = state.viewMode;
    this.currentPage = state.currentPage;
    this.searchTerm = state.searchTerm;
    this.language = state.language;
  }

  get translations() {
    return this.language === 'tr' ? trTranslations : enTranslations;
  }

  get filteredEmployees() {
    return this.employees.filter(emp => 
      Object.values(emp).some(val => 
        val.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    );
  }

  get paginatedEmployees() {
    const start = (this.currentPage - 1) * ITEMS_PER_PAGE;
    return this.filteredEmployees.slice(start, start + ITEMS_PER_PAGE);
  }

  get totalPages() {
    return Math.ceil(this.filteredEmployees.length / ITEMS_PER_PAGE);
  }

  handleViewModeChange(mode) {
    store.dispatch(setViewMode(mode));
  }

  handleSearch(e) {
    store.dispatch(setSearchTerm(e.target.value));
  }

  handlePageChange(page) {
    store.dispatch(setCurrentPage(page));
  }

  handleDeleteClick(id) {
    this.selectedEmployeeId = id;
    this.showDeleteConfirm = true;
  }

  handleDeleteConfirm() {
    store.dispatch(deleteEmployee(this.selectedEmployeeId));
    this.showDeleteConfirm = false;
    this.selectedEmployeeId = null;
  }

  renderTableView() {
    const t = this.translations.employeeList;
    return html`
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>${t.firstName}</th>
              <th>${t.lastName}</th>
              <th>${t.dateOfEmployment}</th>
              <th>${t.dateOfBirth}</th>
              <th>${t.phone}</th>
              <th>${t.email}</th>
              <th>${t.department}</th>
              <th>${t.position}</th>
              <th>${t.actions}</th>
            </tr>
          </thead>
          <tbody>
            ${this.paginatedEmployees.map(emp => html`
              <tr>
                <td>${emp.firstName}</td>
                <td>${emp.lastName}</td>
                <td>${emp.dateOfEmployment}</td>
                <td>${emp.dateOfBirth}</td>
                <td>${emp.phone}</td>
                <td>${emp.email}</td>
                <td>${emp.department}</td>
                <td>${emp.position}</td>
                <td>
                  <div class="action-buttons">
                    <a href="/edit/${emp.id}" class="edit-btn">${t.edit}</a>
                    <button class="delete-btn" @click=${() => this.handleDeleteClick(emp.id)}>
                      ${t.delete}
                    </button>
                  </div>
                </td>
              </tr>
            `)}
          </tbody>
        </table>
      </div>
    `;
  }

  renderListView() {
    const t = this.translations.employeeList;
    return html`
      <div class="list-view">
        ${this.paginatedEmployees.map(emp => html`
          <div class="list-item">
            <h3>${emp.firstName} ${emp.lastName}</h3>
            <p><strong>${t.department}:</strong> ${emp.department}</p>
            <p><strong>${t.position}:</strong> ${emp.position}</p>
            <p><strong>${t.email}:</strong> ${emp.email}</p>
            <p><strong>${t.phone}:</strong> ${emp.phone}</p>
            <div class="action-buttons">
              <a href="/edit/${emp.id}" class="edit-btn">${t.edit}</a>
              <button class="delete-btn" @click=${() => this.handleDeleteClick(emp.id)}>
                ${t.delete}
              </button>
            </div>
          </div>
        `)}
      </div>
    `;
  }

  renderPagination() {
    return html`
      <div class="pagination">
        <button 
          ?disabled=${this.currentPage === 1}
          @click=${() => this.handlePageChange(this.currentPage - 1)}
        >
          &lt;
        </button>
        ${Array.from({ length: this.totalPages }, (_, i) => i + 1).map(page => html`
          <button
            class=${this.currentPage === page ? 'active' : ''}
            @click=${() => this.handlePageChange(page)}
          >
            ${page}
          </button>
        `)}
        <button
          ?disabled=${this.currentPage === this.totalPages}
          @click=${() => this.handlePageChange(this.currentPage + 1)}
        >
          &gt;
        </button>
      </div>
    `;
  }

  renderDeleteConfirmDialog() {
    const t = this.translations.confirmDialog;
    return html`
      <div class="confirm-dialog">
        <h3>${t.deleteTitle}</h3>
        <p>${t.deleteMessage}</p>
        <div class="confirm-dialog-buttons">
          <button @click=${() => this.showDeleteConfirm = false}>${t.cancel}</button>
          <button class="delete-btn" @click=${this.handleDeleteConfirm}>${t.confirm}</button>
        </div>
      </div>
    `;
  }

  render() {
    const t = this.translations.employeeList;
    return html`
      <div class="header">
        <h2>${t.title}</h2>
        <div class="view-toggle">
          <button
            class=${this.viewMode === 'table' ? 'active' : ''}
            @click=${() => this.handleViewModeChange('table')}
          >
            ${t.viewMode.table}
          </button>
          <button
            class=${this.viewMode === 'list' ? 'active' : ''}
            @click=${() => this.handleViewModeChange('list')}
          >
            ${t.viewMode.list}
          </button>
        </div>
      </div>

      <div class="search-bar">
        <input
          type="text"
          .value=${this.searchTerm}
          @input=${this.handleSearch}
          placeholder=${t.search}
        >
      </div>

      ${this.filteredEmployees.length === 0
        ? html`<p>${t.noResults}</p>`
        : html`
          ${this.viewMode === 'table' ? this.renderTableView() : this.renderListView()}
          ${this.renderPagination()}
        `
      }

      ${this.showDeleteConfirm ? this.renderDeleteConfirmDialog() : ''}
    `;
  }
}

customElements.define('employee-list', EmployeeList); 