document.addEventListener('DOMContentLoaded', () => {
    // सर्व घटक निवडा
    const startButton = document.getElementById('start-button');
    const coverPage = document.getElementById('cover-page');
    const mainContent = document.getElementById('main-content');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const tocSidebar = document.getElementById('toc-sidebar');
    const chaptersContainer = document.getElementById('chapters-container');
    const tocList = document.getElementById('toc-list');
    const increaseFont = document.getElementById('increase-font');
    const decreaseFont = document.getElementById('decrease-font');
    const themeToggle = document.getElementById('theme-toggle');

    // "सुरुवात करा" बटण
    startButton.addEventListener('click', () => {
        coverPage.style.display = 'none';
        mainContent.style.display = 'block';
        if (chaptersContainer.children.length === 0) {
            structureChapters();
        }
    });

    // Hamburger मेन्यू
    hamburgerBtn.addEventListener('click', () => {
        tocSidebar.classList.toggle('show');
    });

    // चॅप्टर्स आपोआप तयार करणे
    function structureChapters() {
        const rawHtmlContainer = document.getElementById('raw-html-input');
        if (!rawHtmlContainer) return;
        chaptersContainer.innerHTML = '';
        let chapterDiv = null;
        let chapterCounter = 0;

        Array.from(rawHtmlContainer.children).forEach(node => {
            if (node.matches('p.p2')) {
                chapterCounter++;
                chapterDiv = document.createElement('div');
                chapterDiv.className = 'chapter';
                chapterDiv.id = `ch${chapterCounter}`; // स्क्रोलिंगसाठी ID
                const title = document.createElement('h3');
                title.innerHTML = node.innerHTML;
                chapterDiv.appendChild(title);
                chaptersContainer.appendChild(chapterDiv);
            } else if (chapterDiv) {
                chapterDiv.appendChild(node.cloneNode(true));
            }
        });
        generateTOC();
    }

    // TOC तयार करणे
    function generateTOC() {
        tocList.innerHTML = '';
        const chapters = chaptersContainer.querySelectorAll('.chapter');
        chapters.forEach(chapter => {
            const title = chapter.querySelector('h3').textContent;
            const id = chapter.id;
            const li = document.createElement('li');
            li.innerHTML = `<a href="#${id}">${title}</a>`;
            tocList.appendChild(li);
        });
        addScrollHighlighting();
    }

    // स्क्रोल करताना TOC मध्ये हायलाईट करणे
    function addScrollHighlighting() {
        const tocLinks = tocList.querySelectorAll('a');
        window.addEventListener('scroll', () => {
            let currentId = '';
            chaptersContainer.querySelectorAll('.chapter').forEach(chapter => {
                const chapterTop = chapter.offsetTop;
                if (window.scrollY >= chapterTop - 100) {
                    currentId = chapter.id;
                }
            });

            tocLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentId}`) {
                    link.classList.add('active');
                }
            });
        });
    }

    // TOC लिंकवर क्लिक केल्यावर स्मूथ स्क्रोल
    tocList.addEventListener('click', e => {
        if (e.target.tagName === 'A') {
            e.preventDefault();
            tocSidebar.classList.remove('show');
            const targetElement = document.querySelector(e.target.getAttribute('href'));
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });

    // Controls: Font Size & Theme
    let fontSize = 18;
    increaseFont.addEventListener('click', () => { fontSize += 2; document.body.style.fontSize = `${fontSize}px`; });
    decreaseFont.addEventListener('click', () => { if (fontSize > 12) { fontSize -= 2; document.body.style.fontSize = `${fontSize}px`; } });
    themeToggle.addEventListener('click', () => { document.body.classList.toggle('night-mode'); document.body.classList.toggle('day-mode'); });
});
