

Ext.define('CustomerTreePanel', {
  extend: 'Ext.tree.Panel',
  alias: 'widget.customertreepanel',
  title: 'Customers',
  rootVisible: false,
  selectedRacket: null,

  columns: [
    {
      xtype: 'treecolumn',
      flex: 1,
      text: 'Name',
      sortable: true,
      dataIndex: 'name',
      renderer: function(value, styles, object) {
        if (object.get('leaf') === true) {
            return "<span data-qtip='Select to view details'>" + value + "</span>";
        } else {
            return "<span data-qtip='Expand to view racquets'>" + value + "</span>";
        }
      }
    },
    {
      text: 'Last Strung On',
      sortable: false,
      dataIndex: 'lastStrungOn',
      renderer: function(value) {
        if (value) {
          value = Ext.Date.format(value, 'M d, Y');
        }
        return value;
      }
    },
    {
      text: 'Balance',
      sortable: false,
      width: 75,
      dataIndex: 'current_bill',
      renderer: function(value, styles, object) {
        if (value > 0) {
          if (object.get('leaf') == true) {
            return "<p style='text-align: right; margin-right: 5px'>" + Ext.util.Format.usMoney(value) + "</p>";
          } else {
            return "<p style='color: red; text-align: left'>" + Ext.util.Format.usMoney(value) + "</p>";
          }
        }
      }
    }
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

    this.tbar = [{
        xtype: 'label',
        text: 'Search:'
    }, {
        xtype: 'textfield',
        emptyText: 'Last, First',
        listeners: {
            specialkey: function(field, e){
                if (e.getKey() == e.ENTER) {
                    me.store.load({
                        params: {filter: field.getValue()}
                    });
                }
            }
        }
    }, {
        xtype: 'button',
        icon: '/images/search.png',
        tooltip: 'Search',
        handler: function() {
            me.store.load({
                params: {filter: me.down('textfield').getValue()}
            });
        }
    }];

    this.buttons = [
      {
        text: 'Delete',
        itemId: 'deleteBtn',
        disabled: true,
        handler: function() {
          var item = me.getSelectionModel().getSelection()[0];
          if (item.isLeaf()) {
            Ext.Msg.confirm("Delete", "Delete Racquet ' " + item.get('name') +"'?", function(id) {
              if (id == 'yes') {
                me.deleteCustomerRacket(item);
              }
            });
          } else {
            Ext.Msg.confirm("Delete", "Delete Customer ' " + item.get('name') +"'?", function(id) {
              if (id == 'yes') {
                me.deleteCustomer(item);
              }
            });
          }
        }
      }
    ];

    this.callParent(arguments);

    this.on('selectionchange', function(obj, selections, options) {
      me.down('#deleteBtn').setDisabled(selections.length == 0);
      Ext.ComponentQuery.query('#addCustomerRacketMenuItem')[0].setDisabled(false);
    });

    this.store.on('load', function(store) {
      me.selectedRacket = null;

      me.findSelectedRacket(store.getRootNode());

      if (me.selectedRacket) {
        me.selectPath(me.selectedRacket.getPath('tree_id'), 'tree_id');
      }
    });
  },

    onRender: function() {
        var me = this;

        this.callParent(arguments);
        Ext.ComponentQuery.query('#racketQueue').first().on('itemselected', function(queue, stringing) {
            var node = me.store.getNodeById(stringing.get('customer_racket_id'))
            me.selectPath(node.getPath('tree_id'), 'tree_id');
        });
    },

    deleteCustomer: function(customer) {
        var me = this;
        Ext.Ajax.request({
            url: "/customers/" + customer.get('customer_id'),
            method: "DELETE",
            success: function() {
                customer.remove();
                me.view.refresh();
            }
        });
    },

    deleteCustomerRacket: function(racket) {
        var me = this;
        var parentId = racket.parentNode.get('tree_id');
        Ext.Ajax.request({
            url: "/customer_rackets/" + racket.get('id'),
            method: "DELETE",
            success: function() {
                me.store.load({
                    callback: function(records) {
                        var parentNode;
                        Ext.Array.each(records, function(record) {
                            if (record.get('tree_id') == parentId) {
                                parentNode = record;
                                return false;
                            }
                        });
                        var node = parentNode;
                        if (parentNode.hasChildNodes()) {
                            node = parentNode.childNodes.first();
                        }
                        me.selectPath(node.getPath('tree_id'), 'tree_id');
                    }
                });
            }
        });
    }
});
