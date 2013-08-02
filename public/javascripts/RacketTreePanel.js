

Ext.define('RacketTreePanel', {
  extend: 'Ext.tree.Panel',
  alias: 'widget.rackettreepanel',
  rootVisible: false,
  selectedRacket: null,

  columns: [
    {
      xtype: 'treecolumn',
      flex: 1,
      text: 'Name',
      sortable: true,
      dataIndex: 'name'
    },
    {
      text: 'Headsize',
      sortable: false,
      dataIndex: 'head_size',
      renderer: function(value) {
        if (!value) { // Undefined or 0
          value = ""
        } else {
          value = value + " sq in"
        }
        return value;
      }
    },
  ],

  findSelectedRacket: function(racket) {
    var me = this;
    if (racket.get('selected')) {
      this.selectedRacket = racket;
      return;
    }
    Ext.Array.each(racket.childNodes, function(record) {
      me.findSelectedRacket(record);
      if (me.selectedRacket) {
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
        var store = Ext.data.StoreManager.lookup('racketDetailsStore');
        store.load({url: store.getProxy().url + "/" + id + ".json"});

        store = Ext.StoreManager.lookup('usersOfRacketStore');
        store.load({url: "/rackets/" + id + "/users_of"});
      }
    });

    this.store.on('load', function(store) {
      me.selectedRacket = null;

      me.findSelectedRacket(store.getRootNode());

      if (me.selectedRacket) {
        me.getSelectionModel().select(me.selectedRacket);
      }
    });
  }
});
