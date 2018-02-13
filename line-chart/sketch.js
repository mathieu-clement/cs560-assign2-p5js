var table;

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

var leftMargin = 100;
var topMargin = 50;

function setup() {
    createCanvas(1000,1000);

    var years = get_years();
    console.log('Years', years);
    console.log('Min year', min_from_array(years));
    console.log('Max year', max_from_array(years));

    var plotHeight = 400;
    var plotWidth = 400;

    // X axis
    line(leftMargin, topMargin + plotHeight, leftMargin + plotWidth, topMargin + plotHeight);
    // X axis arrow on the right
    line(leftMargin + plotWidth - 10, topMargin + plotHeight - 10, leftMargin + plotWidth, topMargin + plotHeight);
    line(leftMargin + plotWidth - 10, topMargin + plotHeight + 10, leftMargin + plotWidth, topMargin + plotHeight);
    // X axislabel
    text('Year', leftMargin + plotWidth, topMargin + plotHeight + 30);
    
    // X axis ticks
    var minYear = min_from_array(years);
    var maxYear = max_from_array(years);

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

}

function draw() {
}
