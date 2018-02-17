var table; // data loaded from csv
var cars;

var horsepowers;
var minHp;
var maxHp;

var mpgVar = 'Highway mpg';
var mpgs;
var minMpg;
var maxMpg;

function preload() {
    table = loadTable('../cars.csv', 'csv', 'header');
}

function unique_array(arr) {
    var uniqueArr = [];
    for (var i = 0 ; i < arr.length ; i++) {
        if (uniqueArr.indexOf(arr[i]) < 0) { // not contains
            uniqueArr.push(arr[i]);
        }
    }
    return uniqueArr;
}

function int_array(arr) {
    var intArr = [];
    for (var i = 0 ; i < arr.length ; i++) {
        intArr[i] = int(arr[i]);
    }
    return intArr;
}

function min_from_array(arr) {
    return Math.min(...arr);
}

function max_from_array(arr) {
    return Math.max(...arr);
}

function get_horsepowers() {
    var hps = table.getColumn('Horsepower');
    var intHp = int_array(hps);
    return intHp;
}

function get_mpgs() {
    var mpgs = [];
    for (var i = 0 ; i < cars.length ; i++) {
        var car = cars[i];
        var mpg = int(car.get(mpgVar));
        mpgs.push(mpg);
    }
    return mpgs;
}

function remove_outliers(oldcars) {
    var newCars = [];
    var reasonableMpg = 200;
    for (var i = 0 ; i < oldcars.length ; i++) {
        var car = oldcars[i];
        if (int(car.get(mpgVar)) < reasonableMpg) {
            newCars.push(car);
        }
    }
    return newCars;
}

function round_10_below(n) {
    return Math.floor(n/10) * 10;
}

function round_10_above(n) {
    return Math.ceil(n/10) * 10;
}

var plotHeight = 200;
var plotWidth = 200;

var leftMargin1 = 100;
var leftMargin2 = leftMargin1 + plotWidth;
var leftMargin3 = leftMargin2 + plotWidth;
var leftMargins = [leftMargin1, leftMargin2, leftMargin3];

var topMargin1 = 50;
var topMargin2 = topMargin1 + plotHeight;
var topMargin3 = topMargin2 + plotHeight;

function setup() {
    createCanvas(leftMargin1 + plotWidth*3+50,topMargin1 + plotHeight*3+50);

    cars = table.getRows();
    cars = remove_outliers(cars);

    forwardGears = int_array(unique_array(table.getColumn('Number of Forward Gears')));
    minForwardGear = min_from_array(forwardGears);
    maxForwardGear = max_from_array(forwardGears);

    horsepowers = get_horsepowers();
    minHp = min_from_array(horsepowers);
    maxHp = max_from_array(horsepowers);

    torques = int_array(table.getColumn('Torque'));
    minTorque = min_from_array(torques);
    maxTorque = max_from_array(torques);

    mpgs = get_mpgs();
    minMpg = min_from_array(mpgs);
    maxMpg = max_from_array(mpgs);

    frameRate(20);
}

var mouseMargin = 5;
var oneElementHighlighted = false;

function highlight(car, x, y, leftMargin, topMargin, xVal, yVal) {
        if (!oneElementHighlighted &&
            mouseX > x - mouseMargin && mouseX < x + mouseMargin &&
            mouseY > y - mouseMargin && mouseY < y + mouseMargin) {
        
            textAlign(CENTER);
            fill('rgba(100%,0%,100%,0.5)');
            textStyle(BOLD);
            text(car.getString('ID'), leftMargin + plotWidth/2, topMargin + 20);
            textAlign(LEFT);
            text(int(xVal), x+10, y+4);
            textAlign(RIGHT);
            text(int(yVal), x-6, y-5);
            textStyle(NORMAL);
            ellipse(x, y, 8);
            oneElementHighlighted = true;
        }
}


function draw() {
    background(255);
    oneElementHighlighted = false;

    var surplus = 30; // extra pixels inside plot for spacing
    
    // X axis ticks
    minHp = round_10_below(minHp);
    maxHp = round_10_above(maxHp);

    // Y axis label is drawn only once per "line" of subgraphs
    angleMode(DEGREES);
    rotate(-90);
    textAlign(CENTER);
    text('Horsepower', 0 - (topMargin1 + plotHeight/2), leftMargin1 - 50);
    text('Torque', 0 - (topMargin2 + plotHeight/2), leftMargin1 - 50);
    text(mpgVar, 0 - (topMargin3 + plotHeight/2), leftMargin1 - 50);
    rotate(90);

    // Y axis ticks
    minMpg = round_10_below(minMpg);
    maxMpg = round_10_above(maxMpg);

    // start drawing ticks
    var nbTicksY = 4;
    var pixelsPerHpY = (plotHeight - surplus * 2) / (maxHp - minHp);
    var hpTickDeltaY = (maxHp - minHp) / nbTicksY;
    for (var i = 0 ; i <= nbTicksY ; i++) {
        var y = topMargin1 + plotHeight - surplus - hpTickDeltaY * pixelsPerHpY * i;
        var x = leftMargin1; // x is ON the axis
        // tick
        line(x - 5, y, x + 5, y);
        // label
        textAlign(RIGHT);
        text(minHp + hpTickDeltaY * i, x - 10, y + 5); 
    }
    var pixelsPerTorqueUnitY = (plotHeight - surplus * 2) / (maxTorque - minTorque);
    var torqueTickDeltaY = (maxTorque - minTorque) / nbTicksY;
    for (var i = 0 ; i <= nbTicksY ; i++) {
        var y = topMargin2 + plotHeight - surplus - torqueTickDeltaY * pixelsPerTorqueUnitY * i;
        var x = leftMargin1; // x is ON the axis
        // tick
        line(x - 5, y, x + 5, y);
        // label
        textAlign(RIGHT);
        text(minTorque + torqueTickDeltaY * i, x - 10, y + 5); 
    }
    var pixelsPerMpgY = (plotHeight - surplus * 2) / (maxMpg - minMpg);
    var mpgTickDeltaY = (maxMpg - minMpg) / nbTicksY;
    for (var i = 0 ; i <= nbTicksY ; i++) {
        var y = topMargin3 + plotHeight - surplus - mpgTickDeltaY * pixelsPerMpgY * i;
        var x = leftMargin1; // x is ON the axis
        // tick
        line(x - 5, y, x + 5, y);
        // label
        textAlign(RIGHT);
        text(minMpg + mpgTickDeltaY * i, x - 10, y + 5); 
    }
        
    // X axis labels
    textAlign(CENTER);
    text('Forward gears', leftMargin1 + plotWidth/2, topMargin3 + plotHeight + 40);
    text('Horsepower', leftMargin2 + plotWidth/2, topMargin3 + plotHeight + 40);
    text('Torque', leftMargin3 + plotWidth/2, topMargin3 + plotHeight + 40);
    
    // start drawing ticks
    var nbTicksX = 4;
    var pixelsPerForwardGearX = (plotWidth - surplus * 2) / (maxForwardGear - minForwardGear);
    var tickDeltaForwardGear = (maxForwardGear - minForwardGear) / nbTicksX;
    for (var i = 0 ; i <= nbTicksX ; i++) {
        var x = leftMargin1 + surplus + tickDeltaForwardGear * pixelsPerForwardGearX * i;
        var y = topMargin3 + plotHeight; // y is ON the axis
        // tick
        line(x, y - 5, x, y + 5);
        // label
        textAlign(CENTER);
        text(minForwardGear + tickDeltaForwardGear * i, x, y + 20); 
    }
    var pixelsPerHpX = (plotWidth - surplus * 2) / (maxHp - minHp);
    var tickDeltaHp = (maxHp - minHp) / nbTicksX;
    for (var i = 0 ; i <= nbTicksX ; i++) {
        var x = leftMargin2 + surplus + tickDeltaHp * pixelsPerHpX * i;
        var y = topMargin3 + plotHeight; // y is ON the axis
        // tick
        line(x, y - 5, x, y + 5);
        // label
        textAlign(CENTER);
        text(minHp + tickDeltaHp * i, x, y + 20); 
    }
    var pixelsPerTorqueUnitX = (plotWidth - surplus * 2) / (maxTorque - minTorque);
    var tickDeltaTorque = (maxTorque - minTorque) / nbTicksX;
    for (var i = 0 ; i <= nbTicksX ; i++) {
        var x = leftMargin3 + surplus + tickDeltaTorque * pixelsPerTorqueUnitX * i;
        var y = topMargin3 + plotHeight; // y is ON the axis
        // tick
        line(x, y - 5, x, y + 5);
        // label
        textAlign(CENTER);
        text(minHp + tickDeltaTorque * i, x, y + 20); 
    }

    // Horizontal lines
    line(leftMargin1, topMargin1, leftMargin1 + plotWidth, topMargin1);
    line(leftMargin1, topMargin1 + plotHeight, leftMargin2 + plotWidth, topMargin1 + plotHeight);
    line(leftMargin1, topMargin3, leftMargin3 + plotWidth, topMargin3);
    line(leftMargin1, topMargin3 + plotHeight, leftMargin3 + plotWidth, topMargin3 + plotHeight);
    // Vertical lines
    line(leftMargin1, topMargin1, leftMargin1, topMargin3 + plotHeight);
    line(leftMargin2, topMargin1, leftMargin2, topMargin3 + plotHeight);
    line(leftMargin3, topMargin2, leftMargin3, topMargin3 + plotHeight);
    line(leftMargin3 + plotWidth, topMargin3, leftMargin3 + plotWidth, topMargin3 + plotHeight);

    for (var i = 0 ; i < cars.length ; i++) {
        var car = cars[i];
        var hp = car.getNum('Horsepower');
        var mpg = car.getNum(mpgVar);
        var fwdGr = int(car.get('Number of Forward Gears'));
        var torque = int(car.get('Torque'));

        fill(200);

        // MPG on Forward gears
        var x1 = leftMargin1 + surplus + pixelsPerForwardGearX * (fwdGr - minForwardGear);
        var y1, y2, y3;
        y1 = y2 = y3 = topMargin3 + plotHeight - surplus - pixelsPerMpgY * (mpg - minMpg);
        ellipse(x1, y1, 1);
        highlight(car, x1, y1, leftMargin1, topMargin3, fwdGr, mpg);
        
        // MPG on Horsepower
        var x2 = leftMargin2 + surplus + pixelsPerHpX * (hp - minHp);
        ellipse(x2, y2, 1);
        highlight(car, x2, y2, leftMargin2, topMargin3, hp, mpg);
        
        // MPG on Torque
        var x3 = leftMargin3 + surplus + pixelsPerTorqueUnitX * (torque - minTorque);
        ellipse(x3, y3, 1);
        highlight(car, x3, y3, leftMargin3, topMargin3, torque, mpg);
        
        // Torque on Forward gears
        var x4 = x1;
        var y4 = topMargin2 + plotHeight - surplus - pixelsPerTorqueUnitY * (torque - minTorque);
        ellipse(x4, y4, 1);
        highlight(car, x4, y4, leftMargin1, topMargin2, fwdGr, torque);
        
        // Torque on Horsepower
        var x5 = x2;
        var y5 = y4;
        ellipse(x5, y5, 1);
        highlight(car, x5, y5, leftMargin2, topMargin2, hp, torque);
        
        // Horsepower on Forward gears
        var x6 = x1;
        var y6 = topMargin1 + plotHeight - surplus - pixelsPerHpY * (hp - minHp);
        ellipse(x6, y6, 1);
        highlight(car, x6, y6, leftMargin1, topMargin1, fwdGr, hp);

        fill(0);
    }
}
