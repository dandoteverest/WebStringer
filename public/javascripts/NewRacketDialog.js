
Ext.define('NewRacketManufacturerDialog', {
  extend: 'Ext.window.Window',
  alias: 'widget.newracketmanufacturerdialog',
  title: "New Racket Manufacturer",
  layout: 'fit',
  border: false,
  width: 350,
  items: [
    {
      xtype: 'form',
      padding: '5 5 5 5',
      border: false,
      url: "/racket_manufacturers",
      items: [
        {
          xtype: 'textfield',
          fieldLabel: 'Manufacturer Name',
          labelWidth: 150,
          allowBlank: false,
          name: 'racket_manufacturer[name]',
          anchor: '100%'
        },
        {
          xtype: 'textfield',
          fieldLabel: 'Manufacturer URL',
          name: 'racket_manufacturer[url]',
          labelWidth: 150,
          anchor: '100%'
        }
      ],
      buttons: [
        {
          text: 'Ok',
          handler: function() {
            var window = this.up('window');
            var form = this.up('form').getForm();
            if (form.isValid()) {
              form.submit({
                success: function() {
                  window.close();
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
});



Ext.define('NewRacketDialog', {
  extend: 'Ext.window.Window',
  alias: 'widget.newracketdialog',
  title: "New Racket",
  layout: 'fit',
  style: "margin: '5 5 5 5'",
  border: false,
  width: 350,
  items: [
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
          store: Ext.StoreManager.lookup('racketManufacturerStore'),
          displayField: 'name',
          valueField: 'id',
          name: 'racket[racket_manufacturer_id]',
          itemId: 'racketMake'
        },
        {
          xtype: 'textfield',
          fieldLabel: 'Model',
          anchor: '100%',
          itemId: 'racketModel',
          allowBlank: false,
          name: 'racket[model]'
        },
        {
          xtype: 'headsizespinner',
          fieldLabel: 'Headsize',
          anchor: '100%',
          itemId: 'headSize',
          allowBlank: false,
          step: 1,
          name: 'racket[head_size]'
        },
        {
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
        },
        {
          xtype: 'filefield',
          fieldLabel: 'Photo',
          buttonText: 'Upload Photo...',
          anchor: '100%',
          name: 'racket[image]'
        }
      ],
      buttons: [
        {
          text: 'Ok',
          handler: function() {
            var window = this.up('window');
            var form = this.up('form').getForm();
            if (form.isValid()) {
              form.submit({
                success: function() {
                  window.close();
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
});
