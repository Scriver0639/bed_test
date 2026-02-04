document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("challengeList");
    const questCount = document.getElementById("questCount");

    const questIcons = ['🔥'];
    const questColors = ['var(--neon-green)', 'var(--neon-pink)', 'var(--neon-yellow)'];

    fetchMethod("/challenges", (status, challenges) => {
        if (status !== 200) return;

        if (questCount) questCount.textContent = challenges.length;

        container.innerHTML = challenges.map((c, index) => {
            const icon = questIcons[index % questIcons.length];
            const color = questColors[index % questColors.length];

            return `
            <div class="col-md-6 mb-4" style="animation: slideIn 0.5s ease ${index * 0.1}s backwards;">
                <div class="card quest-card quest-glow" style="border-color: ${color};">
                    <div class="xp-badge">+${c.points} XP</div>
                    <div class="card-body text-center">
                        <span class="quest-icon">${icon}</span>
                        <h5 class="card-title" style="font-family: 'Press Start 2P', cursive; font-size: 0.9rem; color: ${color}; text-shadow: 0 0 10px ${color};">
                            ${c.description}
                        </h5>
                        <p class="card-text" style="font-family: 'VT323', monospace; font-size: 1.2rem; margin: 1rem 0;">
                            Reward: <span style="color: var(--xp-gold);">${c.points} XP</span>
                        </p>
                        <button class="btn btn-success complete-btn w-100"
                            onclick="completeChallenge(${c.challenge_id}, this, '${icon}', ${c.points})"
                            style="font-size: 0.8rem;">
                            COMPLETE QUEST
                        </button>
                    </div>
                </div>
            </div>
        `}).join("");
    });
});

function completeChallenge(challengeId, buttonElement, icon, points) {
    const card = buttonElement.closest('.col-md-6');

    // Disable button to prevent double clicks while processing
    buttonElement.disabled = true;
    buttonElement.textContent = "Processing...";

    fetchMethod(
        `/challenges/${challengeId}/completions`,
        (status, data) => {
            if (status === 201) {
                // 🎉 1. Show Notification (This function IS defined below, so it is safe)
                showAchievement(
                    '🎉 QUEST COMPLETE!',
                    `${icon} +${points} XP Earned!`,
                    'var(--xp-gold)'
                );

                // 🧮 2. Update quest count UI
                const questCount = document.getElementById('questCount');
                if (questCount) {
                    questCount.textContent = Math.max(0, parseInt(questCount.textContent) - 1);
                }

                // 🗑 3. Remove quest card with animation
                card.style.transition = 'all 0.4s ease';
                card.style.opacity = '0';
                card.style.transform = 'scale(0.85) translateY(-40px)';

                // Wait for animation to finish, then remove from DOM
                setTimeout(() => card.remove(), 400);

            } else {
                // Handle Error
                showAchievement(
                    '❌ ERROR',
                    data.message || 'Failed to complete quest',
                    'var(--hp-red)'
                );
                // Re-enable button if it failed
                buttonElement.disabled = false;
                buttonElement.textContent = "COMPLETE QUEST";
            }
        },
        "POST",
        {} // Sending empty object to ensure req.body exists
    );
}


// Achievement notification (Toast)
function showAchievement(title, message, color) {
    const toast = document.createElement('div');
    toast.className = 'achievement-toast';
    toast.style.borderColor = color;
    toast.innerHTML = `
        <div style="color: ${color}; margin-bottom: 0.5rem; font-size: 0.9rem;">${title}</div>
        <div style="color: var(--neon-green); font-size: 0.7rem;">${message}</div>
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideInRight 0.5s ease-out reverse';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// ============================================
// CREATE CHALLENGE MODAL FUNCTIONS
// ============================================

function openCreateChallengeModal() {
    const modal = document.getElementById('createChallengeModal');
    if (modal) {
        modal.style.display = 'flex';
        const input = document.getElementById('challengeName');
        if (input) input.focus();
        document.getElementById('createChallengeMsg').textContent = '';
    }
}

function closeCreateChallengeModal() {
    const modal = document.getElementById('createChallengeModal');
    if (modal) {
        modal.style.display = 'none';
        document.getElementById('createChallengeForm').reset();
        document.getElementById('createChallengeMsg').textContent = '';
    }
}

// Handle create challenge form submission
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('createChallengeForm');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const description = document.getElementById('challengeName').value.trim();
            const points = parseInt(document.getElementById('challengePoints').value);
            const msgEl = document.getElementById('createChallengeMsg');

            // Validation
            if (!description || description.length < 3) {
                msgEl.textContent = 'Quest name must be at least 3 characters!';
                msgEl.className = 'mt-3 text-center';
                msgEl.style.color = 'var(--hp-red)';
                return;
            }

            if (!points || points < 1 || points > 1000) {
                msgEl.textContent = 'XP must be between 1 and 1000!';
                msgEl.className = 'mt-3 text-center';
                msgEl.style.color = 'var(--hp-red)';
                return;
            }

            // Send to backend
            fetchMethod(
                '/challenges',
                (status, data) => {
                    if (status === 201) {
                        // Success!
                        msgEl.textContent = '✓ Quest created successfully!';
                        msgEl.style.color = 'var(--neon-green)';

                        showAchievement('✓ QUEST CREATED!', `"${description}" added to challenges`, 'var(--neon-green)');

                        // Close modal after 1.5 seconds and reload challenges
                        setTimeout(() => {
                            closeCreateChallengeModal();
                            location.reload();
                        }, 1500);

                    } else {
                        // Error
                        msgEl.textContent = data.message || 'Failed to create quest';
                        msgEl.style.color = 'var(--hp-red)';
                    }
                },
                'POST',
                { description, points }
            );
        });
    }

    // Close modal on backdrop click
    document.getElementById('createChallengeModal')?.addEventListener('click', function (e) {
        if (e.target === this) {
            closeCreateChallengeModal();
        }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            const modal = document.getElementById('createChallengeModal');
            if (modal && modal.style.display === 'flex') {
                closeCreateChallengeModal();
            }
        }
    });
});