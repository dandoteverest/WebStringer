
Ext.define('StringDetailsPanel', {
      extend: 'Ext.panel.Panel',
      alias: 'widget.string_details',
      border: false,
      autoScroll: true,
      layout: 'fit',
      stringId: null,
      stringMake: null,
      stringGauge: null,
      stringConstruction: null,


      initComponent: function() {
          var me = this;

          this.manufacturerStore = Ext.create('StringManufacturerStore', {});

          this.items = [
          {
              xtype: 'panel',
              border: false,
              itemId: 'topPanel',
              layout: {
                  type: 'hbox',
                  align: 'stretch'
              },
        //height: 350,
              flex: 0,

              items: [
              {
                  xtype: 'form',
                  region: 'north',
                  itemId: 'detailsPanel',
                  border: false,
                  margin: "15, 10, 10, 10",
                  height: 200,
                  width: 300,
                  flex: 0,
                  items: [
                  {
                      xtype: 'hidden',
                      name: 'string_id',
                      itemId: 'stringId'
                  }, {
                      xtype: 'combobox',
                      autoScroll: true,
                      typeAhead: true,
                      allowBlank: false,
                      minChars: 2,
                      anchor: "100%",
                      fieldLabel: 'Manufacturer',
                      store: me.manufacturerStore,
                      displayField: 'name',
                      valueField: 'id',
                      name: 'tennis_string[string_manufacturer_id]',
                      itemId: 'stringMake'
                  }, {
                      xtype: 'textfield',
                      fieldLabel: 'Name',
                      anchor: '100%',
                      itemId: 'stringName',
                      name: 'tennis_string[name]'
                  }, {
                      xtype: 'stringgaugespinner',
                      fieldLabel: 'Gauge',
                      anchor: '100%',
                      itemId: 'stringGauge',
                      name: 'tennis_string[gauge]'
                  }, {
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
                      name: 'tennis_string[string_construction_id]',
                      itemId: 'stringConstruction'
                  }, {
                      xtype: 'filefield',
                      fieldLabel: 'Photo',
                      buttonText: 'Upload Photo...',
                      anchor: '100%',
                      name: 'tennis_string[image]'
                  }]
                
              }, {
                  xtype: 'panel',
                  flex: 0,
                  border: false,
                  itemId: 'imagePanel',
                  width: 310,
                  items: [
                  {
                      xtype: 'image',
                      src: '',
                      itemId: 'stringImage'
                  }]
              }]
          }];
      
          this.buttons = [
          {
              text: 'Update',
              border: false,
              handler: function() {
                  var formPanel = me.down('form');
                  var form = formPanel.getForm();
                  if (form.isValid()) {
                      form.submit({
                          url: "/tennis_strings/" + formPanel.getComponent('stringId').getValue() + "/update_data",
                          failure: function() {
                              me.fireEvent('updatefailed');
                          },
                          success: function() {
                              me.fireEvent('updated');
                          }
                      });
                  }
              }
          }, {
              text: 'Cancel',
              handler: function() {
                  me.fireEvent('updatecanceled');
              }
          }];

        this.callParent(arguments);
        var detailsPanel = this.getComponent('topPanel').getComponent('detailsPanel');
        if (detailsPanel) {
            this.stringId = detailsPanel.getComponent('stringId');
            this.stringMake = detailsPanel.getComponent('stringMake');
            this.stringName = detailsPanel.getComponent('stringName');
            this.stringGauge = detailsPanel.getComponent('stringGauge');
            this.stringConstruction = detailsPanel.getComponent('stringConstruction');
            this.stringImage = this.getComponent('topPanel').getComponent('imagePanel').getComponent('stringImage');
        }

        var store = Ext.create('StringDetailsStore', {});
        store.on('load', this.stringDetailsLoaded, this);
        store.load({url: store.getProxy().url + "/" + this.string + ".json"});

        Ext.StoreManager.lookup('stringConstructionStore').load();

        this.addEvents(
          'updated',
          'updatecanceled',
          'updatefailed');
    },

    onRender: function() {
        this.manufacturerStore.load();
        this.callParent(arguments);
    },

    stringDetailsLoaded: function(arg1, tennis_string) {
        if (tennis_string) {
            this.stringId.setValue(tennis_string.first().get('id'));
            this.stringMake.setValue(tennis_string.first().get('string_manufacturer_id'));
            this.stringName.setValue(tennis_string.first().get('name'));
            this.stringGauge.setValue(tennis_string.first().get('gauge'));
            this.stringConstruction.setValue(tennis_string.first().get('string_construction_id'));
            this.stringImage.setSrc(tennis_string.first().get('string_image_url_medium'));
        }
    }
});
