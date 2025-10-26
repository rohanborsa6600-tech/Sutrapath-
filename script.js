document.addEventListener('DOMContentLoaded', () => {
    // सर्व घटक निवडा
    const startButton = document.getElementById('start-button');
    const coverPage = document.getElementById('cover-page');
    const mainContent = document.getElementById('main-content');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const tocSidebar = document.getElementById('toc-sidebar');
    const chaptersContainer = document.getElementById('chapters-container');
    const tocList = document.getElementById('toc-list');
    const prevBtn = document.getElementById('prev-chapter-btn');
    const nextBtn = document.getElementById('next-chapter-btn');
    const chapterIndicator = document.getElementById('chapter-indicator');
    const navbarChapterTitle = document.getElementById('navbar-chapter-title');

    let chapters = [];
    let currentChapterIndex = 0;

    // "सुरुवात करा" बटण
    startButton.addEventListener('click', () => {
        coverPage.style.display = 'none';
        mainContent.style.display = 'block';
        if (chapters.length === 0) {
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
        
        let nodes = Array.from(rawHtmlContainer.children);
        let chapterDiv = null;

        nodes.forEach(node => {
            if (node.matches('p.p2')) {
                if (chapterDiv) chaptersContainer.appendChild(chapterDiv);
                chapterDiv = document.createElement('div');
                chapterDiv.className = 'chapter';
                
                const title = document.createElement('h3');
                title.innerHTML = node.innerHTML;
                chapterDiv.appendChild(title);
            } else if (chapterDiv) {
                chapterDiv.appendChild(node.cloneNode(true));
            }
        });
        if (chapterDiv) chaptersContainer.appendChild(chapterDiv);

        chapters = Array.from(chaptersContainer.children);
        chapters.forEach((chap, index) => chap.id = `ch${index}`);
        
        generateTOC();
        showChapter(0);
    }

    // TOC तयार करणे
    function generateTOC() {
        tocList.innerHTML = '';
        chapters.forEach((chapter, index) => {
            const title = chapter.querySelector('h3').textContent;
            const li = document.createElement('li');
            li.innerHTML = `<a href="#ch${index}" data-index="${index}">${title}</a>`;
            tocList.appendChild(li);
        });
    }

    // एक अध्याय दाखवणे
    function showChapter(index) {
        chapters.forEach((chapter, i) => {
            chapter.classList.toggle('active', i === index);
        });
        currentChapterIndex = index;
        updateUI();
    }

    // UI अपडेट करणे (बटणे, शीर्षक, इत्यादी)
    function updateUI() {
        prevBtn.disabled = currentChapterIndex === 0;
        nextBtn.disabled = currentChapterIndex === chapters.length - 1;
        chapterIndicator.textContent = `${currentChapterIndex + 1} / ${chapters.length}`;
        navbarChapterTitle.textContent = chapters[currentChapterIndex].querySelector('h3').textContent;

        // TOC मध्ये active class अपडेट करा
        tocList.querySelectorAll('a').forEach(a => a.classList.remove('active'));
        const activeLink = tocList.querySelector(`a[data-index="${currentChapterIndex}"]`);
        if (activeLink) activeLink.classList.add('active');
    }

    // बटणांचे Events
    prevBtn.addEventListener('click', () => {
        if (currentChapterIndex > 0) showChapter(currentChapterIndex - 1);
    });
    nextBtn.addEventListener('click', () => {
        if (currentChapterIndex < chapters.length - 1) showChapter(currentChapterIndex + 1);
    });

    // TOC लिंकवर क्लिक केल्यावर
    tocList.addEventListener('click', e => {
        if (e.target.tagName === 'A') {
            e.preventDefault();
            const index = parseInt(e.target.dataset.index, 10);
            showChapter(index);
            tocSidebar.classList.remove('show');
        }
    });

    // Controls: Font Size & Theme
    const increaseFont = document.getElementById('increase-font');
    const decreaseFont = document.getElementById('decrease-font');
    const themeToggle = document.getElementById('theme-toggle');
    let fontSize = 18;

    increaseFont.addEventListener('click', () => {
        fontSize += 2;
        document.body.style.fontSize = `${fontSize}px`;
    });
    decreaseFont.addEventListener('click', () => {
        if (fontSize > 12) {
            fontSize -= 2;
            document.body.style.fontSize = `${fontSize}px`;
        }
    });
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('night-mode');
        document.body.classList.toggle('day-mode');
    });
});
