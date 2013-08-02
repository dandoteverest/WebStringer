
  Ext.define('GripSizeModel', {
    extend: 'Ext.data.Model',
    fields: [
      { name: 'id', type: 'integer' },
      { name: 'size', type: 'integer' },
      { name: 'name', type: 'string' }
    ]
  });

  Ext.create('Ext.data.Store', {
    model: 'GripSizeModel',
    storeId: 'gripsSizesStore',
    proxy: {
      url: '/grip_sizes.json',
      type: 'ajax',
      reader: 'json'
    }
  });
