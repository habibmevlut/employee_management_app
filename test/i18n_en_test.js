import { expect } from '@open-wc/testing';
import en from '../src/i18n/en.js';

suite('i18n en', () => {
  test('should be an object', () => {
    expect(en).to.be.an('object');
  });

  test('should have required translation keys', () => {
    expect(en).to.have.property('employeeList');
    expect(en).to.have.property('employeeForm');
    expect(en).to.have.property('confirmDialog');
    expect(en).to.have.property('navigation');
  });

  test('should have form labels', () => {
    expect(en.employeeList.firstName).to.be.a('string');
    expect(en.employeeList.lastName).to.be.a('string');
    expect(en.employeeList.email).to.be.a('string');
    expect(en.employeeList.phone).to.be.a('string');
  });

  test('should have action buttons', () => {
    expect(en.employeeForm.save).to.be.a('string');
    expect(en.employeeForm.cancel).to.be.a('string');
    expect(en.employeeList.edit).to.be.a('string');
    expect(en.employeeList.delete).to.be.a('string');
  });

  test('should have navigation elements', () => {
    expect(en.employeeList.search).to.be.a('string');
    expect(en.employeeList.viewMode.table).to.be.a('string');
    expect(en.employeeList.viewMode.list).to.be.a('string');
  });
}); 