import { fixture, html, expect } from '@open-wc/testing';
import '../src/app.js';

suite('EmployeeApp', () => {
  test('renders the main container and nav-menu', async () => {
    const el = await fixture(html`<employee-app></employee-app>`);
    const container = el.shadowRoot.querySelector('.container');
    const nav = el.shadowRoot.querySelector('nav-menu');
    expect(container).to.exist;
    expect(nav).to.exist;
  });

  test('should define the custom element', () => {
    expect(customElements.get('employee-app')).to.exist;
  });

  test('should initialize the router and set routes', async () => {
    const el = await fixture(html`<employee-app></employee-app>`);
    const outlet = el.shadowRoot.querySelector('#outlet');
    expect(outlet).to.exist;
    // Router'ın setRoutes fonksiyonu için spy/mock eklenebilir
  });
}); 