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
                        var detailsStore = Ext.data.StoreManager.lookup('customerDetailsStore');
                        var tabPanel = this.up('panel').down('#tabPanel');
                        if (selections[0].isLeaf() == false) {
                            tabPanel.setActiveTab(0);
                            tabPanel.down('#racquetDetails').setDisabled(true);
                            tabPanel.down('#stringingHistory').setDisabled(true);
                        } else {
                            detailsStore.load({ url: selections[0].get('customer_url') });
                            detailsStore = Ext.data.StoreManager.lookup('racketStringingDetailsStore');
                            tabPanel.down('#racquetDetails').setDisabled(false);
                            tabPanel.down('#stringingHistory').setDisabled(false);
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
                xtype: 'tabpanel',
                itemId: 'tabPanel',
                items: [
                {
                    title: 'Customer Details',
                    xtype: 'panel',
                    border: false,
                    items: {
                        xtype: 'customer_details',
                        itemId: 'customerDetails',
                        border: false
                    }
                }, {
                    title: 'Racquet Details',
                    xtype: 'customer_racket_details',
                    disabled: true,
                    itemId: 'racquetDetails'
                }, {
                    title: 'Stringing History',
                    xtype: 'stringing_history',
                    itemId: 'stringingHistory',
                    disabled: true,

                    updateStrungDate: function(node, record) {
                        var date = record.get('strung_on');
                        if (date) {
                            var lastStrung = node.parentNode.get('lastStrungOn');
                            if (!lastStrung || (lastStrung < date)) {
                                node.parentNode.set('lastStrung', date);

                            }
                        }
                    },

                    updateCost: function(node, cost, negate) {
                        var _cost = cost;
                        if (negate == true) {
                            _cost *= -1;
                        }
                        node.set('current_bill', node.get('current_bill') + _cost);
                        node.parentNode.set('current_bill', node.parentNode.get('current_bill') + _cost);
                    },

                    listeners: {
                        racquetstringingpaymentupdated: function(grid, record) {
                            var tree = me.down('#customerTreePanel');
                            var child = tree.getRootNode().findChild('tree_id', "racket_" + record.get('customer_racket_id'), true);
                            var cost = record.get('cost');
                            if (record.get('payment_received') === true) {
                                child.set('current_bill', child.get('current_bill') - cost);
                                child.parentNode.set('current_bill', child.parentNode.get('current_bill') - cost);
                            } else {
                                child.set('current_bill', child.get('current_bill') + cost);
                                child.parentNode.set('current_bill', child.parentNode.get('current_bill') + cost);
                            }
                            //tree.view.refresh();
                        },
                        racquetstringingadded: function(grid, record) {
                            var tree = me.down('#customerTreePanel');
                            var child = tree.getRootNode().findChild('tree_id', "racket_" + record.get('customer_racket_id'), true);
                            var cost = record.get('cost');
                            child.set('current_bill', child.get('current_bill') + cost);
                            child.parentNode.set('current_bill', child.parentNode.get('current_bill') + cost);
                            this.updateStrungDate(child, record);
                            Ext.StoreMgr.lookup('racketStringingDetailsStore').load({ url: child.get('url') });
                            //tree.view.refresh();
                        },
                        racquetstringingdeleted: function(grid, record) {
                            var tree = me.down('#customerTreePanel');
                            var child = tree.getRootNode().findChild('tree_id', "racket_" + record.get('customer_racket_id'), true);
                            var cost = record.get('cost');
                            if (record.get('payment_received') === false) {
                                /*
                                child.set('current_bill', child.get('current_bill') - cost);
                                child.parentNode.set('current_bill', child.parentNode.get('current_bill') - cost);
                                */
                                this.updateCost(child, cost, true);
                            }
                            //tree.view.refresh();
                        },
                        racquetstringingdateupdated: function(grid, record) {
                            var tree = me.down('#customerTreePanel');
                            var child = tree.getRootNode().findChild('tree_id', "racket_" + record.get('customer_racket_id'), true);
                            this.updateStrungDate(child, record);
                            //tree.view.refresh();
                        }
                    }
                }]
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
        var id = (customer.isModel ? customer.get('racket_id') : customer);
        var child = this.tree.getRootNode().findChild('tree_id', "racket_" + id, true);
        this.tree.selectPath(child.getPath('tree_id'), 'tree_id');
    }

});
