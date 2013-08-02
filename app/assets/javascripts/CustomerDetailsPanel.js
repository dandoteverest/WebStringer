

Ext.define('CustomerDetailsPanel', {
    extend: 'Ext.form.Panel',
    alias: 'widget.customer_details',
    border: false,
    layout: 'anchor',
    itemId: 'customerDetailsForm',
    buttonAlign: 'left',
    first_name: null,
    last_name: null,
    email: null,
    home_phone: null,
    cell_phone: null,
    balance: null,

    initComponent: function() {
        this.items = [
        {
            xtype: 'textfield',
            itemId: 'firstName',
            margin: 5,
            allowBlank: false,
            fieldLabel: 'First Name',
            name: 'customer[first_name]'
        }, {
            xtype: 'textfield',
            itemId: 'lastName',
            margin: 5,
            allowBlank: false,
            fieldLabel: 'Last Name',
            name: 'customer[last_name]'
        }, {
            xtype: 'textfield',
            itemId: 'cellPhone',
            margin: 5,
            fieldLabel: 'Phone # (c)',
            name: 'customer[cell_phone]'
        }, {
            xtype: 'textfield',
            itemId: 'homePhone',
            margin: 5,
            fieldLabel: 'Phone # (h)',
            name: 'customer[home_phone]'
        }, {
            xtype: 'textfield',
            itemId: 'email',
            margin: 5,
            fieldLabel: 'Email',
            name: 'customer[email]'
        }, {
            xtype: 'displayfield',
            itemId: 'balance',
            margin: 5,
            fieldLabel: 'Balance',
            name: 'customer[balance]'
        }]


        this.buttons = [
        {
            text: 'Update',
            handler: function() {
                this.up('form').getForm().submit({ method: 'PUT' });
            }
        }];
        this.callParent(arguments);
        this.firstName = this.getComponent('firstName');
        this.lastName = this.getComponent('lastName');
        this.homePhone = this.getComponent('homePhone');
        this.cellPhone = this.getComponent('cellPhone');
        this.email = this.getComponent('email');
        this.balance = this.getComponent('balance');
        this.customer_id = this.getComponent('customer_id');
        Ext.StoreManager.lookup('customerDetailsStore').on('load', this.customerLoaded, this);
    },

    customerLoaded: function(arg1, customer) {
        this.firstName.setValue(customer[0].get('first_name'));
        this.lastName.setValue(customer[0].get('last_name'));
        this.homePhone.setValue(customer[0].get('home_phone'));
        this.cellPhone.setValue(customer[0].get('cell_phone'));
        this.email.setValue(customer[0].get('email'));
        var balance = customer[0].get('current_bill');
        if (balance > 0) {
            this.balance.removeCls('positive_balance');
            this.balance.addCls('negative_balance');
        } else {
            this.balance.removeCls('negative_balance');
            this.balance.addCls('positive_balance');
        }
        this.balance.setValue(Ext.util.Format.usMoney(balance));

        this.getForm().url = "/customers/" + customer[0].get('id');
    }
});
