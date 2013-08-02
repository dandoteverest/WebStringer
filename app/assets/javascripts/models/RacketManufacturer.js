Ext.define('RacketManufacturer', {
  extend: 'Ext.data.Model',
  fields: [
    { name: 'id', type: 'integer' },
    { name: 'name', type: 'string' },
    { name: 'url', type: 'string' }
  ]
});

Ext.define('RacketManufacturerStore', {
    extend: 'Ext.data.Store',
    model: 'RacketManufacturer',
    proxy: {
        type: 'ajax',
        url: '/racket_manufacturers/',
        reader: 'json'
    }
});
