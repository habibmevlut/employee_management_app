import { expect } from '@open-wc/testing';
import { validateEmployeeForm, validateEmail, validatePhone, validateRequired, validateDate } from '../src/utils/validation.js';

suite('Validation Functions', () => {
  suite('validateEmployeeForm', () => {
    test('returns errors for empty input', () => {
      const errors = validateEmployeeForm({});
      expect(errors).to.be.an('object');
      expect(errors.firstName).to.include('required');
      expect(errors.lastName).to.include('required');
      expect(errors.email).to.include('required');
      expect(errors.phone).to.include('required');
      expect(errors.dateOfBirth).to.include('required');
      expect(errors.dateOfEmployment).to.include('required');
      expect(errors.department).to.include('required');
      expect(errors.position).to.include('required');
    });

    test('returns no errors for valid input', () => {
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

      const errors = validateEmployeeForm(employee);
      expect(errors.firstName).to.equal('');
      expect(errors.lastName).to.equal('');
      expect(errors.email).to.equal('');
      expect(errors.phone).to.equal('');
      expect(errors.dateOfBirth).to.equal('');
      expect(errors.dateOfEmployment).to.equal('');
      expect(errors.department).to.equal('');
      expect(errors.position).to.equal('');
    });
  });

  suite('validateEmail', () => {
    test('returns error for empty email', () => {
      const error = validateEmail('');
      expect(error).to.include('required');
    });

    test('returns error for invalid email format', () => {
      const error = validateEmail('invalid-email');
      expect(error).to.include('Invalid email format');
    });

    test('returns empty string for valid email', () => {
      const error = validateEmail('test@example.com');
      expect(error).to.equal('');
    });
  });

  suite('validatePhone', () => {
    test('returns error for empty phone', () => {
      const error = validatePhone('');
      expect(error).to.include('required');
    });

    test('returns error for invalid phone format', () => {
      const error = validatePhone('123456');
      expect(error).to.include('Invalid phone format');
    });

    test('returns empty string for valid phone', () => {
      const error = validatePhone('+(90) 532 123 45 67');
      expect(error).to.equal('');
    });
  });

  suite('validateRequired', () => {
    test('returns error for empty value', () => {
      const error = validateRequired('', 'Field Name');
      expect(error).to.include('Field Name is required');
    });

    test('returns empty string for non-empty value', () => {
      const error = validateRequired('test', 'Field Name');
      expect(error).to.equal('');
    });
  });

  suite('validateDate', () => {
    test('returns error for empty date', () => {
      const error = validateDate('');
      expect(error).to.include('required');
    });

    test('returns error for invalid date', () => {
      const error = validateDate('invalid-date');
      expect(error).to.include('Invalid date');
    });

    test('returns empty string for valid date', () => {
      const error = validateDate('1990-01-01');
      expect(error).to.equal('');
    });
  });
}); 