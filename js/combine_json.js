function combineData(error, mapData, statData) {
    var provinceName = mapData.features.map(d => d.properties.CHA_NE)
    var count = 0
    for (var i = 0; i < provinceName.length; i++) {
        var findMatch = false;

        // Convert Camelcase to space separate
        var convert = provinceName[i].replace(/([A-Z])/g, ' $1')
            .replace(/^./, function(str) { return str.toUpperCase(); });

        // Special case
        if (_.includes(provinceName[i], 'Phang-nga')) {
            convert = 'Phangnga'
        }

        if (_.includes(provinceName[i], 'Phatthalung')) {
            convert = 'Phattalung'
        }

        for (var j = 0; j < statData.length; j++) {

            if (_.includes(convert, statData[j].province)) {
                console.log(provinceName[i], statData[j].province);
                mapData.features[i].properties.income = [parseInt(statData[j].i1998),
                    parseInt(statData[j].i2000),
                    parseInt(statData[j].i2002),
                    parseInt(statData[j].i2004),
                    parseInt(statData[j].i2006),
                    parseInt(statData[j].i2007),
                    parseInt(statData[j].i2009),
                    parseInt(statData[j].i2011),
                    parseInt(statData[j].i2013),
                    parseInt(statData[j].i2015)
                ]
                mapData.features[i].properties.debt = [parseInt(statData[j].d1998),
                    parseInt(statData[j].d2000),
                    parseInt(statData[j].d2002),
                    parseInt(statData[j].d2004),
                    parseInt(statData[j].d2006),
                    parseInt(statData[j].d2007),
                    parseInt(statData[j].d2009),
                    parseInt(statData[j].d2011),
                    parseInt(statData[j].d2013),
                    parseInt(statData[j].d2015)
                ]
                mapData.features[i].properties.thai_name = statData[j].thai_name
                mapData.features[i].properties.CHA_NE = statData[j].province
                findMatch = true;
                count++;
            }
        }
        if (!findMatch) {
            console.log('=======', provinceName[i]);
        }
    }

    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(mapData));
    var dlAnchorElem = document.getElementById('downloadAnchorElem');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "thai_income.json");
    dlAnchorElem.click();
}
// Add <a id="downloadAnchorElem" style="display:none"></a> to HTML
d3.queue()
    .defer(d3.json, 'thailand.json')
    .defer(d3.csv, 'thai_income.csv')
    .await(combineData)