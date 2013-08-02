
Ext.define('StringPatternModel', {
  extend: 'Ext.data.Model',

  fields: [
    { name: 'id', type: 'integer' },
    { name: 'name', type: 'string' },
    { name: 'mains', type: 'integer' },
    { name: 'crosses', type: 'integer' }
  ]
});

Ext.create('Ext.data.Store', {
  model: 'StringPatternModel',
  storeId: 'stringPatternStore',
  proxy: {
    url: '/string_patterns.json',
    type: 'ajax',
    reader: 'json'
  }
});
