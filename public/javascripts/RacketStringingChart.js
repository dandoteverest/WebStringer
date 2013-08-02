
Ext.define('RacketStringingChart', {
    extend: 'Ext.chart.Chart',
    axes: [
        {
            title: 'Stringings',
            type: 'Numeric',
            position: 'left',
            fields: ['temperature'],
            minimum: 0,
            maximum: 100
        },
        {
            title: 'Time',
            type: 'Time',
            position: 'bottom',
            fields: ['date'],
            groupBy: 'hour',
            dateFormat: 'ga'
        }
    ]
});
