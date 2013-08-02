Ext.define('NewCustomerDialog', {
    extend: 'Ext.window.Window',
    title: 'Add New Customer',
    style: 'padding: 5px',
    layout: 'fit',

    initComponent: function() {
        var me = this;
        this.items = [
        {
          xtype: 'form',
          url: '/customers',
          fieldDefaults: {
            margin: 5
          },
          items: [
            {
              xtype: 'textfield',
              fieldLabel: 'First Name',
              name: 'customer[first_name]',
              allowBlank: false,
              anchor: '100%'
            },
            {
              xtype: 'textfield',
              fieldLabel: 'Last Name',
              name: 'customer[last_name]',
              allowBlank: false,
              anchor: '100%'
            },
            {
              xtype: 'textfield',
              fieldLabel: 'Home Phone',
              name: 'customer[home_phone]',
              allowBlank: true,
              anchor: '100%'
            },
            {
              xtype: 'textfield',
              fieldLabel: 'Cell Phone',
              name: 'customer[cell_phone]',
              allowBlank: true,
              anchor: '100%'
            },
            {
              xtype: 'textfield',
              fieldLabel: 'E-Mail',
              name: 'customer[email]',
              allowBlank: true,
              anchor: '100%'
            }
          ],
          buttons: [
            {
              text: 'Ok',
              handler: function() {
                var myMask = new Ext.LoadMask(Ext.getBody(), {msg:"Please wait..."});
                myMask.show();
                
                var window = this.up('window');
                var form = this.up('form').getForm();
                if (form.isValid()) {
                  form.submit({
                    success: function(f, a) {
                        var response = Ext.decode(a.response.responseText);
                        if (response.url) {
                            response.customer.url = response.url;
                        }
                        me.fireEvent('customeradded', me, new CustomerRackets(response.customer));
                      //Ext.StoreManager.lookup('customersStore').load({ params: { selected_customer_id: a.result.customer_id } });
                        myMask.hide();
                        window.close();
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
        }];
        this.callParent(arguments);
    },

    initEvents: function() {
        this.addEvents('customeradded');
        this.callParent(arguments);
    }
});
