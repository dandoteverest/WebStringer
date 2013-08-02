Ext.define('RacketManufacturer', {
  extend: 'Ext.data.Model',
  fields: [
    { name: 'id', type: 'integer' },
    { name: 'name', type: 'string' },
    { name: 'url', type: 'string' }
  ]
});

Ext.create('Ext.data.Store', {
  model: 'RacketManufacturer',
  storeId: 'racketManufacturerStore',
  proxy: {
    type: 'ajax',
    url: '/racket_manufacturers/',
    reader: 'json'
  }

});
