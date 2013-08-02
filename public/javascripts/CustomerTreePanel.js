

Ext.define('CustomerTreePanel', {
  extend: 'Ext.tree.Panel',
  alias: 'widget.customertreepanel',
  title: 'Customers',
  rootVisible: false,
  selectedRacket: null,
  /*,
  selType: 'cellmodel',
  plugins: [
    Ext.create('Ext.grid.plugin.CellEditing', {
      clicksToEdit: 1
    })
  ],
  */

  columns: [
    {
      xtype: 'treecolumn',
      flex: 1,
      text: 'Name',
      sortable: true,
      dataIndex: 'name'
      /*,
      editor: {
        xtype: 'textfield'
      }
      */
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

    this.buttons = [
      {
        text: 'Delete',
        itemId: 'deleteBtn',
        disabled: true,
        handler: function() {
          var item = me.getSelectionModel().getSelection()[0];
          if (item.isLeaf()) {
            Ext.Msg.confirm("Delete", "Delete Racket ' " + item.get('name') +"'?", function(id) {
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
      },
      {
        text: 'Filter',
        menu: {
            xtype: 'menu',
            items: [
                {
                    xtype: 'form',
                    items: [
                        {
                            xtype: 'combobox',
                            itemId: 'customerFilterWhere',
                            displayField: 'name',
                            anchor: '100%',
                            valueField: 'value',
                            store: 'customerFiltersStore',
                            fieldLabel: 'Where'
                        },
                        {
                            xtype: 'combobox',
                            fieldLabel: 'starts with',
                            itemId: 'customerStartsWith',
                            editable: true,
                            flex: 1,
                            enableKeyEvents: true,
                            displayField: 'name',
                            valueField: 'value',
                            store: Ext.create('Ext.data.ArrayStore', {
                                idIndex: 0,
                                editable: true,
                                fields: ['name', 'value'],
                                data: [
                                    [ 'A', 'A' ],
                                    [ 'B', 'B' ],
                                    [ 'C', 'C' ],
                                    [ 'D', 'D' ],
                                    [ 'E', 'E' ],
                                    [ 'F', 'F' ],
                                    [ 'G', 'G' ],
                                    [ 'H', 'H' ],
                                    [ 'I', 'I' ],
                                    [ 'J', 'J' ],
                                    [ 'K', 'K' ],
                                    [ 'L', 'L' ],
                                    [ 'M', 'M' ],
                                    [ 'N', 'N' ],
                                    [ 'O', 'O' ],
                                    [ 'P', 'P' ],
                                    [ 'Q', 'Q' ],
                                    [ 'R', 'R' ],
                                    [ 'S', 'S' ],
                                    [ 'T', 'T' ],
                                    [ 'U', 'U' ],
                                    [ 'V', 'V' ],
                                    [ 'W', 'W' ],
                                    [ 'X', 'X' ],
                                    [ 'Y', 'Y' ],
                                    [ 'Z', 'Z' ]
                                ]
                            }),
                        }
                    ],
                    buttons: [
                        {
                            text: "Cancel"
                        },
                        {
                            text: "Filter",
                            handler: function() {
                                var whereFilter = this.up('form').getComponent('customerFilterWhere');
                                var startsWith = this.up('form').getComponent('customerStartsWith');
                                me.store.load({
                                    params: {
                                        filter_where: whereFilter.getValue(),
                                        starts_with: startsWith.getValue(),
                                    }
                                });
                                var dock = me.getDockedComponent('filterLabelDock');
                                if (!dock) {
                                    me.addDocked({
                                        xtype: 'panel',
                                        itemId: 'filterLabelDock',
                                        bodyCls: "filter-panel",
                                        layout: 'column',
                                        items: [
                                            {
                                                xtype: 'button',
                                                icon: "/images/rejected.png",
                                                columnWidth: '16px',
                                                handler: function() {
                                                    me.store.load();
                                                    me.removeDocked(this.up('#filterLabelDock'), true);
                                                }
                                            },
                                            {
                                                xtype: 'label',
                                                html: "<div style='text-align: center'>Filtered By:</div>",
                                                columnWidth: .2
                                            },
                                            {
                                                xtype: 'label',
                                                html: whereFilter.getPicker().getSelectionModel().getLastSelected().get('name') + " starts with <b>" + startsWith.getValue() + "</b>",
                                                columnWidth: .7
                                            }
                                        ],
                                        dock: 'top'
                                    });
                                } else {
                                }
                            }
                        }
                    ]
                }
            ]
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
