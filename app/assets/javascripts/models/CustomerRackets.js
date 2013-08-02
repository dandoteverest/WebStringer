

    Ext.define('CustomerRackets', {
      extend: 'Ext.data.Model',
      fields: [
        { name: 'id', type: 'integer' },
        { name: 'customer_id', type: 'integer' },
        { name: 'tree_id', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'url', type: 'string' },
        { name: 'customer_url', type: 'string' },
        { name: 'current_bill', type: 'integer' },
        { name: 'lastStrungOn', type: 'date' },
        { name: 'selected', type: 'boolean' }
      ]

    });
