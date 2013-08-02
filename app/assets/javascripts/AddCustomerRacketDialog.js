
Ext.define('AddCustomerRacketDialog', {
  extend: 'Ext.window.Window',
  title: 'Add New Customer Racquet',
  style: 'padding: 5px',
  width: 350,
  height: 400,
  layout: 'fit',

  initComponent: function() {
    var me = this;

    var manufacturerStore = Ext.create('RacketManufacturerStore', {});
    var racquetStore = Ext.create('RacquetStore', {});

    this.items = [
      {
        xtype: 'form',
        border: false,
        url: '/customer_rackets',
        fieldDefaults: {
          margin: 5
        },
        items: [
        {
            xtype: 'hiddenfield',
            name: 'customer_racket[customer_id]',
            itemId: 'customerId',
            value: me.customerId ,
        }, {
            xtype: 'combobox',
            fieldLabel: 'Manufacturer',
            typeAhead: true,
            allowBlank: false,
            minChars: 2,
            anchor: "100%",
            emptyText: 'Select a Manufacturer',
            displayField: 'name',
            store: manufacturerStore,
            listeners: {
                select: function(combo, array) {
                    var racquetCombo = this.up('form').down('#racket');
                    racquetCombo.reset();
                    racquetCombo.setDisabled(true);
                    racquetStore.getProxy().extraParams = { paginate: false, manufacturer_id: array[0].get('id')};
                    racquetStore.load(function(store, records, success) {
                        if (success) {
                            racquetCombo.setDisabled(false);
                        }
                    });
                }
            }
        }, {
            xtype: 'combobox',
            disabled: true,
            anchor: "100%",
            fieldLabel: 'Racquet',
            store: racquetStore,
            displayField: 'model',
            valueField: 'id',
            emptyText: 'Select a Racquet',
            name: 'customer_racket[racket_id]',
            autoLoad: false,
            itemId: 'racket',
            listeners: {
              select: function(_this, records, arg3) {
                var foo = 1;
                var form = _this.up('form');
                var racketImage = form.down('#racketImage');
                racketImage.setSrc(records.first().get('racket_image_url_small'));
                form.down('#stringPattern').setValue(records.first().get('pattern'));
                form.down('#headSize').setValue(records.first().get('head_size') + " sq in");
                racketImage.up('panel').doLayout();
              }
            }
        }, {
            xtype: 'combobox',
            autoScroll: true,
            typeAhead: true,
            allowBlank: false,
            minChars: 2,
            anchor: "100%",
            fieldLabel: 'Grip Size',
            store: Ext.StoreManager.lookup('gripsSizesStore'),
            displayField: 'name',
            valueField: 'id',
            name: 'customer_racket[grip_size_id]',
            itemId: 'gripSize'
        }, {
            xtype: 'panel',
            border: false,
            layout: 'column',
            items: [
              {
                xtype: 'panel',
                layout: 'anchor',
                border: false,
                columnWidth: 1,
                items: [
                  {
                    xtype: 'displayfield',
                    fieldLabel: 'String Pattern',
                    itemId: 'stringPattern',
                    anchor: '100%'
                  },
                  {
                    xtype: 'displayfield',
                    fieldLabel: 'Head Size',
                    itemId: 'headSize',
                    anchor: '100%'
                  }
                ]
              },
              {
                xtype: 'image',
                itemId: 'racketImage',
                /*
                xtype: 'panel',
                layout: {
                  type: 'vbox',
                  align: 'center'
                },
                */
                maxHeight: 200,
                maxwidth: 150,
                /*
                width: 150,
                height: 200,
                items: [
                  {
                    xtype: 'image',
                    itemId: 'racketImage'
                  }
                ]
                */
              }
            ]
        }],
        buttons: [
          {
            text: 'Ok',
            handler: function() {
              //var myMask = new Ext.LoadMask(Ext.getBody(), {msg:"Please wait..."});
              //myMask.show();
              var window = this.up('window');
              var form = this.up('form').getForm();
              if (form.isValid()) {
                form.submit({
                  success: function(form, action) {
                    var response = Ext.decode(action.response.responseText);
                    if (response.url) {
                        response.customer_racquet.url = response.url;
                    }
                    me.fireEvent('customerracketadded', me, new CustomerRackets(response.customer_racquet));
                    //me.fireEvent('customerracketadded', me, response.tree_path);
                    window.close();
                  },
                  failure: function() {
                    //myMask.hide();
                  }
                });
              }
            }
          },
          {
            text: 'Cancel',
            handler: function() {
              this.up('window').close();
            }
          }
        ]
      }
    ]

    this.callParent(arguments);
  },

  initEvents: function() {
    this.addEvents('customerracketadded');
    this.callParent(arguments);
  }
});
