let fields = [
    null, // 0
    null, // 1
    null, // 2
    null, // 3
    null, // 4
    null, // 5
    null, // 6
    null, // 7
    null  // 8
];

let currentPlayer = 'circle'; // Start mit Kreis (erster Spieler)
let gameOver = false; // Variable zur Überprüfung, ob das Spiel beendet ist

function init() {
    renderTable();
}


function renderTable() {
    const contentDiv = document.getElementById('content');
    const table = document.createElement('table');

    for (let i = 0; i < 3; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < 3; j++) {
            const cell = document.createElement('td');
            const index = i * 3 + j;
            cell.dataset.index = index; // Speichere den Index des Feldes als data-Attribut
            cell.addEventListener('click', onCellClick); // Füge den Click-Event Listener hinzu

            row.appendChild(cell);
        }
        table.appendChild(row);
    }

    contentDiv.innerHTML = '';
    contentDiv.appendChild(table);
}

function onCellClick(event) {
    const cell = event.target;
    const index = cell.dataset.index;

    if (!fields[index] && !cell.querySelector('svg')) { // Überprüfe, ob das Feld leer ist und kein SVG vorhanden ist
        const svgContainer = document.createElement('div');

        if (currentPlayer === 'circle') {
            const animatedCircle = generateAnimatedCircle();
            svgContainer.appendChild(animatedCircle); // SVG-Element als Kind des Containers hinzufügen
            fields[index] = 'circle'; // Feld als Kreis markieren
        } else if (currentPlayer === 'cross') {
            const animatedX = generateAnimatedX();
            svgContainer.appendChild(animatedX); // SVG-Element als Kind des Containers hinzufügen
            fields[index] = 'cross'; // Feld als X markieren
        }

        cell.appendChild(svgContainer); // Füge den Container als Kind der Zelle hinzu
        svgContainer.classList.remove('hidden-svg'); // Entferne die Klasse, um das SVG sichtbar zu machen

        // Wechsel zum nächsten Spieler
        currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle';


        // Überprüfe, ob ein Spieler gewonnen hat
        const winnerData = checkWinner();

        if (winnerData) {
            markWinner(winnerData);
            gameOver = true;
        }

        player();
    }
}

function generateAnimatedCircle() {
    const svgWidth = 100; // Breite der Grafik (160px)
    const svgHeight = 100; // Höhe der Grafik (160px)
    const fillColor = '#00B0EF'; // Farbe des Auffülleffekts
    const outerStrokeColor = 'white'; // Farbe des äußeren Kreisrands
    const innerStrokeColor = 'white'; // Farbe des inneren Kreisrands
    const strokeWidth = 8; // Breite des äußeren Kreisrands (8px)
    const spaceWidth = 4; // Breite des Zwischenraums zwischen den Kreisen (4px)

    // Erstellen des SVG Elements
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", svgWidth);
    svg.setAttribute("height", svgHeight);
    svg.setAttribute("viewBox", `0 0 ${svgWidth} ${svgHeight}`);

    // Erstellen des äußeren Kreisrands
    const outerCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    outerCircle.setAttribute("cx", svgWidth / 2);
    outerCircle.setAttribute("cy", svgHeight / 2);
    outerCircle.setAttribute("r", (svgWidth - strokeWidth) / 2); // Abzug der äußeren Stroke-Breite
    outerCircle.setAttribute("fill", "none");
    outerCircle.setAttribute("stroke", outerStrokeColor);
    outerCircle.setAttribute("stroke-width", strokeWidth);

    // Erstellen des inneren Kreisrands
    const innerCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    innerCircle.setAttribute("cx", svgWidth / 2);
    innerCircle.setAttribute("cy", svgHeight / 2);
    innerCircle.setAttribute("r", (svgWidth - strokeWidth - spaceWidth) / 2); // Abzug der äußeren Stroke-Breite und Zwischenraum
    innerCircle.setAttribute("fill", "none");
    innerCircle.setAttribute("stroke", innerStrokeColor);
    innerCircle.setAttribute("stroke-width", strokeWidth);

    // Erstellen des Auffülleffekts
    const fillCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    fillCircle.setAttribute("cx", svgWidth / 2);
    fillCircle.setAttribute("cy", svgHeight / 2);
    fillCircle.setAttribute("r", (svgWidth - strokeWidth - spaceWidth) / 2); // Abzug der äußeren Stroke-Breite und Zwischenraum
    fillCircle.setAttribute("fill", "none");
    fillCircle.setAttribute("stroke", fillColor);
    fillCircle.setAttribute("stroke-width", strokeWidth);
    fillCircle.setAttribute("stroke-dasharray", `${2 * Math.PI * (svgWidth - strokeWidth - spaceWidth) / 2} 0`);

    // Erstellen der Animation für die Füllung
    const animation = document.createElementNS("http://www.w3.org/2000/svg", "animate");
    animation.setAttribute("attributeName", "stroke-dasharray");
    animation.setAttribute("from", `0 ${2 * Math.PI * (svgWidth - strokeWidth - spaceWidth) / 2}`);
    animation.setAttribute("to", `${2 * Math.PI * (svgWidth - strokeWidth - spaceWidth) / 2} 0`);
    animation.setAttribute("dur", "500ms");
    animation.setAttribute("repeatCount", "1"); // Nur einmalige Ausführung

    // Auffülleffekt und Animation zum SVG Element hinzufügen
    fillCircle.appendChild(animation);
    svg.appendChild(outerCircle);
    svg.appendChild(innerCircle);
    svg.appendChild(fillCircle);

    return svg;
}

function generateAnimatedX() {
    const svgWidth = 100; // Breite der Grafik (160px)
    const svgHeight = 100; // Höhe der Grafik (160px)
    const fillColor = '#FFC000'; // Farbe des Auffülleffekts
    const strokeWidth = 10; // Breite des X

    // Erstellen des SVG Elements
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", svgWidth);
    svg.setAttribute("height", svgHeight);
    svg.setAttribute("viewBox", `0 0 ${svgWidth} ${svgHeight}`);

    // Erstellen des ersten Liniensegments des X
    const line1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line1.setAttribute("x1", 0);
    line1.setAttribute("y1", 0);
    line1.setAttribute("x2", svgWidth);
    line1.setAttribute("y2", svgHeight);
    line1.setAttribute("stroke", fillColor);
    line1.setAttribute("stroke-width", strokeWidth);
    line1.setAttribute("stroke-dasharray", `${Math.sqrt(svgWidth ** 2 + svgHeight ** 2)} ${Math.sqrt(svgWidth ** 2 + svgHeight ** 2)}`);
    line1.setAttribute("stroke-dashoffset", `${Math.sqrt(svgWidth ** 2 + svgHeight ** 2)}`);

    // Erstellen des zweiten Liniensegments des X
    const line2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line2.setAttribute("x1", 0);
    line2.setAttribute("y1", svgHeight);
    line2.setAttribute("x2", svgWidth);
    line2.setAttribute("y2", 0);
    line2.setAttribute("stroke", fillColor);
    line2.setAttribute("stroke-width", strokeWidth);
    line2.setAttribute("stroke-dasharray", `${Math.sqrt(svgWidth ** 2 + svgHeight ** 2)} ${Math.sqrt(svgWidth ** 2 + svgHeight ** 2)}`);
    line2.setAttribute("stroke-dashoffset", `${Math.sqrt(svgWidth ** 2 + svgHeight ** 2)}`);

    // Erstellen der Animation für die Füllung
    const animation1 = document.createElementNS("http://www.w3.org/2000/svg", "animate");
    animation1.setAttribute("attributeName", "stroke-dashoffset");
    animation1.setAttribute("from", `${Math.sqrt(svgWidth ** 2 + svgHeight ** 2)}`);
    animation1.setAttribute("to", "0");
    animation1.setAttribute("dur", "500ms");
    animation1.setAttribute("repeatCount", "1");
    animation1.setAttribute("fill", "freeze"); // Das "X" bleibt nach Abschluss der Animation stehen

    // Füllanimation zur ersten Linie hinzufügen
    line1.appendChild(animation1);

    // Erstellen der Animation für die Füllung
    const animation2 = document.createElementNS("http://www.w3.org/2000/svg", "animate");
    animation2.setAttribute("attributeName", "stroke-dashoffset");
    animation2.setAttribute("from", `${Math.sqrt(svgWidth ** 2 + svgHeight ** 2)}`);
    animation2.setAttribute("to", "0");
    animation2.setAttribute("dur", "500ms");
    animation2.setAttribute("repeatCount", "1");
    animation2.setAttribute("fill", "freeze"); // Das "X" bleibt nach Abschluss der Animation stehen

    // Füllanimation zur zweiten Linie hinzufügen
    line2.appendChild(animation2);

    // Linien zum SVG Element hinzufügen
    svg.appendChild(line1);
    svg.appendChild(line2);

    return svg;
}

function checkWinner() {
    const patterns = [
        [0, 1, 2], // erste Reihe
        [3, 4, 5], // zweite Reihe
        [6, 7, 8], // dritte Reihe
        [0, 3, 6], // erste Spalte
        [1, 4, 7], // zweite Spalte
        [2, 5, 8], // dritte Spalte
        [0, 4, 8], // diagonale von oben links nach unten rechts
        [2, 4, 6]  // diagonale von oben rechts nach unten links
    ];

    for (const pattern of patterns) {
        const [a, b, c] = pattern;

        if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
            return { pattern, winner: fields[a] };
        }
    }

    return null;
}


function markWinner(winnerData) {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.classList.add('winner-svg'); // Füge eine Klasse hinzu, um das SVG zu stylen

    const [a, b, c] = winnerData.pattern;

    const line = document.createElementNS(svgNS, "line");
    line.setAttribute("x1", "0");
    line.setAttribute("y1", "0");
    line.setAttribute("x2", "100%");
    line.setAttribute("y2", "100%");
    line.setAttribute("class", "winner-line");

    svg.appendChild(line);

    const firstCell = document.querySelector(`td[data-index="${a}"]`);
    const lastCell = document.querySelector(`td[data-index="${c}"]`);

    const rect1 = firstCell.getBoundingClientRect();
    const rect2 = lastCell.getBoundingClientRect();

    const x1 = rect1.left + rect1.width / 2;
    const y1 = rect1.top + rect1.height / 2;
    const x2 = rect2.left + rect2.width / 2;
    const y2 = rect2.top + rect2.height / 2;

    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);

    document.body.appendChild(svg);

//     // Verstecke alle SVG-Elemente, um die Darstellung des Balkens sichtbar zu machen
//     const allSVGContainers = document.querySelectorAll('td > .hidden-svg');
//     allSVGContainers.forEach(svgContainer => svgContainer.classList.add('hidden-svg'));
}

function reloadPage() {
    location.reload();
}

function player() {
    if (currentPlayer === 'circle') {
        document.getElementById('player').innerHTML = `Spieler: O`;
    } else {
        document.getElementById('player').innerHTML = `Spieler: X`;
    }
}