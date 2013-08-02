
Ext.define('CustomerTreeStore', {
  extend : 'Ext.data.TreeStore',
  model: 'CustomerRackets',
  proxy: {
    type: 'ajax',
    url: '<%= load_customer_rackets_customers_path %>',
    reader: {
      type: 'json'
    }
  }
});


Ext.define('CustomerDetailsModel', {
  extend: 'Ext.data.Model',
  fields: [
    { name: 'id', type: 'integer' },
    { name: 'url', type: 'string' },
    { name: 'first_name', type: 'string' },
    { name: 'last_name', type: 'string' },
    { name: 'email', type: 'string' },
    { name: 'home_phone', type: 'string' },
    { name: 'cell_phone', type: 'string' },
    { name: 'racket_id', type: 'integer' },
    { name: 'current_bill', type: 'number' }
  ]
});

Ext.create('Ext.data.Store', {
  model: 'CustomerDetailsModel',
  storeId: 'customerDetailsStore',
  proxy: {
    url: '<%= customers_path %>',
    type: 'ajax',
    reader: 'json'
  }
});

Ext.define('CustomerFilterModel', {
    extend: 'Ext.data.Model',
    fields: [
        'name',
        'value'
    ]
});

Ext.create('Ext.data.Store', {
    model: 'CustomerFilterModel',
    storeId: 'customerFiltersStore',
    proxy: {
        url: '/customer_filters',
        type: 'ajax',
        reader: 'json'
    }
});
