import { fixture, html, expect, aTimeout } from '@open-wc/testing';
import '../src/components/toast-message.js';

suite('ToastMessage', () => {
  test('renders with default values', async () => {
    const el = await fixture(html`<toast-message></toast-message>`);
    expect(el.open).to.be.false;
    expect(el.message).to.equal('');
    expect(el.type).to.equal('success');
  });

  test('shows message and type correctly', async () => {
    const el = await fixture(html`<toast-message></toast-message>`);
    el.show('Test success', 'success');
    await el.updateComplete;
    expect(el.open).to.be.true;
    expect(el.message).to.equal('Test success');
    expect(el.type).to.equal('success');
    const toastDiv = el.shadowRoot.querySelector('.toast');
    expect(toastDiv.classList.contains('open')).to.be.true;
    expect(toastDiv.classList.contains('success')).to.be.true;
    expect(toastDiv.textContent).to.include('Test success');
  });

  test('shows error type correctly', async () => {
    const el = await fixture(html`<toast-message></toast-message>`);
    el.show('Error occurred', 'error');
    await el.updateComplete;
    expect(el.type).to.equal('error');
    const toastDiv = el.shadowRoot.querySelector('.toast');
    expect(toastDiv.classList.contains('error')).to.be.true;
    expect(toastDiv.textContent).to.include('Error occurred');
  });

  test('auto closes after timeout', async () => {
    const el = await fixture(html`<toast-message></toast-message>`);
    el.show('Auto close');
    await el.updateComplete;
    expect(el.open).to.be.true;
    await aTimeout(2600); // 2500ms + buffer
    expect(el.open).to.be.false;
  });
}); 