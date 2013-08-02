

Ext.define('TennisStringTreePanel', {
  extend: 'Ext.tree.Panel',
  alias: 'widget.tennisstringtreepanel',
  rootVisible: false,
  selectedString: null,

  columns: [
    {
      xtype: 'treecolumn',
      flex: 1,
      text: 'Name',
      sortable: true,
      dataIndex: 'name'
    },
    {
      text: 'Gauge',
      sortable: false,
      dataIndex: 'gauge',
      renderer: function(value) {
        if (!value) { // Undefined or 0
          value = ""
        } else {
          value = Ext.util.Format.number(value, '0.00');
        }
        return value;
      }
    },
  ],

  buttons: [
    {
      text: 'New Manufacturer',
      handler: function() {
        Ext.create('Ext.window.Window', {
          layout: 'fit',
          border: false,
          width: 350,
          items: [
            {
              xtype: 'form',
              border: false,
              url: "/string_manufacturers/new",
              items: [
              {
                xtype: "panel",
                layout: "anchor",
                padding: "5 5 5 5",
                items: [
                {
                  xtype: 'textfield',
                  fieldLabel: 'Manufacturer Name',
                  labelWidth: 150,
                  name: 'string_manufacturer[name]',
                  anchor: '100%'
                },
                {
                  xtype: 'textfield',
                  fieldLabel: 'Manufacturer URL',
                  name: 'string_manufacturer[url]',
                  labelWidth: 150,
                  anchor: '100%'
                }]
              }],

              buttons: [
                {
                  text: 'Ok',
                  handler: function() {
                    var window = this.up('window');
                    var form = this.up('form').getForm();
                    if (form.isValid()) {
                      form.submit({
                        success: function() {
                          window.close();
                        }
                      });
                    }
                  }
                },
                {
                  text: 'Cancel',
                  handler: function() {
                    this.up('window').close();
                  }
                }
              ]
            }
          ]
        }).show();
      }
    },
    {
      text: 'Add String',
      itemId: 'addTennisStringBtn',
      disabled: true,
      handler: function() {
      }
    }
  ],

  findSelectedString: function(racket) {
    var me = this;
    if (racket.get('selected')) {
      this.selectedString = racket;
      return;
    }
    Ext.Array.each(racket.childNodes, function(record) {
      me.findSelectedString(record);
      if (me.selectedString) {
        return false;
      }
    });
  },

  initComponent: function() {
    var me = this;
    this.callParent(arguments);

    this.on('selectionchange', function(obj, selections, options) {
      if (selections.length != 1) {
        return;
      }
      if (selections[0].isLeaf() == true) {
        var id = selections[0].get('id');
        var store = Ext.data.StoreManager.lookup('stringDetailsStore');
        store.load({url: store.getProxy().url + "/" + id + ".json"});

        store = Ext.StoreManager.lookup('usersOfStringStore');
        store.load({url: "/tennis_strings/" + id + "/users_of"});
      }
      me.query('#addTennisStringBtn')[0].setDisabled(false);
    });

    this.store.on('load', function(store) {
      me.selectedString = null;

      me.findSelectedString(store.getRootNode());

      if (me.selectedString) {
        me.getSelectionModel().select(me.selectedString);
      }
    });
  },

  onRender: function() {
    var me = this;

    this.callParent(arguments);
    Ext.ComponentQuery.query('#racketQueue').first().on('itemselected', function(queue, stringing) {
      document.location = "/customers?customer_id=" + stringing.get('customer_id') + "&racket_id=" + stringing.get('customer_racket_id')
    });
  }
});
