class CustomFooter extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        footer {
          background: #1e293b;
          padding: 2rem;
          color: #94a3b8;
          text-align: center;
        }
        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
        }
        .footer-section h3 {
          color: #e2e8f0;
          margin-bottom: 1rem;
          font-size: 1.1rem;
        }
        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .footer-link {
          color: #94a3b8;
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer-link:hover {
          color: #8b5cf6;
        }
        .copyright {
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 1px solid #334155;
          font-size: 0.9rem;
        }
      </style>
      <footer>
        <div class="footer-content">
          <div class="footer-section">
            <h3>MindShelf</h3>
            <p>Your personal digital library for organizing and discovering great books.</p>
          </div>
          <div class="footer-section">
            <h3>Quick Links</h3>
            <div class="footer-links">
              <a href="/user.html" class="footer-link">My Books</a>
              <a href="/discover.html" class="footer-link active">Discover</a>
<a href="/collections.html" class="footer-link">Collections</a>
            </div>
          </div>
          <div class="footer-section">
            <h3>Legal</h3>
            <div class="footer-links">
              <a href="/privacy.html" class="footer-link">Privacy Policy</a>
              <a href="/terms.html" class="footer-link">Terms of Service</a>
            </div>
          </div>
        </div>
        <div class="copyright">
          &copy; ${new Date().getFullYear()} MindShelf. All rights reserved.
        </div>
      </footer>
    `;
  }
}
customElements.define('custom-footer', CustomFooter);