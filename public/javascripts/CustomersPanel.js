Ext.define('CustomersPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.customerspanel',
    layout: 'fit',
    autoscroll: true,
    border: false,

    initComponent: function() {
        var me = this;
        var store = Ext.create('Ext.data.TreeStore', {
            model: 'CustomerRackets',
            sorters: [{
                property: 'name',
                direction: 'ASC'
            }],
            proxy: {
              type: 'ajax',
              url: '/customers/load_customer_rackets',
              /*
              extraParams: {
                selected_customer_id: <%= @selected_customer.nil? ? -1 : @selected_customer.id %>,
                selected_racket_id: <%= @selected_racket.nil? ? -1 : @selected_racket.id %>
              },
              */
              reader: {
                type: 'json'
              }
            },
            listeners: {
                beforeload: function() {
                    me.showLoadMask(this);
                },
                load: function() {
                    me.loadMask.hide();
                }
            }
        });


        this.items = [
        {
            xtype: 'panel',
            layout: 'border',
            itemId: 'mainPanel',
            items: [
            {
                resizable: true,
                border: false,
                region: 'west',
                width: 400,
                xtype: 'customertreepanel',
                itemId: 'customerTreePanel',
                store: store,
                listeners: {
                  selectionchange: function(obj, selections, opts) {
                        if (selections.length != 1) {
                          return;
                        }
                        var detailsStore;
                        if (selections[0].isLeaf() == false) {
                          detailsStore = Ext.data.StoreManager.lookup('customerDetailsStore');
                          this.up('panel').getComponent('cardPanel').getLayout().setActiveItem(0);
                        } else {
                          detailsStore = Ext.data.StoreManager.lookup('racketStringingDetailsStore');
                          this.up('panel').getComponent('cardPanel').getLayout().setActiveItem(1);
                        }
                        detailsStore.load({ url: selections[0].get('url') });
                  },
                  viewready: function(view) {
                      var addPanelMenuItem = Ext.ComponentQuery.query('#addCustomerRacketMenuItem').first();
                      if (addPanelMenuItem) {
                          addPanelMenuItem.on('click', function() {
                              var addPanel = Ext.ComponentQuery.query('#addCustomerRacketDialog').first();
                              addPanel.on('customerracketadded', function(panel, racquet) {
                                  var parentNode = view.store.getRootNode().findChildBy(function(node) {
                                      return node.get('customer_id') == racquet.get('customer_id');
                                  });
                                  if (parentNode) {
                                      parentNode.appendChild(parentNode.createNode(racquet));
                                  }
                                  view.store.sort();
                              });
                          });
                      }
                      var newCustomerMenuItem = Ext.ComponentQuery.query('#newCustomerMenuItem').first();
                      if (newCustomerMenuItem) {
                          newCustomerMenuItem.on('click', function() {
                              var newPanel = Ext.ComponentQuery.query('#newCustomerDialog').first();
                              newPanel.on('customeradded', function(panel, customer) {
                                  var rootNode = view.store.getRootNode();
                                  rootNode.appendChild(rootNode.createNode(customer));
                                  view.store.sort();
                              });
                          });
                      }
                  }
                }
              }, {
                region: 'center',
                xtype: 'panel',
                itemId: 'cardPanel',
                layout: 'card',
                border: false,
                items: [
                  {
                    title: 'Customer Details',
                    xtype: 'panel',
                    layout: 'anchor',
                    border: false,
                    items: [
                      {
                        xtype: 'customer_details',
                        border: false
                      }
                    ]
                  },
                  {
                    xtype: 'tabpanel',
                    border: false,
                    items: [
                      {
                        title: 'Racket Details',
                        xtype: 'customer_racket_details'
                      },
                      {
                        title: 'Stringing History',
                        xtype: 'stringing_history',
                        listeners: {
                          racketstringingupdated: function(panel, grid, record) {
                              //me.loadMask.show();
                              var tree = Ext.ComponentQuery.query('#customerTreePanel')[0];
                              var child = tree.getRootNode().findChild('tree_id', "racket_" + record.get('customer_racket_id'), true);
                              var cost = record.get('cost');
                              if (record.get('payment_received') === true) {
                                  child.set('current_bill', 0);
                                  child.parentNode.set('current_bill', child.parentNode.get('current_bill') - cost);
                              } else {
                                  child.set('current_bill', cost);
                                  child.parentNode.set('current_bill', child.parentNode.get('current_bill') + cost);
                              }
                              tree.view.refresh();
                              /*
                              store.load({
                                  callback: function() {
                                      var child = tree.getRootNode().findChild('tree_id', "racket_" + record.get('customer_racket_id'), true);
                                      tree.selectPath(child.getPath('tree_id'), 'tree_id');
                                      me.loadMask.hide();
                                  }
                              });
                              */
                          }
                        }
                      }
                    ]
                  }
                ]
            }]
        }];
        this.callParent(arguments);
        this.tree = this.down('#customerTreePanel');
        this.loadMask = new Ext.LoadMask(this, {msg: "Loading..."});
    },

    showLoadMask: function(store) {
        var me = this;
        if (!this.rendered) {
            this.on('render', function() {
                if (store.isLoading()) {
                    me.loadMask.show();
                }
            });
        } else {
            me.loadMask.show();
        }
    },

    hideloadMask: function() {
    },

    selectCustomer: function(customer) {
    },

    selectCustomerRacquet: function(customer) {
        var child = this.tree.getRootNode().findChild('tree_id', "racket_" + customer.get('racket_id'), true);
        this.tree.selectPath(child.getPath('tree_id'), 'tree_id');
    }

});
