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

var topMargin1 = 100;
var topMargin2 = topMargin1 + plotHeight;
var topMargin3 = topMargin2 + plotHeight;

function setup() {
    createCanvas(plotWidth*3+300,plotHeight*3+300);

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

    frameRate(1);
}

var mouseMargin = 5;
var oneElementHighlighted = false;

function highlight(car, x, y, leftMargin, topMargin) {
        if (!oneElementHighlighted &&
            mouseX > x - mouseMargin && mouseX < x + mouseMargin &&
            mouseY > y - mouseMargin && mouseY < y + mouseMargin) {
        
            textAlign(CENTER);
            fill('rgba(100%,0%,100%,0.5)');
            textStyle(BOLD);
            text(car.getString('ID'), leftMargin + plotWidth/2, topMargin + 20);
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

    // Y axis label is drawn only once
    angleMode(DEGREES);
    rotate(-90);
    textAlign(CENTER);
    text(mpgVar, 0 - (topMargin3 + plotHeight/2), leftMargin1 - 50);
    rotate(90);

    // Y axis ticks
    minMpg = round_10_below(minMpg);
    maxMpg = round_10_above(maxMpg);

    // start drawing ticks
    var pixelsPerMpg = (plotHeight - surplus * 2) / (maxMpg - minMpg);
    var nbTicksY = 4;
    var yTickDelta = (maxMpg - minMpg) / nbTicksY;
    for (var i = 0 ; i <= nbTicksY ; i++) {
        var y = topMargin3 + plotHeight - surplus - yTickDelta * pixelsPerMpg * i;
        var x = leftMargin1; // x is ON the axis
        // tick
        line(x - 5, y, x + 5, y);
        // label
        textAlign(RIGHT);
        text(minMpg + yTickDelta * i, x - 10, y + 5); 
    }
        
    // X axis labels
    textAlign(CENTER);
    text('Forward gears', leftMargin1 + plotWidth/2, topMargin3 + plotHeight + 40);
    text('Horsepower', leftMargin2 + plotWidth/2, topMargin3 + plotHeight + 40);
    text('Torque', leftMargin3 + plotWidth/2, topMargin3 + plotHeight + 40);
    
    // start drawing ticks
    var nbTicksX = 4;
    var pixelsPerForwardGear = (plotWidth - surplus * 2) / (maxForwardGear - minForwardGear);
    var tickDeltaForwardGear = (maxForwardGear - minForwardGear) / nbTicksX;
    for (var i = 0 ; i <= nbTicksX ; i++) {
        var x = leftMargin1 + surplus + tickDeltaForwardGear * pixelsPerForwardGear * i;
        var y = topMargin3 + plotHeight; // y is ON the axis
        // tick
        line(x, y - 5, x, y + 5);
        // label
        textAlign(CENTER);
        text(minForwardGear + tickDeltaForwardGear * i, x, y + 20); 
    }
    var pixelsPerHp = (plotWidth - surplus * 2) / (maxHp - minHp);
    var tickDeltaHp = (maxHp - minHp) / nbTicksX;
    for (var i = 0 ; i <= nbTicksX ; i++) {
        var x = leftMargin2 + surplus + tickDeltaHp * pixelsPerHp * i;
        var y = topMargin3 + plotHeight; // y is ON the axis
        // tick
        line(x, y - 5, x, y + 5);
        // label
        textAlign(CENTER);
        text(minHp + tickDeltaHp * i, x, y + 20); 
    }
    var pixelsPerTorqueUnit = (plotWidth - surplus * 2) / (maxTorque - minTorque);
    var tickDeltaTorque = (maxTorque - minTorque) / nbTicksX;
    for (var i = 0 ; i <= nbTicksX ; i++) {
        var x = leftMargin3 + surplus + tickDeltaTorque * pixelsPerTorqueUnit * i;
        var y = topMargin3 + plotHeight; // y is ON the axis
        // tick
        line(x, y - 5, x, y + 5);
        // label
        textAlign(CENTER);
        text(minHp + tickDeltaTorque * i, x, y + 20); 
    }


    for (var l = 0 ; l < leftMargins.length; l++) {
        var leftMargin = leftMargins[l];
        // X axis
        line(leftMargin, topMargin3 + plotHeight, leftMargin + plotWidth, topMargin3 + plotHeight);
        line(leftMargin, topMargin3, leftMargin + plotWidth, topMargin3);

        // ----------------------------------------------

        // Y axis
        line(leftMargin, topMargin3 + plotHeight, leftMargin, topMargin3);
        line(leftMargin + plotWidth, topMargin3 + plotHeight, leftMargin + plotWidth, topMargin3);
    }

    for (var i = 0 ; i < cars.length ; i++) {
        var car = cars[i];
        var hp = car.getNum('Horsepower');
        var mpg = car.getNum(mpgVar);
        var fwdGr = int(car.get('Number of Forward Gears'));
        var torque = int(car.get('Torque'));

        fill(200);

        // MPG on Forward gears
        var x1 = leftMargin1 + surplus + pixelsPerForwardGear * (fwdGr - minForwardGear);
        var y1, y2, y3;
        y1 = y2 = y3 = topMargin3 + plotHeight - surplus - pixelsPerMpg * (mpg - minMpg);
        ellipse(x1, y1, 1);
        highlight(car, x1, y1, leftMargin1, topMargin3);
        
        // MPG on Horsepower
        var x2 = leftMargin2 + surplus + pixelsPerHp * (hp - minHp);
        ellipse(x2, y2, 1);
        highlight(car, x2, y2, leftMargin2, topMargin3);
        
        // MPG on Torque
        var x3 = leftMargin3 + surplus + pixelsPerTorqueUnit * (torque - minTorque);
        ellipse(x3, y3, 1);
        highlight(car, x3, y3, leftMargin3, topMargin3);

        fill(0);
    }
}
