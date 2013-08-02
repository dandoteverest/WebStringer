
function _showStringDetails(string) {
  var win = Ext.create('Ext.window.Window', {
    title: "Update String Details",
    modal: true,
    layout: 'fit',
    items: {
      xtype: 'string_details',
      width: 550,
      string: string,
      height: 350,
      anchor: "100%",
      listeners: {
        updated: function() {
          Ext.data.StoreManager.lookup('stringsByManufacturerStore').load();
          win.close();
        },

        updatecanceled: function() {
          win.close();
        },

        updatefailed: function(msg) {
          win.close();
        }
      }
    }
  });

  win.show();
}

function _showUsersOfString(string) {
    var store = Ext.StoreManager.lookup('usersOfStringStore');
    store.load({url: '/tennis_strings/' + string + '/users_of'});
}

Ext.define('StringImageListPanel', {
  extend: 'Ext.panel.Panel',
  alias: 'widget.stringimagelistpanel',
  //layout: 'anchor',
  layout: 'border',
  manufacturer: null,
  autoScroll: true,

  initComponent: function() {
    var me = this;
    this.store = Ext.data.StoreManager.lookup('stringsByManufacturerStore');

    me.store.on('beforeload', function(store) {
      delete store.getProxy().extraParams;
      if (me.manufacturer) {
        store.getProxy().extraParams = {
          manufacturer_id: me.manufacturer.get('id')
        };
      }
    });

    me.store.load();

    Ext.apply(Ext.tip.QuickTipManager.getQuickTip(), {
      showDelay: 500
    });

    var tpl = new Ext.XTemplate(
                  '<tpl for=".">',
                      '<tpl if="this.isNewManufacturer(manufacturer)">',
                        '<br/><div style="clear: both;width: 100%; background: #AAAAAA"><b>{manufacturer}</b></div><br/>',
                      '</tpl>',
                      '<div data-qtip="{[this.getQuickTip(values)]}" ' +
                            'style="width: 200px; margin-bottom: 10px;float: left; padding-bottom: 10px" ' +
                            'ondblclick="_showStringDetails({id})" ' +
                            'onclick="_showUsersOfString({id})" ' +
                            /*'onclick="this.showUsersOf()" ' +*/
                            'class="string-thumb-wrap">',
                        '<p style="text-align:center"><img src="{[this.getImageURL(values)]}" /></p>',
                        '<p style="text-align:center">{name_with_gauge}</p>',
                      '</div>',
                  '</tpl>',
                  {
                    currentManufacturer: null,
                    compiled: true,
                    owner: null,

                    setOwner: function(_owner) {
                        this.owner = _owner;
                    },

                    getOwner: function() {
                        return this.owner;
                    },

                    getImageURL: function(obj) {
                      return obj.string_image_url_small;
                    },

                    showUsersOf: function() {
                      console.log("Showing Details");
                    },

                    showStringDetails: function() {
                        this.owner.showStringDetails(obj.id);
                    },

                    getQuickTip: function(obj) {
                      return "<div><p><b>Manufacturer:</b>&nbsp;" + obj.manufacturer + "</p>" +
                             "<p><b>Name:</b>&nbsp;" + obj.name + "</p>" +
                             "<p><b>Gauge:</b>&nbsp;" + obj.gauge + "&nbsp;mm</p>" +
                             "<p><b>Construction:</b>&nbsp;" + obj.construction + "</p></div>" +
                             "<p style='text-align: center'><b>Double Click to Edit</b></p></div>";
                    },

                    isNewManufacturer: function(manufacturer) {
                      var val = false;
                      if (this.currentManufacturer != manufacturer) {
                        this.currentManufacturer = manufacturer;
                        val = true;
                      }
                      return val;
                    }
                  
                  });
    tpl.setOwner(this);

    this.items = [
        {
            xtype: 'dataview',
            region: 'center',
            itemId: 'stringListView',
            autoScroll: true,
            store: me.store,
            tpl: tpl,
            itemSelector: 'div.thumb-wrap',
            emptyText: 'No images available'
        },
        {
            xtype: 'usersofstring',
            title: 'Customers using this string',
            collapsible: true,
            region: 'east',
            width: 200
        }
    ];

    this.manufuacturerStore = Ext.create('StringManufacturerStore', {});
    this.manufuacturerStore.on('load', function(store) {
        store.insert(0, new StringManufacturer({ id: -1, name: 'All Manufacturers'}));
    }, this, { single: true});

    /*
    Ext.data.StoreManager.lookup('stringManufacturerStore').on('load', function(store) {
      store.insert(0, new StringManufacturer({ id: -1, name: 'All Manufacturers'}));
    }, this, { single: true});
    */

    this.dockedItems = [
      {
        xtype: 'toolbar',
        dock: 'top',
        items: [
          {
            xtype: 'combobox',
            store: me.manufuacturerStore,
            emptyText: "All Manufacturers",
            autoSelect: true,
            autoScroll: true,
            typeAhead: true,
            displayField: 'name',
            valueField: 'id',
            fieldLabel: 'Manufacturer',
            listeners: {
              select: function(combo, records) {
                me.getComponent('stringListView').tpl.currentManufacturer = null;
                me.manufacturer = null;
                if (records[0].get('id') != -1) {
                  me.manufacturer = records[0];
                }
                me.store.load();
              }
            }
          }
        ]
      }
    ];
    this.callParent(arguments);
  },

  setManufacturer: function(manufacturer) {
    me.manufacturer = manufacturer;
  }
});
