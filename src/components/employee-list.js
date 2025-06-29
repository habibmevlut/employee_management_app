import { LitElement, html, css } from 'lit';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../store/employee-store.js';
import { deleteEmployee, setViewMode, setCurrentPage } from '../store/employee-store.js';
import '../styles/employee-list.css';

export class EmployeeList extends connect(store)(LitElement) {
  static get properties() {
    return {
      employees: { type: Array },
      viewMode: { type: String },
      currentPage: { type: Number },
      searchTerm: { type: String },
      language: { type: String }
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
    `;
  }

  constructor() {
    super();
    this.employees = [];
    this.viewMode = 'table';
    this.currentPage = 1;
    this.searchTerm = '';
    this.language = 'en';
    this.itemsPerPage = 10;
  }

  stateChanged(state) {
    this.employees = state.employees;
    this.viewMode = state.viewMode;
    this.currentPage = state.currentPage;
    this.searchTerm = state.searchTerm;
    this.language = state.language;
  }

  render() {
    return html`
      <div class="employee-container">
        <div class="employee-header-bar">
          <div class="employee-header-left">
            <img src="../assets/logo.svg" alt="ING Logo" class="ing-logo" />
            <span class="ing-text">ING</span>
          </div>
          <div class="employee-header-right">
            <span class="employee-users">
              <span class="user-icon"> 
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#FF6B00"/></svg>
              </span>
              Employees
            </span>
            <button class="add-new">
              <span class="plus-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="#FF6B00"/></svg>
              </span>
              Add New
            </button>
            <span class="lang-flag">
              <img src="https://flagcdn.com/w20/tr.png" alt="TR" width="20" height="14" />
            </span>
          </div>
        </div>

        <div class="employee-list">
          <div class="list-header">
            <h2 class="list-title">Employee List</h2>
            <div class="view-toggle">
              <button 
                class="${this.viewMode === 'table' ? 'active' : ''}"
                @click=${() => this._handleViewModeChange('table')}
                title="Table View">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="7" height="7" rx="1.5" fill="${this.viewMode === 'table' ? '#FF6B00' : '#D3D3D3'}"/>
                  <rect x="14" y="3" width="7" height="7" rx="1.5" fill="${this.viewMode === 'table' ? '#FF6B00' : '#D3D3D3'}"/>
                  <rect x="3" y="14" width="7" height="7" rx="1.5" fill="${this.viewMode === 'table' ? '#FF6B00' : '#D3D3D3'}"/>
                  <rect x="14" y="14" width="7" height="7" rx="1.5" fill="${this.viewMode === 'table' ? '#FF6B00' : '#D3D3D3'}"/>
                </svg>
              </button>
              <button 
                class="${this.viewMode === 'list' ? 'active' : ''}"
                @click=${() => this._handleViewModeChange('list')}
                title="List View">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect x="4" y="5" width="16" height="3" rx="1.5" fill="${this.viewMode === 'list' ? '#FF6B00' : '#D3D3D3'}"/>
                  <rect x="4" y="10.5" width="16" height="3" rx="1.5" fill="${this.viewMode === 'list' ? '#FF6B00' : '#D3D3D3'}"/>
                  <rect x="4" y="16" width="16" height="3" rx="1.5" fill="${this.viewMode === 'list' ? '#FF6B00' : '#D3D3D3'}"/>
                </svg>
              </button>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th class="checkbox-cell">
                  <input type="checkbox" @change=${this._handleSelectAll} />
                </th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Date of Employment</th>
                <th>Date of Birth</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Department</th>
                <th>Position</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${this._getPaginatedEmployees().map(employee => html`
                <tr>
                  <td class="checkbox-cell">
                    <input type="checkbox" .checked=${employee.selected || false} />
                  </td>
                  <td>${employee.firstName}</td>
                  <td>${employee.lastName}</td>
                  <td>${employee.dateOfEmployment}</td>
                  <td>${employee.dateOfBirth}</td>
                  <td>${employee.phone}</td>
                  <td>${employee.email}</td>
                  <td>${employee.department}</td>
                  <td>${employee.position}</td>
                  <td class="actions">
                    <button class="edit-btn" @click=${() => this._handleEdit(employee)} title="Edit">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="#FF6B00"/></svg>
                    </button>
                    <button class="delete-btn" @click=${() => this._handleDelete(employee.id)} title="Delete">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="#FF6B00"/></svg>
                    </button>
                  </td>
                </tr>
              `)}
            </tbody>
          </table>

          <div class="pagination">
            ${this._renderPagination()}
          </div>
        </div>
      </div>
    `;
  }

  _getPaginatedEmployees() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.employees.slice(start, end);
  }

  _renderPagination() {
    const totalPages = Math.ceil(this.employees.length / this.itemsPerPage);
    const pages = [];
    const isFirst = this.currentPage === 1;
    const isLast = this.currentPage === totalPages || totalPages === 0;

    pages.push(html`
      <button class="page-btn" ?disabled=${isFirst} @click=${() => !isFirst && this._handlePageChange(this.currentPage - 1)} title="Previous">
        <svg viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="${isFirst ? '#ccc' : '#FF6B00'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
    `);

    for (let i = 1; i <= totalPages; i++) {
      pages.push(html`
        <button 
          class="page-btn ${i === this.currentPage ? 'active' : ''}"
          @click=${() => this._handlePageChange(i)}>
          ${i}
        </button>
      `);
    }

    pages.push(html`
      <button class="page-btn" ?disabled=${isLast} @click=${() => !isLast && this._handlePageChange(this.currentPage + 1)} title="Next">
        <svg viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="${isLast ? '#ccc' : '#FF6B00'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
    `);

    return pages;
  }

  _handleAddNew() {
    // Implement add new employee logic
  }

  _handleEdit(employee) {
    // TODO: Implement edit employee logic
    console.log('Edit employee:', employee);
  }

  _handleDelete(id) {
    if (confirm('Are you sure you want to delete this employee?')) {
      store.dispatch(deleteEmployee(id));
    }
  }

  _handleViewModeChange(mode) {
    store.dispatch(setViewMode(mode));
  }

  _handlePageChange(page) {
    store.dispatch(setCurrentPage(page));
  }

  _handleSelectAll(e) {
    // TODO: Implement select all logic
    console.log('Select all:', e.target.checked);
  }
} 