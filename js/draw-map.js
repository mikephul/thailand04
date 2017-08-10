var features;

var width = 485,
    height = 700,
    centeredIncome,
    colorIncome,
    yearIncome,
    pathIncome,
    sortedIncome,
    drawnIncome = false;

var width = 485,
    height = 700,
    centeredDebt,
    colorDebt,
    yearDebt,
    pathDebt,
    sortedDebt,
    drawnDebt = false;

var loopIncome = false;
var loopDebt = false;

// Define color scale
colorIncome = d3.scale.linear()
    .interpolate(d3.interpolateHslLong)
    .range([d3.rgb("#f7a8a6"), d3.rgb("#addcc9")]);

// Define color scale
colorDebt = d3.scale.linear()
    .interpolate(d3.interpolateHslLong)
    .range([d3.rgb("#addcc9"), d3.rgb("#f7a8a6")]);
    // .range([d3.rgb("#f6dfdf"), d3.rgb("#f22a2a")]);

// Load map data
d3.json('thai_income.json', function(error, mapData) {
    features = mapData.features;
    updateIncome();
    updateDebt();
});

function loopAnimationIncome() {
    loopIncome = !loopIncome;
    if (loopIncome) {
        $("#play-button-income")
            .attr('class', 'btn btn-danger')
            .attr('value', 'หยุด');
        var i = 0;
        flowLoopIncome = setInterval(function() {
            document.getElementsByName("year-income")[0].value = i % 10;
            updateIncome()
            i++;
        }, 1500);
    } else {
        $("#play-button-income")
            .attr('class', 'btn btn-default')
            .attr('value', 'เล่น');
        clearInterval(flowLoopIncome)
    }
}

function loopAnimationDebt() {
    loopDebt = !loopDebt;
    if (loopDebt) {
        $("#play-button-debt")
            .attr('class', 'btn btn-danger')
            .attr('value', 'หยุด');
        var i = 0;
        flowLoopDebt = setInterval(function() {
            document.getElementsByName("year-debt")[0].value = i % 10;
            updateDebt()
            i++;
        }, 1500);
    } else {
        $("#play-button-debt")
            .attr('class', 'btn btn-default')
            .attr('value', 'เล่น');
        clearInterval(flowLoopDebt)
    }
}

function getMapLayer(canvas) {
    return d3.select(canvas).select('g').select('g');
}

function getG(canvas) {
    return d3.select(canvas).select('g');
}

function updateDebt() {
    // Set year to display
    yearDebt = document.getElementsByName("year-debt")[0].value    

    // Update color scale domain based on data
    colorDebt.domain([d3.min(features, debtFn), d3.max(features, debtFn)]);

    // Draw map or update
    if (!drawnDebt) {
        drawMapDebt('#map-canvas-debt');
        drawnDebt = true;
    } else {
        getMapLayer('#map-canvas-debt').selectAll('path').transition().delay(700).style('fill', fillDebtFn);
    }

    // Sort income
    var debt = features.map(debtFn)
    var indices = sortIndices(debt)
    sortedDebt = indices.map(i => features[i])

    // Update UI
    document.getElementById("max-debt").click()
    var avgDebt = parseInt(debt.reduce(function(total, d) { return total + d; }) / debt.length)
    document.getElementById("country-avg-debt").innerHTML = 'หนี้สินเฉลี่ยทั้งประเทศ ' + numberWithCommas(avgDebt) + ' บาท';

    // Plot income historgram
    plotDebt(debt);
}


function updateIncome() {
    // Set year to display
    yearIncome = document.getElementsByName("year-income")[0].value

    // Update color scale domain based on data
    colorIncome.domain([d3.min(features, incomeFn), d3.max(features, incomeFn)]);

    // Draw map or update
    if (!drawnIncome) {
        drawMapIncome('#map-canvas-income');
        drawnIncome = true;
    } else {
        getMapLayer('#map-canvas-income').selectAll('path').transition().delay(700).style('fill', fillIncomeFn);
    }

    // Sort income
    var income = features.map(incomeFn)
    var indices = sortIndices(income)
    sortedIncome = indices.map(i => features[i])

    // Update UI
    document.getElementById("max-income").click()
    var avgIncome = parseInt(income.reduce(function(total, d) { return total + d; }) / income.length)
    document.getElementById("country-avg-income").innerHTML = 'รายได้เฉลี่ยทั้งประเทศ ' + numberWithCommas(avgIncome) + ' บาท';

    // Plot income historgram
    plotIncome(income);
}

function drawMapDebt(canvas) {
    var projection = d3.geo.mercator()
        .scale(2500)
        // Customize the projection to make the center of Thailand become the center of the map
        .rotate([-100.6331, -13.2])
        .translate([485 / 2 + 10, 700 / 2]);

    pathDebt = d3.geo.path()
        .projection(projection);

    // Set svg width & height
    var svg = d3.select(canvas)
        .attr('width', 485)
        .attr('height', 700);

    // Add background
    svg.append('rect')
        .attr('class', 'background')
        .attr('width', 485)
        .attr('height', 700)
        .on('click', clickedDebt);

    var g = svg.append('g');

    var mapLayer = g.append('g')
        .classed('map-layer', true);

    // Draw each province as a path
    mapLayer.selectAll('path')
        .data(features)
        .enter().append('path')
        .attr('d', pathDebt)
        .attr('vector-effect', 'non-scaling-stroke')
        .style('fill', fillDebtFn)
        .on('mouseover', mouseoverDebt)
        .on('mouseout', mouseoutDebt)
        .on('click', clickedDebt);

    // Add tip information
    $('svg path').tipsy({
        gravity: 'w',
        html: true,
        title: function() {
            var d = this.__data__;
            var info = '';
            info += '<b>' + d.properties.thai_name + '</b><br />';
            info += 'หนี้สินเฉลี่ยต่อครัวเรือน ' + numberWithCommas(debtFn(d)) + ' บาท';
            return info;
        }
    });
}

function drawMapIncome(canvas) {
    var projection = d3.geo.mercator()
        .scale(2500)
        // Customize the projection to make the center of Thailand become the center of the map
        .rotate([-100.6331, -13.2])
        .translate([485 / 2 - 90, 700 / 2]);

    pathIncome = d3.geo.path()
        .projection(projection);

    // Set svg width & height
    var svg = d3.select(canvas)
        .attr('width', 485)
        .attr('height', 700);

    // Add background
    svg.append('rect')
        .attr('class', 'background')
        .attr('width', 485)
        .attr('height', 700)
        .on('click', clickedIncome);

    var g = svg.append('g');

    var mapLayer = g.append('g')
        .classed('map-layer', true);

    // Draw each province as a path
    mapLayer.selectAll('path')
        .data(features)
        .enter().append('path')
        .attr('d', pathIncome)
        .attr('vector-effect', 'non-scaling-stroke')
        .style('fill', fillIncomeFn)
        .on('mouseover', mouseoverIncome)
        .on('mouseout', mouseoutIncome)
        .on('click', clickedIncome);

    // Add tip information
    $('svg path').tipsy({
        gravity: 'w',
        html: true,
        title: function() {
            var d = this.__data__;
            var info = '';
            info += '<b>' + d.properties.thai_name + '</b><br />';
            info += 'รายได้เฉลี่ยต่อเดือนต่อครัวเรือน ' + numberWithCommas(incomeFn(d)) + ' บาท';
            return info;
        }
    });
}

function sortIndices(arr) {
    // Sort income in descending order return the indices
    var len = arr.length;
    var indices = new Array(len);
    for (var i = 0; i < len; ++i) indices[i] = i;
    indices.sort(function(a, b) { return arr[a] > arr[b] ? -1 : arr[a] < arr[b] ? 1 : 0; });
    return indices;
}

function numberWithCommas(x) {
    // Format number to have comma
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Get province name
function nameFn(d) {
    return d && d.properties ? d.properties.CHA_NE : null;
}

// Get province name
function thaiNameFn(d) {
    return d && d.properties ? d.properties.thai_name : null;
}

// Get province income
function incomeFn(d) {
    return d && d.properties ? d.properties.income[yearIncome] : null;
}

// Get province income
function debtFn(d) {
    return d && d.properties ? d.properties.debt[yearDebt] : null;
}

// Get province color
function fillIncomeFn(d) {
    return colorIncome(incomeFn(d));
}

function fillDebtFn(d) {
    return colorDebt(debtFn(d));
}

// When clicked, zoom in
function clickedIncome(d) {
    var x, y, k;

    // Compute centroid of the selected path
    if (d && centeredIncome !== d) {
        var centroid = pathIncome.centroid(d);
        x = centroid[0];
        y = centroid[1];
        k = 4;
        centeredIncome = d;
    } else {
        x = width / 2;
        y = height / 2;
        k = 1;
        centeredIncome = null;
    }

    // // Highlight the clicked province
    // getMapLayer('#map-canvas-income').selectAll('path')
    //     .style('fill', function(d) { return centeredIncome && d === centeredIncome ? 'steelblue' : fillIncomeFn(d); });

    // Zoom
    getG('#map-canvas-income').transition()
        .duration(750)
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')scale(' + k + ')translate(' + -x + ',' + -y + ')');
}

function mouseoverIncome(d) {
    // Highlight hovered province
    d3.select(this).style('fill', "steelblue");
}

function mouseoutIncome(d) {
    // Reset province color
    getMapLayer('#map-canvas-income').selectAll('path')
        .style('fill', function(d) { return centeredIncome && d === centeredIncome ? "steelblue" : fillIncomeFn(d); });
}

// When clicked, zoom in
function clickedDebt(d) {
    var x, y, k;

    // Compute centroid of the selected path
    if (d && centeredDebt !== d) {
        var centroid = pathDebt.centroid(d);
        x = centroid[0];
        y = centroid[1];
        k = 4;
        centeredDebt = d;
    } else {
        x = width / 2;
        y = height / 2;
        k = 1;
        centeredDebt = null;
    }

    // Highlight the clicked province
    getMapLayer('#map-canvas-debt').selectAll('path')
        .style('fill', function(d) { return centeredDebt && d === centeredDebt ? 'steelblue' : fillDebtFn(d); });

    // Zoom
    getG('#map-canvas-debt').transition()
        .duration(750)
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')scale(' + k + ')translate(' + -x + ',' + -y + ')');
}

function mouseoverDebt(d) {
    // Highlight hovered province
    d3.select(this).style('fill', "steelblue");
}

function mouseoutDebt(d) {
    // Reset province color
    getMapLayer('#map-canvas-debt').selectAll('path')
        .style('fill', function(d) { return centeredDebt && d === centeredDebt ? "steelblue" : fillDebtFn(d); });
}