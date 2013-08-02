Ext.define('RacquetsPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.racquetpanel',
    layout: 'fit',
    autoscroll: true,
    border: false,

    initComponent: function() {
        var me = this;
        this.items = {
            xtype: 'panel',
            layout: 'fit',
            items: {
                title: 'Racquet List',
                xtype: 'racketimagelistpanel',
                itemId: 'racquetImageListPanel',
                width: 500
            }
        }
        this.callParent(arguments);
    }
}); 
