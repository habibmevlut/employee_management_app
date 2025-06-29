import { fixture, html, expect } from '@open-wc/testing';
import '../src/app.js';

suite('App', () => {
  test('renders the main app component', async () => {
    const el = await fixture(html`<app-main></app-main>`);
    expect(el).to.exist;
  });
}); 