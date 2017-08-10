function getMaxIncome() {
    d3.select('#dynamic-table-income').selectAll('*').remove()
    var info = sortedIncome.map(function(d, i) {
        return {"rank": i + 1, 
                "thai_name": thaiNameFn(d),
                "income": numberWithCommas(incomeFn(d))};
    })
    var column = ['rank', 'thai_name', 'income']
    var header = ['#', 'จังหวัด', 'รายได้เฉลี่ย (บาท)'];
    createDynamicTable('#dynamic-table-income', info, column, header);
}

function getMinIncome() {
    d3.select('#dynamic-table').selectAll('*').remove()
    var info = sortedIncome.reverse().map(function(d, i) {
        return {"rank": i + 1, 
                "thai_name": thaiNameFn(d),
                "income": numberWithCommas(incomeFn(d))};
    })
    var column = ['rank', 'thai_name', 'income']
    var header = ['#', 'จังหวัด', 'รายได้เฉลี่ย (บาท)'];
    createDynamicTable('#dynamic-table-income', info, column, header);
    sortedIncome.reverse();
}

function getMaxDebt() {
    d3.select('#dynamic-table-debt').selectAll('*').remove()
    var info = sortedDebt.map(function(d, i) {
        return {"rank": i + 1, 
                "thai_name": thaiNameFn(d),
                "debt": numberWithCommas(debtFn(d))};
    })
    var column = ['rank', 'thai_name', 'debt']
    var header = ['#', 'จังหวัด', 'หนี้สิน (บาท)'];
    createDynamicTable('#dynamic-table-debt', info, column, header);
}

function getMinDebt() {
    d3.select('#dynamic-table-debt').selectAll('*').remove()
    var info = sortedDebt.reverse().map(function(d, i) {
        return {"rank": i + 1, 
                "thai_name": thaiNameFn(d),
                "debt": numberWithCommas(debtFn(d))};
    })
    var column = ['rank', 'thai_name', 'debt']
    var header = ['#', 'จังหวัด', 'หนี้สิน (บาท)'];
    createDynamicTable('#dynamic-table-debt', info, column, header);
    sortedDebt.reverse();
}

function createDynamicTable(label, data, columns, header) {
    d3.select(label).selectAll('table').remove()
    var table = d3.select(label).append('table')
        .style("width", "100%")
        .attr("class", "table");
    var thead = table.append('thead')

    var tbody = table.append('tbody')

    thead.append('tr')
        .selectAll('th')
        .style("padding-top", 10)
        .style("padding-left", 2)
        .style("text-align", "center")
        .data(header).enter()
        .append('th')
        .style("padding-top", 10)
        .style("padding-left", 2)
        .style("text-align", "center")
        .text(function(column) { return column; });

    // create a row for each object in the data
    var rows = tbody.selectAll('tr')
        .data(data)
        .enter()
        .append('tr')
        .attr("id", "new_row")
        .style("padding-top", 10)
        .style("padding-left", 2)
        .style("text-align", "center")
        .on("mouseover", function(d) {
            d3.select(this)
                .style('background-color', "#f2f2f2");
        })
        .on("mouseout", function(d) {
            d3.select(this)
                .style('background-color', "white");

        });

    // create a cell in each row for each column
    var cells = rows.selectAll('td')
        .attr("id", "new_cell")
        .style("padding-top", 10)
        .style("padding-left", 2)
        .style("text-align", "center")
        .data(function(row) {
            return columns.map(function(column) {
                return { column: column, value: row[column] };
            });
        })
        .enter()
        .append('td')
        .attr("id", "new_cell")
        .style("padding-top", 15)
        .style("padding-left", 2)
        .style("text-align", "center")
        .text(function(d) {
            return d.value;
        });
}