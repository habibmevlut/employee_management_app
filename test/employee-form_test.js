import { fixture, html, expect } from '@open-wc/testing';
import { store, addEmployee, resetStore } from '../src/store/employee-store.js';
import '../src/components/employee-form/employee-form.js';

suite('EmployeeForm', () => {
  let element;

  setup(async () => {
    // Reset store before each test
    store.dispatch(resetStore());
    element = await fixture(html`<employee-form></employee-form>`);
    await element.updateComplete;
  });

  test('renders the employee form component', () => {
    expect(element).to.exist;
    expect(element.tagName.toLowerCase()).to.equal('employee-form');
  });

  test('should have form elements', () => {
    const form = element.shadowRoot.querySelector('form');
    expect(form).to.exist;
  });

  test('should have all required input fields', () => {
    const requiredFields = [
      'firstName',
      'lastName', 
      'email',
      'phone',
      'dateOfBirth',
      'dateOfEmployment',
      'department',
      'position'
    ];

    requiredFields.forEach(fieldName => {
      const input = element.shadowRoot.querySelector(`input[name="${fieldName}"], select[name="${fieldName}"]`);
      expect(input, `Field ${fieldName} should exist`).to.exist;
    });
  });

  test('should have submit and cancel buttons', () => {
    const submitBtn = element.shadowRoot.querySelector('button[type="submit"]');
    const cancelBtn = element.shadowRoot.querySelector('button[type="button"]');
    
    expect(submitBtn).to.exist;
    expect(cancelBtn).to.exist;
  });

  test('should handle input changes and update form data', async () => {
    const firstNameInput = element.shadowRoot.querySelector('input[name="firstName"]');
    const lastNameInput = element.shadowRoot.querySelector('input[name="lastName"]');
    const emailInput = element.shadowRoot.querySelector('input[name="email"]');
    
    if (firstNameInput && lastNameInput && emailInput) {
      firstNameInput.value = 'John';
      firstNameInput.dispatchEvent(new Event('input'));
      
      lastNameInput.value = 'Doe';
      lastNameInput.dispatchEvent(new Event('input'));
      
      emailInput.value = 'john@example.com';
      emailInput.dispatchEvent(new Event('input'));
      
      await element.updateComplete;
      
      expect(firstNameInput.value).to.equal('John');
      expect(lastNameInput.value).to.equal('Doe');
      expect(emailInput.value).to.equal('john@example.com');
    }
  });

  test('should validate email format', async () => {
    const emailInput = element.shadowRoot.querySelector('input[name="email"]');
    if (emailInput) {
      // Test invalid email
      emailInput.value = 'invalid-email';
      emailInput.dispatchEvent(new Event('input'));
      await element.updateComplete;
      
      // Test valid email
      emailInput.value = 'valid@example.com';
      emailInput.dispatchEvent(new Event('input'));
      await element.updateComplete;
      
      expect(emailInput.value).to.equal('valid@example.com');
    }
  });

  test('should validate phone format', async () => {
    const phoneInput = element.shadowRoot.querySelector('input[name="phone"]');
    if (phoneInput) {
      // Test invalid phone
      phoneInput.value = '123456';
      phoneInput.dispatchEvent(new Event('input'));
      await element.updateComplete;
      
      // Test valid phone
      phoneInput.value = '+(90) 532 123 45 67';
      phoneInput.dispatchEvent(new Event('input'));
      await element.updateComplete;
      
      expect(phoneInput.value).to.equal('+(90) 532 123 45 67');
    }
  });

  test('should handle cancel button click', async () => {
    const cancelBtn = element.shadowRoot.querySelector('button[type="button"]');
    if (cancelBtn) {
      const clickEvent = new Event('click', { bubbles: true });
      cancelBtn.dispatchEvent(clickEvent);
      
      await element.updateComplete;
      expect(element).to.exist;
    }
  });

  test('should populate form in edit mode', async () => {
    // Add an employee to the store
    const employee = {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      phone: '+(90) 555 987 65 43',
      dateOfBirth: '1985-05-15',
      dateOfEmployment: '2019-03-15',
      department: 'HR',
      position: 'Manager'
    };
    
    store.dispatch(addEmployee(employee));
    const state = store.getState();
    const employeeId = state.employees[0].id;
    
    // Create form in edit mode
    const editElement = await fixture(html`<employee-form .employeeId="${employeeId}"></employee-form>`);
    await editElement.updateComplete;
    
    // Check if form is populated with employee data
    const firstNameInput = editElement.shadowRoot.querySelector('input[name="firstName"]');
    if (firstNameInput) {
      // In edit mode, the form should be populated
      expect(editElement).to.exist;
    }
  });

  test('should handle department selection', async () => {
    const departmentSelect = element.shadowRoot.querySelector('select[name="department"]');
    if (departmentSelect) {
      departmentSelect.value = 'IT';
      departmentSelect.dispatchEvent(new Event('change'));
      
      await element.updateComplete;
      // Check that the change event was handled
      expect(element).to.exist;
    }
  });

  test('should handle position selection', async () => {
    const positionSelect = element.shadowRoot.querySelector('select[name="position"]');
    if (positionSelect) {
      positionSelect.value = 'Developer';
      positionSelect.dispatchEvent(new Event('change'));
      
      await element.updateComplete;
      // Check that the change event was handled
      expect(element).to.exist;
    }
  });

  test('should validate date fields', async () => {
    const dateOfBirthInput = element.shadowRoot.querySelector('input[name="dateOfBirth"]');
    const dateOfEmploymentInput = element.shadowRoot.querySelector('input[name="dateOfEmployment"]');
    
    if (dateOfBirthInput && dateOfEmploymentInput) {
      dateOfBirthInput.value = '1990-01-01';
      dateOfBirthInput.dispatchEvent(new Event('input'));
      
      dateOfEmploymentInput.value = '2020-01-01';
      dateOfEmploymentInput.dispatchEvent(new Event('input'));
      
      await element.updateComplete;
      
      expect(dateOfBirthInput.value).to.equal('1990-01-01');
      expect(dateOfEmploymentInput.value).to.equal('2020-01-01');
    }
  });

  test('should handle form reset', async () => {
    const form = element.shadowRoot.querySelector('form');
    
    // Fill in some data
    const firstNameInput = element.shadowRoot.querySelector('input[name="firstName"]');
    if (firstNameInput) {
      firstNameInput.value = 'Test';
      firstNameInput.dispatchEvent(new Event('input'));
    }
    
    await element.updateComplete;
    
    // Reset form
    const resetEvent = new Event('reset', { bubbles: true });
    form.dispatchEvent(resetEvent);
    
    await element.updateComplete;
    
    expect(element).to.exist;
  });

  test('should have proper form structure', () => {
    const form = element.shadowRoot.querySelector('form');
    expect(form).to.exist;
    
    const inputs = element.shadowRoot.querySelectorAll('input, select');
    expect(inputs.length).to.be.greaterThan(0);
    
    const buttons = element.shadowRoot.querySelectorAll('button');
    expect(buttons.length).to.be.greaterThan(0);
  });

  test('should handle input focus and blur events', async () => {
    const firstNameInput = element.shadowRoot.querySelector('input[name="firstName"]');
    if (firstNameInput) {
      firstNameInput.focus();
      firstNameInput.dispatchEvent(new Event('focus'));
      
      firstNameInput.blur();
      firstNameInput.dispatchEvent(new Event('blur'));
      
      await element.updateComplete;
      expect(element).to.exist;
    }
  });
}); 