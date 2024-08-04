const newIdeaInput = document.getElementById('new-idea');
const categorySelect = document.getElementById('category-select');
const addIdeaButton = document.getElementById('add-idea');
const ideaList = document.getElementById('idea-list');
const spinButton = document.getElementById('spin-button');
const canvas = document.getElementById('spinner');
const ctx = canvas.getContext('2d');
const selectedIdeaText = document.getElementById('selected-idea-text');

let ideas = [];
let spinning = false;
let currentRotation = 0;
let spinSpeed = 0;

function addIdea() {
    const idea = newIdeaInput.value.trim();
    const category = categorySelect.value;
    if (idea) {
        ideas.push({ text: idea, category: category });
        renderIdeas();
        newIdeaInput.value = '';
        categorySelect.value = '';
        drawSpinner();
    }
}

function removeIdea(index) {
    ideas.splice(index, 1);
    renderIdeas();
    drawSpinner();
}

function renderIdeas() {
    ideaList.innerHTML = '';
    ideas.forEach((idea, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${idea.text} <span class="category-tag category-${idea.category}">${idea.category}</span></span>
            <button class="remove-idea" data-index="${index}"><i class="fas fa-trash"></i></button>
        `;
        ideaList.appendChild(li);
    });

    document.querySelectorAll('.remove-idea').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = parseInt(e.target.closest('.remove-idea').getAttribute('data-index'));
            removeIdea(index);
        });
    });
}

function drawSpinner() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(currentRotation);

    const sliceAngle = (2 * Math.PI) / ideas.length;
    for (let i = 0; i < ideas.length; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, i * sliceAngle, (i + 1) * sliceAngle);
        ctx.closePath();
        ctx.fillStyle = getCategoryColor(ideas[i].category);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.save();
        ctx.rotate(i * sliceAngle + sliceAngle / 2);
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'white';
        ctx.font = 'bold 16px Arial';
        wrapText(ctx, ideas[i].text, radius - 20, 0, radius - 40, 20);
        ctx.restore();
    }

    ctx.restore();

    // Draw the arrow
    ctx.beginPath();
    ctx.moveTo(canvas.width - 30, centerY - 15);
    ctx.lineTo(canvas.width, centerY);
    ctx.lineTo(canvas.width - 30, centerY + 15);
    ctx.closePath();
    ctx.fillStyle = '#e74c3c';
    ctx.fill();
}

function getCategoryColor(category) {
    switch (category) {
        case 'work': return '#3498db';
        case 'personal': return '#2ecc71';
        case 'hobby': return '#f1c40f';
        default: return '#95a5a6';
    }
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';

    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    context.fillText(line, x, y);
}

function spin() {
    if (!spinning && ideas.length > 1) {
        spinning = true;
        spinSpeed = Math.random() * 0.2 + 0.1;
        requestAnimationFrame(updateSpin);
    }
}

function updateSpin() {
    currentRotation += spinSpeed;
    spinSpeed *= 0.99;
    drawSpinner();

    if (spinSpeed > 0.001) {
        requestAnimationFrame(updateSpin);
    } else {
        spinning = false;
        const winningIndex = Math.floor(ideas.length * (1 - (currentRotation % (2 * Math.PI)) / (2 * Math.PI))) % ideas.length;
        selectedIdeaText.textContent = ideas[winningIndex].text;
    }
}

addIdeaButton.addEventListener('click', addIdea);
newIdeaInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addIdea();
});
spinButton.addEventListener('click', spin);

renderIdeas();
drawSpinner();