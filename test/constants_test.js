import { expect } from '@open-wc/testing';
import { EMAIL_REGEX, PHONE_REGEX } from '../src/utils/constants.js';

suite('Constants', () => {
  test('should export EMAIL_REGEX', () => {
    expect(EMAIL_REGEX).to.be.an.instanceOf(RegExp);
  });
  
  test('should export PHONE_REGEX', () => {
    expect(PHONE_REGEX).to.be.an.instanceOf(RegExp);
  });

  suite('EMAIL_REGEX', () => {
    test('should match valid email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
        '123@test.com'
      ];

      validEmails.forEach(email => {
        expect(EMAIL_REGEX.test(email)).to.be.true;
      });
    });

    test('should not match invalid email addresses', () => {
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'test@',
        'test.example.com',
        ''
      ];

      invalidEmails.forEach(email => {
        expect(EMAIL_REGEX.test(email)).to.be.false;
      });
    });
  });

  suite('PHONE_REGEX', () => {
    test('should match valid phone numbers', () => {
      const validPhones = [
        '+(90) 532 123 45 67',
        '+(99) 555 123 45 67',
        '+(123) 123 456 78 90'
      ];

      validPhones.forEach(phone => {
        expect(PHONE_REGEX.test(phone)).to.be.true;
      });
    });

    test('should not match invalid phone numbers', () => {
      const invalidPhones = [
        '123456',
        'abc123',
        '+90',
        '+905321234567',
        '+(90) 532 123 4567',
        '+(1) 555 123 45 67',
        '+(44) 20 7946 09 58',
        ''
      ];

      invalidPhones.forEach(phone => {
        expect(PHONE_REGEX.test(phone)).to.be.false;
      });
    });
  });
}); 