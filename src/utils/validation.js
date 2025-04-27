import { EMAIL_REGEX, PHONE_REGEX } from './constants';

export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  if (!EMAIL_REGEX.test(email)) return 'Invalid email format';
  return '';
};

export const validatePhone = (phone) => {
  if (!phone) return 'Phone number is required';
  if (!PHONE_REGEX.test(phone)) return 'Invalid phone format (e.g. +(90) 532 123 45 67)';
  return '';
};

export const validateRequired = (value, fieldName) => {
  if (!value) return `${fieldName} is required`;
  return '';
};

export const validateDate = (date) => {
  if (!date) return 'Date is required';
  const selectedDate = new Date(date);
  if (isNaN(selectedDate.getTime())) return 'Invalid date';
  return '';
};

export const validateEmployeeForm = (employee) => {
  const errors = {};
  
  errors.firstName = validateRequired(employee.firstName, 'First name');
  errors.lastName = validateRequired(employee.lastName, 'Last name');
  errors.email = validateEmail(employee.email);
  errors.phone = validatePhone(employee.phone);
  errors.dateOfBirth = validateDate(employee.dateOfBirth);
  errors.dateOfEmployment = validateDate(employee.dateOfEmployment);
  errors.department = validateRequired(employee.department, 'Department');
  errors.position = validateRequired(employee.position, 'Position');

  return errors;
}; 