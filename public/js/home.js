document.addEventListener("DOMContentLoaded", () => {
    // 1. Define the Level Thresholds (Matches initTables.js)
    const levelThresholds = [
        { level: 1, xp: 0 },
        { level: 2, xp: 100 },
        { level: 3, xp: 225 },
        { level: 4, xp: 375 },
        { level: 5, xp: 550 },
        { level: 6, xp: 750 },
        { level: 7, xp: 975 },
        { level: 8, xp: 1225 },
        { level: 9, xp: 1500 },
        { level: 10, xp: 1800 }
    ];

    // 2. Fetch User Data
    fetchMethod("/users/profile", (status, user) => {
        if (status === 200) {
            // Update Text Info
            // NOTICE: user.points, not user.xp (matches your DB column)
            document.getElementById('usernameDisplay').textContent = user.username.toUpperCase();
            document.getElementById('levelDisplay').textContent = user.level;

            // 3. Calculate XP Progress Bar
            const currentPoints = user.points;
            const currentLevel = user.level;

            // Find current level requirement and next level requirement
            const currentLevelObj = levelThresholds.findfh = levelThresholds.find(l => l.level === currentLevel);
            const nextLevelObj = levelThresholds.find(l => l.level === currentLevel + 1);

            let progressPercent = 0;

            if (currentLevel >= 10) {
                // Max level reached
                progressPercent = 100;
                document.getElementById('xpText').textContent = "MAX LEVEL";
            } else if (currentLevelObj && nextLevelObj) {
                // Calculate progress within the current level
                const pointsInThisLevel = currentPoints - currentLevelObj.xp;
                const pointsNeededForNext = nextLevelObj.xp - currentLevelObj.xp;

                progressPercent = (pointsInThisLevel / pointsNeededForNext) * 100;

                // Show text like: "150 / 225 XP"
                document.getElementById('xpText').textContent = `${currentPoints} / ${nextLevelObj.xp} XP`;
            }

            // Apply width
            document.getElementById('xpBar').style.width = `${progressPercent}%`;

        } else {
            console.error("Failed to fetch profile");
            // Optional: Redirect to login if unauthorized
            if (status === 401) window.location.href = "login.html";
        }
    });

    // 4. Dashboard Card Animations
    const cards = document.querySelectorAll('.dashboard-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
});