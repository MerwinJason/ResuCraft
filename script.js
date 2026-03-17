/* ═══════════════════════════════════════════════════════════════
   ResuCraft — Resume Editor JavaScript
   Full interactive editing, page management, style customization
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    // ── References ──
    const homeView = document.getElementById('home-view');
    const editorView = document.getElementById('editor-view');
    const homeVersionsGrid = document.getElementById('home-versions-grid');
    const btnGoHome = document.getElementById('btn-go-home');
    
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
    const photoShapeSelect = document.getElementById('photo-shape');
    const photoPositionSelect = document.getElementById('photo-position');

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

    // ── Photo Processing ──
    photoShapeSelect.addEventListener('change', (e) => {
        const shape = e.target.value;
        const photoContainers = document.querySelectorAll('.profile-photo-container');
        photoContainers.forEach(container => {
            container.classList.remove('hidden', 'round', 'square');
            if (shape === 'hidden') {
                container.classList.add('hidden');
            } else {
                container.classList.add(shape);
            }
        });
    });

    photoPositionSelect.addEventListener('change', (e) => {
        const pos = e.target.value;
        document.querySelectorAll('.resume-header').forEach(h => {
            h.classList.remove('photo-top', 'photo-left', 'photo-right');
            h.classList.add(pos);
        });
    });

    // Handle Photo Upload
    pagesContainer.addEventListener('click', (e) => {
        const photoContainer = e.target.closest('.profile-photo-container');
        if (photoContainer) {
            const input = photoContainer.querySelector('input[type="file"]');
            if (input) input.click();
        }
    });

    pagesContainer.addEventListener('change', (e) => {
        if (e.target.matches('input[type="file"]')) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const img = e.target.parentElement.querySelector('img');
                    if (img) img.src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        }
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
            section.querySelectorAll('.entry').forEach(makeEntryDraggable);
            section.querySelector('.section-title').focus();
        });
    });

    // ══════════════════════════════════════════
    // DELEGATED EVENT LISTENERS
    // ══════════════════════════════════════════
    function attachPageListeners(page) {
        page.querySelectorAll('.resume-section').forEach(attachSectionListeners);
        page.querySelectorAll('.entry').forEach(makeEntryDraggable);
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
                makeEntryDraggable(entry);
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
    // AUTO SAVE / LOAD
    // ══════════════════════════════════════════
    function showToast(msg) {
        const toast = document.getElementById('toast');
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2500);
    }

    let saveTimeout = null;
    function saveState() {
        if (saveTimeout) clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            const styles = {
                accent: customColor.value,
                secondary: secondaryColor.value,
                font: fontSelect.value,
                fontSize: fontSizeSlider.value,
                lineHeight: lineHeightSlider.value,
                spacing: sectionSpacingSlider.value,
                layout: document.querySelector('.layout-btn.active')?.dataset.layout || 'two-col',
                sidebarBg: sidebarBgColor.value,
                headerStyle: headerStyleSelect.value,
                photoShape: photoShapeSelect.value,
                photoPosition: photoPositionSelect.value
            };
            localStorage.setItem('resuCraftHTML', pagesContainer.innerHTML);
            localStorage.setItem('resuCraftStyles', JSON.stringify(styles));
        }, 500); // debounce slightly
    }

    // Auto-save on style change
    const styleInputs = [
        colorPresets, customColor, secondaryColor, fontSelect, fontSizeSlider,
        lineHeightSlider, sectionSpacingSlider, sidebarBgColor, headerStyleSelect,
        photoShapeSelect, photoPositionSelect
    ];
    styleInputs.forEach(el => el.addEventListener('input', saveState));
    styleInputs.forEach(el => el.addEventListener('change', saveState));
    document.querySelectorAll('.layout-btn').forEach(btn => btn.addEventListener('click', saveState));

    // Auto-save on content change
    const observer = new MutationObserver(() => {
        saveState();
    });
    observer.observe(pagesContainer, { childList: true, subtree: true, characterData: true, attributes: true });

    document.addEventListener('input', (e) => {
        if (e.target.isContentEditable) {
            saveState();
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
                // Apply Photo Shape
                if (s.photoShape) {
                    photoShapeSelect.value = s.photoShape;
                    photoShapeSelect.dispatchEvent(new Event('change'));
                }
                // Apply Photo Position
                if (s.photoPosition) {
                    photoPositionSelect.value = s.photoPosition;
                    photoPositionSelect.dispatchEvent(new Event('change'));
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

    // ══════════════════════════════════════════
    // TEMPLATES & HOME PAGE LOGIC
    // ══════════════════════════════════════════
    
    // Store the default empty HTML to use when a template is selected
    // Note: in a real app this would be a clean slate, but here we reuse the current innerHTML base
    const baseHTML = pagesContainer.innerHTML;

    // ── Pre-built HTML Strings ──
    const htmlIntern = `
        <div class="resume-page" data-page="1">
            <div class="resume-header minimal" id="resume-header">
                <div class="profile-photo-container hidden" title="Click to upload photo">
                    <img id="profile-photo" src="" alt="Profile Photo">
                    <div class="photo-overlay"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg></div>
                    <input type="file" id="photo-upload" accept="image/*" style="display: none;">
                </div>
                <div class="header-content">
                    <h1 contenteditable="true" class="editable name-field" id="full-name">ALEX JOHNSON</h1>
                    <p contenteditable="true" class="editable subtitle-field" id="subtitle">Marketing Intern | Creative & Driven</p>
                    <div class="contact-row" id="contact-row">
                        <span contenteditable="true" class="editable contact-item">✉ alex.j@email.com</span>
                        <span class="contact-sep">|</span>
                        <span contenteditable="true" class="editable contact-item">☏ +1 234 567 8900</span>
                        <span class="contact-sep">|</span>
                        <span contenteditable="true" class="editable contact-item">📍 New York, NY</span>
                    </div>
                </div>
            </div>
            <div class="resume-body two-col">
                <div class="col-left" id="col-left-1">
                    <section class="resume-section" data-section="education">
                        <div class="section-header-row">
                            <h2 contenteditable="true" class="editable section-title">EDUCATION</h2>
                            <button class="remove-section-btn" title="Remove section">✕</button>
                        </div>
                        <div class="section-line"></div>
                        <div class="entry" draggable="true">
                            <div class="entry-header-row">
                                <h3 contenteditable="true" class="editable entry-title">B.A. Communications</h3>
                                <button class="remove-entry-btn" title="Remove entry">✕</button>
                            </div>
                            <p contenteditable="true" class="editable entry-subtitle"><em>State University</em> — Expected May 2025</p>
                            <p contenteditable="true" class="editable entry-detail"><strong>GPA:</strong> 3.8/4.0 | Dean's List</p>
                            <p contenteditable="true" class="editable entry-detail"><strong>Relevant Coursework:</strong> Marketing Strategy, Public Relations, Digital Media Production.</p>
                            <div class="entry-drag-handle" title="Drag to reorder">⋮⋮</div>
                        </div>
                        <button class="add-entry-btn">+ Add Entry</button>
                    </section>
                    <section class="resume-section" data-section="projects">
                        <div class="section-header-row">
                            <h2 contenteditable="true" class="editable section-title">ACADEMIC PROJECTS</h2>
                            <button class="remove-section-btn" title="Remove section">✕</button>
                        </div>
                        <div class="section-line"></div>
                        <div class="entry" draggable="true">
                            <div class="entry-header-row">
                                <h3 contenteditable="true" class="editable entry-title">Social Media Audit & Campaign</h3>
                                <button class="remove-entry-btn" title="Remove entry">✕</button>
                            </div>
                            <p contenteditable="true" class="editable entry-subtitle"><em>Capstone Project</em> — Fall 2024</p>
                            <ul class="entry-bullets">
                                <li contenteditable="true" class="editable">Conducted a comprehensive audit of a local nonprofit's Instagram and Facebook presence.</li>
                                <li contenteditable="true" class="editable">Developed a targeted 4-week campaign that simulated a 25% increase in youth engagement.</li>
                            </ul>
                            <div class="entry-drag-handle" title="Drag to reorder">⋮⋮</div>
                        </div>
                        <button class="add-entry-btn">+ Add Entry</button>
                    </section>
                </div>
                <div class="col-right" id="col-right-1">
                    <section class="resume-section" data-section="skills">
                        <div class="section-header-row">
                            <h2 contenteditable="true" class="editable section-title">SKILLS</h2>
                            <button class="remove-section-btn" title="Remove section">✕</button>
                        </div>
                        <div class="section-line"></div>
                        <div class="skill-category">
                            <div class="skill-cat-title" contenteditable="true">Tools & Software</div>
                            <div class="skill-cat-detail" contenteditable="true">Microsoft Office, Canva, Basic Adobe Photoshop, Google Analytics Foundation</div>
                        </div>
                        <div class="skill-category">
                            <div class="skill-cat-title" contenteditable="true">Soft Skills</div>
                            <div class="skill-cat-detail" contenteditable="true">Public Speaking, Team Collaboration, Time Management</div>
                        </div>
                        <button class="add-bullet-btn" style="margin-top: 5px;">+ Add Category</button>
                    </section>
                    <section class="resume-section" data-section="extracurriculars">
                        <div class="section-header-row">
                            <h2 contenteditable="true" class="editable section-title">ACTIVITIES</h2>
                            <button class="remove-section-btn" title="Remove section">✕</button>
                        </div>
                        <div class="section-line"></div>
                        <ul class="tag-list">
                            <li class="tag-item" contenteditable="true">Marketing Club (Vice President)</li>
                            <li class="tag-item" contenteditable="true">Student Government (Senator)</li>
                            <li class="tag-item" contenteditable="true">Campus Tour Guide</li>
                        </ul>
                        <button class="add-tag-btn" style="margin-top: 5px;">+ Add Tag</button>
                    </section>
                </div>
            </div>
        </div>`;

    const htmlFresher = `
        <div class="resume-page" data-page="1">
            <div class="resume-header banner" id="resume-header">
                <div class="profile-photo-container hidden" title="Click to upload photo">
                    <img id="profile-photo" src="" alt="Profile Photo">
                    <div class="photo-overlay"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg></div>
                    <input type="file" id="photo-upload" accept="image/*" style="display: none;">
                </div>
                <div class="header-content">
                    <h1 contenteditable="true" class="editable name-field" id="full-name">SARAH JENKINS</h1>
                    <p contenteditable="true" class="editable subtitle-field" id="subtitle">Junior Software Engineer</p>
                    <div class="contact-row" id="contact-row">
                        <span contenteditable="true" class="editable contact-item">✉ sarah.j@email.com</span>
                        <span class="contact-sep">|</span>
                        <span contenteditable="true" class="editable contact-item">☏ +1 987 654 3210</span>
                        <span class="contact-sep">|</span>
                        <span contenteditable="true" class="editable contact-item">📍 Austin, TX</span>
                        <span class="contact-sep">|</span>
                        <span contenteditable="true" class="editable contact-item">🔗 github.com/sjenkins</span>
                    </div>
                </div>
            </div>
            <div class="resume-body single-col">
                <div class="col-left" id="col-left-1">
                    <section class="resume-section" data-section="profile">
                        <div class="section-header-row">
                            <h2 contenteditable="true" class="editable section-title">PROFESSIONAL SUMMARY</h2>
                            <button class="remove-section-btn" title="Remove section">✕</button>
                        </div>
                        <div class="section-line"></div>
                        <p contenteditable="true" class="editable section-text">Recent Computer Science graduate with a passion for full-stack web development. Experienced in building responsive web applications using React and Node.js through rigorous academic projects and a 3-month intensive coding bootcamp. Eager to contribute to a dynamic engineering team and rapidly adapt to new technologies.</p>
                    </section>
                    <section class="resume-section" data-section="technical-skills">
                        <div class="section-header-row">
                            <h2 contenteditable="true" class="editable section-title">TECHNICAL SKILLS</h2>
                            <button class="remove-section-btn" title="Remove section">✕</button>
                        </div>
                        <div class="section-line"></div>
                        <div class="skill-category">
                            <div class="skill-cat-title" contenteditable="true">Languages & Frameworks:</div>
                            <div class="skill-cat-detail" contenteditable="true">JavaScript (ES6+), HTML5, CSS3, React.js, Node.js, Express, Python</div>
                        </div>
                        <div class="skill-category">
                            <div class="skill-cat-title" contenteditable="true">Databases & Tools:</div>
                            <div class="skill-cat-detail" contenteditable="true">MongoDB, PostgreSQL, Git, GitHub, VS Code, RESTful APIs</div>
                        </div>
                    </section>
                    <section class="resume-section" data-section="projects">
                        <div class="section-header-row">
                            <h2 contenteditable="true" class="editable section-title">SELECTED PROJECTS</h2>
                            <button class="remove-section-btn" title="Remove section">✕</button>
                        </div>
                        <div class="section-line"></div>
                        <div class="entry" draggable="true">
                            <div class="entry-header-row">
                                <h3 contenteditable="true" class="editable entry-title">TaskMaster Pro (React/Node)</h3>
                                <button class="remove-entry-btn" title="Remove entry">✕</button>
                            </div>
                            <p contenteditable="true" class="editable entry-subtitle"><em>Full Stack Application</em></p>
                            <ul class="entry-bullets">
                                <li contenteditable="true" class="editable">Developed a full-stack project management dashboard with user authentication and drag-and-drop task boards.</li>
                                <li contenteditable="true" class="editable">Implemented RESTful APIs in Node/Express to handle CRUD operations, connected to a MongoDB database.</li>
                                <li contenteditable="true" class="editable">Reduced API fetch times by 40% through selective indexing.</li>
                            </ul>
                            <div class="entry-drag-handle" title="Drag to reorder">⋮⋮</div>
                        </div>
                        <button class="add-entry-btn">+ Add Entry</button>
                    </section>
                    <section class="resume-section" data-section="education">
                        <div class="section-header-row">
                            <h2 contenteditable="true" class="editable section-title">EDUCATION</h2>
                            <button class="remove-section-btn" title="Remove section">✕</button>
                        </div>
                        <div class="section-line"></div>
                        <div class="entry" draggable="true">
                            <div class="entry-header-row">
                                <h3 contenteditable="true" class="editable entry-title">B.S. in Computer Science</h3>
                                <button class="remove-entry-btn" title="Remove entry">✕</button>
                            </div>
                            <p contenteditable="true" class="editable entry-subtitle"><em>University of Texas at Austin</em> — Graduated Dec 2024</p>
                            <div class="entry-drag-handle" title="Drag to reorder">⋮⋮</div>
                        </div>
                        <button class="add-entry-btn">+ Add Entry</button>
                    </section>
                </div>
            </div>
        </div>`;

    const htmlPro = `
        <div class="resume-page" data-page="1">
            <div class="resume-header centered-line" id="resume-header">
                <div class="profile-photo-container hidden" title="Click to upload photo">
                    <img id="profile-photo" src="" alt="Profile Photo">
                    <div class="photo-overlay"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg></div>
                    <input type="file" id="photo-upload" accept="image/*" style="display: none;">
                </div>
                <div class="header-content">
                    <h1 contenteditable="true" class="editable name-field" id="full-name">MICHAEL CHANG</h1>
                    <p contenteditable="true" class="editable subtitle-field" id="subtitle">Senior Financial Analyst | Corporate Strategy</p>
                    <div class="contact-row" id="contact-row">
                        <span contenteditable="true" class="editable contact-item">✉ m.chang.finance@email.com</span>
                        <span class="contact-sep">|</span>
                        <span contenteditable="true" class="editable contact-item">☏ +1 415 555 0192</span>
                        <span class="contact-sep">|</span>
                        <span contenteditable="true" class="editable contact-item">📍 San Francisco, CA</span>
                        <span class="contact-sep">|</span>
                        <span contenteditable="true" class="editable contact-item">in/michaelchang-fin</span>
                    </div>
                </div>
            </div>
            <div class="resume-body two-col">
                <div class="col-left" id="col-left-1">
                    <section class="resume-section" data-section="experience">
                        <div class="section-header-row">
                            <h2 contenteditable="true" class="editable section-title">WORK EXPERIENCE</h2>
                            <button class="remove-section-btn" title="Remove section">✕</button>
                        </div>
                        <div class="section-line"></div>
                        
                        <div class="entry" draggable="true">
                            <div class="entry-header-row">
                                <h3 contenteditable="true" class="editable entry-title">Senior Financial Analyst</h3>
                                <button class="remove-entry-btn" title="Remove entry">✕</button>
                            </div>
                            <p contenteditable="true" class="editable entry-subtitle"><em>Stark Industries</em> — Jan 2020 – Present</p>
                            <ul class="entry-bullets">
                                <li contenteditable="true" class="editable">Spearheaded the annual budgeting process for a $50M division, reducing variance by 15% through improved forecasting models.</li>
                                <li contenteditable="true" class="editable">Developed dynamic dashboards in Tableau to track KPIs, presenting monthly financial performance reviews to C-level executives.</li>
                                <li contenteditable="true" class="editable">Identified and implemented $1.2M in cost-saving operational efficiencies over 2 years.</li>
                            </ul>
                            <div class="entry-drag-handle" title="Drag to reorder">⋮⋮</div>
                        </div>

                        <div class="entry" draggable="true">
                            <div class="entry-header-row">
                                <h3 contenteditable="true" class="editable entry-title">Financial Analyst II</h3>
                                <button class="remove-entry-btn" title="Remove entry">✕</button>
                            </div>
                            <p contenteditable="true" class="editable entry-subtitle"><em>Wayne Enterprises</em> — Mar 2017 – Dec 2019</p>
                            <ul class="entry-bullets">
                                <li contenteditable="true" class="editable">Conducted detailed variance analysis on OPEX, investigating anomalies mapping to departmental spending behaviors.</li>
                                <li contenteditable="true" class="editable">Assisted in financial due diligence for a $15M M&A transaction.</li>
                            </ul>
                            <div class="entry-drag-handle" title="Drag to reorder">⋮⋮</div>
                        </div>
                        <button class="add-entry-btn">+ Add Entry</button>
                    </section>
                </div>
                <div class="col-right" id="col-right-1">
                    <section class="resume-section" data-section="competencies">
                        <div class="section-header-row">
                            <h2 contenteditable="true" class="editable section-title">CORE COMPETENCIES</h2>
                            <button class="remove-section-btn" title="Remove section">✕</button>
                        </div>
                        <div class="section-line"></div>
                        <ul class="tag-list">
                            <li class="tag-item" contenteditable="true">Financial Modeling & Forecasting</li>
                            <li class="tag-item" contenteditable="true">Variance Analysis</li>
                            <li class="tag-item" contenteditable="true">Strategic Planning & Budgeting</li>
                            <li class="tag-item" contenteditable="true">Data Visualization (Tableau)</li>
                            <li class="tag-item" contenteditable="true">Cross-functional Leadership</li>
                        </ul>
                        <button class="add-tag-btn" style="margin-top: 5px;">+ Add Tag</button>
                    </section>
                    <section class="resume-section" data-section="education">
                        <div class="section-header-row">
                            <h2 contenteditable="true" class="editable section-title">EDUCATION</h2>
                            <button class="remove-section-btn" title="Remove section">✕</button>
                        </div>
                        <div class="section-line"></div>
                        <div class="entry" draggable="true">
                            <div class="entry-header-row">
                                <h3 contenteditable="true" class="editable entry-title">M.B.A. Finance</h3>
                                <button class="remove-entry-btn" title="Remove entry">✕</button>
                            </div>
                            <p contenteditable="true" class="editable entry-subtitle"><em>Wharton School</em> — 2017</p>
                            <div class="entry-drag-handle" title="Drag to reorder">⋮⋮</div>
                        </div>
                        <div class="entry" draggable="true">
                            <div class="entry-header-row">
                                <h3 contenteditable="true" class="editable entry-title">B.A. Economics</h3>
                                <button class="remove-entry-btn" title="Remove entry">✕</button>
                            </div>
                            <p contenteditable="true" class="editable entry-subtitle"><em>UC Berkeley</em> — 2014</p>
                            <div class="entry-drag-handle" title="Drag to reorder">⋮⋮</div>
                        </div>
                        <button class="add-entry-btn">+ Add Entry</button>
                    </section>
                </div>
            </div>
        </div>`;

    const TEMPLATES = {
        intern: {
            accent: '#1A3C5E',
            secondary: '#2E86AB',
            font: "'Georgia', serif",
            layout: 'two-col',
            headerStyle: 'minimal',
            html: htmlIntern
        },
        fresher: {
            accent: '#495057',
            secondary: '#2E86AB',
            font: "'Inter', sans-serif",
            layout: 'single-col',
            headerStyle: 'banner',
            html: htmlFresher
        },
        professional: {
            accent: '#A23B72',
            secondary: '#F18F01',
            font: "'Outfit', sans-serif",
            layout: 'two-col',
            headerStyle: 'centered-line',
            html: htmlPro
        }
    };

    function generateMiniSVG(layout, headerStyle, accentColor, secondaryColor) {
        // Generates an SVG string representation of the saved layout dynamically
        let headerSVG, bodySVG;

        if (headerStyle === 'banner') {
            headerSVG = `
                <rect x="0" y="0" width="100" height="30" fill="#495057"/>
                <rect x="20" y="10" width="60" height="6" fill="#ffffff"/>
                <rect x="30" y="20" width="40" height="3" fill="#ffffff" opacity="0.6"/>`;
        } else if (headerStyle === 'centered-line') {
            headerSVG = `
                <rect x="20" y="10" width="60" height="6" fill="${accentColor}"/>
                <rect x="40" y="20" width="20" height="2" fill="${secondaryColor}"/>
                <rect x="25" y="26" width="50" height="3" fill="#6b7280" opacity="0.6"/>`;
        } else {
            // minimal
            headerSVG = `
                <rect x="10" y="10" width="60" height="6" fill="${accentColor}"/>
                <rect x="10" y="20" width="40" height="3" fill="#6b7280" opacity="0.6"/>
                <rect x="10" y="28" width="80" height="1" fill="${accentColor}"/>`;
        }

        if (layout === 'two-col') {
            bodySVG = `
                <rect x="62" y="30" width="38" height="100" fill="#F4F7FA"/>
                <!-- Left -->
                <rect x="10" y="35" width="45" height="4" fill="${accentColor}" opacity="0.8"/>
                <rect x="10" y="42" width="45" height="2" fill="#6b7280" opacity="0.4"/>
                <rect x="10" y="46" width="35" height="2" fill="#6b7280" opacity="0.4"/>
                <rect x="10" y="58" width="45" height="4" fill="${accentColor}" opacity="0.8"/>
                <rect x="10" y="65" width="45" height="2" fill="#6b7280" opacity="0.4"/>
                <!-- Right -->
                <rect x="68" y="35" width="25" height="4" fill="${accentColor}" opacity="0.8"/>
                <rect x="68" y="43" width="20" height="2" fill="#6b7280" opacity="0.4"/>
                <rect x="68" y="47" width="15" height="2" fill="#6b7280" opacity="0.4"/>`;
        } else {
            // single col
            bodySVG = `
                <rect x="15" y="40" width="70" height="4" fill="${accentColor}" opacity="0.8"/>
                <rect x="15" y="46" width="20" height="1" fill="${secondaryColor}"/>
                <rect x="15" y="51" width="70" height="2" fill="#6b7280" opacity="0.4"/>
                <rect x="15" y="55" width="60" height="2" fill="#6b7280" opacity="0.4"/>
                <rect x="15" y="65" width="70" height="4" fill="${accentColor}" opacity="0.8"/>
                <rect x="15" y="71" width="20" height="1" fill="${secondaryColor}"/>
                <rect x="15" y="76" width="65" height="2" fill="#6b7280" opacity="0.4"/>`;
        }

        return `<svg viewBox="0 0 100 130" width="100%" height="100%">${headerSVG}${bodySVG}</svg>`;
    }

    function generateMiniSVG(layout, headerStyle, accentColor, secondaryColor) {
        // Generates an SVG string representation of the saved layout dynamically
        let headerSVG, bodySVG;

        if (headerStyle === 'banner') {
            headerSVG = `
                <rect x="0" y="0" width="100" height="30" fill="#495057"/>
                <rect x="20" y="10" width="60" height="6" fill="#ffffff"/>
                <rect x="30" y="20" width="40" height="3" fill="#ffffff" opacity="0.6"/>`;
        } else if (headerStyle === 'centered-line') {
            headerSVG = `
                <rect x="20" y="10" width="60" height="6" fill="${accentColor}"/>
                <rect x="40" y="20" width="20" height="2" fill="${secondaryColor}"/>
                <rect x="25" y="26" width="50" height="3" fill="#6b7280" opacity="0.6"/>`;
        } else {
            // minimal
            headerSVG = `
                <rect x="10" y="10" width="60" height="6" fill="${accentColor}"/>
                <rect x="10" y="20" width="40" height="3" fill="#6b7280" opacity="0.6"/>
                <rect x="10" y="28" width="80" height="1" fill="${accentColor}"/>`;
        }

        if (layout === 'two-col') {
            bodySVG = `
                <rect x="62" y="30" width="38" height="100" fill="#F4F7FA"/>
                <!-- Left -->
                <rect x="10" y="35" width="45" height="4" fill="${accentColor}" opacity="0.8"/>
                <rect x="10" y="42" width="45" height="2" fill="#6b7280" opacity="0.4"/>
                <rect x="10" y="46" width="35" height="2" fill="#6b7280" opacity="0.4"/>
                <rect x="10" y="58" width="45" height="4" fill="${accentColor}" opacity="0.8"/>
                <rect x="10" y="65" width="45" height="2" fill="#6b7280" opacity="0.4"/>
                <!-- Right -->
                <rect x="68" y="35" width="25" height="4" fill="${accentColor}" opacity="0.8"/>
                <rect x="68" y="43" width="20" height="2" fill="#6b7280" opacity="0.4"/>
                <rect x="68" y="47" width="15" height="2" fill="#6b7280" opacity="0.4"/>`;
        } else {
            // single col
            bodySVG = `
                <rect x="15" y="40" width="70" height="4" fill="${accentColor}" opacity="0.8"/>
                <rect x="15" y="46" width="20" height="1" fill="${secondaryColor}"/>
                <rect x="15" y="51" width="70" height="2" fill="#6b7280" opacity="0.4"/>
                <rect x="15" y="55" width="60" height="2" fill="#6b7280" opacity="0.4"/>
                <rect x="15" y="65" width="70" height="4" fill="${accentColor}" opacity="0.8"/>
                <rect x="15" y="71" width="20" height="1" fill="${secondaryColor}"/>
                <rect x="15" y="76" width="65" height="2" fill="#6b7280" opacity="0.4"/>`;
        }

        return `<svg viewBox="0 0 100 130" width="100%" height="100%">${headerSVG}${bodySVG}</svg>`;
    }

    function renderHomeVersions() {
        const savedVersions = JSON.parse(localStorage.getItem('resuCraftVersions') || '[]');
        homeVersionsGrid.innerHTML = '';

        // Prepend current auto-saved draft if exists
        const currentHTML = localStorage.getItem('resuCraftHTML');
        if (currentHTML) {
            const draftCard = document.createElement('div');
            draftCard.className = 'version-card';
            draftCard.style.borderColor = 'var(--accent2)';
            draftCard.style.borderWidth = '2px';
            draftCard.innerHTML = `
                <div class="template-preview" style="background: rgba(46,134,171,0.05); display: flex; flex-direction: column; justify-content: center; align-items: center; opacity: 0.8;">
                    <div style="font-size: 3rem; margin-bottom: 5px;">📝</div>
                </div>
                <h3 style="color: var(--accent2);">Continue Editing</h3>
                <p>Resume from your latest auto-saved session.</p>
            `;
            draftCard.addEventListener('click', () => {
                showEditor();
            });
            homeVersionsGrid.appendChild(draftCard);
        }

        if (savedVersions.length === 0 && !currentHTML) {
            homeVersionsGrid.innerHTML = '<p class="empty-versions" style="grid-column: 1/-1;">No saved versions found. Start a new one below!</p>';
            return;
        }

        savedVersions.slice(0, 6).forEach(version => { // Limit to 6 recent
            const card = document.createElement('div');
            card.className = 'version-card';
            
            const layout = version.styles?.layout || 'two-col';
            const headerStyle = version.styles?.headerStyle || 'minimal';
            const accentColor = version.styles?.accent || 'var(--accent)';
            const secondaryColor = version.styles?.secondary || 'var(--secondary)';

            card.innerHTML = `
                <div class="template-preview">
                    ${generateMiniSVG(layout, headerStyle, accentColor, secondaryColor)}
                </div>
                <h3>${version.timestamp}</h3>
                <p>Saved state • ID: ${version.id.slice(-6)}</p>
            `;
            card.addEventListener('click', () => {
                localStorage.setItem('resuCraftHTML', version.html);
                localStorage.setItem('resuCraftStyles', JSON.stringify(version.styles));
                location.reload(); // Reload to apply cleanly
            });
            homeVersionsGrid.appendChild(card);
        });
    }

    function showEditor() {
        homeView.style.display = 'none';
        editorView.style.display = 'block';
    }

    function showHome() {
        editorView.style.display = 'none';
        homeView.style.display = 'block';
        renderHomeVersions();
    }

    // Template selection
    document.querySelectorAll('.template-card').forEach(card => {
        card.addEventListener('click', () => {
            const tempId = card.dataset.template;
            const config = TEMPLATES[tempId];
            if (config) {
                // Apply config
                customColor.value = config.accent;
                setAccentColor(config.accent);
                secondaryColor.value = config.secondary;
                setSecondaryColor(config.secondary);
                
                fontSelect.value = config.font;
                document.documentElement.style.setProperty('--resume-font', config.font);
                document.querySelectorAll('.resume-page').forEach(p => p.style.fontFamily = config.font);
                
                headerStyleSelect.value = config.headerStyle;
                headerStyleSelect.dispatchEvent(new Event('change'));

                document.querySelectorAll('.layout-btn').forEach(b => {
                    b.classList.toggle('active', b.dataset.layout === config.layout);
                });
                document.querySelectorAll('.resume-body').forEach(body => {
                    body.classList.remove('two-col', 'single-col');
                    body.classList.add(config.layout);
                });

                // Clear current content base
                pagesContainer.innerHTML = config.html || baseHTML;
                pageCount = 1;
                document.querySelectorAll('.resume-page').forEach(attachPageListeners);

                // Sync photo state defaults into the newly injected HTML
                photoShapeSelect.value = 'hidden';
                photoShapeSelect.dispatchEvent(new Event('change'));

                photoPositionSelect.value = 'photo-top';
                photoPositionSelect.dispatchEvent(new Event('change'));

                saveState(); // Save the new template state immediately
                showEditor();
            }
        });
    });

    // Go Home
    btnGoHome.addEventListener('click', () => {
        saveState(); // Ensure last moment save
        showHome();
    });

    // Determine initial view: Always start on Home Page as requested
    function checkInitialView() {
        showHome();
    }

    // Load state on startup
    loadState();
    checkInitialView();

    // ══════════════════════════════════════════
    // VERSION HISTORY
    // ══════════════════════════════════════════
    const versionsModal = document.getElementById('versions-modal');
    const versionsList = document.getElementById('versions-list');

    document.getElementById('btn-save-version').addEventListener('click', () => {
        const styles = {
            accent: customColor.value,
            secondary: secondaryColor.value,
            font: fontSelect.value,
            fontSize: fontSizeSlider.value,
            lineHeight: lineHeightSlider.value,
            spacing: sectionSpacingSlider.value,
            layout: document.querySelector('.layout-btn.active')?.dataset.layout || 'two-col',
            sidebarBg: sidebarBgColor.value,
            headerStyle: headerStyleSelect.value,
            photoShape: photoShapeSelect.value,
            photoShape: photoShapeSelect.value
        };
        const currentVersion = {
            id: Date.now().toString(),
            timestamp: new Date().toLocaleString(),
            html: pagesContainer.innerHTML,
            styles: styles
        };

        const savedVersions = JSON.parse(localStorage.getItem('resuCraftVersions') || '[]');
        savedVersions.unshift(currentVersion);
        localStorage.setItem('resuCraftVersions', JSON.stringify(savedVersions));
        showToast('Version saved successfully!');
    });

    document.getElementById('btn-open-versions').addEventListener('click', () => {
        const savedVersions = JSON.parse(localStorage.getItem('resuCraftVersions') || '[]');
        versionsList.innerHTML = '';

        if (savedVersions.length === 0) {
            versionsList.innerHTML = '<li class="empty-versions">No saved versions found.</li>';
        } else {
            savedVersions.forEach(version => {
                const li = document.createElement('li');
                li.className = 'version-item';
                li.innerHTML = `
                    <div class="version-info">
                        <span class="version-date">${version.timestamp}</span>
                        <span class="version-id">ID: ${version.id}</span>
                    </div>
                    <div class="version-actions">
                        <button class="version-btn-load" data-id="${version.id}">Load</button>
                        <button class="version-btn-delete" data-id="${version.id}">Delete</button>
                    </div>
                `;
                versionsList.appendChild(li);
            });
        }
        versionsModal.classList.add('show');
    });

    document.getElementById('close-modal-btn').addEventListener('click', () => {
        versionsModal.classList.remove('show');
    });

    versionsModal.addEventListener('click', (e) => {
        if (e.target === versionsModal) {
            versionsModal.classList.remove('show');
        } else if (e.target.classList.contains('version-btn-load')) {
            const id = e.target.dataset.id;
            const savedVersions = JSON.parse(localStorage.getItem('resuCraftVersions') || '[]');
            const versionToLoad = savedVersions.find(v => v.id === id);
            
            if (versionToLoad) {
                if (confirm('Load this version? Any unsaved current changes will be lost.')) {
                    localStorage.setItem('resuCraftHTML', versionToLoad.html);
                    localStorage.setItem('resuCraftStyles', JSON.stringify(versionToLoad.styles));
                    location.reload();
                }
            }
        } else if (e.target.classList.contains('version-btn-delete')) {
            const id = e.target.dataset.id;
            if (confirm('Are you sure you want to delete this version?')) {
                const savedVersions = JSON.parse(localStorage.getItem('resuCraftVersions') || '[]');
                const updatedVersions = savedVersions.filter(v => v.id !== id);
                localStorage.setItem('resuCraftVersions', JSON.stringify(updatedVersions));
                e.target.closest('li').remove();
                if (updatedVersions.length === 0) {
                    versionsList.innerHTML = '<li class="empty-versions">No saved versions found.</li>';
                }
            }
        }
    });

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
    // DRAG AND DROP REORDERING
    // ══════════════════════════════════════════
    let draggedEntry = null;

    function handleDragStart(e) {
        draggedEntry = this;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', '');
        requestAnimationFrame(() => {
            this.style.opacity = '0.4';
        });
    }

    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.dataTransfer.dropEffect = 'move';
        const targetEntry = e.target.closest('.entry');
        if (targetEntry && targetEntry !== draggedEntry) {
            const bounding = targetEntry.getBoundingClientRect();
            const offset = bounding.y + (bounding.height / 2);
            if (e.clientY > offset) {
                targetEntry.style.borderBottom = "2px dashed var(--accent2)";
                targetEntry.style.borderTop = "";
            } else {
                targetEntry.style.borderTop = "2px dashed var(--accent2)";
                targetEntry.style.borderBottom = "";
            }
        }
        return false;
    }

    function handleDragLeave(e) {
        const targetEntry = e.target.closest('.entry');
        if (targetEntry) {
            targetEntry.style.borderTop = "";
            targetEntry.style.borderBottom = "";
        }
    }

    function handleDrop(e) {
        if (e.stopPropagation) e.stopPropagation();
        const targetEntry = e.target.closest('.entry');
        if (draggedEntry && targetEntry && targetEntry !== draggedEntry) {
            const bounding = targetEntry.getBoundingClientRect();
            const offset = bounding.y + (bounding.height / 2);
            targetEntry.style.borderTop = "";
            targetEntry.style.borderBottom = "";
            if (e.clientY > offset) {
                targetEntry.after(draggedEntry);
            } else {
                targetEntry.before(draggedEntry);
            }
            saveState();
        }
        return false;
    }

    function handleDragEnd(e) {
        this.style.opacity = '1';
        document.querySelectorAll('.entry').forEach(el => {
            el.style.borderTop = "";
            el.style.borderBottom = "";
        });
        draggedEntry = null;
    }

    function makeEntryDraggable(entry) {
        if (!entry.draggableAttachedLocal) {
            entry.draggableAttachedLocal = true;
            
            let handle = entry.querySelector(':scope > .entry-drag-handle');
            if (!handle) {
                handle = document.createElement('div');
                handle.className = 'entry-drag-handle';
                handle.innerHTML = '⋮⋮';
                handle.title = 'Drag to reorder';
                entry.prepend(handle);
            }

            handle.addEventListener('mousedown', () => {
                entry.setAttribute('draggable', 'true');
            });
            handle.addEventListener('mouseup', () => {
                entry.setAttribute('draggable', 'false');
            });
            handle.addEventListener('mouseleave', () => {
                entry.setAttribute('draggable', 'false');
            });

            entry.addEventListener('dragstart', handleDragStart, false);
            entry.addEventListener('dragover', handleDragOver, false);
            entry.addEventListener('dragleave', handleDragLeave, false);
            entry.addEventListener('drop', handleDrop, false);
            entry.addEventListener('dragend', handleDragEnd, false);
        }
    }

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
