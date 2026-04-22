// ═══════ PROFILE MANAGEMENT ═══════

const AVATARS = ['👨', '👩', '👦', '👧', '👴', '👵', '🧑', '👶', '🐱', '🐶', '🦊', '🐻', '🦁', '🐼', '🦄', '🌟'];

const ProfileManager = (() => {
    const PROFILES_KEY = 'family_profiles';
    const ACTIVE_KEY = 'active_profile_id';

    function getProfiles() {
        return JSON.parse(localStorage.getItem(PROFILES_KEY)) || [];
    }

    function saveProfiles(profiles) {
        localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
    }

    function getActiveProfileId() {
        return localStorage.getItem(ACTIVE_KEY);
    }

    function setActiveProfileId(id) {
        localStorage.setItem(ACTIVE_KEY, id);
    }

    function getActiveProfile() {
        const profiles = getProfiles();
        const activeId = getActiveProfileId();
        return profiles.find(p => p.id === activeId) || null;
    }

    function addProfile(name, avatar) {
        const profiles = getProfiles();
        const profile = {
            id: 'profile_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            name: name.trim(),
            avatar: avatar,
            createdAt: new Date().toISOString()
        };
        profiles.push(profile);
        saveProfiles(profiles);
        return profile;
    }

    function deleteProfile(id) {
        let profiles = getProfiles();
        profiles = profiles.filter(p => p.id !== id);
        saveProfiles(profiles);
        // Clean up profile data from localStorage
        localStorage.removeItem('transactions_' + id);
        localStorage.removeItem('categoryMap_' + id);
        // If deleted profile was active, clear active
        if (getActiveProfileId() === id) {
            localStorage.removeItem(ACTIVE_KEY);
        }
    }

    function getTransactionsKey(profileId) {
        return 'transactions_' + (profileId || getActiveProfileId());
    }

    function getCategoryMapKey(profileId) {
        return 'categoryMap_' + (profileId || getActiveProfileId());
    }

    return {
        getProfiles,
        saveProfiles,
        getActiveProfileId,
        setActiveProfileId,
        getActiveProfile,
        addProfile,
        deleteProfile,
        getTransactionsKey,
        getCategoryMapKey
    };
})();

// ═══════ PROFILE UI ═══════

const ProfileUI = (() => {
    const overlay = document.getElementById('profile-overlay');
    const profileGrid = document.getElementById('profile-grid');
    const addProfileBtn = document.getElementById('add-profile-btn');
    const addModal = document.getElementById('add-profile-modal');
    const deleteModal = document.getElementById('delete-profile-modal');
    const deleteMsg = document.getElementById('delete-profile-msg');
    const profileNameInput = document.getElementById('new-profile-name');
    const avatarPicker = document.getElementById('avatar-picker');
    const modalCancel = document.getElementById('modal-cancel');
    const modalSave = document.getElementById('modal-save');
    const deleteCancel = document.getElementById('delete-modal-cancel');
    const deleteConfirm = document.getElementById('delete-modal-confirm');
    const appContainer = document.getElementById('app-container');
    const switchBtn = document.getElementById('profile-switch-btn');
    const switchAvatar = document.getElementById('profile-switch-avatar');
    const switchName = document.getElementById('profile-switch-name');

    let selectedAvatar = AVATARS[0];
    let profileToDelete = null;

    function renderAvatarPicker() {
        avatarPicker.innerHTML = '';
        AVATARS.forEach(emoji => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'avatar-option' + (emoji === selectedAvatar ? ' selected' : '');
            btn.textContent = emoji;
            btn.addEventListener('click', () => {
                selectedAvatar = emoji;
                avatarPicker.querySelectorAll('.avatar-option').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
            });
            avatarPicker.appendChild(btn);
        });
    }

    function renderProfileGrid() {
        const profiles = ProfileManager.getProfiles();
        profileGrid.innerHTML = '';

        profiles.forEach((profile, index) => {
            const card = document.createElement('div');
            card.className = 'profile-card';
            card.style.animationDelay = `${index * 0.08}s`;

            card.innerHTML = `
                <button class="profile-delete-btn" title="Usuń profil" data-id="${profile.id}">×</button>
                <div class="profile-avatar">${profile.avatar}</div>
                <div class="profile-name">${profile.name}</div>
            `;

            card.addEventListener('click', (e) => {
                if (e.target.closest('.profile-delete-btn')) return;
                selectProfile(profile);
            });

            const deleteBtn = card.querySelector('.profile-delete-btn');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showDeleteConfirm(profile);
            });

            profileGrid.appendChild(card);
        });

        if (profiles.length === 0) {
            profileGrid.innerHTML = '<p class="profile-empty-hint">Dodaj pierwszy profil, aby rozpocząć</p>';
        }
    }

    function selectProfile(profile) {
        ProfileManager.setActiveProfileId(profile.id);
        updateSwitchButton(profile);
        hideOverlay();
        // Signal to script.js to reload data
        if (typeof window.onProfileSelected === 'function') {
            window.onProfileSelected(profile);
        }
    }

    function updateSwitchButton(profile) {
        if (profile) {
            switchAvatar.textContent = profile.avatar;
            switchName.textContent = profile.name;
        }
    }

    function showOverlay() {
        renderProfileGrid();
        overlay.style.display = 'flex';
        overlay.classList.remove('overlay-exit');
        overlay.classList.add('overlay-enter');
        appContainer.style.display = 'none';
    }

    function hideOverlay() {
        overlay.classList.remove('overlay-enter');
        overlay.classList.add('overlay-exit');
        setTimeout(() => {
            overlay.style.display = 'none';
            appContainer.style.display = 'block';
        }, 400);
    }

    function showAddModal() {
        profileNameInput.value = '';
        selectedAvatar = AVATARS[0];
        renderAvatarPicker();
        addModal.style.display = 'flex';
        setTimeout(() => profileNameInput.focus(), 100);
    }

    function hideAddModal() {
        addModal.style.display = 'none';
    }

    function showDeleteConfirm(profile) {
        profileToDelete = profile;
        deleteMsg.textContent = `Czy na pewno chcesz usunąć profil „${profile.name}"? Wszystkie dane zostaną utracone.`;
        deleteModal.style.display = 'flex';
    }

    function hideDeleteModal() {
        deleteModal.style.display = 'none';
        profileToDelete = null;
    }

    // Event listeners
    addProfileBtn.addEventListener('click', showAddModal);
    modalCancel.addEventListener('click', hideAddModal);
    deleteCancel.addEventListener('click', hideDeleteModal);

    modalSave.addEventListener('click', () => {
        const name = profileNameInput.value.trim();
        if (!name) {
            profileNameInput.classList.add('input-error');
            profileNameInput.focus();
            setTimeout(() => profileNameInput.classList.remove('input-error'), 600);
            return;
        }
        ProfileManager.addProfile(name, selectedAvatar);
        hideAddModal();
        renderProfileGrid();
    });

    deleteConfirm.addEventListener('click', () => {
        if (profileToDelete) {
            ProfileManager.deleteProfile(profileToDelete.id);
            hideDeleteModal();
            renderProfileGrid();
        }
    });

    // Close modals on backdrop click
    addModal.addEventListener('click', (e) => {
        if (e.target === addModal) hideAddModal();
    });
    deleteModal.addEventListener('click', (e) => {
        if (e.target === deleteModal) hideDeleteModal();
    });

    // Profile switch button in header
    switchBtn.addEventListener('click', () => {
        showOverlay();
    });

    // Handle Enter key in modal
    profileNameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            modalSave.click();
        }
    });

    // Initialize
    function init() {
        const activeProfile = ProfileManager.getActiveProfile();
        if (activeProfile) {
            updateSwitchButton(activeProfile);
            // Check if we should show overlay or go straight to app
            // Always show overlay on load so user can switch
            showOverlay();
        } else {
            showOverlay();
        }
    }

    return { init, showOverlay, hideOverlay, updateSwitchButton };
})();

// Initialize profiles on DOM load
ProfileUI.init();
