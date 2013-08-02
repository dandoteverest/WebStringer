Ext.define('NewLoginDialog', {
  extend: 'Ext.panel.Panel',
  alias: 'widget.newlogindialog',

  margin: 5,
  border: false,
  layout: 'fit',

  loginName: null,

  modal: true,

  items: [
    {
      xtype: 'form',
      border: false,
      //standardSubmit: true,
      url: '/users',
      items: [
        {
          xtype: 'textfield',
          name: 'login',
          itemId: 'loginName',
          allowBlank: false,
          fieldLabel: 'Email'
        },
        {
          xtype: 'textfield',
          inputType: 'password',
          name: 'password',
          allowBlank: false,
          fieldLabel: 'Passsword'
        },
        {
          xtype: 'textfield',
          inputType: 'password',
          name: 'password_verify',
          allowBlank: false,
          fieldLabel: 'Verify Passsword'
        },
        {
          xtype: 'textfield',
          name: 'company',
          allowBlank: true,
          fieldLabel: 'Company'
        }
      ],

      buttons: [
        {
          text: 'Ok',
          handler: function() {
            var form = this.up('form').getForm();
            if (form.isValid()) {
              form.submit({
                params: Ext.Ajax.extraParams,
                success: function() {
                  alert("account created!");
                },
                failure: function() {
                  alert("account creation failed!");
                }
              });
            }
          }
        },
        {
          text: 'Cancel',
          handler: function() {
            this.up('window').hide();
          }
        }
      ]
    }
  ],

  initComponent: function() {
    var me = this;
    this.callParent(arguments);
    if (this.loginName) {
      this.down('#loginName').setValue(this.loginName);
    }

    this.on('afterrender', function() {
      me.down('#loginName').focus(true, 500);
    });
  },

  show: function() {
    this.callParent(arguments);
    if (this.loginFailed) {
      Ext.Msg.alert("Error", "Login or Password is incorrect.  Please try again");
    }
  }
});
