import { expect } from '@open-wc/testing';
import tr from '../src/i18n/tr.js';

suite('i18n tr', () => {
  test('should be an object', () => {
    expect(tr).to.be.an('object');
  });

  test('should have required translation keys', () => {
    expect(tr).to.have.property('employeeList');
    expect(tr).to.have.property('employeeForm');
    expect(tr).to.have.property('confirmDialog');
    expect(tr).to.have.property('navigation');
  });

  test('should have form labels', () => {
    expect(tr.employeeList.firstName).to.be.a('string');
    expect(tr.employeeList.lastName).to.be.a('string');
    expect(tr.employeeList.email).to.be.a('string');
    expect(tr.employeeList.phone).to.be.a('string');
  });

  test('should have action buttons', () => {
    expect(tr.employeeForm.save).to.be.a('string');
    expect(tr.employeeForm.cancel).to.be.a('string');
    expect(tr.employeeList.edit).to.be.a('string');
    expect(tr.employeeList.delete).to.be.a('string');
  });

  test('should have navigation elements', () => {
    expect(tr.employeeList.search).to.be.a('string');
    expect(tr.employeeList.viewMode.table).to.be.a('string');
    expect(tr.employeeList.viewMode.list).to.be.a('string');
  });
}); 