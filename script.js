let score = 0;
let level = 1;
let prestige = 0;
const maxLevel = 2550;
const userRole = "administrateur"; // Simuler le rôle actuel de l'utilisateur
const playerName = prompt("Entrez votre nom pour le classement :"); // Demande le nom du joueur

const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');
const prestigeDisplay = document.getElementById('prestige');
const target = document.getElementById('target');
const gameContainer = document.getElementById('game-container');
const adminControls = document.getElementById('admin-controls');
const rankingList = document.getElementById('ranking-list');

// Vérifier si l'utilisateur a le rôle d'administrateur ou de créateur
function checkAdminAccess() {
    if (userRole === "administrateur" || userRole === "créateur") {
        adminControls.style.display = "block"; // Affiche le formulaire pour définir le niveau et le prestige
    }
}

// Fonction pour charger les données sauvegardées depuis le Local Storage
function loadGameData() {
    const savedLevel = localStorage.getItem('level');
    const savedScore = localStorage.getItem('score');
    const savedPrestige = localStorage.getItem('prestige');

    if (savedLevel) {
        level = parseInt(savedLevel, 10);
        levelDisplay.textContent = level;
    }

    if (savedScore) {
        score = parseInt(savedScore, 10);
        scoreDisplay.textContent = score;
    }

    if (savedPrestige) {
        prestige = parseInt(savedPrestige, 10);
        prestigeDisplay.textContent = prestige;
    }
}

// Fonction pour sauvegarder les données dans le Local Storage
function saveGameData() {
    localStorage.setItem('level', level);
    localStorage.setItem('score', score);
    localStorage.setItem('prestige', prestige);
    saveRankingData(); // Sauvegarde également le classement
}

// Fonction pour gérer le classement
function saveRankingData() {
    let rankings = JSON.parse(localStorage.getItem('rankings')) || [];

    // Mettre à jour ou ajouter le score du joueur
    const playerIndex = rankings.findIndex(entry => entry.name === playerName);
    if (playerIndex !== -1) {
        rankings[playerIndex].score = score; // Met à jour le score
        rankings[playerIndex].prestige = prestige; // Met à jour le prestige
    } else {
        rankings.push({ name: playerName, score: score, prestige: prestige }); // Ajoute un nouvel joueur
    }

    // Trier le classement par score (du plus élevé au plus bas)
    rankings.sort((a, b) => b.score - a.score);

    // Sauvegarder le classement mis à jour dans le Local Storage
    localStorage.setItem('rankings', JSON.stringify(rankings));
    displayRanking(rankings);
}

// Fonction pour afficher le classement
function displayRanking(rankings) {
    rankingList.innerHTML = ''; // Vide la liste actuelle

    rankings.forEach((entry, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${index + 1}. ${entry.name} : ${entry.score} points, Prestige : ${entry.prestige}`;
        rankingList.appendChild(listItem);
    });
}

// Fonction pour générer une position aléatoire pour la cible
function getRandomPosition() {
    const containerWidth = gameContainer.offsetWidth;
    const containerHeight = gameContainer.offsetHeight;
    const targetSize = target.offsetWidth;

    const randomX = Math.floor(Math.random() * (containerWidth - targetSize));
    const randomY = Math.floor(Math.random() * (containerHeight - targetSize));

    return { x: randomX, y: randomY };
}

// Fonction pour déplacer la cible
function moveTarget() {
    const { x, y } = getRandomPosition();
    target.style.left = `${x}px`;
    target.style.top = `${y}px`;
}

// Fonction pour gérer le score et le niveau
function increaseScore() {
    score += 1;
    scoreDisplay.textContent = score;
    saveGameData();

    if (score >= 20) {
        levelUp();
    } else {
        moveTarget();
    }
}

// Fonction pour passer au niveau suivant
function levelUp() {
    if (level < maxLevel) {
        level += 1;
        score = 0;
        scoreDisplay.textContent = score;
        levelDisplay.textContent = level;
        saveGameData();

        const newSize = Math.max(20, target.offsetWidth * 0.95);
        target.style.width = `${newSize}px`;
        target.style.height = `${newSize}px`;

        moveTarget();
    } else {
        // Atteint le niveau maximum, réinitialise le niveau et incrémente le prestige
        prestige += 1;
        prestigeDisplay.textContent = prestige;
        level = 0; // Réinitialise le niveau à 0
        score = 0; // Réinitialise le score
        scoreDisplay.textContent = score;
        levelDisplay.textContent = level;

        alert(`Niveau maximum atteint ! Vous avez gagné un prestige ! Prestige actuel : ${prestige}`);
        
        saveGameData(); // Sauvegarde les valeurs mises à jour
        moveTarget(); // Déplace la cible
    }
}

// Fonction pour ajouter du prestige
function addPrestige() {
    const additionalPrestige = parseInt(document.getElementById('new-prestige').value, 10);
    if (additionalPrestige >= 0) {
        prestige += additionalPrestige;
        prestigeDisplay.textContent = prestige;
        saveGameData(); // Sauvegarde les données après ajout de prestige
        alert(`Prestige augmenté de ${additionalPrestige}. Prestige actuel : ${prestige}`);
    } else {
        alert(`Veuillez entrer une valeur de prestige valide.`);
    }
}

// Fonction pour réinitialiser le jeu
function resetGame() {
    score = 0;
    level = 1;
    prestige = 0; // Optionnel : Réinitialise également le prestige
    scoreDisplay.textContent = score;
    levelDisplay.textContent = level;
    prestigeDisplay.textContent = prestige;
    target.style.width = "50px"; // Taille initiale de la cible
    target.style.height = "50px";
    saveGameData(); // Sauvegarde les valeurs de départ dans le Local Storage
    moveTarget();
}

// Fonction pour permettre à un administrateur ou au créateur de définir un niveau spécifique
function setLevel() {
    const newLevel = parseInt(document.getElementById('new-level').value, 10);
    if (newLevel >= 1 && newLevel <= maxLevel) {
        level = newLevel;
        score = 0;
        levelDisplay.textContent = level;
        scoreDisplay.textContent = score;
        saveGameData();
        moveTarget();
        alert(`Niveau défini sur ${newLevel}`);
    } else {
        alert(`Veuillez entrer un niveau entre 1 et ${maxLevel}.`);
    }
}

// Initialisation du jeu
loadGameData();
checkAdminAccess(); // Vérifie l'accès administrateur ou créateur
moveTarget();
displayRanking(JSON.parse(localStorage.getItem('rankings')) || []); // Affiche le classement lors de l'initialisation

// Démarrer le jeu
target.addEventListener('click', increaseScore);
