import { fixture, html, expect } from '@open-wc/testing';
import '../src/components/navigation/nav-menu.js';

suite('NavMenu', () => {
  test('renders the navigation menu component', async () => {
    const el = await fixture(html`<nav-menu></nav-menu>`);
    expect(el).to.exist;
  });
}); 