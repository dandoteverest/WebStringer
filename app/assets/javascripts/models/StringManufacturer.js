Ext.define('StringManufacturer', {
  extend: 'Ext.data.Model',
  fields: [
    { name: 'id', type: 'integer' },
    { name: 'name', type: 'string' },
    { name: 'url', type: 'string' }
  ]
});

Ext.define('StringManufacturerStore', {
    extend: 'Ext.data.Store',
    model: 'StringManufacturer',
    proxy: {
        type: 'ajax',
        url: '/string_manufacturers/',
        reader: 'json'
    }
});
