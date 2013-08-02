Ext.override(Ext.data.Store, {
    /**
     * Loads an array of {@Ext.data.Model model} instances into the store, fires the datachanged event. This should only usually
     * be called internally when loading from the {@link Ext.data.proxy.Proxy Proxy}, when adding records manually use {@link #add} instead
     * @param {Ext.data.Model[]} records The array of records to load
     * @param {Object} options {addRecords: true} to add these records to the existing records, false to remove the Store's existing records first
     */
    //FIXME 1: removed records are not cleaned after store reload
    loadRecords: function(records, options) {
        var me     = this,
            i      = 0,
            length = records.length;

        options = options || {};


        if (!options.addRecords) {
            delete me.snapshot;
            me.clearData();
            //FIXME 1
            me.removed = [];
        }

        me.data.addAll(records);

        //FIXME: this is not a good solution. Ed Spencer is totally responsible for this and should be forced to fix it immediately.
        for (; i < length; i++) {
            if (options.start !== undefined) {
                records[i].index = options.start + i;

            }
            records[i].join(me);
        }

        /*
         * this rather inelegant suspension and resumption of events is required because both the filter and sort functions
         * fire an additional datachanged event, which is not wanted. Ideally we would do this a different way. The first
         * datachanged event is fired by the call to this.add, above.
         */
        me.suspendEvents();

        if (me.filterOnLoad && !me.remoteFilter) {
            me.filter();
        }

        if (me.sortOnLoad && !me.remoteSort) {
            me.sort();
        }

        me.resumeEvents();
        me.fireEvent('datachanged', me, records);
    }
});