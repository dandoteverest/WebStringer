
Ext.define('RacketStringingsModel', {
  extend: 'Ext.data.Model',
  fields: [
    { name: 'id', type: 'integer' },
    { name: 'customer_racket_id', type: 'integer' },
    { name: 'main_string_id', type: 'integer' },
    { name: 'main_string', type: 'integer', mapping: 'main_string_id' },
    { name: 'main_tension', type: 'integer' },
    { name: 'cross_string_id', type: 'integer', useNull: true },
    { name: 'cross_string', type: 'integer', mapping: 'cross_string_id' },
    { name: 'cross_tension', type: 'integer', useNull: true },
    { name: 'strung_on', type: 'date' },
    { name: 'user_id', type: 'integer' },
    { name: 'requested_by', type: 'date' },
    { name: 'dropped_off', type: 'date' },
    { name: 'is_late', type: 'bool' },
    { name: 'string_name', type: 'string' },
    { name: 'is_two_piece', type: 'bool' },
    { name: 'tension', type: 'string' },
    { name: 'cost', type: 'float' },
    { name: 'notes', type: 'string' },
    { name: 'payment_received', type: 'bool' }
  ],
  hasMany: [
    { name: 'customers', model: 'CustomerDetailsModel' },
  ]
});

Ext.create('Ext.data.Store', {
  storeId: 'racketQueueStore',
  model: 'RacketStringingsModel',
  pageSize: 3,
  proxy: {
    type: 'ajax',
    url: '/racket_stringings/queue',
    reader: {
      type: 'json',
      root: 'racket_stringings',
      totalProperty: 'totalCount'
    }
  }
});

Ext.create('Ext.data.Store', {
  storeId: 'racquetStringingsStore',
  model: 'RacketStringingsModel',
  proxy: {
    type: 'ajax',
    url: '/racket_stringings/',
    reader: {
      type: 'json'
    }
  }
});
