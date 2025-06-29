import { expect } from '@open-wc/testing';
import { generateMockEmployees, isFirstTimeLoad, markAsInitialized } from '../src/utils/mock-data.js';

suite('Mock Data Generator', () => {
  test('should generate the specified number of employees', () => {
    const count = 15;
    const employees = generateMockEmployees(count);
    
    expect(employees).to.be.an('array');
    expect(employees.length).to.equal(count);
  });

  test('should generate employees with all required fields', () => {
    const employees = generateMockEmployees(5);
    
    employees.forEach(employee => {
      expect(employee).to.have.property('firstName');
      expect(employee).to.have.property('lastName');
      expect(employee).to.have.property('email');
      expect(employee).to.have.property('phone');
      expect(employee).to.have.property('dateOfBirth');
      expect(employee).to.have.property('dateOfEmployment');
      expect(employee).to.have.property('department');
      expect(employee).to.have.property('position');
      
      expect(employee.firstName).to.be.a('string');
      expect(employee.lastName).to.be.a('string');
      expect(employee.email).to.be.a('string');
      expect(employee.phone).to.be.a('string');
      expect(employee.dateOfBirth).to.be.a('string');
      expect(employee.dateOfEmployment).to.be.a('string');
      expect(employee.department).to.be.a('string');
      expect(employee.position).to.be.a('string');
    });
  });

  test('should generate valid email addresses', () => {
    const employees = generateMockEmployees(10);
    
    employees.forEach(employee => {
      expect(employee.email).to.match(/^[a-z]+\.[a-z]+@[a-z]+\.[a-z]+$/);
    });
  });

  test('should generate valid phone numbers', () => {
    const employees = generateMockEmployees(10);
    
    employees.forEach(employee => {
      expect(employee.phone).to.match(/^\+\d+ \d+ \d+ \d+$/);
    });
  });

  test('should generate valid date formats', () => {
    const employees = generateMockEmployees(10);
    
    employees.forEach(employee => {
      expect(employee.dateOfBirth).to.match(/^\d{4}-\d{2}-\d{2}$/);
      expect(employee.dateOfEmployment).to.match(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  test('should generate realistic birth years', () => {
    const employees = generateMockEmployees(20);
    const currentYear = new Date().getFullYear();
    
    employees.forEach(employee => {
      const birthYear = parseInt(employee.dateOfBirth.split('-')[0]);
      expect(birthYear).to.be.at.least(currentYear - 60);
      expect(birthYear).to.be.at.most(currentYear - 20);
    });
  });

  test('should generate realistic employment years', () => {
    const employees = generateMockEmployees(20);
    const currentYear = new Date().getFullYear();
    
    employees.forEach(employee => {
      const employmentYear = parseInt(employee.dateOfEmployment.split('-')[0]);
      expect(employmentYear).to.be.at.least(currentYear - 10);
      expect(employmentYear).to.be.at.most(currentYear);
    });
  });

  test('should generate valid departments and positions', () => {
    const employees = generateMockEmployees(50);
    const validDepartments = [
      'IT', 'HR', 'Marketing', 'Sales', 'Finance', 'Operations', 
      'Engineering', 'Design', 'Product', 'Support'
    ];
    
    employees.forEach(employee => {
      expect(validDepartments).to.include(employee.department);
      expect(employee.position).to.be.a('string');
      expect(employee.position.length).to.be.greaterThan(0);
    });
  });

  test('should handle first time load detection', () => {
    // Clear localStorage for testing
    localStorage.removeItem('employees_initialized');
    
    expect(isFirstTimeLoad()).to.be.true;
    
    markAsInitialized();
    expect(isFirstTimeLoad()).to.be.false;
    
    // Clean up
    localStorage.removeItem('employees_initialized');
  });

  test('should generate unique employee data', () => {
    const employees = generateMockEmployees(100);
    const emails = employees.map(emp => emp.email);
    const uniqueEmails = emails.filter((email, index) => emails.indexOf(email) === index);
    
    // Most emails should be unique (some might be duplicates due to same name)
    expect(uniqueEmails.length).to.be.greaterThan(employees.length * 0.8);
  });

  test('should generate default count when no count specified', () => {
    const employees = generateMockEmployees();
    expect(employees.length).to.equal(15);
  });
}); 