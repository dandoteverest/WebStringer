Ext.define('USState', {
    extend: 'Ext.data.Model',
    fields: [
        'label',
        'value'
    ]
});


Ext.create('Ext.data.Store', {
    storeId: 'usStatesStore',
    model: 'USState',
    proxy: {
        type: 'ajax',
        url: '/us-states.xml',
        reader: {
            type: 'xml',
            record: 'item'
        }
    }
});
