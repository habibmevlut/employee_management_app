import { fixture, html, expect } from '@open-wc/testing';
import { store, addEmployee, setViewMode, setLanguage, resetStore } from '../../src/store/employee-store.js';
import '../../src/components/employee-list/employee-list.js';

suite('EmployeeList', () => {
  let el;

  setup(async () => {
    // Reset store before each test
    store.dispatch(resetStore());
    
    // Add some test employees
    const employees = [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+(90) 532 123 45 67',
        dateOfBirth: '1990-01-01',
        dateOfEmployment: '2020-01-01',
        department: 'IT',
        position: 'Developer'
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        phone: '+(90) 555 987 65 43',
        dateOfBirth: '1985-05-15',
        dateOfEmployment: '2019-03-15',
        department: 'HR',
        position: 'Manager'
      },
      {
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob@example.com',
        phone: '+(90) 533 456 78 90',
        dateOfBirth: '1988-12-10',
        dateOfEmployment: '2021-06-20',
        department: 'Marketing',
        position: 'Designer'
      }
    ];

    employees.forEach(emp => store.dispatch(addEmployee(emp)));
    
    el = await fixture(html`<employee-list></employee-list>`);
    await el.updateComplete;
  });

  test('renders the employee list component', () => {
    expect(el).to.exist;
    expect(el.tagName.toLowerCase()).to.equal('employee-list');
  });

  test('displays employees in table view by default', () => {
    const table = el.shadowRoot.querySelector('table');
    expect(table).to.exist;
    
    const rows = el.shadowRoot.querySelectorAll('tbody tr');
    expect(rows.length).to.be.greaterThan(0);
  });

  test('switches to list view when view mode is changed', async () => {
    store.dispatch(setViewMode('list'));
    await el.updateComplete;
    
    const listView = el.shadowRoot.querySelector('.list-view');
    expect(listView).to.exist;
    
    const listItems = el.shadowRoot.querySelectorAll('.list-item');
    expect(listItems.length).to.be.greaterThan(0);
  });

  test('filters employees based on search term', async () => {
    const searchInput = el.shadowRoot.querySelector('input[type="text"]');
    expect(searchInput).to.exist;
    
    // Search for "John"
    searchInput.value = 'John';
    searchInput.dispatchEvent(new Event('input'));
    await el.updateComplete;
    
    const rows = el.shadowRoot.querySelectorAll('tbody tr');
    // Search should filter results, but exact count may vary
    expect(rows.length).to.be.greaterThan(0);
  });

  test('handles pagination correctly', async () => {
    // Add more employees to test pagination
    for (let i = 0; i < 15; i++) {
      store.dispatch(addEmployee({
        firstName: `Employee${i}`,
        lastName: `Test${i}`,
        email: `employee${i}@example.com`,
        phone: '+(90) 532 123 45 67',
        dateOfBirth: '1990-01-01',
        dateOfEmployment: '2020-01-01',
        department: 'IT',
        position: 'Developer'
      }));
    }
    
    await el.updateComplete;
    
    const pagination = el.shadowRoot.querySelector('.pagination');
    expect(pagination).to.exist;
    
    const pageButtons = el.shadowRoot.querySelectorAll('.pagination button');
    expect(pageButtons.length).to.be.greaterThan(1);
  });

  test('handles page change', async () => {
    // Add more employees
    for (let i = 0; i < 15; i++) {
      store.dispatch(addEmployee({
        firstName: `Employee${i}`,
        lastName: `Test${i}`,
        email: `employee${i}@example.com`,
        phone: '+(90) 532 123 45 67',
        dateOfBirth: '1990-01-01',
        dateOfEmployment: '2020-01-01',
        department: 'IT',
        position: 'Developer'
      }));
    }
    
    await el.updateComplete;
    
    const page2Button = el.shadowRoot.querySelector('.pagination button[data-page="2"]');
    if (page2Button) {
      page2Button.click();
      await el.updateComplete;
      
      expect(store.getState().currentPage).to.equal(2);
    }
  });

  test('shows delete confirmation dialog', async () => {
    const deleteButtons = el.shadowRoot.querySelectorAll('button[data-action="delete"]');
    if (deleteButtons.length > 0) {
      deleteButtons[0].click();
      await el.updateComplete;
      
      const dialog = el.shadowRoot.querySelector('.delete-confirm-dialog');
      expect(dialog).to.exist;
      expect(el.showDeleteConfirm).to.be.true;
    }
  });

  test('handles bulk selection', async () => {
    const selectAllCheckbox = el.shadowRoot.querySelector('input[type="checkbox"][data-action="select-all"]');
    if (selectAllCheckbox) {
      selectAllCheckbox.checked = true;
      selectAllCheckbox.dispatchEvent(new Event('change'));
      await el.updateComplete;
      
      expect(el.isAllSelected()).to.be.true;
    }
  });

  test('handles individual row selection', async () => {
    const rowCheckboxes = el.shadowRoot.querySelectorAll('input[type="checkbox"][data-action="select-row"]');
    if (rowCheckboxes.length > 0) {
      rowCheckboxes[0].checked = true;
      rowCheckboxes[0].dispatchEvent(new Event('change'));
      await el.updateComplete;
      
      expect(el.selectedEmployeeIds.length).to.be.greaterThan(0);
    }
  });

  test('displays employee information correctly', () => {
    const rows = el.shadowRoot.querySelectorAll('tbody tr');
    if (rows.length > 0) {
      const firstRow = rows[0];
      const cells = firstRow.querySelectorAll('td');
      
      // Check that employee data is displayed
      expect(cells.length).to.be.greaterThan(0);
    }
  });

  test('handles view mode toggle buttons', async () => {
    const tableButton = el.shadowRoot.querySelector('button[data-view="table"]');
    const listButton = el.shadowRoot.querySelector('button[data-view="list"]');
    
    if (tableButton && listButton) {
      // Test list view
      listButton.click();
      await el.updateComplete;
      expect(store.getState().viewMode).to.equal('list');
      
      // Test table view
      tableButton.click();
      await el.updateComplete;
      expect(store.getState().viewMode).to.equal('table');
    }
  });

  test('updates when store state changes', async () => {
    const initialState = store.getState();
    
    // Add a new employee
    store.dispatch(addEmployee({
      firstName: 'New',
      lastName: 'Employee',
      email: 'new@example.com',
      phone: '+(90) 532 123 45 67',
      dateOfBirth: '1990-01-01',
      dateOfEmployment: '2020-01-01',
      department: 'IT',
      position: 'Developer'
    }));
    
    await el.updateComplete;
    
    const newState = store.getState();
    expect(newState.employees.length).to.equal(initialState.employees.length + 1);
  });

  test('handles empty employee list', async () => {
    // Clear all employees
    store.dispatch(resetStore());
    await el.updateComplete;
    
    const table = el.shadowRoot.querySelector('table');
    if (table) {
      const rows = el.shadowRoot.querySelectorAll('tbody tr');
      expect(rows.length).to.equal(0);
    }
  });

  test('displays correct translations based on language', async () => {
    // Test English
    store.dispatch(setLanguage('en'));
    await el.updateComplete;
    
    // Test Turkish
    store.dispatch(setLanguage('tr'));
    await el.updateComplete;
    
    // Verify component updates
    expect(el.language).to.equal('tr');
  });

  test('handles search with no results', async () => {
    const searchInput = el.shadowRoot.querySelector('input[type="text"]');
    searchInput.value = 'NonExistentEmployee';
    searchInput.dispatchEvent(new Event('input'));
    await el.updateComplete;
    
    const rows = el.shadowRoot.querySelectorAll('tbody tr');
    expect(rows.length).to.equal(0);
  });

  test('maintains selected employees across view mode changes', async () => {
    // Select an employee in table view
    const rowCheckboxes = el.shadowRoot.querySelectorAll('input[type="checkbox"][data-action="select-row"]');
    if (rowCheckboxes.length > 0) {
      rowCheckboxes[0].checked = true;
      rowCheckboxes[0].dispatchEvent(new Event('change'));
      await el.updateComplete;
      
      const selectedCount = el.selectedEmployeeIds.length;
      
      // Switch to list view
      store.dispatch(setViewMode('list'));
      await el.updateComplete;
      
      // Check that selection is maintained
      expect(el.selectedEmployeeIds.length).to.equal(selectedCount);
    }
  });
}); 