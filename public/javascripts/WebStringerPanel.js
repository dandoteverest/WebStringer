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
            }]
        }, {
            region: 'south',
            xtype: 'panel',
            title: 'Rackets in Queue',
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

        this.cardPanel.down('#stringsPanel').down('usersofstring').on('userselected', function(panel, record) {
            me.select('customersPanel');
            me.customersPanel.selectCustomerRacquet(record);
        });

        this.cardPanel.down('#racquetsPanel').down('usersofracket').on('userselected', function(panel, record) {
            me.select('customersPanel');
            me.customersPanel.selectCustomerRacquet(record);
        });
    },

    select: function(cardId) {
        this.cardPanel.getLayout().setActiveItem(cardId);
    }

});
