
function _showRacketDetails(racket) {
  var store = Ext.data.StoreManager.lookup('racketDetailsStore');
  var win = Ext.create('Ext.window.Window', {
    title: "Update Racquet Details",
    modal: true,
    layout: 'fit',
    items: {
      xtype: 'racket_details',
      width: 550,
      height: 350,
      anchor: "100%",
      listeners: {
        updated: function() {
          Ext.data.StoreManager.lookup('racketsByManufacturerStore').load();
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
  store.load({url: store.getProxy().url + "/" + racket + ".json"});

  win.show();
}

function _showUsersOfRacquet(racket) {
    var store = Ext.StoreManager.lookup('usersOfRacketStore');
    store.load({url: '/rackets/' + racket + '/users_of'});
}

Ext.define('RacketImageListPanel', {
  extend: 'Ext.panel.Panel',
  alias: 'widget.racketimagelistpanel',
  layout: 'border',
  manufacturer: null,
  autoScroll: true,

  initComponent: function() {
    var me = this;

    var tpl = new Ext.XTemplate(
                  '<tpl for=".">',
                      '<tpl if="this.isNewManufacturer(manufacturer)">',
                        '<br/><div style="clear: both;width: 100%; background: #AAAAAA"><b>{manufacturer}</b></div><br/>',
                      '</tpl>',
                      '<div data-qtip="{[this.getQuickTip(values)]}" ' +
                            'style="width: 200px; margin-bottom: 10px;float: left; padding-bottom: 10px" ' +
                            'ondblclick="_showRacketDetails({id})" ' +
                            'onclick="_showUsersOfRacquet({id})" ' +
                            'class="racket-thumb-wrap">',
                        '<p style="text-align:center"><img src="{[this.getImageURL(values)]}" /></p>',
                        '<p style="text-align:center">{model}</p>',
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
                      return obj.racket_image_url_small;
                    },

                    showUsersOf: function() {
                      console.log("Showing Details");
                    },

                    showRacketDetails: function() {
                        this.owner.showRacketDetails(obj.id);
                    },

                    getQuickTip: function(obj) {
                      return "<div><p><b>Manufacturer:</b>&nbsp;" + obj.manufacturer + "</p>" +
                             "<p><b>Model:</b>&nbsp;" + obj.model + "</p>" +
                             "<p><b>Head Size:</b>&nbsp;" + obj.head_size + "&nbsp;sq in</p>" +
                             "<p><b>String Pattern:</b>&nbsp;" + obj.pattern + "</p></div>" +
                             "<p style='text-align: center'><b>Double Click to Edit</b></p></div>";
                    },

                    isNewManufacturer: function(manufacturer) {
                      var val = false;
                      if (this.currentManufacturer != manufacturer) {
                        this.currentManufacturer = manufacturer;
                        val = true;
                      }
                      return val;
                    },

                    clearManufacturer: function() {
                        this.currentManufacturer = null;
                    }
                  
                  });
    tpl.setOwner(this);

    this.racquetsStore = Ext.data.StoreManager.lookup('racketsByManufacturerStore');

    me.racquetsStore.pageSize = 25;

    me.racquetsStore.on('beforeload', function(store) {
      tpl.clearManufacturer();
      delete store.getProxy().extraParams;
      if (me.manufacturer) {
        store.getProxy().extraParams = {
          manufacturer_id: me.manufacturer.get('id')
        };
      }
    });

    me.racquetsStore.load();

    Ext.apply(Ext.tip.QuickTipManager.getQuickTip(), {
      showDelay: 500
    });

    this.items = [
        {
            xtype: 'dataview',
            region: 'center',
            itemId: 'racketListView',
            autoScroll: true,
            store: me.racquetsStore,
            tpl: tpl,
            itemSelector: 'div.thumb-wrap',
            emptyText: 'No images available'
        },
        {
            xtype: 'usersofracket',
            title: 'Customers using this racquet',
            collapsible: true,
            region: 'east',
            width: 200
        }
    ];

    me.racquetManufacturerStore = Ext.create('RacketManufacturerStore', {});
    me.racquetManufacturerStore.on('load', function(store) {
      store.insert(0, new RacketManufacturer({ id: -1, name: 'All Manufacturers'}));
    }, this);
    me.racquetManufacturerStore.load();

    this.dockedItems = [
    {
        xtype: 'toolbar',
        dock: 'top',
        items: [
          {
            xtype: 'combobox',
            store: me.racquetManufacturerStore,
            emptyText: "All Manufacturers",
            autoSelect: true,
            autoScroll: true,
            typeAhead: true,
            displayField: 'name',
            valueField: 'id',
            fieldLabel: 'Manufacturer',
            listeners: {
              select: function(combo, records) {
                me.getComponent('racketListView').tpl.currentManufacturer = null;
                me.manufacturer = null;
                if (records[0].get('id') != -1) {
                  me.manufacturer = records[0];
                }
                me.racquetsStore.load();
              }
            }
          }
        ]
    }, {
        xtype: 'pagingtoolbar',
        store: me.racquetsStore,
        dock: 'bottom',
        displayInfo: true
    }];

    this.callParent(arguments);
  },

  setManufacturer: function(manufacturer) {
    me.manufacturer = manufacturer;
  }
});
