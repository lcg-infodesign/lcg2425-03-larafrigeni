let data;
let dataObj;
let colors = [];
let fontDIN;
let scrollY = 0;

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
    color('#232A5C'),   
    color('#2058A9'),   
    color('#3682F0'),   
    color('#2F89C7'),   
    color('#5FA2C9'),   
    color('#9BCCE8'),
    color('#D3ECF9'),   
  ];

  dataObj = data.getObject();
}

function draw() {
  background("WHITE");

  let rows = data.getRowCount(); // Numero di righe
  let spacing = 300; // Spazio tra elementi

  for (let i = 0; i < rows; i++) {
    let x = windowWidth / 2; // Posizione x al centro della finestra
    let y = i * spacing + spacing / 2 + scrollY; 
    
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
    text(data.getString(i, "name"), x, y + diametro / 2 + 70); 

    // Disegna pallini intorno alla palla = "tributaries"
    let tributariesValue = data.getNum(i, "tributaries"); 
    let rotationSpeed = 0.02; 
    let angleOffset = frameCount * rotationSpeed; 
    for (let j = 0; j < tributariesValue; j++) {
      let angle = map(j, 0, tributariesValue, 0, TWO_PI) + angleOffset; 
      let dotX = x + (diametro / 2 + 30) * cos(angle); 
      let dotY = y + (diametro / 2 + 30) * sin(angle); 
      fill(0); 
      ellipse(dotX, dotY, 5, 5); 
    }

    // Cerchio accanto alla palla = "length"
    let lengthValue = data.getNum(i, "length"); 
    let diametro2 = lengthValue / 100; 
    fill(colors[colorIndex].levels[0], colors[colorIndex].levels[1], colors[colorIndex].levels[2], 150); 
    ellipse(x - 5 + diametro / 2 + diametro2 / 2, y - 10, diametro2, diametro2); 
  }

  Legenda();
}

// Funzione Palla
function drawPalla(x, y, diametro) {
  ellipse(x, y, diametro, diametro);
}

// scroll
function mouseWheel(event) {    
  // Limite inferiore (non scrollare sotto l'ultimo elemento): -numero righe - 1 x spacing + mezza altezza
  let limiteSotto = -99 * 300 + height / 2;

  scrollY -= event.delta;
  scrollY = constrain(scrollY, limiteSotto, 0); // Limita scrollY tra i due limiti

  return false;
}

// Funzione legenda
function Legenda() {
  let legendX = windowWidth - 220; 
  let legendY = 35; 

  textSize(150);
  textAlign(LEFT);
  fill('#2058A9');
  text("RIVERS", 20, 150);
  fill('#3682F0');
  text("IN", 20, 300);
  fill('#2F89C7');
  text("THE", 20, 450);
  fill('#5FA2C9');
  text("WORLD", 20, 600);

  fill(0); 
  textSize(16);
  textAlign(LEFT);

  let continents = ["Asia", "Europe", "Africa", "America", "Oceania", "Other"];
  for (let i = 0; i < continents.length; i++) {
    fill(colors[i].levels[0], colors[i].levels[1], colors[i].levels[2]);
    rect(legendX + 10, legendY  + i * 20, 10, 10); 
    fill(0);
    text(continents[i], legendX + 30, legendY + i * 20 + 10); 
  }
  text("Main circle diameter = Area", legendX + 10, legendY + 150);
  text("Number of dots = Tributaries", legendX + 10, legendY + 170);
  text("Side circle diameter = Length", legendX + 10, legendY + 190);
}
