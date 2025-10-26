document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    const coverPage = document.getElementById('cover-page');
    const mainContent = document.getElementById('main-content');
    const tocContainer = document.getElementById('toc-container');
    const tocTitle = document.getElementById('toc-title');
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

            if (currentChapterDiv && node.nodeType === 1) {
                // मूळ p2 टॅग अध्यायाच्या शीर्षकामध्ये वापरला गेला आहे, म्हणून तो पुन्हा टाकू नका.
                if (!(node.nodeType === 1 && node.matches('p.p2'))) {
                    currentChapterDiv.appendChild(node.cloneNode(true));
                }
            }
        });
        
        generateTOC();
    }

    // 2. अनुक्रमणिका (TOC) आपोआप तयार करणे
    function generateTOC() {
        tocList.innerHTML = '';
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
        addScrollHighlighting();
    }
    
    // 3. Sidebar (TOC) लपवण्यासाठी/दाखवण्यासाठी कार्यक्षमता
    tocTitle.addEventListener('click', () => {
        tocContainer.classList.toggle('collapsed');
        document.getElementById('chapters-container').classList.toggle('full-width');
    });

    // 4. स्क्रोल करताना सक्रिय TOC आयटम हायलाइट करणे
    function addScrollHighlighting() {
        // ... (या फंक्शनमध्ये कोणताही बदल नाही) ...
    }

    // 5. "सुरुवात करा" बटण
    startButton.addEventListener('click', () => {
        coverPage.style.display = 'none';
        mainContent.style.display = 'block';
        structureChapters();
    });

    // 6. फॉन्ट साइज बदलणे
    // ... (या फंक्शनमध्ये कोणताही बदल नाही) ...

    // 7. दिवस/रात्र मोड
    // ... (या फंक्शनमध्ये कोणताही बदल नाही) ...

    // 8. TOC लिंकवर क्लिक केल्यावर स्मूथ स्क्रोल
    // ... (या फंक्शनमध्ये कोणताही बदल नाही) ...

    // (मागील उत्तरांमधील functions 4, 6, 7, 8 येथे कॉपी करा)
    // Highlight active TOC item on Scroll
    const tocLinks = tocList.querySelectorAll('a');
    window.addEventListener('scroll', () => {
        let currentChapterId = '';
        const chapters = document.querySelectorAll('#chapters-container .chapter');
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

    // Adjustable Font Size
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

    // Day/Night Mode Toggle
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('night-mode');
        document.body.classList.toggle('day-mode');
    });

    // Smooth scroll for TOC links
    tocList.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            e.preventDefault();
            document.querySelector(e.target.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
        }
    });
});
