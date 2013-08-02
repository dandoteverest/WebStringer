Ext.define('WebStringerPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.webstringerpanel',

    layout: 'border',
    border: false,
    margins: '5, 5, 5, 5',

    initComponent: function() {
        this.items = [
        {
            xtype: 'panel',
            region: 'center',
            itemId: '_cardPanel',
            layout: 'card',
            items: [
            {
                xtype: 'customerspanel',
                itemId: 'customersPanel'
            }, {
                xtype: 'racquetpanel',
                itemId: 'racquetsPanel'
            }, {
                xtype: 'stringpanel',
                itemId: 'stringsPanel'
            }, {
                xtype: 'accountsreceivablepanel',
                itemId: 'accountsReceivablePanel'
            }]
        }, {
            region: 'south',
            xtype: 'panel',
            title: 'Racquets in Queue',
            height: 90,
            layout: 'fit',
            margins: '10, 0, 0, 0',
            items: [
            {
                xtype: 'myracketqueue',
                itemId: 'racketQueue'
            }
            ]
        }];
        this.callParent(arguments);
    },

    onRender: function() {
        var me = this;

        this.callParent(arguments);
        this.cardPanel = this.down('#_cardPanel');
        this.customersPanel = this.cardPanel.down('#customersPanel');
        this.racquetsPanel = this.cardPanel.down('#racquetsPanel');
        this.stringsPanel = this.cardPanel.down('#stringsPanel');

        this.stringsPanel.down('usersofstring').on('userselected', function(panel, record) {
            me.select('customersPanel');
            me.customersPanel.selectCustomerRacquet(record);
        });

        this.racquetsPanel.down('usersofracket').on('userselected', function(panel, record) {
            me.select('customersPanel');
            me.customersPanel.selectCustomerRacquet(record);
        });

        this.down('#racketQueue').on('itemselected', function(panel, record) {
            me.customersPanel.selectCustomerRacquet(record.get('customer_racket_id'));
        });

        Ext.ComponentQuery.query('#newStringMenuItem').first().on('click', function() {
            Ext.create('NewStringDialog', {
                listeners: {
                    stringadded: function(dialog, string) {
                        var history = me.customersPanel.down('stringing_history');
                        if (history && history.stringStore) {
                            history.stringStore.add(string);
                            history.stringStore.sort('full_name_with_gauge', 'ASC');
                        }
                        var stringImages = me.stringsPanel.down('stringimagelistpanel');
                        if (stringImages && stringImages.stringsStore) {
                            stringImages.stringsStore.load();
                        }
                    }
                }
            }).show();
        });

        Ext.ComponentQuery.query('#newRacquetManufacturerMenuItem').first().on('click', function() {
            Ext.create('NewRacketManufacturerDialog', {
                listeners: {
                    racquetmanufactureradded: function(dialog, racquet) {
                        var racquetImages = me.racquetsPanel.down('racketimagelistpanel');
                        if (racquetImages && racquetImages.racquetManufacturerStore) {
                            racquetImages.racquetManufacturerStore.load();
                        }
                    }
                }
            }).show();
        });

        Ext.ComponentQuery.query('#newRacquetMenuItem').first().on('click', function() {
            Ext.create('NewRacketDialog', {
                listeners: {
                    racquetadded: function(dialog, racquet) {
                        var racquetImages = me.racquetsPanel.down('racketimagelistpanel');
                        if (racquetImages && racquetImages.racquetsStore) {
                            racquetImages.racquetsStore.load();
                        }
                    }
                }
            }).show();
        });

        Ext.ComponentQuery.query('#editRacquetManufacturerMenuItem').first().on('click', function() {
            Ext.create('EditRacquetManufacturerDialog', {
                listeners: {
                    racquetmanufactureredited: function(dialog, racquet) {
                        var racquetImages = me.racquetsPanel.down('racketimagelistpanel');
                        if (racquetImages && racquetImages.racquetManufacturerStore) {
                            racquetImages.racquetManufacturerStore.load();
                        }
                    }
                }
            }).show();
        });
    },

    select: function(cardId) {
        this.cardPanel.getLayout().setActiveItem(cardId);
    }

});
