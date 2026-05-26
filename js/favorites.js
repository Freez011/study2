function addFavorite(section, title, content, sectionName) {
    const favorites = getStoredJSON('favorites', []);
    const exists = favorites.some(f => f.section === section && f.title === title);
    if (!exists) {
        const newItem = {
            id: Date.now() + Math.random(),
            section,
            title,
            content,
            sectionName,
            comment: ''
        };
        favorites.push(newItem);
        setStoredJSON('favorites', favorites);
        alert('✅ Topic added to favorites!');
    } else {
        alert('ℹ️ This topic is already in favorites');
    }
}

function removeFavorite(id, section) {
    let favorites = getStoredJSON('favorites', []);
    favorites = favorites.filter(f => !(f.id == id && f.section === section));
    setStoredJSON('favorites', favorites);
    if (window.location.pathname.includes('favorites.html')) {
        loadFavorites();
    }
}

function loadFavorites() {
    const container = document.getElementById('favorites-list');
    if (!container) return;
    const favorites = getStoredJSON('favorites', []);
    if (favorites.length === 0) {
        container.innerHTML = '<p>You have no favorite topics yet. Add them on section pages by clicking the star.</p>';
        return;
    }
    container.innerHTML = favorites.map((item, index) => {
        const preview = stripHTML(item.content).slice(0, 200);
        return `
        <div class="result-card" data-id="${escapeHTML(item.id)}" data-section="${escapeHTML(item.section)}">
            <h4>${escapeHTML(item.title)}</h4>
            <p>${escapeHTML(preview)}${preview.length === 200 ? '...' : ''}</p>
            <div class="result-meta">Section: ${escapeHTML(item.sectionName || item.section)}</div>
            <textarea placeholder="Your comment..." class="favorite-comment" data-index="${index}" rows="2">${escapeHTML(item.comment || '')}</textarea>
            <button class="remove-favorite" data-id="${escapeHTML(item.id)}" data-section="${escapeHTML(item.section)}">Delete</button>
        </div>
    `;
    }).join('');

    document.querySelectorAll('.favorite-comment').forEach(textarea => {
        textarea.addEventListener('input', (e) => {
            const index = e.target.dataset.index;
            const favorites = getStoredJSON('favorites', []);
            favorites[index].comment = e.target.value;
            setStoredJSON('favorites', favorites);
        });
    });

    document.querySelectorAll('.remove-favorite').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const button = e.target.closest('.remove-favorite');
            const id = button.dataset.id;
            const section = button.dataset.section;
            removeFavorite(id, section);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('favorites.html')) {
        loadFavorites();
    }
});