export function Settings(app) {
    const savedVolume = localStorage.getItem('volume') || 50;
    const savedDifficulty = localStorage.getItem('difficulty') || 'medium';
    
    app.innerHTML = `
        <div class="settings">
            <h1>Settings</h1>
            <div class="setting-row">
                <label for="volume">Sound:</label>
                <input id="volume" type="range" min="0" max="100" value="${savedVolume}" />
                <span id="volume-value">${savedVolume}%</span>
            </div>
            <div class="setting-row">
                <label for="difficulty">Difficulty:</label>
                <select id="difficulty">
                    <option value="easy" ${savedDifficulty === 'easy' ? 'selected' : ''}>Easy</option>
                    <option value="medium" ${savedDifficulty === 'medium' ? 'selected' : ''}>Medium</option>
                    <option value="hard" ${savedDifficulty === 'hard' ? 'selected' : ''}>Hard</option>
                </select>
            </div>
            <button id="apply-settings">Apply</button>
            <button id="back-button" style="margin-top: 10px;">Back</button>
        </div>
    `;
    
    const volumeInput = document.getElementById('volume');
    const volumeValue = document.getElementById('volume-value');
    
    volumeInput.addEventListener('input', function() {
        volumeValue.textContent = `${this.value}%`;
    });
    
    document.getElementById('apply-settings').addEventListener('click', function() {
        const difficulty = document.getElementById('difficulty').value;
        const volume = document.getElementById('volume').value;
        
        localStorage.setItem('difficulty', difficulty);
        localStorage.setItem('volume', volume);
        
        alert(`Settings saved! Difficulty: ${getDifficultyName(difficulty)}`);
    });
    
    document.getElementById('back-button').addEventListener('click', function() {
        window.location.href = '#home';
    });
    
    function getDifficultyName(value) {
        const names = {
            'easy': 'Easy',
            'medium': 'Medium',
            'hard': 'Hard'
        };
        return names[value] || 'Medium';
    }
}