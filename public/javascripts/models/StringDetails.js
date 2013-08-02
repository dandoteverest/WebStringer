
  Ext.define('StringDetailsModel', {
    extend: 'Ext.data.Model',
    fields: [
      { name: 'id', type: 'integer' },
      { name: 'manufacturer', type: 'string' },
      { name: 'name', type: 'string' },
      { name: 'name_with_gauge', type: 'string' },
      { name: 'string_manufacturer_id', type: 'integer' },
      { name: 'gauge', type: 'float' },
      { name: 'string_image_url', type: 'string' },
      { name: 'string_image_url_medium', type: 'string' },
      { name: 'string_image_url_small', type: 'string' },
      { name: 'construction', type: 'string' },
      { name: 'string_construction_id', type: 'integer' }
    ]
  });

  Ext.define('StringDetailsStore', {
    extend: 'Ext.data.Store',
    model: 'StringDetailsModel',
    proxy: {
      url: '/tennis_strings',
      type: 'ajax',
      reader: 'json'
    }
  });

  Ext.create('Ext.data.TreeStore', {
    model: 'StringDetailsModel',
    storeId: 'stringDetailsTreeViewStore',
    proxy: {
      url: '/tennis_strings/tree_view.json',
      type: 'ajax',
      reader: 'json'
    }
  });

  Ext.define('StringConstructionModel', {
    extend: 'Ext.data.Model',
    fields: [
      { name: 'id', type: 'integer' },
      { name: 'construction', type: 'string' }
    ]
  });

  Ext.create('Ext.data.Store', {
    model: 'StringDetailsModel',
    storeId: 'stringsByManufacturerStore',
    proxy: {
      url: '/tennis_strings/all_for_manufacturer.json',
      type: 'ajax',
      reader: 'json'
    }
  });

  Ext.create('Ext.data.Store', {
    model: 'StringConstructionModel',
    storeId: 'stringConstructionStore',
    proxy: {
      url: '/string_constructions.json',
      type: 'ajax',
      reader: 'json'
    }
  });

Ext.create('Ext.data.Store', {
  model: 'CustomerDetailsModel',
  storeId: 'usersOfStringStore',
  autoLoad: false,
  proxy: {
    type: 'ajax',
    reader: 'json'
  }
});
