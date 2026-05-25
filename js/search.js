async function loadAllTheory() {
    const sections = ['discrete', 'calculus', 'programming', 'english', 'history'];
    const allTopics = [];
    for (const section of sections) {
        try {
            const response = await fetch(`data/theory/${section}.json`);
            const data = await response.json();
            data.topics.forEach(topic => {
                topic.section = section;
                const sectionNames = {
                    discrete: 'Discrete Mathematics',
                    calculus: 'Calculus',
                    programming: 'Programming',
                    english: 'English Language',
                    history: 'Russian History'
                };
                topic.sectionName = sectionNames[section] || section;
                allTopics.push(topic);
            });
        } catch (e) {
            console.warn(`Failed to load section ${section}`);
        }
    }
    return allTopics;
}

function searchTopics(topics, query) {
    query = query.toLowerCase();
    return topics.filter(topic => 
        topic.title.toLowerCase().includes(query) ||
        topic.content.toLowerCase().includes(query) ||
        (topic.keywords && topic.keywords.some(kw => kw.toLowerCase().includes(query)))
    );
}

function displayResults(results) {
    const container = document.getElementById('search-results');
    if (!container) return;
    if (results.length === 0) {
        container.innerHTML = '<p>Nothing found</p>';
        return;
    }
    container.innerHTML = results.map(topic => `
        <div class="result-card">
            <h4>${topic.title}</h4>
            <p>${topic.content.substring(0, 200)}...</p>
            <div class="result-meta">Section: ${topic.sectionName}</div>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', async () => {
    const topics = await loadAllTheory();
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    if (!searchInput) return;
    function performSearch() {
        const query = searchInput.value.trim();
        if (query.length < 2) {
            displayResults([]);
            return;
        }
        const results = searchTopics(topics, query);
        displayResults(results);
    }
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });
    const urlParams = new URLSearchParams(window.location.search);
    const q = urlParams.get('q');
    if (q) {
        searchInput.value = q;
        performSearch();
    }
});