import { expect } from '@open-wc/testing';
import { store, addEmployee, updateEmployee, deleteEmployee, setViewMode, setCurrentPage, setSearchTerm, setLanguage, resetStore } from '../src/store/employee-store.js';

suite('EmployeeStore', () => {
  setup(() => {
    // Reset store to initial state before each test
    store.dispatch(resetStore());
  });

  test('should be defined', () => {
    expect(store).to.exist;
  });

  test('should have initial state', () => {
    const state = store.getState();
    expect(state.employees).to.be.an('array');
    expect(state.viewMode).to.equal('table');
    expect(state.currentPage).to.equal(1);
    expect(state.searchTerm).to.equal('');
  });

  test('should add employee', () => {
    const employee = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+(90) 532 123 45 67',
      dateOfBirth: '1990-01-01',
      dateOfEmployment: '2020-01-01',
      department: 'IT',
      position: 'Developer'
    };

    store.dispatch(addEmployee(employee));
    const state = store.getState();
    expect(state.employees).to.have.length(1);
    expect(state.employees[0].firstName).to.equal('John');
  });

  test('should update employee', () => {
    const employee = {
      id: '1',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      phone: '+(90) 532 123 45 67',
      dateOfBirth: '1990-01-01',
      dateOfEmployment: '2020-01-01',
      department: 'IT',
      position: 'Developer'
    };

    store.dispatch(addEmployee(employee));
    const state1 = store.getState();
    const employeeId = state1.employees[0].id;
    
    store.dispatch(updateEmployee({ ...employee, id: employeeId, firstName: 'Jane Updated' }));
    
    const state2 = store.getState();
    expect(state2.employees[0].firstName).to.equal('Jane Updated');
  });

  test('should delete employee', () => {
    const employee = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '+(90) 532 123 45 67',
      dateOfBirth: '1990-01-01',
      dateOfEmployment: '2020-01-01',
      department: 'IT',
      position: 'Developer'
    };

    store.dispatch(addEmployee(employee));
    const state1 = store.getState();
    const employeeId = state1.employees[0].id;
    
    store.dispatch(deleteEmployee(employeeId));
    const state2 = store.getState();
    expect(state2.employees).to.have.length(0);
  });

  test('should set view mode', () => {
    store.dispatch(setViewMode('list'));
    const state = store.getState();
    expect(state.viewMode).to.equal('list');
  });

  test('should set current page', () => {
    store.dispatch(setCurrentPage(2));
    const state = store.getState();
    expect(state.currentPage).to.equal(2);
  });

  test('should set search term', () => {
    store.dispatch(setSearchTerm('test'));
    const state = store.getState();
    expect(state.searchTerm).to.equal('test');
    expect(state.currentPage).to.equal(1); // Should reset to page 1
  });

  test('should set language', () => {
    store.dispatch(setLanguage('tr'));
    const state = store.getState();
    expect(state.language).to.equal('tr');
  });
}); 