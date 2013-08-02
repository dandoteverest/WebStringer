Ext.define('StringsPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.stringpanel',
    layout: 'fit',
    autoscroll: true,
    border: false,

    initComponent: function() {
        var me = this;
        this.items = {
            xtype: 'panel',
            layout: 'fit',
            items: {
                title: 'String List',
                xtype: 'stringimagelistpanel',
                width: 500
            }
        }
        this.callParent(arguments);
    }
}); 
