document.addEventListener('DOMContentLoaded', () => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    const storageKey = `profile_${currentUser}`;
    let profileData = getStoredJSON(storageKey, {});

    const avatarPreview = document.getElementById('profile-avatar-preview');
    const firstNameInput = document.getElementById('first-name');
    const lastNameInput = document.getElementById('last-name');
    const bioInput = document.getElementById('bio');
    const themeSelect = document.getElementById('theme-selector-profile');
    const avatarUpload = document.getElementById('avatar-upload');
    const saveBtn = document.getElementById('save-profile');
    const cancelBtn = document.getElementById('cancel-profile');

    if (profileData.firstName) firstNameInput.value = profileData.firstName;
    if (profileData.lastName) lastNameInput.value = profileData.lastName;
    if (profileData.bio) bioInput.value = profileData.bio;
    if (profileData.avatar) avatarPreview.src = profileData.avatar;
    if (profileData.theme) {
        themeSelect.value = profileData.theme;
        document.body.className = '';
        if (profileData.theme !== 'light') document.body.classList.add(profileData.theme);
    } else {
        document.body.className = '';
    }

    avatarUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => { avatarPreview.src = event.target.result; };
            reader.readAsDataURL(file);
        }
    });

    const avatarContainer = document.querySelector('.avatar-container');
    if (avatarContainer) {
        avatarContainer.addEventListener('click', () => { avatarUpload.click(); });
    }

    themeSelect.addEventListener('change', (e) => {
        const newTheme = e.target.value;
        document.body.className = '';
        if (newTheme !== 'light') document.body.classList.add(newTheme);
    });

    saveBtn.addEventListener('click', () => {
        const newProfile = {
            firstName: firstNameInput.value,
            lastName: lastNameInput.value,
            bio: bioInput.value,
            avatar: avatarPreview.src || '',
            theme: themeSelect.value
        };
        setStoredJSON(storageKey, newProfile);
        localStorage.setItem('theme', themeSelect.value);
        alert('✅ Profile saved!');
        window.location.href = 'dashboard.html';
    });

    cancelBtn.addEventListener('click', () => {
        window.location.href = 'dashboard.html';
    });
});