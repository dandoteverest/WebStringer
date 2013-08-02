
Ext.define('EditRacquetManufacturerDialog', {
    extend: 'Ext.window.Window',
    alias: 'widget.editracquetmanufacturerdialog',
    title: "Edit Racquet Manufacturer",
    layout: 'fit',
    border: false,
    width: 350,

    initComponent: function() {
        var me = this;
        var store = Ext.create('RacketManufacturerStore', {});
        store.load();

        this.items = [
        {
            xtype: 'form',
            padding: '5 5 5 5',
            border: false,
            items: [
            {
                xtype: 'combobox',
                fieldLabel: 'Manufacturer Name',
                emptyText: "Select a Manufacturer",
                itemId: "manufacturerName",
                labelWidth: 150,
                allowBlank: false,
                editable: false,
                displayField: 'name',
                valueField: 'id',
                store: store,
                name: 'id',
                anchor: '100%',
                listeners: {
                    select: function(combo, records){
                        me.down("#newManucaturerName").setValue(records[0].get('name'));
                        me.down("#newManucaturerURL").setValue(records[0].get('url'));
                    }
                }
            }, {
                xtype: 'textfield',
                fieldLabel: 'New Manufacturer Name',
                itemId: 'newManucaturerName',
                name: 'racket_manufacturer[name]',
                labelWidth: 150,
                anchor: '100%'
            }, {
                xtype: 'textfield',
                fieldLabel: 'Manufacturer URL',
                itemId: 'newManucaturerURL',
                name: 'racket_manufacturer[url]',
                labelWidth: 150,
                anchor: '100%'
            }],
            buttons: [
            {
                text: 'Ok',
                handler: function() {
                    var window = this.up('window');
                    var formPanel = this.up('form');
                    var combo = formPanel.down("#manufacturerName");
                    var form = formPanel.getForm();
                    if (form.isValid()) {
                        form.submit({
                            url: "/racket_manufacturers/" + combo.getValue() ,
                            method: 'PUT',
                            success: function() {
                                me.fireEvent('racquetmanufactureredited', me);
                                window.close();
                            }
                        });
                    }
                }
            }, {
                text: 'Cancel',
                handler: function() {
                    this.up('window').close();
                }
            }]
        }];
        this.callParent(arguments);
    },

    initEvents: function() {
        this.addEvents('racquetmanufactureradded')
        this.callParent(arguments);
    }
});



Ext.define('EditRacketDialog', {
    extend: 'Ext.window.Window',
    alias: 'widget.editracketdialog',
    title: "Edit Racquet",
    layout: 'fit',
    style: "margin: '5 5 5 5'",
    border: false,
    width: 350,

    initComponent: function() {
        var me = this;

        var store = Ext.create('RacketManufacturerStore', {});
        store.load();

        this.items = [
        {
            xtype: 'form',
            style: "margin: '5 5 5 5'",
            border: false,
            url: "/rackets",
            items: [
            {
                xtype: 'combobox',
                autoScroll: true,
                typeAhead: true,
                allowBlank: false,
                minChars: 2,
                anchor: "100%",
                fieldLabel: 'Manufacturer',
                store: store,
                displayField: 'name',
                valueField: 'id',
                name: 'racket[racket_manufacturer_id]',
                itemId: 'racketMake'
            }, {
                xtype: 'textfield',
                fieldLabel: 'Model',
                anchor: '100%',
                itemId: 'racketModel',
                allowBlank: false,
                name: 'racket[model]'
            }, {
                xtype: 'headsizespinner',
                fieldLabel: 'Headsize',
                anchor: '100%',
                itemId: 'headSize',
                allowBlank: false,
                step: 1,
                name: 'racket[head_size]'
            }, {
                xtype: 'combobox',
                autoScroll: true,
                anchor: '100%',
                typeAhead: true,
                allowBlank: false,
                minChars: 2,
                anchor: "100%",
                fieldLabel: 'String Pattern',
                store: Ext.StoreManager.lookup('stringPatternStore'),
                displayField: 'name',
                valueField: 'id',
                name: 'racket[string_pattern_id]',
                itemId: 'stringPattern'
            }, {
                xtype: 'filefield',
                fieldLabel: 'Photo',
                buttonText: 'Upload Photo...',
                anchor: '100%',
                name: 'racket[image]'
            }],
            buttons: [
            {
                text: 'Ok',
                handler: function() {
                    var window = this.up('window');
                    var form = this.up('form').getForm();
                    if (form.isValid()) {
                        form.submit({
                            success: function() {
                                me.fireEvent('racquetadded', me); //, new TennisString(Ext.JSON.decode(action.response.responseText)));
                                window.close();
                            }
                        });
                    }
                }
            }, {
                text: 'Cancel',
                handler: function() {
                    this.up('window').close();
                }
            }]
        }];

        this.callParent(arguments);
    },

    initEvents: function() {
        this.addEvents('racquetadded');
        this.callParent(arguments);
    }
});
