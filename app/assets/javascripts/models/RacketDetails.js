
Ext.define('RacketDetailsModel', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'id', type: 'integer' },
        { name: 'manufacturer', type: 'string' },
        { name: 'full_name', type: 'string' },
        { name: 'racket_manufacturer_id', type: 'integer' },
        { name: 'model', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'head_size', type: 'integer' },
        { name: 'racket_image_url', type: 'string' },
        { name: 'racket_image_url_medium', type: 'string' },
        { name: 'racket_image_url_small', type: 'string' },
        { name: 'pattern', type: 'string' },
        { name: 'string_pattern_id', type: 'integer' }
    ]
});

Ext.define('StringingHistory', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'id', type: 'integer' },
        { name: 'strung_on', type: 'date' },
        { name: 'strung_by', type: 'string' },
        { name: 'string_name', type: 'string' },
        { name: 'tension', type: 'string' },
        { name: 'is_two_piece', type: 'bool' },
        { name: 'cost', type: 'float' },
        { name: 'customer_racket_id', type: 'integer' },
        { name: 'notes', type: 'string' },
        { name: 'payment_received', type: 'bool' }
    ],

    proxy: {
        type: 'rest',
        url: '/racket_stringings'
    }
});

Ext.create('Ext.data.TreeStore', {
    model: 'RacketDetailsModel',
    storeId: 'racketDetailsTreeViewStore',
    proxy: {
        url: '/rackets/tree_view.json',
        type: 'ajax',
        reader: 'json'
    }
});

Ext.define('CustomerRacketDetails', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'id', type: 'integer' },
        { name: 'grip', type: 'string' },
        { name: 'notes', type: 'string' }
    ],

    hasMany: [
        { name: 'customers', model: 'CustomerDetailsModel' },
        { name: 'rackets', model: 'RacketDetailsModel' },
        { name: 'racket_stringings', model: 'StringingHistory' }
    ]
});

Ext.define('RacquetStore', {
    extend: 'Ext.data.Store',
    model: 'RacketDetailsModel',
    proxy: {
        url: '/rackets/all_for_manufacturer.json',
        type: 'ajax',
        reader: {
            type: 'json',
            root: 'racquets',
            totalProperty: 'totalCount'
        }
    }
});

Ext.create('RacquetStore', {
    storeId: 'racketsByManufacturerStore'
});
/*
Ext.create('Ext.data.Store', {
    model: 'RacketDetailsModel',
    storeId: 'racketsByManufacturerStore',
    proxy: {
        url: '/rackets/all_for_manufacturer.json',
        type: 'ajax',
        reader: {
            type: 'json',
            root: 'racquets',
            totalProperty: 'totalCount'
        }
    }
});
*/

Ext.create('Ext.data.Store', {
    model: 'RacketDetailsModel',
    storeId: 'racketDetailsStore',
    proxy: {
        url: '/rackets/',
        type: 'ajax',
        reader: 'json'
    }
});

Ext.create('Ext.data.Store', {
    model: 'RacketDetailsModel',
    storeId: 'racketsStore',
    proxy: {
        url: '/rackets.json',
        type: 'ajax',
        reader: 'json'
    }
});

Ext.create('Ext.data.Store', {
    model: 'CustomerRacketDetails',
    storeId: 'racketStringingDetailsStore',
    proxy: {
        type: 'ajax',
        reader: 'json'
    }
});


Ext.define('HTMLPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'htmlpanel',
    layout: 'fit',
    border: false,
    elementId: null,

    initEvents: function() {
        this.addEvents('click');
        this.on('click', this._onClick, this);
    },

    onRender: function() {
        var me = this;
        this.callParent(arguments);
        this.getEl(this.elementId).on('click', function() {
            me.fireEvent('click');
        });
    },

    _onClick: function() {
        if (Ext.isDefined(this.onClick)) {
            this.onClick();
        }
    }
});

Ext.create('Ext.data.Store', {
    model: 'CustomerDetailsModel',
    storeId: 'usersOfRacketStore',
    autoLoad: false,
    proxy: {
        type: 'ajax',
        reader: 'json'
    }
});
