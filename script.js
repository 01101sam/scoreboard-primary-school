let teamCount = 0; // Assuming there's already one team as a starting point

document.addEventListener('DOMContentLoaded', () => {
    // Save, load, reset, remove buttons
    document.getElementById('btn-save').addEventListener('click', saveScores);
    document.getElementById('btn-load').addEventListener('click', loadScores);

    document.getElementById('btn-batch-add-score').addEventListener('click', () => batchChangeScore(1));
    document.getElementById('btn-batch-remove-score').addEventListener('click', () => batchChangeScore(-1));

    document.getElementById('btn-reset').addEventListener('click', resetScores);
    document.getElementById('btn-remove').addEventListener('click', removeAllTeams);

    document.getElementById('file-load').addEventListener('change', handleFileSelect);

    // Settings buttons
    document.getElementById('btn-add-team').addEventListener('click', () => addTeam());
    document.getElementById('btn-remove-team').addEventListener('click', removeTeam);
});

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = JSON.parse(e.target.result);
            applyScores(data);
        };
        reader.readAsText(file);
        // Reset the value of the input after loading to ensure the load event fires even if the same file is selected again.
        event.target.value = '';
    }
}

function applyScores(data) {
    removeAllTeams(false);
    // This assumes that the team names are unique and that they match the keys in the JSON file.
    Object.entries(data).forEach(([teamName, score]) => addTeam(teamName, score));
}

function addTeam(teamName = `隊伍 ${teamCount + 1}`, score = 0) {
    teamCount++;
    const teamContainer = document.createElement('div');
    teamContainer.className = 'team';
    teamContainer.id = 'team' + teamCount;
    teamContainer.innerHTML = `
    <input type="text" class="team-name" value="${teamName}" />
    <div class="score">${score}</div>
    <hr>
    <button class="btn-add" onclick="changeScore(this, 1)">+</button>
    <button class="btn-subtract" onclick="changeScore(this, -1)">-</button>
`;
    document.getElementById('teams-container').appendChild(teamContainer);
}


function changeScore(button, increment) {
    let scoreDiv = button.parentNode.querySelector('.score');
    let currentScore = parseInt(scoreDiv.textContent, 10);
    scoreDiv.textContent = currentScore + increment;
}

function batchChangeScore(increment) {
    document.querySelectorAll('.score').forEach(scoreDiv => {
        let currentScore = parseInt(scoreDiv.textContent, 10);
        scoreDiv.textContent = currentScore + increment;
    });
}

function saveScores() {
    const data = {};
    document.querySelectorAll('.team').forEach(team => {
        const name = team.querySelector('.team-name').value;
        data[name] = team.querySelector('.score').textContent;
    });

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 4));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "scores.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function loadScores() {
    document.getElementById('file-load').click();
}

function resetScores() {
    document.querySelectorAll('.team').forEach(team => {
        team.querySelector('.score').textContent = '0';
    });
}

function removeAllTeams(keepOne = true) {
    document.getElementById('teams-container').innerHTML = '';
    teamCount = 0;
    keepOne && addTeam();
}


function removeTeam() {
    if (teamCount > 0) {
        document.getElementById('team' + teamCount).remove();
        teamCount--;
    } else {
        alert('沒有隊伍可以刪除了');
    }
}
