Ext.define('NewCompanyDialog', {
  extend: 'Ext.window.Window',
  title: 'Add New Company',
  style: 'padding: 5px',
  layout: 'fit',
  items: [
    {
      xtype: 'form',
      url: '/companies',
      fieldDefaults: {
        margin: 5
      },
      items: [
        {
          xtype: 'textfield',
          fieldLabel: 'Company Name',
          name: 'company[name]',
          allowBlank: false,
          anchor: '100%'
        },
        {
          xtype: 'textfield',
          fieldLabel: 'Address',
          name: 'company[address1]',
          allowBlank: false,
          anchor: '100%'
        },
        {
          xtype: 'textfield',
          fieldLabel: '&nbsp;',
          labelSeparator: '',
          name: 'company[address2]',
          allowBlank: true,
          anchor: '100%'
        },
        {
          xtype: 'textfield',
          fieldLabel: 'City',
          name: 'company[city]',
          allowBlank: false,
          anchor: '100%'
        },
        {
          xtype: 'combobox',
          fieldLabel: 'State',
          displayField: 'label',
          valueField: 'value',
          typeAhead: true,
          minChars: 1,
          autoSelect: true,
          name: 'company[state_id]',
          store: 'usStatesStore',
          allowBlank: false,
          anchor: '100%'
        },
        {
          xtype: 'textfield',
          fieldLabel: 'Phone #',
          name: 'company[phone]',
          allowBlank: false,
          anchor: '100%',
          enableKeyEvents: true,
          getSubmitValue: function() {
            return Ext.Array.from(this.getValue().match(/[0-9]/g)).join("");
          },
          listeners: {
            keypress: function(textField, evt) {
                var stopEvent = true;

                var c = String.fromCharCode(evt.getCharCode());
                if (c.match(/[0-9]/)) {
                    var text = Ext.Array.from(textField.getValue().match(/[0-9]/g)).join("");
                    if (text.length == 10) {
                        evt.stopEvent();
                        return;
                    }
                    var currentPos = textField.getCursorPosition();
                    var insertionPos = currentPos + 1;

                    if (Ext.isEmpty(text)) {
                        insertionPos = 2;
                    } else if (text.length == 3) {
                        insertionPos = 7;
                        /*
                    } else if (text.length > 2 && text.length < 5) {
                        insertionPos = text.length + 4;
                    } else {
                        insertionPos = text.length + 5;
                    */
                    } else if (text.length == 6) {
                        insertionPos = 11;
                    }
                    text = text + c;
                    textField.setValue("(" + text.slice(0, 3) + ") " + text.slice(3, 6) + "-" + text.slice(6));
                    textField.setCursorPosition(insertionPos);
                } else if (evt.isSpecialKey() || evt.isNavKeyPress()) {
                    stopEvent = false;
                }
                if (stopEvent) {
                    evt.stopEvent();
                }
            }
          }
        },
        {
          xtype: 'numberfield',
          fieldLabel: 'Zip',
          name: 'company[zip]',
          allowBlank: false,
          anchor: '100%'
        }
      ],
        buttons: [
            {
                text: 'Ok',
                handler: function() {
                    var myMask = new Ext.LoadMask(Ext.getBody(), {msg:"Please wait..."});

                    var window = this.up('window');
                    var form = this.up('form').getForm();
                    if (form.isValid()) {
                        myMask.show();
                        form.submit({
                            success: function() {
                                myMask.show();
                                window.close();
                                document.location = "/companies"
                            },
                            failure: function() {
                                myMask.hide();
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
