/**
 * Created by senthil on 07/09/17.
 */
function enableC3(id, data, xlabel, ylabel) {
    //var colorArray = ['#FF6600', '#EC81B3', '#0D8ECF', '#CD0D74', '#0D52D1', '#999999', '#333333', '#754DEB', '#000000', '#FF0F00']
    //var colorArray = ['#20783F', '#A3FF7F', '#FFD127', '#FFFE4A', '#FF8E0B', '#FFB91A', '#FF5B14', '#FF2014', '#7D2403', '#FF0F00']


    var colorArray = ['#247AC4', '#5ED450', '#F9C02D', '#F1812B', '#CA4FE3', '#4142CD', '#EB3D2A', '#72B0FB', '#5FD77D', '#FEE055']

    var cData = {
        bindto: id,
        animation: true,
        onclick: function (d, element) {
            console.log('element', element)
        },
        data: {
            x: xlabel,
            columns: [
                [xlabel].concat(data['ranges']),
                [ylabel].concat(data['values'])

            ],
            type: 'bar',
            labels: {
                format: function (v, id, i, j) {
                    return v;
                }
            },
            selection: {
                enabled: false
            },
            colors: {

                Students : function (d) {
                    return colorArray[d.index] || '#EC81B3';
                },
                Marks : function (d) {
                    return colorArray[d.index] || '#EC81B3';
                },
               GradePoints : function (d) {
                    return colorArray[d.index] || '#EC81B3';
                }
            }
        },
        axis: {
            x: {
                type: 'category',
                label: {
                    text: xlabel,
                    position: 'outer-center'
                },
                tick: {
                    rotate: xlabel ==  'Subjects' ? -40 : 0,
                    multiline: false
                },
                height: xlabel ==  'Subjects' ? 90 : 0

            },
            y: {
                label: {
                    text: ylabel,
                    position: 'outer-middle'
                },
                tick: {
                    format: function (d) {
                        return  d ? (d).toFixed(2) : null;

                    }
                }
            },

        },
        labels: true,
        legend: {
            show: false
        },
        tooltip: {
            contents: function (d, defaultTitleFormat, defaultValueFormat, color) {
                color = function() {
                    return colorArray[d[0].index] || '#EC81B3';
                };
                return chart.internal.getTooltipContent.call(this, d, defaultTitleFormat, defaultValueFormat, color)
            }
        }
    }

    if(xlabel == 'Exams' ||  xlabel == 'Subjects') {
        cData.bar = {
            width: {
                ratio: xlabel == 'Exams' ||xlabel ==  'Subjects' ? 0.30 : 1// this makes bar width 50% of length between ticks
            }
            // or
            //width: 100 // this makes bar width 100px
        }

    }


    var chart = c3.generate(cData);

    $(".sidebar-control").on('click', function() {
        chart.resize();
    });
}

function disableC3(chart) {
    if(chart != undefined)
        chart.destroy()
}


function enableD3(id , data ,title ) {

    // Pie chart
    // ------------------------------

    // Generate chart
    var pie_chart = c3.generate({
        bindto: id,
        size: { width: 250, height:250 },
        color: {
            pattern: ['#3F51B5', '#FF9800', '#4CAF50', '#00BCD4', '#F44336']
        },

        data: {
            columns: data.ranges
            ,
            type : 'pie'
        },
        pie: {
            label: {
                format: function (value, ratio, id) {
                    return d3.format('')(value);
                }
            }
        },
        title: {
            text: title
        },
        tooltip: {
            format: {
                value: function (value, ratio, id) {
                    var format = id === data.ranges ? d3.format(',') : d3.format('');

                    if(format(value) == -1){
                        return 'AB';
                    } else {
                        return format(value);
                    }


                }
            }
        }

    });

    // Resize chart on sidebar width change
    $(".sidebar-control").on('click', function() {
        pie_chart.resize();

    });
}

function disableD3(pie_chart) {
    if(pie_chart != undefined)
        pie_chart.destroy()
}


