document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    const coverPage = document.getElementById('cover-page');
    const mainContent = document.getElementById('main-content');
    const tocList = document.getElementById('toc-list');
    const increaseFont = document.getElementById('increase-font');
    const decreaseFont = document.getElementById('decrease-font');
    const themeToggle = document.getElementById('theme-toggle');

    // 1. चॅप्टर्स आपोआप तयार करणे
    function structureChapters() {
        const rawHtmlContainer = document.getElementById('raw-html-input');
        const chaptersContainer = document.getElementById('chapters-container');
        if (!rawHtmlContainer || !chaptersContainer) return;

        const nodes = Array.from(rawHtmlContainer.childNodes);
        let chapterCounter = 0;
        let currentChapterDiv = null;

        nodes.forEach(node => {
            // नवीन चॅप्टर सुरू करण्यासाठी p2 क्लास शोधा
            if (node.nodeType === 1 && node.matches('p.p2')) {
                chapterCounter++;
                currentChapterDiv = document.createElement('div');
                currentChapterDiv.className = 'chapter';
                currentChapterDiv.id = `ch${chapterCounter}`;
                
                const title = document.createElement('h3');
                title.textContent = node.textContent.trim();
                currentChapterDiv.appendChild(title);
                
                chaptersContainer.appendChild(currentChapterDiv);
            }

            // सध्याच्या चॅप्टरमध्ये मजकूर जोडा
            if (currentChapterDiv && node.nodeType === 1) {
                currentChapterDiv.appendChild(node.cloneNode(true));
            }
        });
        
        // चॅप्टर्स तयार झाल्यावर TOC बनवा
        generateTOC();
    }

    // 2. अनुक्रमणिका (TOC) आपोआप तयार करणे
    function generateTOC() {
        tocList.innerHTML = ''; // जुनी TOC काढून टाका
        const chapters = document.querySelectorAll('#chapters-container .chapter');
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
        addScrollHighlighting(); // TOC तयार झाल्यावर स्क्रोल इफेक्ट जोडा
    }

    // 3. स्क्रोल करताना सक्रिय TOC आयटम हायलाइट करणे
    function addScrollHighlighting() {
        const tocLinks = tocList.querySelectorAll('a');
        const chapters = document.querySelectorAll('#chapters-container .chapter');
        
        window.addEventListener('scroll', () => {
            let currentChapterId = '';
            chapters.forEach(chapter => {
                const chapterTop = chapter.offsetTop;
                if (window.pageYOffset >= chapterTop - 60) {
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

    // 4. "सुरुवात करा" बटण
    startButton.addEventListener('click', () => {
        coverPage.style.display = 'none';
        mainContent.style.display = 'block';
        structureChapters(); // बटण दाबल्यावर चॅप्टर्स आणि TOC तयार करा
    });

    // 5. फॉन्ट साइज बदलणे
    let currentFontSize = 18;
    increaseFont.addEventListener('click', () => {
        currentFontSize += 2;
        document.body.style.fontSize = `${currentFontSize}px`;
    });
    decreaseFont.addEventListener('click', () => {
        if (currentFontSize > 12) {
            currentFontSize -= 2;
            document.body.style.fontSize = `${currentFontSize}px`;
        }
    });

    // 6. दिवस/रात्र मोड
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('night-mode');
        document.body.classList.toggle('day-mode');
    });

    // 7. TOC लिंकवर क्लिक केल्यावर स्मूथ स्क्रोल
    tocList.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            e.preventDefault();
            document.querySelector(e.target.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
        }
    });
});
