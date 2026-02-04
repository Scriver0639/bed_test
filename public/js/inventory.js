document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("inventoryList");

    // Asset Mapping (Same as weapons.js)
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

    // 1. Get current User ID first
    fetchMethod("/users/profile", (status, user) => {
        if (status === 200) {
            loadUserInventory(user.user_id);
        } else {
            container.innerHTML = "<p class='text-center text-danger'>Please log in to view inventory.</p>";
        }
    });

    function loadUserInventory(userId) {
        // 2. Fetch OWNED weapons using the specific user endpoint
        fetchMethod(`/users/${userId}/weapons`, (status, weapons) => {
            if (status !== 200 || weapons.length === 0) {
                container.innerHTML = `
                    <div class="col-12 text-center">
                        <p style="font-family: 'VT323', monospace; font-size: 1.5rem; color: var(--text-muted);">
                            Your inventory is empty. Go equip some gear!
                        </p>
                        <a href="weapons.html" class="btn btn-warning">GO TO SHOP</a>
                    </div>`;
                return;
            }

            // 3. Render the weapons
            container.innerHTML = weapons.map((w, index) => {
                // Map image, default if missing
                const weaponImg = weaponAssets[w.weapon_name] || "assets/woodenSword.png";

                // Determine rarity based on level required (visual flair)
                let rarity = 'common';
                if (w.required_level >= 10) rarity = 'legendary';
                else if (w.required_level >= 7) rarity = 'epic';
                else if (w.required_level >= 4) rarity = 'rare';

                return `
                <div class="col-6 col-md-4 col-lg-3" style="animation: fadeIn 0.5s ease ${index * 0.1}s backwards;">
                    <div class="card h-100 inventory-card rarity-${rarity}" style="background: rgba(30, 41, 59, 0.9); border: 2px solid var(--border-color);">
                        <div class="card-body text-center p-3">
                            <div style="height: 100px; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;">
                                <img src="${weaponImg}" alt="${w.weapon_name}" style="max-height: 100%; max-width: 100%; filter: drop-shadow(0 0 5px rgba(255,255,255,0.2));">
                            </div>
                            <h6 class="card-title mb-0" style="font-family: 'Press Start 2P', cursive; font-size: 0.7rem; color: var(--neon-blue); line-height: 1.4;">
                                ${w.weapon_name}
                            </h6>
                        </div>
                    </div>
                </div>
            `}).join("");
        });
    }
});