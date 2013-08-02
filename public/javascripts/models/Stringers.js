
Ext.define('StringerModel', {
    extend: 'Ext.data.Model',
    fields: [
      { name: 'id', type: 'integer' },
      { name: 'first_name', type: 'string' },
      { name: 'last_name', type: 'string' },
      { name: 'phone', type: 'integer' },
      { name: 'email', type: 'string' },
      { name: 'full_name', type: 'string' }
    ]
});

Ext.define('CompanyModel', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'id', type: 'integer' },
        'name',
        'address',
        'city',
        'zip'
    ],

    hasMany: { model: 'StringerModel', name: 'users'},

    proxy: {
        type: 'ajax',  //rest
        url : '/users',
        reader: {
            type: 'json',
            root: 'users'
        }
    }
});

Ext.create('Ext.data.Store', {
    model: 'StringerModel',
    storeId: 'stringersStore',
    proxy: {
      url: '/users.json',
      type: 'ajax',
      reader: 'json'
    }
});

Ext.create('Ext.data.TreeStore', {
    model: 'StringerModel',
    storeId: 'stringerTreeViewStore',
    proxy: {
      url: '/users/tree_view.json',
      type: 'ajax',
      reader: 'json'
    }
});
