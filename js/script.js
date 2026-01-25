document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('nav a');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;
        const filename = href.split('/').pop();

        // Highlight if filename matches current path end
        if (filename && currentPath.endsWith(filename)) {
            link.classList.add('active');
        }
        // Highlight home if root
        else if ((filename === 'index.html' || filename === '') && (currentPath.endsWith('/') || currentPath === '/')) {
             link.classList.add('active');
        }
        // Highlight Blog for blog posts
        else if (currentPath.includes('/blog/') && filename === 'blog.html') {
             link.classList.add('active');
        }
    });
});
