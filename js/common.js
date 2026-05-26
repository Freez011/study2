function safeParseJSON(value, fallback) {
    try {
        return value ? JSON.parse(value) : fallback;
    } catch (error) {
        return fallback;
    }
}

function getStoredJSON(key, fallback) {
    return safeParseJSON(localStorage.getItem(key), fallback);
}

function setStoredJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[char]);
}

function stripHTML(value) {
    const template = document.createElement('template');
    template.innerHTML = String(value ?? '');
    return template.content.textContent || template.content.innerText || '';
}

function getCurrentProfile() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return { currentUser: '', profileData: {} };
    return {
        currentUser,
        profileData: getStoredJSON(`profile_${currentUser}`, {})
    };
}

function renderHeaderProfile() {
    const { currentUser, profileData } = getCurrentProfile();
    if (!currentUser) return;

    const usernameSpan = document.getElementById('username');
    if (usernameSpan) {
        usernameSpan.textContent = (profileData.firstName || profileData.lastName)
            ? `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim()
            : currentUser;
    }

    const avatarImg = document.getElementById('profile-avatar');
    const defaultIcon = document.getElementById('default-avatar');
    if (avatarImg && defaultIcon) {
        if (profileData.avatar) {
            avatarImg.src = profileData.avatar;
            avatarImg.style.display = 'block';
            defaultIcon.style.display = 'none';
        } else {
            avatarImg.removeAttribute('src');
            avatarImg.style.display = 'none';
            defaultIcon.style.display = 'block';
        }
    }
}

function attachLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    if (!logoutBtn) return;
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
}
