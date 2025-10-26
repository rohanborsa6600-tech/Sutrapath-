document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    const coverPage = document.getElementById('cover-page');
    const mainContent = document.getElementById('main-content');
    const tocList = document.getElementById('toc-list');
    const chaptersContainer = document.getElementById('chapters-container');
    const chapters = chaptersContainer.querySelectorAll('.chapter');
    const increaseFont = document.getElementById('increase-font');
    const decreaseFont = document.getElementById('decrease-font');
    const themeToggle = document.getElementById('theme-toggle');

    // 1. Start Button Functionality
    startButton.addEventListener('click', () => {
        coverPage.style.display = 'none';
        mainContent.style.display = 'block';
    });

    // 2. Automatic TOC Generation
    chapters.forEach(chapter => {
        const chapterTitle = chapter.querySelector('h3').textContent;
        const chapterId = chapter.id;
        
        const tocItem = document.createElement('li');
        const tocLink = document.createElement('a');
        
        tocLink.textContent = chapterTitle;
        tocLink.href = `#${chapterId}`;
        tocItem.appendChild(tocLink);
        tocList.appendChild(tocItem);
    });

    // Smooth scroll for TOC links
    tocList.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            e.preventDefault();
            const targetId = e.target.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });

    // 3. Highlight Active TOC Item on Scroll
    const tocLinks = tocList.querySelectorAll('a');
    window.addEventListener('scroll', () => {
        let currentChapter = '';
        chapters.forEach(chapter => {
            const chapterTop = chapter.offsetTop;
            if (pageYOffset >= chapterTop - 60) {
                currentChapter = chapter.getAttribute('id');
            }
        });

        tocLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(currentChapter)) {
                link.classList.add('active');
            }
        });
    });

    // 4. Adjustable Font Size
    let currentFontSize = 16; // Default font size in px
    increaseFont.addEventListener('click', () => {
        currentFontSize += 2;
        document.body.style.fontSize = `${currentFontSize}px`;
    });

    decreaseFont.addEventListener('click', () => {
        currentFontSize -= 2;
        document.body.style.fontSize = `${currentFontSize}px`;
    });

    // 5. Day/Night Mode Toggle
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('night-mode');
        document.body.classList.toggle('day-mode');
    });
});
