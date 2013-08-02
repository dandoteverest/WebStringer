Ext.require([
    'Ext.ux.grid.Printer'
]);

Ext.define('AccountsReceivablePanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.accountsreceivablepanel',
    layout: 'fit',
    border: false,

    initComponent: function() {
        var me = this;
        this.store = Ext.create('RacquetStringingsStore', {
            groupField: 'full_name'
        });
        this.store.getProxy().url = "/accounts_receivable";
        /*
        var mask = new Ext.LoadMask(_mainContentPanel);
        mask.show();
        store.load({
        */
        this.columns = [{
            xtype: 'datecolumn',
            text: 'Strung On',
            dataIndex: 'strung_on'
        }, {
            text: 'Racquet',
            dataIndex: 'racquet_name',
            width: 200
        }, {
            xtype: 'datecolumn',
            text: 'Dropped Off',
            dataIndex: 'dropped_off'
        }, {
            text: 'String',
            dataIndex: 'string_name',
            width: 200
        }, {
            text: 'Tension (lbs)',
            dataIndex: 'tension'
        }, {
            xtype: 'datecolumn',
            text: 'Requested By',
            dataIndex: 'requested_by',
            summaryRenderer: function(value) {
                return "Balance:";
            }
        }, {
            xtype: 'numbercolumn',
            renderer: Ext.util.Format.usMoney,
            text: 'Cost',
            dataIndex: 'cost',
            summaryType: 'sum',
            summaryRenderer: function(value) {
                return "<span style='color:red'>" + Ext.util.Format.usMoney(value) + "</span>";
            }
        }];

        this.items = [{
            xtype: 'grid',
            autoScroll: true,
            border: false,
            store: this.store,
            features: [Ext.create('Ext.grid.feature.GroupingSummary', {
                groupHeaderTpl: [
                    "<div style='display:inline'>",
                        "<div style='float: left'>Customer: {name}</div>",
                        /*"<div style='float:right'>Balance: <span style='color:red'>{name:this.getBalance}</span></div>",*/
                    "</div>",
                    {
                        getBalance: function(name) {
                            var balance = 0;
                            Ext.Array.forEach(me.store.getGroups(name).children, function(child) {
                                balance += child.get('cost');
                            });
                            return Ext.util.Format.usMoney(balance);
                        }
                    }
                ]
            })],
            columns: this.columns,
            tbar: [{
                text: 'Print',
                handler: Ext.bind(this.onPrintGrid, this),
                icon: '/images/printer.png'
            }]
        }];

        this.callParent(arguments);
    },

    onPrintGrid: function() {
        var me = this;
        if (!this.printStore) {
            this.printStore = Ext.create('RacquetStringingsStore', { });
            this.printStore.getProxy().url = "/accounts_receivable";
            this.printStore.sort([{
                property: 'full_name',
                direction: 'ASC'
            }, {
                property: 'strung_on',
                direction: 'ASC'

            }]);
        }

        this.printStore.load({
            callback: function() {
                if (!me.printGrid) {
                    me.printGrid = Ext.create('Ext.grid.Panel', {
                        store: me.printStore,
                        columns: Ext.Array.merge([{ dataIndex: 'full_name', text: "Customer" }], me.columns)
                    });
                }
                Ext.ux.grid.Printer.print(me.printGrid);
            }
        });
    },

    onRender: function() {

        this.callParent(arguments);
        this.store.load();
    }
});
