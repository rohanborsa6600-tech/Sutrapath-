document.addEventListener('DOMContentLoaded', () => {
    // सर्व आवश्यक घटक निवडा
    const startButton = document.getElementById('start-button');
    const coverPage = document.getElementById('cover-page');
    const mainContent = document.getElementById('main-content');
    const tocContainer = document.getElementById('toc-container');
    const tocTitle = document.getElementById('toc-title');
    const tocList = document.getElementById('toc-list');
    const chaptersContainer = document.getElementById('chapters-container');
    const increaseFont = document.getElementById('increase-font');
    const decreaseFont = document.getElementById('decrease-font');
    const themeToggle = document.getElementById('theme-toggle');

    // चॅप्टर्स आपोआप तयार करणे
    function structureChapters() {
        const rawHtmlContainer = document.getElementById('raw-html-input');
        if (!rawHtmlContainer) return;

        const nodes = Array.from(rawHtmlContainer.childNodes);
        let chapterCounter = 0;
        let currentChapterDiv = null;

        nodes.forEach(node => {
            if (node.nodeType !== 1) return; // फक्त एलिमेंट नोड्स घ्या

            if (node.matches('p.p2')) {
                chapterCounter++;
                currentChapterDiv = document.createElement('div');
                currentChapterDiv.className = 'chapter';
                currentChapterDiv.id = `ch${chapterCounter}`;
                
                const title = document.createElement('h3');
                title.innerHTML = node.innerHTML;
                currentChapterDiv.appendChild(title);
                
                chaptersContainer.appendChild(currentChapterDiv);
            } else if (currentChapterDiv) {
                currentChapterDiv.appendChild(node.cloneNode(true));
            }
        });
        
        generateTOC();
    }

    // अनुक्रमणिका (TOC) आपोआप तयार करणे
    function generateTOC() {
        tocList.innerHTML = '';
        const chapters = chaptersContainer.querySelectorAll('.chapter');
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
        addScrollHighlighting();
    }

    // स्क्रोल करताना सक्रिय TOC आयटम हायलाइट करणे
    function addScrollHighlighting() {
        const tocLinks = tocList.querySelectorAll('a');
        const chapters = chaptersContainer.querySelectorAll('.chapter');
        
        window.addEventListener('scroll', () => {
            let currentChapterId = '';
            chapters.forEach(chapter => {
                const chapterTop = chapter.offsetTop;
                if (window.pageYOffset >= chapterTop - 100) {
                    currentChapterId = chapter.getAttribute('id');
                }
            });

            tocLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentChapterId}`) {
                    link.classList.add('active');
                }
            });
        });
    }
    
    // Sidebar (TOC) लपवण्यासाठी/दाखवण्यासाठी
    tocTitle.addEventListener('click', () => {
        tocContainer.classList.toggle('collapsed');
        chaptersContainer.classList.toggle('full-width');
    });

    // "सुरुवात करा" बटण
    startButton.addEventListener('click', () => {
        coverPage.style.display = 'none';
        mainContent.style.display = 'block';
        if (chaptersContainer.children.length === 0) {
             structureChapters();
        }
    });

    // फॉन्ट साइज बदलणे
    let currentFontSize = 18;
    increaseFont.addEventListener('click', () => {
        currentFontSize += 2;
        chaptersContainer.style.fontSize = `${currentFontSize}px`;
    });
    decreaseFont.addEventListener('click', () => {
        if (currentFontSize > 12) {
            currentFontSize -= 2;
            chaptersContainer.style.fontSize = `${currentFontSize}px`;
        }
    });

    // दिवस/रात्र मोड
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('night-mode');
        document.body.classList.toggle('day-mode');
    });

    // TOC लिंकवर क्लिक केल्यावर स्मूथ स्क्रोल
    tocList.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            e.preventDefault();
            const targetElement = document.querySelector(e.target.getAttribute('href'));
            if(targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});
