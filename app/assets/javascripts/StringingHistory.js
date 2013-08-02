
Ext.Loader.setConfig({
    enabled: true
});

Ext.Loader.setPath('Ext.ux', '/ext/examples/ux');

Ext.require([
    'Ext.selection.CellModel',
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.util.*',
    'Ext.state.*',
    'Ext.form.*',
    'Ext.ux.CheckColumn',
    'Ext.ux.RowExpander'
]);

Ext.define('TennisString', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'id', type: 'integer' },
        { name: 'name', type: 'string' },
        { name: 'gauge', type: 'float' },
        { name: 'full_name_with_gauge', type: 'string' }
    ]
});

Ext.define('StringManufacturer',{
    extend: 'Ext.data.Model',
    fields: [
        { name: 'name', type: 'string' }
    ],

    hasMany: [ { name: 'tennis_strings', model: 'TennisString' } ]
});

Ext.create('Ext.data.Store', {
    model: 'TennisString',
    storeId: 'tennisStringStore',
    proxy: {
        type: 'ajax',
        url: '/tennis_strings/tennis_strings_for_combo',
        reader: {
            type: 'json',
        }
    }
});

Ext.define('TensionSpinner', {
    extend: 'Ext.form.field.Spinner',
    alias: 'widget.tensionspinner',
    regex: new RegExp('[0-9]+'),
    onSpinUp: function() {
        var me = this;
        if (!me.readOnly) {
            var val = me.step; // set the default value to the step value
            if(me.getValue() !== '') {
                val = parseInt(me.regex.exec(me.getValue()).first());
            }                          
            me.setValue((val + me.step) + ' lbs');
        }
    },

    // override onSpinDown
    onSpinDown: function() {
        var me = this;
        if (!me.readOnly) {
            if(me.getValue() !== '') {
                val = parseInt(me.regex.exec(me.getValue()).first());
            }            
            me.setValue((val - me.step) + ' lbs');
        }
    }
});


Ext.create('Ext.data.Store', {
    model: 'StringingHistory',
    data: [],
    storeId: 'stringingHistoryStore'
});

Ext.onReady(function() {
    updateStringingNotes = function(id) {
        var store = Ext.StoreManager.lookup('stringingHistoryStore');
        var record = store.findRecord('id', id);
        var onUpdate = function(btn, text) {
            if (btn == 'ok') {
                record.set('notes', text);
                record.save();
            }
            Ext.ComponentQuery.query('#stringingHistoryGrid').first().getView().refresh()
        };
        Ext.MessageBox.prompt("Update Notes", "", onUpdate, null, true, record.get('notes'));
    }
});


Ext.define('StringingHistoryGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.stringing_history_grid',
    autoScroll: true,
    margin: 2,
    store: null,
    currentSelection: null,

    selModel: {
        selType: 'cellmodel',
    },
    plugins: [
        Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1
        }),
        {
            ptype: 'rowexpander',
            rowBodyTpl : [
                '<p><b>Notes:</b><br/>{notes}</p><br><input type="button" value="Update" onclick="updateStringingNotes({id})"/>',
            {
                update: function() {
                    console.log("Updating record...");
                }
            }]
        }
    ],

    initComponent: function() {
        var me = this;
        this.store = Ext.StoreManager.lookup('stringingHistoryStore'),
        this.store.on('load', function() {
          me.currentSelection = null;
        });

        this.getSelectionModel().on('select', function(view, selection, options) {
          if (me.currentSelection == null) {
            me.currentSelection = selection;
          }
        });

        this.getSelectionModel().on('deselect', function(view, selection, options) {
          me.currentSelection = selection;
        });

        this.columns = [
        {
            xtype: 'actioncolumn',
            align: 'center',
            width: 50,
            items: [
            {
                icon   : '/images/rejected.png',  // Use a URL in the icon config
                tooltip: 'Delete',
                handler: function(grid, rowIndex, colIndex) {
                    var rec = grid.getStore().getAt(rowIndex);
                    Ext.Msg.confirm("Confirm", "Delete string job?", function(id) {
                        if (id == 'yes') {
                            Ext.Ajax.request({
                                method: 'DELETE',
                                url: '/racket_stringings/' + rec.get('id'),
                                success: function(response) {
                                    var response = Ext.decode(response.responseText);
                                    grid.getStore().removeAt(rowIndex);
                                    me.fireEvent('racquetstringingdeleted', me, rec);
                                }
                            });
                        }
                    });
                }
            }]
        }, {
            flex: 1.25,
            text: 'Date Strung',
            dataIndex: 'strung_on',
            editor: {
              xtype: 'datefield',
              submitFormat: 'd/m/Y',
              listeners: {
                blur: function(field, date) {
                  if (field.isValid()) {
                    me.fireEvent('datestrungchanged', me.currentSelection, field.getSubmitValue());
                  }
                },
                select: function(field, date) {
                  me.currentSelection.set('strung_on', date);
                }
              }
            },
            renderer: function(value) {
              if (value) {
                value = Ext.Date.format(value, 'M j, Y');
              }
              return value;
              }
        },
        { flex: 1.5, text: 'Stringer', dataIndex: 'strung_by' },
        { flex: 4, text: 'String', dataIndex: 'string_name' },
        {
            flex: .75,
            text: 'Tension',
            dataIndex: 'tension',
            editor: {
              xtype: 'textfield',
              listeners: {
                blur: function() {
                  me.fireEvent('tensionchanged', me.currentSelection, this.getValue());
                }
              }
            }
        }, {
            flex: .75,
            text: 'Cost',
            dataIndex: 'cost',
            renderer: Ext.util.Format.usMoney,
            editor: {
                xtype: 'textfield',
                listeners: {
                    blur: function() {
                        var val = 0;
                        try {
                            val = parseInt(new RegExp('[0-9]+').exec(this.getValue()).first());
                        } catch (e) {
                        }
                        me.currentSelection.set('cost', val);
                        me.fireEvent('costchanged', me.currentSelection, val);
                        this.setValue("$" + val);
                      }
                  }
            }
        }, {
            flex: 1,
            header: 'Paid?',
            dataIndex: 'payment_received',
            xtype: 'checkcolumn',
            width: 55,
            listeners: {
                checkchange: {
                    fn: function(checkcolumn, index, val, callback) {
                        var record = this.up('panel').store.getAt(index);
                        Ext.Ajax.request({
                            method: 'PUT',
                            url: '/racket_stringings/' + record.get('id'),
                            params: {
                                id: record.get('id'),
                                'racket_stringing[payment_received]': val
                            },
                            success: function() {
                                me.fireEvent('paymentreceived', me, record);
                            },
                            failure: function(arg1, arg2, arg3) {
                                record.set('payment_received', !record.get('payment_received'));
                                Ext.Msg.alert('Update', 'There was an error updating the record');
                            }
                        });
                    }
                }
            }
        }];
        /*
        this.on('viewready', function() {
            me.getView().on('expandbody', function(a, b, c) {
                console.log("expanding row body...");
                Ext.create("Ext.form.Panel", {
                    renderTo: c.down('td'),
                    items: [{
                        xtype: "textfield",
                        fieldLabel: "One"
                    }, {
                        xtype: "textfield",
                        fieldLabel: "Two"
                    }]
                });
            });
            me.getView().on('collapsebody', function(a, b, c) {
                console.log("collapsing row body...");
            });
        });
        */
        this.callParent(arguments);
    },

    initEvents: function() {
        this.callParent(arguments);
    }
});


Ext.define('StringingHistoryPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.stringing_history',
    layout: 'border',
    margin: 5,
    border: false,
    store: Ext.StoreManager.lookup('stringingHistoryStore'),
    stringStore: null,
    stringersStore: null,

    initComponent: function() {
        var me = this;

        me.stringStore = Ext.create('StringDetailsStore', {});
        me.stringersStore = Ext.create('StringerStore', {});

        me.items = [
        {
                  region: 'north',
                  xtype: 'form',
                  url: '/racket_stringings',
                  flex: 0,
                  border: false,
                  margin: 2,
                  bodyPadding: 2,
                  items: [
                  {
                      xtype: 'panel',
                      border: false,
                      anchor: '100%',
                      layout: {
                        type: 'column'
                      },
                      items: [
                            {
                              xtype: 'panel',
                              border: false,
                              columnWidth: .50,
                              style: 'margin-right: 10px; margin-left: 10px',
                              layout: 'anchor',
                              items: [
                                {
                                  xtype: 'hiddenfield',
                                  itemId: 'cutomerRacketId',
                                  name: 'customer_racket_id'
                                },
                                {
                                  xtype: 'datefield',
                                  fieldLabel: 'Dropped off',
                                  allowBlank: true,
                                  anchor: '100%',
                                  submitFormat: 'd/m/Y',
                                  value: new Date(),
                                  name: 'dropped_off'
                                },
                                {
                                  xtype: 'datefield',
                                  fieldLabel: 'Requested by',
                                  allowBlank: true,
                                  anchor: '100%',
                                  submitFormat: 'd/m/Y',
                                  value: Ext.Date.add(new Date(), Ext.Date.DAY, 5),
                                  name: 'requested_by'
                                },
                                {
                                  xtype: 'datefield',
                                  fieldLabel: 'Strung on',
                                  allowBlank: true,
                                  anchor: '100%',
                                  // Not sure WHY I need to do it for only this field, but that is how it is working right now...
                                  submitFormat: 'd/m/Y',
                                  name: 'strung_on'
                                },
                                {
                                  xtype: 'textfield',
                                  allowBlank: false,
                                  fieldLabel: 'Cost',
                                  name: 'cost',
                                  minValue: 0, //prevents negative numbers

                                  listeners: {
                                    blur: function() {
                                      var val = 0;
                                      try {
                                        val = parseInt(new RegExp('[0-9]+').exec(this.getValue()).first());
                                      } catch (e) {
                                      }
                                      this.setValue("$" + val);
                                    }
                                  }
                                },
                                {
                                  xtype: 'combobox',
                                  fieldLabel: 'Stringer',
                                  allowBlank: true,
                                  anchor: '100%',
                                  name: 'user_id',
                                  valueField: 'id',
                                  displayField: 'full_name',
                                  store: me.stringersStore
                                }
                              ]
                            },
                            {
                              xtype: 'panel',
                              columnWidth: .50,
                              layout: 'anchor',
                              style: 'margin-right: 10px; margin-left: 10px',
                              border: false,
                              items: [
                                {
                                  xtype: 'checkbox',
                                  fieldLabel: '2 Piece Stringing',
                                  name: 'is_two_piece',
                                  handler: function() {
                                    var container = this.up('panel');
                                    container.getComponent('crossString').setDisabled(!this.getValue());
                                    container.getComponent('crossTension').setDisabled(!this.getValue());
                                  }
                                },
                                {
                                  xtype: 'combobox',
                                  autoScroll: true,
                                  typeAhead: true,
                                  allowBlank: false,
                                  minChars: 2,
                                  anchor: "100%",
                                  fieldLabel: 'Main String',
                                  //store: Ext.StoreManager.lookup('tennisStringStore'),
                                  store: me.stringStore,
                                  displayField: 'full_name_with_gauge',
                                  valueField: 'id',
                                  name: 'main_string'
                                },
                                {
                                  xtype: 'tensionspinner',
                                  step: 1,
                                  fieldLabel: 'Main Tension',
                                  value: '60 lbs',
                                  allowBlank: false,
                                  name: 'main_tension'
                                },
                                {
                                  xtype: 'combobox',
                                  autoScroll: true,
                                  typeAhead: true,
                                  allowBlank: true,
                                  minChars: 2,
                                  anchor: "100%",
                                  fieldLabel: 'Cross String',
                                  //store: Ext.StoreManager.lookup('tennisStringStore'),
                                  store: me.stringStore,
                                  displayField: 'full_name_with_gauge',
                                  valueField: 'id',
                                  name: 'cross_string',
                                  disabled: true,
                                  itemId: 'crossString'
                                },
                                {
                                  xtype: 'tensionspinner',
                                  itemId: 'crossTension',
                                  allowBlank: true,
                                  disabled: true,
                                  step: 1,
                                  fieldLabel: 'Cross Tension',
                                  value: '60 lbs',
                                  name: 'cross_tension'
                                }
                              ]
                            }
                        ]
                    },
                    {
                            xtype: 'textarea',
                              style: 'margin-right: 10px; margin-left: 10px',
                            fieldLabel: 'Notes',
                            allowBlank: true,
                            anchor: '100%',
                            name: 'notes',
                            rows: 3
                    }
                  ],
            buttons: [
            {
                text: 'Copy Last Job',
                handler: function() {
                    var store;
                    if (me.stringersStore.count() == 0) {
                        me.stringersStore.load();
                    }
                    if (me.stringStore.count() == 0) {
                        me.stringStore.load();
                    }
                    store = Ext.StoreMgr.lookup('racketStringingDetailsStore');
                    store.first().racket_stringings().sort('strung_on', 'DESC');

                    var form = this.up('form');
                    var record = store.first().racket_stringings().first();
                    //store = Ext.StoreMgr.lookup('racquetStringingsStore');
                    store = Ext.create('RacquetStringingsStore');
                    store.load({
                        url: store.getProxy().url + record.get('id') + ".json",
                        callback: function(records) {
                            var rec = records[0];
                            if (rec) {
                                rec = rec.copy();
                                rec.set('strung_on', null);
                                rec.set('requested_by', Ext.Date.add(new Date(), Ext.Date.DAY, 5));
                                rec.set('dropped_off', new Date());
                                form.loadRecord(rec);
                            }
                        }
                    });
                }
            }, {
                text: 'Add String Job',
                formBind: true,
                margin: 2,
                handler: function() {
                    this.up('form').submit({
                        success: function(form, action) {
                            var store = Ext.StoreManager.lookup('stringingHistoryStore');
                            store.setProxy(new Ext.data.proxy.Ajax({url: '/racket_stringings', model: 'StringingHistory', reader: 'json'}));
                            store.load({params: {customer_racket_id: Ext.StoreManager.lookup('racketStringingDetailsStore').first().get('id')}});
                            me.fireEvent('racquetstringingadded', me, new RacketStringingsModel(Ext.decode(action.response.responseText)));
                        },
                        failure: function(arg1, arg2, arg3) {
                            console.log('submit failed');
                        }
                    });
                }
            }]
        }, {
            xtype: 'stringing_history_grid',
            itemId: 'stringingHistoryGrid',
            region: 'center',
            autoScroll: true,
            listeners: {
                datestrungchanged: function(racketStringing, strung_on) {
                    Ext.Ajax.request({
                        method: 'PUT',
                        url: '/racket_stringings/' + racketStringing.get('id'),
                        params: {
                            id: racketStringing.get('id'),
                            'racket_stringing[strung_on]': strung_on
                        }
                    });
                },

                tensionchanged: function(racketStringing, tension) {
                  //var form = this.up('form').getForm();
                    if (racketStringing.get('is_two_piece')) {
                        var tension = tension.split('/');
                        try {
                            tension[0] = parseInt(new RegExp('[0-9]+').exec(tension[0]));
                            tension[1] = parseInt(new RegExp('[0-9]+').exec(tension[1]));
                        } catch (e) {
                            console.log(e.getMessage());
                            return;
                        }

                        Ext.Ajax.request({
                            method: 'PUT',
                            url: '/racket_stringings/' + racketStringing.get('id'),
                            params: {
                                id: racketStringing.get('id'),
                                'racket_stringing[main_tension]': tension[0],
                                'racket_stringing[cross_tension]': tension[1]
                            }
                        });
                    } else {
                        try {
                            tension = parseInt(new RegExp('[0-9]+').exec(tension));
                        } catch (e) {
                            console.log(e.getMessage());
                            return;
                        }
                        Ext.Ajax.request({
                            method: 'PUT',
                            url: '/racket_stringings/' + racketStringing.get('id'),
                            params: {
                                id: racketStringing.get('id'),
                                'racket_stringing[main_tension]': tension,
                            }
                        });
                    }
                },

                costchanged: function(racketStringing, cost) {
                    Ext.Ajax.request({
                        method: 'PUT',
                        url: '/racket_stringings/' + racketStringing.get('id'),
                        params: {
                            id: racketStringing.get('id'),
                            'racket_stringing[cost]': cost
                        }
                    });
                },
              
                paymentreceived: function(racketStringing, record) {
                    me.fireEvent('racquetstringingpaymentupdated', racketStringing, record);
                }
            }
        }];

        this.callParent(arguments);
        Ext.StoreManager.lookup('racketStringingDetailsStore').on('load', function(arg1, record, arg3) {
            me.store.loadData(record[0].getAssociatedData().racket_stringings);
            var form = me.down('form');
            form.getForm().reset();
            form.down('hiddenfield').setValue(record[0].get('id'));
        });
    },

    initEvents: function() {
        this.callParent(arguments);
        this.addEvents('racquetstringingadded');
        this.addEvents('racquetstringingpaymentupdated');
        this.relayEvents(this.down('#stringingHistoryGrid'), ['racquetstringingdeleted']);
    }

});
