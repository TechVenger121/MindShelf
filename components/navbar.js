class CustomNavbar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <nav class="bg-gray-900 text-gray-100 shadow-lg p-4 flex flex-wrap justify-between items-center">
        <a href="index.html" class="text-2xl font-bold text-primary">MINDSHELF</a>
        <div class="flex gap-6 text-lg font-medium mt-2 sm:mt-0">
          <a href="index.html" class="nav-link">Discover</a>
          <a href="collections.html" class="nav-link">Collections</a>
          <a href="user.html" class="nav-link">My Books</a>
        </div>
      </nav>
    `;

    this.setActiveLink();
  }

  setActiveLink() {
    const links = this.querySelectorAll(".nav-link");
    const currentPage = window.location.pathname.split("/").pop();

    links.forEach(link => {
      const linkPage = link.getAttribute("href");

      // Remove any existing styles
      link.classList.remove("bg-primary", "text-white", "px-3", "py-1", "rounded-lg");

      // If current page matches link → mark active
      if (linkPage === currentPage) {
        link.classList.add("bg-primary", "text-white", "px-3", "py-1", "rounded-lg");
      }
    });
  }
}

customElements.define("custom-navbar", CustomNavbar);
