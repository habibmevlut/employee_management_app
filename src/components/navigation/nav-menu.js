import { LitElement, html, css } from 'lit';

export class NavMenu extends LitElement {
  static styles = css`
    :host {
      display: block;
      margin-bottom: 20px;
    }

    nav {
      background-color: #f8f9fa;
      padding: 1rem;
      border-radius: 4px;
    }

    .nav-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .brand {
      font-size: 1.5rem;
      font-weight: bold;
      color: #ff4400;
      text-decoration: none;
    }

    .nav-links {
      display: flex;
      gap: 1rem;
    }

    a {
      color: #333;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background-color 0.3s;
    }

    a:hover {
      background-color: #e9ecef;
    }

    .add-new {
      background-color: #ff4400;
      color: white;
    }

    .add-new:hover {
      background-color: #cc3700;
    }

    @media (max-width: 768px) {
      .nav-container {
        flex-direction: column;
        gap: 1rem;
      }

      .nav-links {
        flex-direction: column;
        width: 100%;
        text-align: center;
      }
    }
  `;

  render() {
    return html`
      <nav>
        <div class="nav-container">
          <a href="/" class="brand">ING</a>
          <div class="nav-links">
            <a href="/">Employees</a>
            <a href="/add" class="add-new">Add New</a>
          </div>
        </div>
      </nav>
    `;
  }
}

customElements.define('nav-menu', NavMenu); 