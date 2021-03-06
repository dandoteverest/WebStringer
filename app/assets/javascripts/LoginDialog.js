Ext.define('LoginDialog', {
  extend: 'Ext.panel.Panel',
  alias: 'widget.logindialog',

  layout: 'fit',
  margin: 5,
  border: false,

  loginName: null,

  modal: true,

  items: [
    {
      xtype: 'form',
      border: false,
      standardSubmit: true,
      url: '/users/login',
      items: [
        {
          xtype: 'textfield',
          name: 'login',
          itemId: 'loginName',
          allowBlank: false,
          fieldLabel: 'Login'
        },
        {
          xtype: 'textfield',
          inputType: 'password',
          name: 'password',
          allowBlank: false,
          fieldLabel: 'Passsword',
          listeners: {
            specialkey: function(field, evt) {
              if (evt.getKey() == evt.ENTER) {
                var form = this.up('form').getForm();
                if (form.isValid()) {
                  form.submit({ params: Ext.Ajax.extraParams });
                }
              }
            }
          }
        }
      ],

      buttons: [
        {
          text: 'Ok',
          handler: function() {
            var form = this.up('form').getForm();
            if (form.isValid()) {
              form.submit({ params: Ext.Ajax.extraParams });
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
