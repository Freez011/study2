function addFavorite(section, title, content, sectionName) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
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
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert('✅ Topic added to favorites!');
    } else {
        alert('ℹ️ This topic is already in favorites');
    }
}

function removeFavorite(id, section) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(f => !(f.id == id && f.section === section));
    localStorage.setItem('favorites', JSON.stringify(favorites));
    if (window.location.pathname.includes('favorites.html')) {
        loadFavorites();
    }
}

function loadFavorites() {
    const container = document.getElementById('favorites-list');
    if (!container) return;
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (favorites.length === 0) {
        container.innerHTML = '<p>You have no favorite topics yet. Add them on section pages by clicking the star.</p>';
        return;
    }
    container.innerHTML = favorites.map((item, index) => `
        <div class="result-card" data-id="${item.id}" data-section="${item.section}">
            <h4>${item.title}</h4>
            <p>${item.content.substring(0, 200)}...</p>
            <div class="result-meta">Section: ${item.sectionName || item.section}</div>
            <textarea placeholder="Your comment..." class="favorite-comment" data-index="${index}" rows="2">${item.comment || ''}</textarea>
            <button class="remove-favorite" data-id="${item.id}" data-section="${item.section}">Delete</button>
        </div>
    `).join('');

    document.querySelectorAll('.favorite-comment').forEach(textarea => {
        textarea.addEventListener('input', (e) => {
            const index = e.target.dataset.index;
            const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            favorites[index].comment = e.target.value;
            localStorage.setItem('favorites', JSON.stringify(favorites));
        });
    });

    document.querySelectorAll('.remove-favorite').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            const section = e.target.dataset.section;
            removeFavorite(id, section);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('favorites.html')) {
        loadFavorites();
    }
});