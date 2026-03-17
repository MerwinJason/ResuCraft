/* ═══════════════════════════════════════════════════════════════
   ResuCraft — Resume Editor JavaScript
   Full interactive editing, page management, style customization
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    // ── References ──
    const pagesContainer = document.getElementById('pages-container');
    const colorPresets = document.getElementById('color-presets');
    const customColor = document.getElementById('custom-color');
    const secondaryColor = document.getElementById('secondary-color');
    const fontSelect = document.getElementById('font-select');
    const fontSizeSlider = document.getElementById('font-size-slider');
    const fontSizeValue = document.getElementById('font-size-value');
    const lineHeightSlider = document.getElementById('line-height-slider');
    const lineHeightValue = document.getElementById('line-height-value');
    const sectionSpacingSlider = document.getElementById('section-spacing-slider');
    const sectionSpacingValue = document.getElementById('section-spacing-value');
    const sidebarBgColor = document.getElementById('sidebar-bg-color');
    const headerStyleSelect = document.getElementById('header-style');

    let pageCount = 1;

    // ══════════════════════════════════════════
    // COLOR / ACCENT
    // ══════════════════════════════════════════
    function setAccentColor(color) {
        document.documentElement.style.setProperty('--accent', color);
        // Update resume header bg for banner style
        document.querySelectorAll('.resume-header.banner').forEach(h => {
            h.style.background = color;
        });
        // We removed the manual setting of text color since style.css handles it via var(--accent)
    }

    function setSecondaryColor(color) {
        document.documentElement.style.setProperty('--accent2', color);
        document.querySelectorAll('.section-line').forEach(el => {
            el.style.background = color;
        });
    }

    colorPresets.addEventListener('click', (e) => {
        const swatch = e.target.closest('.color-swatch');
        if (!swatch) return;
        colorPresets.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
        setAccentColor(swatch.dataset.color);
        customColor.value = swatch.dataset.color;
    });

    customColor.addEventListener('input', (e) => {
        colorPresets.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
        setAccentColor(e.target.value);
    });

    secondaryColor.addEventListener('input', (e) => {
        setSecondaryColor(e.target.value);
    });

    // ══════════════════════════════════════════
    // FONT
    // ══════════════════════════════════════════
    fontSelect.addEventListener('change', (e) => {
        document.documentElement.style.setProperty('--resume-font', e.target.value);
        document.querySelectorAll('.resume-page').forEach(p => {
            p.style.fontFamily = e.target.value;
        });
    });

    fontSizeSlider.addEventListener('input', (e) => {
        const val = e.target.value + 'pt';
        fontSizeValue.textContent = val;
        document.documentElement.style.setProperty('--resume-font-size', val);
        document.querySelectorAll('.resume-page').forEach(p => {
            p.style.fontSize = val;
        });
    });

    lineHeightSlider.addEventListener('input', (e) => {
        lineHeightValue.textContent = e.target.value;
        document.documentElement.style.setProperty('--resume-line-height', e.target.value);
        document.querySelectorAll('.resume-page').forEach(p => {
            p.style.lineHeight = e.target.value;
        });
    });

    sectionSpacingSlider.addEventListener('input', (e) => {
        sectionSpacingValue.textContent = e.target.value + 'x';
        document.documentElement.style.setProperty('--spacing-multiplier', e.target.value);
    });

    // ══════════════════════════════════════════
    // SIDEBAR BG
    // ══════════════════════════════════════════
    sidebarBgColor.addEventListener('input', (e) => {
        document.documentElement.style.setProperty('--resume-sidebar-bg', e.target.value);
        document.querySelectorAll('.col-right').forEach(r => {
            r.style.background = e.target.value;
        });
    });

    // ══════════════════════════════════════════
    // HEADER STYLE
    // ══════════════════════════════════════════
    headerStyleSelect.addEventListener('change', (e) => {
        const style = e.target.value;
        document.querySelectorAll('.resume-header').forEach(h => {
            h.classList.remove('banner', 'minimal', 'centered-line');
            h.classList.add(style);
            if (style === 'banner') {
                h.style.background = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
            } else {
                h.style.background = '';
            }
        });
    });

    // ══════════════════════════════════════════
    // LAYOUT
    // ══════════════════════════════════════════
    document.querySelectorAll('.layout-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.layout-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const layout = btn.dataset.layout;
            document.querySelectorAll('.resume-body').forEach(body => {
                body.classList.remove('two-col', 'single-col');
                body.classList.add(layout);
            });
        });
    });

    // ══════════════════════════════════════════
    // ADD / REMOVE PAGES
    // ══════════════════════════════════════════
    document.getElementById('btn-add-page').addEventListener('click', () => {
        pageCount++;
        const newPage = document.createElement('div');
        newPage.className = 'resume-page';
        newPage.dataset.page = pageCount;

        const currentLayout = document.querySelector('.layout-btn.active')?.dataset.layout || 'two-col';

        newPage.innerHTML = `
            <div class="resume-body ${currentLayout}">
                <div class="col-left" id="col-left-${pageCount}">
                    <section class="resume-section">
                        <div class="section-header-row">
                            <h2 contenteditable="true" class="editable section-title">NEW SECTION</h2>
                            <button class="remove-section-btn" title="Remove section">✕</button>
                        </div>
                        <div class="section-line"></div>
                        <p contenteditable="true" class="editable section-text">Click to edit this section content...</p>
                    </section>
                </div>
                <div class="col-right" id="col-right-${pageCount}" style="background: var(--resume-sidebar-bg);">
                    <section class="resume-section">
                        <div class="section-header-row">
                            <h2 contenteditable="true" class="editable section-title">SIDEBAR SECTION</h2>
                            <button class="remove-section-btn" title="Remove section">✕</button>
                        </div>
                        <div class="section-line"></div>
                        <p contenteditable="true" class="editable section-text">Click to edit...</p>
                    </section>
                </div>
            </div>
        `;
        pagesContainer.appendChild(newPage);
        newPage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        attachPageListeners(newPage);
    });

    document.getElementById('btn-remove-page').addEventListener('click', () => {
        const pages = pagesContainer.querySelectorAll('.resume-page');
        if (pages.length > 1) {
            pages[pages.length - 1].remove();
            pageCount = Math.max(1, pageCount - 1);
        }
    });

    // ══════════════════════════════════════════
    // ADD SECTIONS (from panel)
    // ══════════════════════════════════════════
    document.querySelectorAll('.add-sec-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.target; // 'left' or 'right'
            const colId = target === 'left' ? 'col-left-1' : 'col-right-1';
            const col = document.getElementById(colId);
            if (!col) return;

            const section = document.createElement('section');
            section.className = 'resume-section';
            section.innerHTML = `
                <div class="section-header-row">
                    <h2 contenteditable="true" class="editable section-title">NEW SECTION</h2>
                    <button class="remove-section-btn" title="Remove section">✕</button>
                </div>
                <div class="section-line"></div>
                <div class="entry">
                    <div class="entry-header-row">
                        <h3 contenteditable="true" class="editable entry-title">Entry Title</h3>
                        <button class="remove-entry-btn" title="Remove entry">✕</button>
                    </div>
                    <p contenteditable="true" class="editable entry-subtitle"><em>Subtitle / Organization</em></p>
                    <ul class="entry-bullets">
                        <li contenteditable="true" class="editable">Description or achievement point here.</li>
                    </ul>
                    <button class="add-bullet-btn">+ Add Bullet</button>
                </div>
                <button class="add-entry-btn">+ Add Entry</button>
            `;
            col.appendChild(section);
            attachSectionListeners(section);
            section.querySelector('.section-title').focus();
        });
    });

    // ══════════════════════════════════════════
    // DELEGATED EVENT LISTENERS
    // ══════════════════════════════════════════
    function attachPageListeners(page) {
        page.querySelectorAll('.resume-section').forEach(attachSectionListeners);
    }

    function attachSectionListeners(section) {
        // Remove section
        section.querySelectorAll('.remove-section-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (confirm('Remove this section?')) section.remove();
            });
        });
        // Remove entry
        section.querySelectorAll('.remove-entry-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.closest('.entry')?.remove();
            });
        });
        // Remove inline (lang)
        section.querySelectorAll('.remove-inline-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.closest('li')?.remove();
            });
        });
        // Add bullet
        section.querySelectorAll('.add-bullet-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const ul = btn.previousElementSibling;
                if (ul && ul.classList.contains('entry-bullets')) {
                    const li = document.createElement('li');
                    li.contentEditable = 'true';
                    li.className = 'editable';
                    li.textContent = 'New bullet point...';
                    ul.appendChild(li);
                    li.focus();
                    selectAllText(li);
                }
            });
        });
        // Add entry
        section.querySelectorAll('.add-entry-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const entry = document.createElement('div');
                entry.className = 'entry';
                entry.innerHTML = `
                    <div class="entry-header-row">
                        <h3 contenteditable="true" class="editable entry-title">New Entry</h3>
                        <button class="remove-entry-btn" title="Remove entry">✕</button>
                    </div>
                    <p contenteditable="true" class="editable entry-subtitle"><em>Organization / Details</em></p>
                    <ul class="entry-bullets">
                        <li contenteditable="true" class="editable">Description here...</li>
                    </ul>
                    <button class="add-bullet-btn">+ Add Bullet</button>
                `;
                btn.before(entry);
                attachSectionListeners(entry.closest('.resume-section'));
                entry.querySelector('.entry-title').focus();
                selectAllText(entry.querySelector('.entry-title'));
            });
        });
        // Add tag
        section.querySelectorAll('.add-tag-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const list = section.querySelector('.tag-list, .lang-list, .entry-bullets.sidebar-bullets');
                if (list) {
                    if (list.classList.contains('lang-list')) {
                        const li = document.createElement('li');
                        li.innerHTML = `<span contenteditable="true" class="editable lang-name">Language</span> — <span contenteditable="true" class="editable lang-level">Level</span> <button class="remove-inline-btn">✕</button>`;
                        list.appendChild(li);
                        li.querySelector('.remove-inline-btn').addEventListener('click', () => li.remove());
                        li.querySelector('.lang-name').focus();
                        selectAllText(li.querySelector('.lang-name'));
                    } else if (list.classList.contains('tag-list')) {
                        const li = document.createElement('li');
                        li.contentEditable = 'true';
                        li.className = 'editable tag-item';
                        li.textContent = 'New Item';
                        list.appendChild(li);
                        li.focus();
                        selectAllText(li);
                    } else {
                        const li = document.createElement('li');
                        li.contentEditable = 'true';
                        li.className = 'editable';
                        li.textContent = 'New item...';
                        list.appendChild(li);
                        li.focus();
                        selectAllText(li);
                    }
                }
            });
        });
    }

    // Initialize all listeners
    document.querySelectorAll('.resume-page').forEach(attachPageListeners);

    // ══════════════════════════════════════════
    // UNDO / REDO (simple using execCommand)
    // ══════════════════════════════════════════
    document.getElementById('btn-undo').addEventListener('click', () => {
        document.execCommand('undo');
    });
    document.getElementById('btn-redo').addEventListener('click', () => {
        document.execCommand('redo');
    });

    // ══════════════════════════════════════════
    // EXPORT PDF
    // ══════════════════════════════════════════
    document.getElementById('btn-export-pdf').addEventListener('click', () => {
        // Hide all interactive buttons before printing
        const style = document.createElement('style');
        style.id = 'print-override';
        style.textContent = `
            .remove-section-btn, .remove-entry-btn, .remove-inline-btn,
            .add-entry-btn, .add-bullet-btn, .add-tag-btn { display: none !important; }
        `;
        document.head.appendChild(style);

        window.print();

        // Restore after a delay
        setTimeout(() => {
            const override = document.getElementById('print-override');
            if (override) override.remove();
        }, 1000);
    });

    // ══════════════════════════════════════════
    // HELPER: Select all text in contenteditable
    // ══════════════════════════════════════════
    function selectAllText(el) {
        const range = document.createRange();
        range.selectNodeContents(el);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }

    // ══════════════════════════════════════════
    // LOCAL STORAGE SAVE / LOAD
    // ══════════════════════════════════════════
    const DEFAULT_HTML = pagesContainer.innerHTML; // Store original for reset
    
    function showToast(msg) {
        const toast = document.getElementById('toast');
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2500);
    }

    document.getElementById('btn-save-local').addEventListener('click', () => {
        const styles = {
            accent: customColor.value,
            secondary: secondaryColor.value,
            font: fontSelect.value,
            fontSize: fontSizeSlider.value,
            lineHeight: lineHeightSlider.value,
            spacing: sectionSpacingSlider.value,
            layout: document.querySelector('.layout-btn.active').dataset.layout,
            sidebarBg: sidebarBgColor.value,
            headerStyle: headerStyleSelect.value
        };
        localStorage.setItem('resuCraftHTML', pagesContainer.innerHTML);
        localStorage.setItem('resuCraftStyles', JSON.stringify(styles));
        showToast('Saved locally!');
    });

    document.getElementById('btn-reset-local').addEventListener('click', () => {
        if (confirm('Are you sure you want to discard all changes and reset to the default template?')) {
            localStorage.removeItem('resuCraftHTML');
            localStorage.removeItem('resuCraftStyles');
            location.reload();
        }
    });

    function loadState() {
        const savedHTML = localStorage.getItem('resuCraftHTML');
        const savedStyles = localStorage.getItem('resuCraftStyles');
        
        if (savedHTML) {
            pagesContainer.innerHTML = savedHTML;
            // Re-attach listeners to loaded DOM
            pageCount = pagesContainer.querySelectorAll('.resume-page').length;
            document.querySelectorAll('.resume-page').forEach(attachPageListeners);
        }
        
        if (savedStyles) {
            try {
                const s = JSON.parse(savedStyles);
                // Apply Accent
                if (s.accent) {
                    customColor.value = s.accent;
                    setAccentColor(s.accent);
                    colorPresets.querySelectorAll('.color-swatch').forEach(sw => {
                        sw.classList.toggle('active', sw.dataset.color === s.accent);
                    });
                }
                // Apply Secondary
                if (s.secondary) {
                    secondaryColor.value = s.secondary;
                    setSecondaryColor(s.secondary);
                }
                // Apply Font
                if (s.font) {
                    fontSelect.value = s.font;
                    document.documentElement.style.setProperty('--resume-font', s.font);
                    document.querySelectorAll('.resume-page').forEach(p => p.style.fontFamily = s.font);
                }
                // Apply Font Size
                if (s.fontSize) {
                    fontSizeSlider.value = s.fontSize;
                    fontSizeValue.textContent = s.fontSize + 'pt';
                    document.documentElement.style.setProperty('--resume-font-size', s.fontSize + 'pt');
                    document.querySelectorAll('.resume-page').forEach(p => p.style.fontSize = s.fontSize + 'pt');
                }
                // Apply Line Spacing
                if (s.lineHeight) {
                    lineHeightSlider.value = s.lineHeight;
                    lineHeightValue.textContent = s.lineHeight;
                    document.documentElement.style.setProperty('--resume-line-height', s.lineHeight);
                    document.querySelectorAll('.resume-page').forEach(p => p.style.lineHeight = s.lineHeight);
                }
                // Apply Section Spacing
                if (s.spacing) {
                    sectionSpacingSlider.value = s.spacing;
                    sectionSpacingValue.textContent = s.spacing + 'x';
                    document.documentElement.style.setProperty('--spacing-multiplier', s.spacing);
                }
                // Apply Sidebar BG
                if (s.sidebarBg) {
                    sidebarBgColor.value = s.sidebarBg;
                    document.documentElement.style.setProperty('--resume-sidebar-bg', s.sidebarBg);
                    document.querySelectorAll('.col-right').forEach(r => r.style.background = s.sidebarBg);
                }
                // Apply Header Style
                if (s.headerStyle) {
                    headerStyleSelect.value = s.headerStyle;
                    headerStyleSelect.dispatchEvent(new Event('change'));
                }
                // Apply Layout
                if (s.layout) {
                    document.querySelectorAll('.layout-btn').forEach(b => {
                        b.classList.toggle('active', b.dataset.layout === s.layout);
                    });
                    document.querySelectorAll('.resume-body').forEach(body => {
                        body.classList.remove('two-col', 'single-col');
                        body.classList.add(s.layout);
                    });
                }
            } catch (e) { console.error('Error parsing saved styles', e); }
        }
    }

    // Load state on startup
    loadState();

    // ══════════════════════════════════════════
    // AUTO-DELETE EMPTY BULLETS
    // ══════════════════════════════════════════
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && e.target.tagName === 'LI' && e.target.classList.contains('editable')) {
            if (e.target.textContent.trim() === '') {
                e.preventDefault();
                const prev = e.target.previousElementSibling;
                e.target.remove();
                if (prev && prev.tagName === 'LI') {
                    prev.focus();
                    const range = document.createRange();
                    range.selectNodeContents(prev);
                    range.collapse(false);
                    const sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            }
        }
    });

    document.addEventListener('blur', (e) => {
        if (e.target.tagName === 'LI' && e.target.classList.contains('editable')) {
            setTimeout(() => {
                if (e.target.textContent.trim() === '') {
                    e.target.remove();
                }
            }, 50);
        } else if (e.target.classList.contains('lang-name') || e.target.classList.contains('tag-item')) {
            setTimeout(() => {
                const li = e.target.closest('li');
                if (li && li.textContent.replace('✕', '').trim() === '') {
                    li.remove();
                }
            }, 50);
        }
    }, true);

    // ══════════════════════════════════════════
    // KEYBOARD SHORTCUTS
    // ══════════════════════════════════════════
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'p') {
            e.preventDefault();
            document.getElementById('btn-export-pdf').click();
        }
    });
});
