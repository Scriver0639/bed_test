document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("weaponList");
    const userLevelEl = document.getElementById("userLevel");

    let currentUserLevel = 1;
    let currentUserId = null; // Store the ID here

    // Asset Mapping
    const weaponAssets = {
        "Wooden Sword": "assets/woodenSword.png",
        "Stone Sword": "assets/stoneSword.png",
        "Iron Sword": "assets/ironSword.png",
        "Throwable Axe": "assets/heavyAxe.png",
        "Shadow Blade": "assets/shadowBlade.png",
        "Great Dragon Spear": "assets/greatDragonSpear.png",
        "Legion Staff": "assets/legionStaff.png",
        "Sea Halberd": "assets/seaHalberd.png",
        "Divine Rapier": "assets/divineRapier.png"
    };

    // 1. Fetch User Data
    fetchMethod("/users/profile", (status, user) => {
        if (status === 200) {
            currentUserLevel = user.level;
            currentUserId = user.user_id; // CAPTURE THE ID
            userLevelEl.textContent = user.level;
        }
        // Load weapons after getting user info
        loadWeapons();
    });

    function loadWeapons() {
        fetchMethod("/weapons", (status, weapons) => {
            if (status !== 200) {
                container.innerHTML = "<p class='text-center'>No weapons found.</p>";
                return;
            }

            container.innerHTML = weapons.map((w, index) => {
                const isLocked = currentUserLevel < w.required_level;
                const weaponImg = weaponAssets[w.weapon_name] || "assets/woodenSword.png";

                let rarity = 'common';
                if (w.required_level >= 10) rarity = 'legendary';
                else if (w.required_level >= 7) rarity = 'epic';
                else if (w.required_level >= 4) rarity = 'rare';

                const rarityClass = `rarity-${rarity}`;

                // PASS THE REAL ID TO THE FUNCTION (currentUserId)
                return `
                <div class="col-md-4 weapon-card" style="animation: slideIn 0.5s ease ${index * 0.1}s backwards;">
                    <div class="card mb-4 shadow ${rarityClass}">
                        ${isLocked ? '<div class="locked-overlay">🔒 LOCKED</div>' : ''}
                        <div class="level-req">LV ${w.required_level}</div>
                        <div class="weapon-img-container">
                            <img src="${weaponImg}" class="weapon-img" alt="${w.weapon_name}">
                        </div>
                        <div class="card-body text-center">
                            <h5 class="card-title" style="font-family: 'Press Start 2P', cursive; font-size: 0.9rem; margin-bottom: 1rem;">
                                ${w.weapon_name}
                            </h5>
                                ${isLocked ? 'disabled' : ''}
                                onclick="buyWeapon(${w.weapon_id}, '${w.weapon_name}', ${w.required_level}, this, ${currentUserId})"
                                style="font-size: 0.8rem;">
                                ${isLocked ? '🔒 LOCKED' : '⚡ EQUIP'}
                            </button>
                        </div>
                    </div>
                </div>
            `}).join("");
        });
    }
});

// UPDATED FUNCTION: Now accepts userId
function buyWeapon(weaponId, weaponName, requiredLevel, buttonElement, userId) {
    if (!userId) {
        alert("Error: User ID not found. Please refresh.");
        return;
    }

    buttonElement.disabled = true;
    buttonElement.textContent = 'EQUIPPING...';

    // USE THE REAL ID IN THE URL
    fetchMethod(
        `/users/${userId}/weapons/${weaponId}`,
        (status, data) => {
            if (status === 200 || status === 201) {
                buttonElement.textContent = '✓ EQUIPPED!';
                buttonElement.style.background = 'var(--neon-green)';
                buttonElement.style.borderColor = 'var(--neon-green)';
                buttonElement.style.color = 'var(--pixel-darker)';

                // Show visual feedback
                const toast = document.createElement('div');
                toast.className = 'achievement-toast';
                toast.style.borderColor = 'var(--neon-yellow)';
                toast.innerHTML = `
                    <div style="color: var(--neon-yellow); margin-bottom: 0.5rem; font-size: 0.9rem;">⚔️ EQUIPPED!</div>
                    <div style="color: var(--neon-green); font-size: 0.7rem;">${weaponName} added to inventory</div>
                `;
                document.body.appendChild(toast);
                setTimeout(() => toast.remove(), 3000);

            } else {
                buttonElement.disabled = false;
                buttonElement.textContent = '⚡ EQUIP';
                buttonElement.style.animation = 'shake 0.5s ease';
                console.error("Equip failed:", data);
            }
        },
        "POST"
    );
}