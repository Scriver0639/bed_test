document.addEventListener("DOMContentLoaded", () => {
    const playerList = document.getElementById("playerList");
    const podium = document.getElementById("podium");

    fetchMethod("/users", (status, users) => {
        if (status !== 200) return;

        // Sort by XP (descending)
        users.sort((a, b) => b.xp - a.xp);

        // Show podium if we have at least 3 players
        if (users.length >= 3) {
            podium.style.display = 'flex';

            // Populate podium
            document.getElementById('first-name').textContent = users[0].username.toUpperCase();
            document.getElementById('first-stats').textContent = `Level ${users[0].level} • ${users[0].xp} XP`;

            document.getElementById('second-name').textContent = users[1].username.toUpperCase();
            document.getElementById('second-stats').textContent = `Level ${users[1].level} • ${users[1].xp} XP`;

            document.getElementById('third-name').textContent = users[2].username.toUpperCase();
            document.getElementById('third-stats').textContent = `Level ${users[2].level} • ${users[2].xp} XP`;
        }

        // Render full list
        playerList.innerHTML = users.map((u, index) => {
            const rank = index + 1;
            let rankClass = '';
            let rankIcon = rank;

            if (rank === 1) {
                rankClass = 'rank-1';
                rankIcon = '👑';
            } else if (rank === 2) {
                rankClass = 'rank-2';
                rankIcon = '🥈';
            } else if (rank === 3) {
                rankClass = 'rank-3';
                rankIcon = '🥉';
            }

            return `
                <div class="leaderboard-row" style="animation: slideInLeft 0.5s ease ${index * 0.05}s backwards;">
                    <div class="rank-badge ${rankClass}">
                        ${rankIcon}
                    </div>
                    <div class="player-info">
                        <div class="player-name">${u.username.toUpperCase()}</div>
                        <div class="player-stats">
                            ⭐ Level ${u.level}
                        </div>
                    </div>
                    <div class="xp-display">
                        💰 ${u.xp} XP
                    </div>
                </div>
            `;
        }).join("");
    });
});

// Add slide animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInLeft {
        from {
            opacity: 0;
            transform: translateX(-50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(style);