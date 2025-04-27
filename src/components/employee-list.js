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
        <div class="header">
          <div class="logo">
            <img src="../assets/logo.svg" alt="ING Logo" />
            <span>ING</span>
          </div>
          <div class="header-actions">
            <span>Employees</span>
            <button class="add-new" @click=${this._handleAddNew}>
              Add New
            </button>
          </div>
        </div>

        <div class="employee-list">
          <div class="list-header">
            <h2 class="list-title">Employee List</h2>
            <div class="view-toggle">
              <button 
                class="${this.viewMode === 'table' ? 'active' : ''}"
                @click=${() => this._handleViewModeChange('table')}>
                Table View
              </button>
              <button 
                class="${this.viewMode === 'list' ? 'active' : ''}"
                @click=${() => this._handleViewModeChange('list')}>
                List View
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
                    </button>
                    <button class="delete-btn" @click=${() => this._handleDelete(employee.id)} title="Delete">
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

    for (let i = 1; i <= totalPages; i++) {
      pages.push(html`
        <button 
          class="page-btn ${i === this.currentPage ? 'active' : ''}"
          @click=${() => this._handlePageChange(i)}>
          ${i}
        </button>
      `);
    }

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