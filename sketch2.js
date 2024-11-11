let data;
let dataObj;
let colors = [];
let fontDIN;


function preload() {
  data = loadTable("../data.csv", "csv", "header");
  fontDIN = loadFont("../DIN.ttf");
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  data = loadTable("../data.csv", "csv", "header", () => {
    console.log(data);
    console.log("Numero di righe:", data.getRowCount());
  });

  colors = [
    color ('#232A5C'),   
    color ('#2058A9'),   
    color ('#3682F0'),   
    color ('#2F89C7'),   
    color ('#5FA2C9'),   
    color ('#9BCCE8'),
    color ('#D3ECF9'),   
  ];

  dataObj = data.getObject();

}

function draw() {
  background("WHITE");

  let rows = data.getRowCount(); // Numero righe
  let spacing = 300; // Spazio tra elementi

  for (let i = 0; i < rows; i++) {
    console.log("Disegnando blob:", i);
    let x = windowWidth / 2; // Posizione x al centro della finestra
    let y = i * spacing + spacing / 2; // Posizione y in base a indice
    
    // Diametro palla = "area"
    let areaValue = data.getNum(i, "area"); 
    let diametro = map(areaValue, 0, 6000000, 10, 100); // Riproporziono

    // Colore palla = "continent"
    let continent = data.getString(i, "continent"); // Continente
    let colorIndex = continent === "Asia" ? 0 : continent === "Europe" ? 1 : continent === "Africa" ? 2 : continent === "America" ? 3 : continent === "Oceania" ? 4 : 5; 
    fill(colors[colorIndex].levels[0], colors[colorIndex].levels[1], colors[colorIndex].levels[2], 150); // Con trasparenza
    noStroke();
    
    // Disegna Palla con sotto "name"
    drawPalla(x, y, diametro); 
    textAlign(CENTER); 
    textSize(20);
    textFont(fontDIN);
    text(data.getString(i, "name"), x, y + diametro / 2 + 40); 

    // Disegna pallini intorno alla palla = "tributaries"
    let tributariesValue = data.getNum(i, "tributaries"); 
    let rotationSpeed = 0.02; 
    let angleOffset = frameCount * rotationSpeed; 
    for (let j = 0; j < tributariesValue; j++) {
      let angle = map(j, 0, tributariesValue, 0, TWO_PI) + angleOffset; 
      let dotX = x + (diametro / 2 + 10) * cos(angle); 
      let dotY = y + (diametro / 2 + 10) * sin(angle); 
      fill(0); 
      ellipse(dotX, dotY, 5, 5); 
    }

    // Cerchio accanto alla palla = "length"
    let lengthValue = data.getNum(i, "length"); 
    let diametro2 = lengthValue / 100; 
    fill(colors[colorIndex].levels[0], colors[colorIndex].levels[1], colors[colorIndex].levels[2], 150); 
    ellipse(x - 5 + diametro / 2 + diametro2 / 2, y-10, diametro2, diametro2); 
  }
}

// Funzione Palla
function drawPalla(x, y, diametro) {
  ellipse(x, y, diametro, diametro);
}


