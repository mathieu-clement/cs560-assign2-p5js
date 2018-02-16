var table; // data loaded from csv
var cars;
var minMpg, maxMpg;
var minHp, maxHp;
var minTorque, maxTorque;
var minYear, maxYear;

function preload() {
    table = loadTable('../cars.csv', 'csv', 'header');
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

function round_10_below(n) {
    return Math.floor(n/10) * 10;
}

function round_10_above(n) {
    return Math.ceil(n/10) * 10;
}

function clean_cars(cars) {
    var newCars = [];
    for (var i = 0 ; i < cars.length; i++) {
        if (int(cars[i].get('Highway mpg')) < 100) {
            newCars.push(cars[i]);
        }
    }
    return newCars;
}

function max_mpg(cars) {
    var maxMpg = 0;
    for (var i = 0 ; i < cars.length ; i++) {
        var mpg = int(cars[i].get('Highway mpg'));
        if (mpg > maxMpg) maxMpg = mpg;
    }
    return maxMpg;
}

var topMargin = 50;

var plotHeight = 500;

var surplus = 20; // unused axis space

function setup() {
    createCanvas(1000, plotHeight + topMargin + 200);

    cars       =  clean_cars(table.getRows());
    mpgs       =  int_array(table.getColumn('Highway mpg'));
    hps        =  int_array(table.getColumn('Horsepower'));
    torques    =  int_array(table.getColumn('Torque'));
    years      =  int_array(table.getColumn('Year'));
    
    minMpg     =  round_10_below(min_from_array(mpgs));
    maxMpg     =  round_10_above(max_mpg(cars));
    minHp      =  round_10_below(min_from_array(hps));
    maxHp      =  round_10_above(max_from_array(hps));
    minTorque  =  round_10_below(min_from_array(torques));
    maxTorque  =  round_10_above(max_from_array(torques));
    minYear    =  min_from_array(years);
    maxYear    =  max_from_array(years);
}

var imprecisionFactor = 300;

function colinear(a, b, m, n, x, y) {
    var p = a*(n-y) + m*(y-b) + x*(b-n);
    return p > -imprecisionFactor && p < imprecisionFactor;
}

function is_mouse_on_line(mouseX, mouseY, mpgLineX, mpgY, hpLineX, hpY, torqueLineX, torqueY, yearLineX, yearY) {
    if (mouseX > mpgLineX && mouseX < hpLineX) {
        return colinear(mouseX, mouseY, mpgLineX, mpgY, hpLineX, hpY);
    } else if (mouseX > hpLineX && mouseX < torqueLineX) {
        return colinear(mouseX, mouseY, hpLineX, hpY, torqueLineX, torqueY);
    } else if (mouseX > torqueLineX && mouseX < yearLineX) {
        return colinear(mouseX, mouseY, torqueLineX, torqueY, yearLineX, yearY);
    }
    return false;
}

function draw() {
    background(255);

    // Vertical line coordinates
    var mpgLineX    = 200;
    var hpLineX     = 400;
    var torqueLineX = 600;
    var yearLineX   = 800;

    // Ticks
    var numTicks = 5;
    var tickWidth = 10;
    var maxTickY = topMargin + surplus;
    var minTickY = topMargin + plotHeight - surplus;

    var highlighted = false;

    // Legend for line colors
    textAlign(LEFT);
    strokeWeight(3);
    stroke('rgb(80%,80%,100%)');
    line(yearLineX + 100, 300, yearLineX + 140, 300);
    strokeWeight(1);
    text('Gasoline', yearLineX + 150, 305);

    stroke('orange');
    strokeWeight(3);
    line(yearLineX + 100, 320, yearLineX + 140, 320);
    strokeWeight(1);
    text('Diesel', yearLineX + 150, 325);

    stroke('red');
    strokeWeight(3);
    line(yearLineX + 100, 340, yearLineX + 140, 340);
    strokeWeight(1);
    text('E85', yearLineX + 150, 345);

    stroke(0);

    // Lines for each car
    for (var i = 0 ; i < cars.length ; i++) {
        var car  = cars[i];
        var mpg  = int(car.get('Highway mpg'));
        var hp   = int(car.get('Horsepower'));
        var torque = int(car.get('Torque'));
        var year = int(car.get('Year'));
        var fuel = car.get('Fuel Type');

        var color = 'black';
        if (fuel == 'Gasoline') color = 'rgb(80%,80%,100%)';
        else if (fuel == 'Diesel fuel') color = 'orange';
        else if (fuel == 'E85') color = 'red';
        //fill(color);
        stroke(color);

        var mpgY = map(mpg, minMpg, maxMpg, minTickY, maxTickY);
        var hpY  = map(hp,  minHp,  maxHp,  minTickY, maxTickY);
        var torqueY = map(torque, minTorque, maxTorque, minTickY, maxTickY);
        var yearY = map(year, minYear, maxYear, minTickY, maxTickY);

        // Draw lines
        line(mpgLineX, mpgY, hpLineX, hpY);
        line(hpLineX, hpY, torqueLineX, torqueY);
        line(torqueLineX, torqueY, yearLineX, yearY);
    }

    // Interactivity / Highlighting
    for (var i = 0 ; i < cars.length ; i++) {
        var car  = cars[i];
        var mpg  = int(car.get('Highway mpg'));
        var hp   = int(car.get('Horsepower'));
        var torque = int(car.get('Torque'));
        var year = int(car.get('Year'));

        var mpgY = map(mpg, minMpg, maxMpg, minTickY, maxTickY);
        var hpY  = map(hp,  minHp,  maxHp,  minTickY, maxTickY);
        var torqueY = map(torque, minTorque, maxTorque, minTickY, maxTickY);
        var yearY = map(year, minYear, maxYear, minTickY, maxTickY);

        // Interactivity
        if (is_mouse_on_line(mouseX, mouseY, mpgLineX, mpgY, hpLineX, hpY, torqueLineX, torqueY, yearLineX, yearY)) {
            strokeWeight(4);
            stroke('green');
            // Draw lines
            line(mpgLineX, mpgY, hpLineX, hpY);
            line(hpLineX, hpY, torqueLineX, torqueY);
            line(torqueLineX, torqueY, yearLineX, yearY);

            // Name of car above plot
            fill(0); strokeWeight(1);
            stroke('green');
            textAlign(CENTER);
            text(car.get('ID'), map(50, 0, 100, mpgLineX, yearLineX), 30);

            textAlign(LEFT);
            text(mpg, mpgLineX+10, mpgY-4);
            text(hp, hpLineX+10, hpY-4);
            text(torque, torqueLineX+10, torqueY-4);

            stroke(0);

            break;
        }
    }

    fill(0);
    stroke(0);
    strokeWeight(1);
    
    // Vertical lines

    line(mpgLineX, topMargin, mpgLineX, topMargin + plotHeight);
    line(hpLineX, topMargin, hpLineX, topMargin + plotHeight);
    line(torqueLineX, topMargin, torqueLineX, topMargin + plotHeight);
    line(yearLineX, topMargin, yearLineX, topMargin + plotHeight);

    // Attribute name under each line
    textAlign(CENTER);
    text('Highway MPG', mpgLineX, topMargin + plotHeight + 20);
    text('Horsepower', hpLineX, topMargin + plotHeight + 20);
    text('Torque', torqueLineX, topMargin + plotHeight + 20);
    text('Year', yearLineX, topMargin + plotHeight + 20);


    textAlign(RIGHT);
   
    // Max ticks
    line(mpgLineX-tickWidth, maxTickY, mpgLineX, maxTickY);
    text(maxMpg, mpgLineX-tickWidth-5, maxTickY + 5);

    line(hpLineX-tickWidth, maxTickY, hpLineX, maxTickY);
    text(maxHp, hpLineX-tickWidth-5, maxTickY + 5);

    line(torqueLineX-tickWidth, maxTickY, torqueLineX, maxTickY);
    text(maxTorque, torqueLineX-tickWidth-5, maxTickY + 5);

    line(yearLineX-tickWidth, maxTickY, yearLineX, maxTickY);
    text(maxYear, yearLineX-tickWidth-5, maxTickY + 5);

    // Min ticks
    line(mpgLineX-tickWidth, minTickY, mpgLineX, minTickY);
    text(minMpg, mpgLineX-tickWidth-5, minTickY + 5);

    line(hpLineX-tickWidth, minTickY, hpLineX, minTickY);
    text(minHp, hpLineX-tickWidth-5, minTickY + 5);

    line(torqueLineX-tickWidth, minTickY, torqueLineX, minTickY);
    text(minTorque, torqueLineX-tickWidth-5, minTickY + 5);

    line(yearLineX-tickWidth, minTickY, yearLineX, minTickY);
    text(minYear, yearLineX-tickWidth-5, minTickY + 5);

    // Ticks in between
    textAlign(RIGHT);

    var mpgUnitsPerTick = (maxMpg - minMpg) / numTicks;
    for (var i = 1 ; i < numTicks ; i++) {
        var u = mpgUnitsPerTick * i + minMpg;
        var y = map(u, minMpg, maxMpg, minTickY, maxTickY);
        line(mpgLineX-tickWidth, y, mpgLineX, y);
        text(u, mpgLineX-tickWidth-5, y+5);
    }
    var hpUnitsPerTick = (maxHp - minHp) / numTicks;
    for (var i = 1 ; i < numTicks ; i++) {
        var u = hpUnitsPerTick * i + minHp;
        var y = map(u, minHp, maxHp, minTickY, maxTickY);
        line(hpLineX-tickWidth, y, hpLineX, y);
        text(u, hpLineX-tickWidth-5, y+5);
    }
    var torqueUnitsPerTick = (maxTorque - minTorque) / numTicks;
    for (var i = 1 ; i < numTicks ; i++) {
        var u = torqueUnitsPerTick * i + minTorque;
        var y = map(u, minTorque, maxTorque, minTickY, maxTickY);
        line(torqueLineX-tickWidth, y, torqueLineX, y);
        text(u, torqueLineX-tickWidth-5, y+5);
    }
    var yearUnitsPerTick = 1;
    for (var i = 1 ; i < numTicks ; i++) {
        var u = yearUnitsPerTick * i + minYear;
        var y = map(u, minYear, maxYear, minTickY, maxTickY);
        line(yearLineX-tickWidth, y, yearLineX, y);
        text(u, yearLineX-tickWidth-5, y+5);
    }
}
