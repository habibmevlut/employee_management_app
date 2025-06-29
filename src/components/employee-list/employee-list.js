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
      selectedEmployeeId: { type: String },
      selectedEmployeeIds: { type: Array }
    };
  }

  static styles = css`
    :host {
      display: block;
      background: #fafafa;
      min-height: 100vh;
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
      align-items: center;
    }

    .search-bar {
      margin: 1.5rem 0 1rem 0;
      display: flex;
      justify-content: center;
    }

    input[type="text"] {
      width: 100%;
      max-width: 98%;
      box-sizing: border-box;
      padding: 0.7rem 1.1rem;
      border: 1.5px solid #ff8800;
      border-radius: 12px;
      background: #fffaf5;
      font-size: 1.08rem;
      margin: 0 auto;
      outline: none;
      transition: border 0.2s;
    }
    input[type="text"]:focus {
      border: 2px solid #ff8800;
      background: #fff7ee;
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
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      margin-bottom: 1rem;
      padding: 0 0 0 0;
    }

    table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      background: #fff;
      border-radius: 12px;
      overflow: hidden;
    }

    th {
      background-color: #fff;
      color: #ff8800;
      font-weight: 500;
      font-size: 1rem;
      border-bottom: 1px solid #ffe0b2;
      text-align: center;
      padding: 1.2rem 0.5rem 1.1rem 0.5rem;
      letter-spacing: 0.01em;
    }

    tr {
      transition: background 0.2s;
      border-radius: 8px;
    }

    tr:hover {
      background: #fff3e0;
    }

    td {
      font-size: 1.05rem;
      color: #222;
      border-bottom: 1px solid #f0f0f0;
      text-align: center;
      padding: 1.1rem 0.5rem;
    }

    .list-view {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
      gap: 1.5rem;
      margin: 1.5rem 0;
    }

    .list-item {
      background: #fff;
      border-radius: 14px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.07);
      padding: 1.5rem 1.3rem 1.1rem 1.3rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 180px;
      transition: box-shadow 0.18s, transform 0.13s;
    }

    .list-item:hover {
      box-shadow: 0 6px 24px rgba(255,136,0,0.13);
      transform: translateY(-2px) scale(1.012);
    }

    .list-item h3 {
      margin: 0 0 0.7rem 0;
      font-size: 1.18rem;
      font-weight: 700;
      color: #222;
    }

    .list-item p {
      margin: 0.18rem 0;
      font-size: 1.01rem;
      color: #444;
    }

    .list-item p strong {
      color: #ff8800;
      font-weight: 600;
    }

    .list-item .action-buttons {
      margin-top: 1.1rem;
      justify-content: center;
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.3rem;
      margin-top: 1rem;
      flex-wrap: wrap;
    }

    .pagination button, .pagination .page-ellipsis {
      background: #fff;
      border: 1px solid #ff8800;
      color: #ff8800;
      border-radius: 6px;
      padding: 0.35rem 0.85rem;
      font-weight: 600;
      font-size: 1rem;
      transition: background 0.15s, color 0.15s;
      margin: 0 1px;
      min-width: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .pagination button.active,
    .pagination button:hover:not(:disabled) {
      background: #ff8800;
      color: #fff;
    }

    .pagination button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .pagination .page-ellipsis {
      border: none;
      background: none;
      color: #bbb;
      cursor: default;
      pointer-events: none;
    }

    .action-buttons {
      display: flex;
      gap: 0.3rem;
      justify-content: center;
      align-items: center;
      background: none;
      box-shadow: none;
    }

    .edit-btn, .delete-btn {
      background: none;
      border: none;
      padding: 0.1rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      box-shadow: none;
      border-radius: 0;
    }

    .edit-btn svg, .delete-btn svg {
      width: 22px;
      height: 22px;
      fill: #ff8800;
      transition: fill 0.15s, transform 0.12s;
    }

    .edit-btn:hover svg, .delete-btn:hover svg {
      fill: #ff4400;
      transform: scale(1.18);
    }

    .view-toggle button {
      background: none;
      border: none;
      padding: 0.2rem 0.4rem;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      transition: background 0.15s;
    }

    .view-toggle button.active {
      background: #fff7f0;
    }

    .view-toggle svg {
      width: 28px;
      height: 28px;
      fill: #bbb;
      transition: fill 0.15s;
    }

    .view-toggle button.active svg {
      fill: #ff8800;
    }

    .confirm-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(30, 30, 30, 0.32);
      backdrop-filter: blur(2px);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .confirm-dialog {
      position: relative;
      min-width: 340px;
      max-width: 95vw;
      background: #fff;
      padding: 2.2rem 2.1rem 1.7rem 2.1rem;
      border-radius: 16px;
      box-shadow: 0 6px 32px rgba(0,0,0,0.18);
      display: flex;
      flex-direction: column;
      align-items: stretch;
      z-index: 1100;
    }

    .confirm-title {
      color: #ff8800;
      font-size: 1.35rem;
      font-weight: 600;
      margin-bottom: 0.7rem;
      text-align: left;
      letter-spacing: 0.01em;
    }

    .confirm-desc {
      color: #444;
      font-size: 1.05rem;
      margin-bottom: 1.5rem;
      text-align: left;
      font-weight: 400;
    }

    .confirm-dialog-buttons {
      display: flex;
      flex-direction: column;
      gap: 0.7rem;
      width: 100%;
      margin-top: 0.2rem;
    }

    .confirm-btn {
      width: 100%;
      min-width: 110px;
      padding: 0.7rem 0;
      border-radius: 8px;
      font-size: 1.08rem;
      font-weight: 500;
      border: none;
      cursor: pointer;
      transition: background 0.15s, color 0.15s, border 0.15s;
      letter-spacing: 0.01em;
    }

    .confirm-btn.proceed {
      background: #ff8800;
      color: #fff;
      border: 2px solid #ff8800;
    }

    .confirm-btn.proceed:hover {
      background: #ff4400;
      border-color: #ff4400;
    }

    .confirm-btn.cancel {
      background: #fff;
      color: #6c47ff;
      border: 2px solid #6c47ff;
    }

    .confirm-btn.cancel:hover {
      background: #f7f3ff;
      border-color: #4b2fd6;
      color: #4b2fd6;
    }

    .confirm-close {
      position: absolute;
      top: 14px;
      right: 16px;
      background: none;
      border: none;
      font-size: 1.3rem;
      color: #ff8800;
      cursor: pointer;
      padding: 2px;
      border-radius: 50%;
      transition: background 0.15s;
    }

    .confirm-close:hover {
      background: #fff3e0;
    }

    @media (max-width: 700px) {
      .table-container {
        border-radius: 8px;
        padding: 0;
      }
      th, td {
        padding: 0.5rem 0.2rem;
        font-size: 0.95rem;
      }
      input[type="text"] {
        font-size: 0.98rem;
        padding: 0.5rem 0.7rem;
        border-radius: 8px;
      }
      .list-view {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      .list-item {
        padding: 1rem 0.7rem 0.7rem 0.7rem;
        min-height: 120px;
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
    this.selectedEmployeeIds = [];
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

  handleSelectAll(e) {
    if (e.target.checked) {
      this.selectedEmployeeIds = this.paginatedEmployees.map(emp => emp.id);
    } else {
      this.selectedEmployeeIds = [];
    }
    this.requestUpdate();
  }

  handleSelectRow(e, id) {
    if (e.target.checked) {
      this.selectedEmployeeIds = [...this.selectedEmployeeIds, id];
    } else {
      this.selectedEmployeeIds = this.selectedEmployeeIds.filter(empId => empId !== id);
    }
    this.requestUpdate();
  }

  isRowSelected(id) {
    return this.selectedEmployeeIds.includes(id);
  }

  isAllSelected() {
    return this.paginatedEmployees.length > 0 && this.paginatedEmployees.every(emp => this.selectedEmployeeIds.includes(emp.id));
  }

  renderTableView() {
    const t = this.translations.employeeList;
    return html`
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>
                <input type="checkbox"
                  @change=${e => this.handleSelectAll(e)}
                  .checked=${this.isAllSelected()}
                  aria-label="Select all"
                />
              </th>
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
                <td>
                  <input type="checkbox"
                    @change=${e => this.handleSelectRow(e, emp.id)}
                    .checked=${this.isRowSelected(emp.id)}
                    aria-label="Select row"
                  />
                </td>
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
                    <a href="/edit/${emp.id}" class="edit-btn" title="Edit">
                      <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 17.25V21h3.75l11.06-11.06-3.75-3.75L3 17.25z"/>
                        <path d="M20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"/>
                      </svg>
                    </a>
                    <button class="delete-btn" @click=${() => this.handleDeleteClick(emp.id)} title="Delete">
                      <svg width="20" height="20" fill="#ff4400" viewBox="0 0 24 24"><path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-4.5l-1-1z"/></svg>
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
              <a href="/edit/${emp.id}" class="edit-btn" title="Edit">
                <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 17.25V21h3.75l11.06-11.06-3.75-3.75L3 17.25z"/>
                  <path d="M20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"/>
                </svg>
              </a>
              <button class="delete-btn" @click=${() => this.handleDeleteClick(emp.id)} title="Delete">
                <svg width="20" height="20" fill="#ff4400" viewBox="0 0 24 24"><path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-4.5l-1-1z"/></svg>
              </button>
            </div>
          </div>
        `)}
      </div>
    `;
  }

  renderPagination() {
    const total = this.totalPages;
    const current = this.currentPage;
    const pageButtons = [];
    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pageButtons.push(i);
      }
    } else {
      if (current <= 4) {
        pageButtons.push(1, 2, 3, 4, 5, '...', total);
      } else if (current >= total - 3) {
        pageButtons.push(1, '...', total - 4, total - 3, total - 2, total - 1, total);
      } else {
        pageButtons.push(1, '...', current - 1, current, current + 1, '...', total);
      }
    }
    return html`
      <div class="pagination">
        <button
          ?disabled=${current === 1}
          @click=${() => this.handlePageChange(1)}
          title="First Page"
        >
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M18.41 16.59L13.83 12l4.58-4.59L16 6l-6 6 6 6z"/><path d="M6 6h2v12H6z"/></svg>
        </button>
        <button
          ?disabled=${current === 1}
          @click=${() => this.handlePageChange(current - 1)}
          title="Previous Page"
        >
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z"/></svg>
        </button>
        ${pageButtons.map(page =>
          page === '...'
            ? html`<span class="page-ellipsis">...</span>`
            : html`<button
                class=${current === page ? 'active' : ''}
                @click=${() => this.handlePageChange(page)}
                ?disabled=${current === page}
              >${page}</button>`
        )}
        <button
          ?disabled=${current === total}
          @click=${() => this.handlePageChange(current + 1)}
          title="Next Page"
        >
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>
        </button>
        <button
          ?disabled=${current === total}
          @click=${() => this.handlePageChange(total)}
          title="Last Page"
        >
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M5.59 7.41L10.17 12l-4.58 4.59L8 18l6-6-6-6z"/><path d="M16 6h2v12h-2z"/></svg>
        </button>
      </div>
    `;
  }

  renderDeleteConfirmDialog() {
    const t = this.translations.confirmDialog;
    const emp = this.employees.find(e => e.id === this.selectedEmployeeId);
    return html`
      <div class="confirm-overlay">
        <div class="confirm-dialog">
          <button class="confirm-close" @click=${() => this.showDeleteConfirm = false} title="Close">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12l-4.89 4.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.89a1 1 0 0 0 0-1.4z" fill="#ff8800"/></svg>
          </button>
          <div class="confirm-title">${t.deleteTitle || 'Are you sure?'}</div>
          <div class="confirm-desc">
            ${emp ? html`Selected Employee record of <b>${emp.firstName} ${emp.lastName}</b> will be deleted.` : t.deleteMessage}
          </div>
          <div class="confirm-dialog-buttons">
            <button class="confirm-btn proceed" @click=${this.handleDeleteConfirm}>${t.confirm || 'Proceed'}</button>
            <button class="confirm-btn cancel" @click=${() => this.showDeleteConfirm = false}>${t.cancel || 'Cancel'}</button>
          </div>
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
            class=${this.viewMode === 'list' ? 'active' : ''}
            @click=${() => this.handleViewModeChange('list')}
            title="List View"
          >
            <svg viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="3"/><rect x="4" y="10.5" width="16" height="3"/><rect x="4" y="16" width="16" height="3"/></svg>
          </button>
          <button
            class=${this.viewMode === 'table' ? 'active' : ''}
            @click=${() => this.handleViewModeChange('table')}
            title="Grid View"
          >
            <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
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