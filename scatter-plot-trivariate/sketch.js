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

var leftMargin = 100;
var topMargin = 100;

var plotHeight = 450;
var plotWidth = 800;

function setup() {
    createCanvas(plotWidth + leftMargin*2,plotHeight + topMargin*2);

    cars = table.getRows();
    cars = remove_outliers(cars);

    horsepowers = get_horsepowers();
    minHp = min_from_array(horsepowers);
    maxHp = max_from_array(horsepowers);

    mpgs = get_mpgs();
    minMpg = min_from_array(mpgs);
    maxMpg = max_from_array(mpgs);
}

function draw() {
    background(255);
 
    var surplus = 30; // extra pixels inside plot for spacing

    // X axis
    line(leftMargin, topMargin + plotHeight, leftMargin + plotWidth, topMargin + plotHeight);
    // X axis arrow on the right
    line(leftMargin + plotWidth - 10, topMargin + plotHeight - 10, leftMargin + plotWidth, topMargin + plotHeight);
    line(leftMargin + plotWidth - 10, topMargin + plotHeight + 10, leftMargin + plotWidth, topMargin + plotHeight);
    // X axis label
    textAlign(LEFT);
    text('Horsepower', leftMargin + plotWidth, topMargin + plotHeight + 30);
    
    // X axis ticks
    minHp = round_10_below(minHp);
    maxHp = round_10_above(maxHp);

    // start drawing ticks
    var pixelsPerHp = (plotWidth - surplus * 2) / (maxHp - minHp);
    var nbTicksX = 10;
    var tickDelta = (maxHp - minHp) / nbTicksX;
    for (var i = 0 ; i <= nbTicksX ; i++) {
        var x = leftMargin + surplus + tickDelta * pixelsPerHp * i;
        var y = topMargin + plotHeight; // y is ON the axis
        // tick
        line(x, y - 5, x, y + 5);
        // label
        textAlign(CENTER);
        text(minHp + tickDelta * i, x, y + 20); 
    }

    // ----------------------------------------------

    // Y axis
    line(leftMargin, topMargin + plotHeight, leftMargin, topMargin);
    // Y axis arrow at the top
    line(leftMargin - 10, topMargin + 10, leftMargin, topMargin);
    line(leftMargin + 10, topMargin + 10, leftMargin, topMargin);
    // Y axis label
    angleMode(DEGREES);
    rotate(-90);
    textAlign(CENTER);
    text(mpgVar, 0 - (topMargin + plotHeight/2), leftMargin - 50);
    rotate(90);

    // Y axis ticks
    minMpg = round_10_below(minMpg);
    maxMpg = round_10_above(maxMpg);

    // start drawing ticks
    var pixelsPerMpg = (plotHeight - surplus * 2) / (maxMpg - minMpg);
    var nbTicksY = 10;
    var yTickDelta = (maxMpg - minMpg) / nbTicksY;
    for (var i = 0 ; i <= nbTicksY ; i++) {
        var y = topMargin + plotHeight - surplus - yTickDelta * pixelsPerMpg * i;
        var x = leftMargin; // x is ON the axis
        // tick
        line(x - 5, y, x + 5, y);
        // label
        textAlign(RIGHT);
        text(minMpg + yTickDelta * i, x - 10, y + 5); 
    }

    // Legend
    textAlign(RIGHT);
    textStyle(BOLD);
    text('Legend', leftMargin, 12);
    textAlign(LEFT);
    noStroke();

    fill(255, 165, 0);
    triangle(leftMargin-6, 30, leftMargin, 22, leftMargin+6, 30);
    text('Diesel', leftMargin+12, 30);

    fill(0, 128, 0);
    rect(leftMargin-5, 40, 10, 10);
    text('E85', leftMargin+12, 49);

    fill(200);
    ellipse(leftMargin, 65, 10);
    text('Gasoline', leftMargin+12, 69);

    var mouseMargin = 2;
    var oneElementHighlighted = false;

    for (var i = 0 ; i < cars.length ; i++) {
        var car = cars[i];
        var hp = car.getNum('Horsepower');
        var mpg = car.getNum(mpgVar);
        var fuelType = car.get('Fuel Type');

        var x = leftMargin + surplus + pixelsPerHp * (hp - minHp);
        var y = topMargin + plotHeight - surplus - pixelsPerMpg * (mpg - minMpg);
        noStroke();
        if (fuelType == 'Diesel fuel') {
            fill(255, 165, 0); // orange
            triangle(x-4, y, x, y-4, x+4, y);
        } else if (fuelType == 'E85') {
            fill(0, 128, 0); // green
            rect(x-2, y-2, 4, 4);
        } else {
            fill(200); // grey
            ellipse(x, y, 4);
        }
        stroke(51);

        if (!oneElementHighlighted &&
            mouseX > x - mouseMargin && mouseX < x + mouseMargin &&
            mouseY > y - mouseMargin && mouseY < y + mouseMargin) {
        
            textAlign(CENTER);
            fill('rgba(100%,0%,100%,1.0)');
            textStyle(BOLD);
            text(car.getString('ID'), leftMargin + plotWidth/2, topMargin - 70);
            textStyle(NORMAL);
            text(car.get(mpgVar) + ' mpg', leftMargin + plotWidth/2, topMargin - 50);
            text(car.get('Horsepower') + ' bhp', leftMargin + plotWidth/2, topMargin - 30);
            text(fuelType, leftMargin + plotWidth/2, topMargin - 10);
            ellipse(x, y, 8);
            oneElementHighlighted = true;
        }
        fill(0);
        textStyle(NORMAL);
    }
}
