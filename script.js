document.addEventListener('DOMContentLoaded', () => {
    // सर्व आवश्यक घटक निवडा
    const startButton = document.getElementById('start-button');
    const coverPage = document.getElementById('cover-page');
    const mainContent = document.getElementById('main-content');
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const tocDropdown = document.getElementById('toc-dropdown');
    const tocList = document.getElementById('toc-list');
    const chaptersContainer = document.getElementById('chapters-container');
    const increaseFont = document.getElementById('increase-font');
    const decreaseFont = document.getElementById('decrease-font');
    const themeToggle = document.getElementById('theme-toggle');

    // चॅप्टर्स आपोआप तयार करणे
    function structureChapters() {
        const rawHtmlContainer = document.getElementById('raw-html-input');
        if (!rawHtmlContainer) {
            console.error("त्रुटी: 'raw-html-input' नावाचा div सापडला नाही.");
            return;
        }

        // जुने चॅप्टर्स काढून टाका (असल्यास)
        chaptersContainer.innerHTML = '';
        
        const nodes = Array.from(rawHtmlContainer.childNodes);
        let chapterCounter = 0;
        let currentChapterDiv = null;

        nodes.forEach(node => {
            // फक्त एलिमेंट नोड्स घ्या (उदा. <p>, <div>), टेक्स्ट नोड्स (उदा. स्पेस) दुर्लक्षित करा
            if (node.nodeType !== 1) return;

            // <p class="p2"> टॅग नवीन चॅप्टरची सुरुवात दर्शवतो
            if (node.matches('p.p2')) {
                chapterCounter++;
                currentChapterDiv = document.createElement('div');
                currentChapterDiv.className = 'chapter';
                currentChapterDiv.id = `ch${chapterCounter}`;
                
                // p2 टॅगला चॅप्टरचे शीर्षक (h3) बनवा
                const title = document.createElement('h3');
                title.innerHTML = node.innerHTML; // मूळ HTML कायम ठेवण्यासाठी innerHTML वापरा
                currentChapterDiv.appendChild(title);
                
                chaptersContainer.appendChild(currentChapterDiv);
            } else if (currentChapterDiv) {
                // p2 नंतरचे सर्व टॅग्स त्या चॅप्टरमध्ये जोडा
                currentChapterDiv.appendChild(node.cloneNode(true));
            }
        });
        
        // चॅप्टर्स तयार झाल्यावर TOC बनवा
        if (chapterCounter > 0) {
            console.log(`${chapterCounter} चॅप्टर्स यशस्वीरित्या तयार झाले.`);
            generateTOC();
        } else {
            console.warn("लक्ष द्या: एकही चॅप्टर तयार झाला नाही. तुमच्या कच्च्या HTML मध्ये '<p class=\"p2\">' टॅग आहे का, ते तपासा.");
        }
    }

    // अनुक्रमणिका (TOC) आपोआप तयार करणे
    function generateTOC() {
        tocList.innerHTML = ''; // जुनी TOC काढून टाका
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
                if (window.pageYOffset >= chapter.offsetTop - 100) {
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
    
    // Hamburger मेन्यू दाखवण्यासाठी/लपवण्यासाठी
    hamburgerMenu.addEventListener('click', () => {
        tocDropdown.classList.toggle('show');
    });

    // TOC लिंकवर क्लिक केल्यावर मेन्यू बंद करणे
    tocList.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            tocDropdown.classList.remove('show');
            e.preventDefault();
            const targetElement = document.querySelector(e.target.getAttribute('href'));
            if(targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });

    // "सुरुवात करा" बटण
    startButton.addEventListener('click', () => {
        coverPage.style.display = 'none';
        mainContent.style.display = 'block';
        // चॅप्टर्स आधीच तयार झाले नसतील, तरच तयार करा
        if (chaptersContainer.children.length === 0) {
             structureChapters();
        }
    });

    // फॉन्ट साइज बदलणे
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

    // दिवस/रात्र मोड
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('night-mode');
        document.body.classList.toggle('day-mode');
    });
});
