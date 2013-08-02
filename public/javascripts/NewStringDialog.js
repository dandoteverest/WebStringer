
Ext.define('NewStringManufacturerDialog', {
  extend: 'Ext.window.Window',
  alias: 'widget.newstringmanufacturerdialog',
  title: "New String Manufacturer",
  layout: 'fit',
  border: false,
  width: 350,
  items: [
    {
      xtype: 'form',
      padding: '5 5 5 5',
      border: false,
      url: "/string_manufacturers",
      items: [
        {
          xtype: 'textfield',
          fieldLabel: 'Manufacturer Name',
          labelWidth: 150,
          allowBlank: false,
          name: 'string_manufacturer[name]',
          anchor: '100%'
        },
        {
          xtype: 'textfield',
          fieldLabel: 'Manufacturer URL',
          name: 'string_manufacturer[url]',
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



Ext.define('NewStringDialog', {
    extend: 'Ext.window.Window',
    alias: 'widget.newstringdialog',
    title: "New String",
    layout: 'fit',
    style: "margin: '5 5 5 5'",
    border: false,
    width: 350,

    initComponent: function() {
        var store = Ext.create('StringManufacturerStore', {});
        store.load();

        this.items = [
          {
            xtype: 'form',
            style: "margin: '5 5 5 5'",
            border: false,
            url: "/tennis_strings/",
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
                name: 'tennis_string[string_manufacturer_id]'
              },
              {
                xtype: 'textfield',
                fieldLabel: 'Name',
                anchor: '100%',
                allowBlank: false,
                name: 'tennis_string[name]'
              },
              {
                xtype: 'stringgaugespinner',
                fieldLabel: 'Gauge',
                anchor: '100%',
                allowBlank: false,
                name: 'tennis_string[gauge]'
              },
              {
                xtype: 'combobox',
                autoScroll: true,
                typeAhead: true,
                allowBlank: false,
                minChars: 2,
                anchor: "100%",
                fieldLabel: 'Construction',
                store: Ext.StoreManager.lookup('stringConstructionStore'),
                displayField: 'construction',
                valueField: 'id',
                name: 'tennis_string[string_construction_id]'
              },
              {
                xtype: 'filefield',
                fieldLabel: 'Photo',
                buttonText: 'Upload Photo...',
                anchor: '100%',
                name: 'tennis_string[image]'
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
                      standardSubmit: false,
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
        ];

        this.callParent(arguments);
    }
});
