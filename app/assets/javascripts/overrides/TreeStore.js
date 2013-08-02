Ext.override(Ext.data.TreeStore, {
    load: function(options) {
        options = options || {};
        options.params = options.params || {};
 
        var me = this,
            node = options.node || me.tree.getRootNode(),
            root;
 
        // If there is not a node it means the user hasnt defined a rootnode yet. In this case lets just
        // create one for them.
        if (!node) {
            node = me.setRootNode({
                expanded: true
            });
        }
 
        if (me.clearOnLoad) {
            // this is what we changed.  added false
            node.removeAll(false);
        }
 
        Ext.applyIf(options, {
            node: node
        });
        options.params[me.nodeParam] = node ? node.getId() : 'root';
 
        if (node) {
            node.set('loading', true);
        }
 
        return me.callParent([options]);
    }
});
