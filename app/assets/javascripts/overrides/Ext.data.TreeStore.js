/*
*  FIXME 1: tree nodes are deleted BEFORE operation is confirmed, see FIXME 2
*  FIXME 2: synchronize this fix with FIXME 2, noeds should be removed from store here
*  FIXME 3: strange bug, workaround to show nodes properly after sync() when some nodes were moved (added) to saving node with children
*           - just collapse node (hide childred) and allow users to expand it manually after operation is done
* */
Ext.override(Ext.data.TreeStore, {

    //overwrite AbstractStore.sync()
    sync: function() {
        var me        = this,
            options   = {},
            toCreate  = me.getNewRecords(),
            toUpdate  = me.getUpdatedRecords(),
            toDestroy = me.getRemovedRecords(),
            needsSync = false;

        if (toCreate.length > 0) {
            options.create = toCreate;
            needsSync = true;
        }

        if (toUpdate.length > 0) {
            options.update = toUpdate;
            needsSync = true;
        }

        if (toDestroy.length > 0) {
            options.destroy = toDestroy;
            needsSync = true;
        }

        if (needsSync && me.fireEvent('beforesync', options) !== false) {
            //FIXME 3 -- begin
            if (options.create) {
                Ext.Array.forEach(options.create,function(i,idx,a){
                    var n;
                    if (i.parentNode) {
                        n = i.parentNode;
                    } else {
                        n = i;
                    }
                    if (n.isRoot()) {
                        n.collapseChildren(true);
                    } else {
                        n.collapse(true);
                    }
                });
            }
            if (options.update) {
                Ext.Array.forEach(options.update,function(i,idx,a){
                    var n;
                    if (i.parentNode) {
                        n = i.parentNode;
                    } else {
                        n = i;
                    }
                    if (n.isRoot()) {
                        n.collapseChildren(true);
                    } else {
                        n.collapse(true);
                    }
                });
            }
            // -- end of FIX 3
            me.proxy.batch(options, me.getBatchListeners());
        }
    },

    //method added in AbstractStore
    setLoadingState:function(loading, operation){
        var me = this,
            node = operation ? operation.node : null;
        if (loading == true) {
            if (node) {
                node.set('loading', true);
            }
        } else {
            if (node) {
                node.set('loading', false);
            }
        }
        me.callParent(arguments);
    },

    //Cleanup of new, modified and deleted marks when node is refreshed
    //private
    nodeRefreshCleanup:function(node){
        var me = this;
        if (me.clearOnLoad) {
            me.removeChildNodes(node, false);
        }
    },
    //removes all childs recurrently
    //private
    removeChildNodes:function(node, destroy, suppressEvents) {
        var cn = node.childNodes,
            n;

        while ((n = cn[0])) {
            this.removeChildNodes(n, destroy, suppressEvents);
            // prevent being added to the removed cache
            n.isReplace = true;
            node.removeChild(n, destroy, suppressEvents);
            delete n.isReplace;
        }
        return node;
    },
    /**
     * Loads the Store using its configured {@link #proxy}.
     * @param {Object} options (Optional) config object. This is passed into the {@link Ext.data.Operation Operation}
     * object that is created and then sent to the proxy's {@link Ext.data.proxy.Proxy#read} function.
     * The options can also contain a node, which indicates which node is to be loaded. If not specified, it will
     * default to the root node.
     */
    //overwrite
    load: function(options) {
        options = options || {};
        options.params = options.params || {};

        var me = this,
            node = options.node || me.tree.getRootNode(),
            root,
            currentPage;

        // If there is not a node it means the user hasnt defined a rootnode yet. In this case lets just
        // create one for them.
        if (!node) {
            node = me.setRootNode({
                expanded: true
            });
        }

//------
        //FIXME 1
//        if (me.clearOnLoad) {
//            node.removeAll(true);
//        }
//------

        options.params[me.nodeParam] = node ? node.getId() : 'root';

        return me.callParent([options]);
    },
    // inherit docs
    //overwrite
    onProxyLoad: function(operation) {
        var me = this,
            resultSet = operation.getResultSet(),
            successful = operation.wasSuccessful(),
            records = operation.getRecords(),
            node = operation.node;

        me.setLoadingState(false, operation);

        if (successful) {
//------
            //FIXME 2
            me.nodeRefreshCleanup(node);
//------
            records = me.fillNode(node, records);

        }
        // The load event has an extra node parameter
        // (differing from the load event described in AbstractStore)
        /**
         * @event load
         * Fires whenever the store reads data from a remote data source.
         * @param {Ext.data.TreeStore} this
         * @param {Ext.data.NodeInterface} node The node that was loaded.
         * @param {Ext.data.Model[]} records An array of records.
         * @param {Boolean} successful True if the operation was successful.
         */
        // deprecate read?
        me.fireEvent('read', me, operation.node, records, successful);
        me.fireEvent('load', me, operation.node, records, successful);
        //this is a callback that would have been passed to the 'read' function and is optional
        Ext.callback(operation.callback, operation.scope || me, [records, operation, successful]);
    }


});
