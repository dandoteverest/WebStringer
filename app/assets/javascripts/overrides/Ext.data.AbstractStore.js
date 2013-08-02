Ext.override(Ext.data.AbstractStore, {

    //method can by overwritten to allow some specific behaviour during load state change (TreeStore for example)
    setLoadingState:function(loading, operation){
        this.loading = loading;
    },

    /**
     * Loads the Store using its configured {@link #proxy}.
     * @param {Object} options (optional) config object. This is passed into the {@link Ext.data.Operation Operation}
     * object that is created and then sent to the proxy's {@link Ext.data.proxy.Proxy#read} function
     */
    //FIX 1: adding method setLoadingState() to manage store load states
    load: function(options) {
        var me = this,
            operation;

        options = options || {};

        Ext.applyIf(options, {
            action : 'read',
            filters: me.filters.items,
            sorters: me.getSorters()
        });

        operation = Ext.create('Ext.data.Operation', options);

        if (me.fireEvent('beforeload', me, operation) !== false) {
            //FIX 1
            me.setLoadingState(true, operation);
            me.proxy.read(operation, me.onProxyLoad, me);
        }

        return me;
    }

});