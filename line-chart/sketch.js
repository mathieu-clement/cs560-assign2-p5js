var table; // data loaded from csv
var years; // the unique years in the data, int, sorted
var hpAverages = {}; // average of horsepower for each year
var xes = []; // x coordinates for each year
var yes = []; // y coordinates for each year

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

function get_years() {
    var tableYears = table.getColumn('Year');
    var uniqueYears = int_array(unique_array(tableYears));
    sort(uniqueYears);
    return uniqueYears;
}

function round_10_below(n) {
    return Math.floor(n/10) * 10;
}

function round_10_above(n) {
    return Math.ceil(n/10) * 10;
}

var leftMargin = 100;
var topMargin = 50;

var plotHeight = 350;
var plotWidth = 400;

function setup() {
    createCanvas(plotWidth + leftMargin*2,plotHeight + topMargin*2);

    years = get_years();
    console.log('Years', years);
}

function draw() {
    background(255);

    var minYear = min_from_array(years);
    var maxYear = max_from_array(years);


    // X axis
    line(leftMargin, topMargin + plotHeight, leftMargin + plotWidth, topMargin + plotHeight);
    // X axis arrow on the right
    line(leftMargin + plotWidth - 10, topMargin + plotHeight - 10, leftMargin + plotWidth, topMargin + plotHeight);
    line(leftMargin + plotWidth - 10, topMargin + plotHeight + 10, leftMargin + plotWidth, topMargin + plotHeight);
    // X axislabel
    text('Year', leftMargin + plotWidth, topMargin + plotHeight + 30);
    
    // X axis ticks

    // note that plot begins at minYear - 1, and ends at maxYear + 1, thus: +2
    var pixelsPerYear = plotWidth / (maxYear - minYear + 2);
    // start drawing ticks and add label under them
    for (var i = 0 ; i < years.length ; i++) {
        var year = years[i];
        var x = leftMargin + pixelsPerYear * (1+i);
        var y = topMargin + plotHeight; // y is ON the axis
        // tick
        line(x, y - 5, x, y + 5);
        // label
        textAlign(CENTER);
        text(year, x, y + 20); 
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
    text('Average horsepower', 0 - (topMargin + plotHeight/2), leftMargin - 50);
    rotate(90);

    // Y axis ticks
    
    var surplus = 30; // extra pixels on Y axis inside plot for spacing

    // compute average for each year, and min / max
    var minHp = 1000000;
    var maxHp = 0;

    for (var i = 0 ; i < years.length ; i++) {
        var year = years[i];
        var total = 0;
        var cars = table.findRows('' + year, 'Year');
        console.log('Cars for year ' + year, cars);

        for (var j = 0 ; j < cars.length ; j++) {
            var hp = cars[j].getNum('Horsepower');
            total = total + hp;
        }

        var avg = total / cars.length;
        hpAverages[year] = avg;
        if (avg < minHp) minHp = avg;
        if (avg > maxHp) maxHp = avg;
    }
    console.log('Averages of horsepower per year', hpAverages);
    console.log('min avg hp', minHp);
    console.log('max avg hp', maxHp);

    minHp = round_10_below(minHp);
    maxHp = round_10_above(maxHp);

    var pixelsPerHp = (plotHeight - surplus * 2) / (maxHp - minHp);

    // ticks
    // bottom tick
    textAlign(RIGHT);
    var minHpY = topMargin + plotHeight - surplus;
    text(minHp, leftMargin - 10, minHpY+5); // + 5 to center text vertically
    line(leftMargin - 5, minHpY, leftMargin + 5, minHpY);

    // top tick
    var maxHpY = topMargin + surplus;
    text(maxHp, leftMargin - 10, maxHpY+5);
    line(leftMargin -5, maxHpY, leftMargin + 5, maxHpY);

    // ticks in between
    // => we'll put this many ticks:
    var numVertTicks = 5;
    // so each tick represents this much horsepower:
    var hpDelta = (maxHp - minHp) / numVertTicks;

    for (var i = 0 ; i < numVertTicks ; i++) {
        var x = leftMargin;
        var y = minHpY - (i+1) * hpDelta * pixelsPerHp;
        text(minHp + (i+1) * hpDelta, x - 10, y+5);
        line(x-5, y, x+5, y);
    }

    // Calculate line points
    for (var i = 0 ; i < years.length ; i++) {
        var year = years[i];
        var hpAboveMin = hpAverages[year] - minHp;
        var x = leftMargin + pixelsPerYear * (1+i);
        var y = minHpY - pixelsPerHp * hpAboveMin;
        xes[i] = x;
        yes[i] = y;
    }
    console.log(xes);
    console.log(yes);

    // Draw lines
    for (var i = 1; i < years.length ; i++) {
        line(xes[i-1], yes[i-1], xes[i], yes[i]);
    }

    // Label points
    for (var i = 0 ; i < years.length ; i++) {
        textAlign(RIGHT);
        text('' + Math.round(hpAverages[years[i]]*100)/100, xes[i] - 10, yes[i]);
    }

    var mouseMargin = 10;
    for (var i = 0 ; i < years.length ; i++) {
        var x = xes[i];
        var y = yes[i];
        if (mouseX > x - mouseMargin && mouseX < x + mouseMargin &&
            mouseY > y - mouseMargin && mouseY < y + mouseMargin) {
            
            rect (x - 30, y - 40, 50, 30);
            textAlign(CENTER);
            text('' + Math.round(hpAverages[years[i]]*100)/100, x, y - 20);
            strokeWeight(7);
            point(x, y);
            strokeWeight(1);
        }
    }
}
