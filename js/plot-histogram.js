function plotIncome(income) {
    d3.select("#histogram-income").selectAll("*").remove()
    histogram("#histogram-income", income, colorIncome);
}

function plotDebt(debt) {
    d3.select("#histogram-debt").selectAll("*").remove()
    histogram("#histogram-debt", debt, colorDebt);
}

function histogram(canvas, values, color) {
    var margin = {
        top: 20,
        right: 120,
        bottom: 0,
        left: 20
    };

    var width = 400 - margin.left - margin.right
    height = 300 - margin.top - margin.bottom;

    var xMax = d3.max(values);
    var xMin = d3.min(values);

    if (xMin == 0 && xMax == 0) {
        xMin = 0;
        xMax = 10;
    }

    var x = d3.scale.linear()
        .domain([xMin, xMax])
        .range([0, width]);

    var formatCount = d3.format(",0f");

    var data = d3.layout.histogram()
        .bins(x.ticks(20))
        (values);

    var yMax = d3.max(data, function(d) { return d.length });

    var yMin = d3.min(data, function(d) { return d.length });

    var y = d3.scale.linear()
        .domain([0, yMax])
        .range([width, 0]);

    var xAxis = d3.svg.axis()
        .orient('left')
        .scale(x);

    var svg = d3.select(canvas)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var grid = d3.range(9).map(function(i) {
        return { 'x1': 0, 'y1': -10, 'x2': 0, 'y2': 250 };
    });

    var grids = svg.append('g')
        .attr('id', 'grid')
        .attr('transform', 'translate(150,10)')
        .selectAll('line')
        .data(grid)
        .enter()
        .append('line')
        .attr({
            'x1': function(d, i) { return i * 30 - 65; },
            'y1': function(d) { return d.y1; },
            'x2': function(d, i) { return i * 30 - 65; },
            'y2': function(d) { return d.y2; },
        })
        .style({ 'stroke': '#adadad', 'stroke-width': '1px' });

    var bar = svg.selectAll(".bar")
        .data(data)
        .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) { return "translate(" + 55 + "," + x(d.x) + ")"; });

    bar.append("rect")
        .attr("x", 1)
        .attr("height", (x(data[0].dx) - x(0)) - 1)
        .attr("width", function(d) { return 20; })
        .attr("fill", function(d) { return color(d.x) });

    bar.selectAll("rect").transition().duration(700).attr("width", function(d) { return width - y(d.y); });


    bar.append("text")
        .attr("dy", ".75em")
        .attr("y", 1)
        .attr("x", 20)
        .attr("text-anchor", "middle")
        .text(function(d) { return formatCount(d.y); });

    bar.selectAll("text").transition().duration(700).attr("x", function(d) { return width - y(d.y) + 10; })

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + 55 + ", 0)")
        .call(xAxis);

}