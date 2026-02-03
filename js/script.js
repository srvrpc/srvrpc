document.addEventListener('DOMContentLoaded', () => {
    // Navigation Highlighting Logic
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

    // Initialize Theme Manager
    ThemeManager.init();
});

/* Theme Manager */
const ThemeManager = {
    storageKey: 'theme-preference',

    init() {
        this.injectThemeSwitcher();
        this.loadTheme();

        // Listen for system changes if mode is auto
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (this.getStoredTheme() === 'auto') {
                this.applyTheme('auto');
            }
        });
    },

    getStoredTheme() {
        return localStorage.getItem(this.storageKey) || 'auto';
    },

    setStoredTheme(theme) {
        localStorage.setItem(this.storageKey, theme);
    },

    applyTheme(theme) {
        let effectiveTheme = theme;
        if (theme === 'auto') {
            effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }

        if (effectiveTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }

        this.updateSwitcherUI(theme);
    },

    injectThemeSwitcher() {
        // Find target
        // Priority 1: Standard Header
        let target = document.querySelector('header nav ul');

        // Priority 2: Wikipedia Personal Tools (Top Right)
        if (!target) {
            target = document.querySelector('#p-personal ul');
        }

        if (!target) return; // Fail silently if no target

        const li = document.createElement('li');
        li.className = 'theme-switcher-item';

        const container = document.createElement('div');
        container.className = 'theme-switcher';
        container.setAttribute('role', 'group');
        container.setAttribute('aria-label', 'Theme switcher');

        ['Light', 'Dark', 'Auto'].forEach(mode => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.textContent = mode;
            btn.setAttribute('data-value', mode.toLowerCase());
            btn.setAttribute('aria-label', `${mode} theme`);
            btn.addEventListener('click', () => {
                const theme = mode.toLowerCase();
                this.setStoredTheme(theme);
                this.applyTheme(theme);
            });
            container.appendChild(btn);
        });

        li.appendChild(container);
        target.appendChild(li);
    },

    updateSwitcherUI(activeTheme) {
        const buttons = document.querySelectorAll('.theme-switcher button');
        buttons.forEach(btn => {
            if (btn.getAttribute('data-value') === activeTheme) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    },

    loadTheme() {
        const stored = this.getStoredTheme();
        this.applyTheme(stored);
    }
};

// Apply theme immediately to prevent flash (if script is loaded early enough)
// However, since script is defer, this might run after parsing.
// To truly prevent flash, this snippet should be in HEAD.
// But we are sticking to modifying js/script.js as per plan.
// We can try to read localStorage immediately here outside DOMContentLoaded
(function() {
    const storageKey = 'theme-preference';
    const stored = localStorage.getItem(storageKey) || 'auto';
    let effectiveTheme = stored;
    if (stored === 'auto') {
        effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    if (effectiveTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
})();
