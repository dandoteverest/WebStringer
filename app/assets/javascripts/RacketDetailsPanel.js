
Ext.define('RacketDetailsPanel', {
  extend: 'Ext.panel.Panel',
  alias: 'widget.racket_details',
  border: false,
  autoScroll: true,
  layout: 'fit',
  width: 600,
  height: 300,
  racketId: null,
  racketMake: null,
  racketModel: null,
  stringPattern: null,
  headSize: null,
  racketImage: null,

  buildItems: function() {
    var me = this;
    var stringStore = Ext.StoreManager.lookup('stringPatternStore');
    stringStore.load();

    this.items = [
      {
        xtype: 'panel',
        padding: "10 10 10 10",
        border: false,
        itemId: 'topPanel',
        layout: {
          type: 'hbox',
          align: 'stretch'
        },
        flex: 0,

        items: [
          {
            xtype: 'form',
            itemId: 'detailsPanel',
            defaults: {
                padding: '5 0 5 0',
                anchor: '100%'
            },
            border: false,
            items: [
              {
                xtype: 'hidden',
                name: 'id',
                itemId: 'racketId'
              },
              {
                xtype: 'combobox',
                autoScroll: true,
                typeAhead: true,
                allowBlank: false,
                minChars: 2,
                fieldLabel: 'Manufacturer',
                store: Ext.create('RacketManufacturerStore', { autoLoad: true}),
                displayField: 'name',
                valueField: 'id',
                name: 'racket[racket_manufacturer_id]',
                itemId: 'racketMake'
              },
              {
                xtype: 'textfield',
                fieldLabel: 'Model',
                itemId: 'racketModel',
                name: 'racket[model]'
              },
              {
                xtype: 'headsizespinner',
                fieldLabel: 'Headsize',
                itemId: 'headSize',
                step: 1,
                name: 'racket[head_size]'
              },
              {
                xtype: 'combobox',
                autoScroll: true,
                typeAhead: true,
                allowBlank: false,
                minChars: 2,
                fieldLabel: 'String Pattern',
                store: stringStore,
                displayField: 'name',
                valueField: 'id',
                name: 'racket[string_pattern_id]',
                itemId: 'stringPattern'
              },
              {
                xtype: 'filefield',
                fieldLabel: 'Photo',
                buttonText: 'Upload Photo...',
                name: 'racket[image]'
              }
            ]
          },
          {
            xtype: 'panel',
            flex: 0,
            border: false,
            style: 'padding-left: 10px',
            itemId: 'imagePanel',
            width: 300,
            items: [
              {
                xtype: 'image',
                src: '',
                itemId: 'racketImage'
              }
            ]
          }
        ]
      }
    ]
    
    this.buttons = [
      {
        text: 'Update',
        handler: function() {
          var formPanel = me.down('form');
          var form = formPanel.getForm();
          if (form.isValid()) {
              form.submit({
                url: "/rackets/" + formPanel.getComponent('racketId').getValue() + "/update_data",
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
      }
    ];
  },

  initComponent: function() {
    this.buildItems();
    this.callParent(arguments);
    var detailsPanel = this.getComponent('topPanel').getComponent('detailsPanel');
    if (detailsPanel) {      
      this.racketId = detailsPanel.getComponent('racketId');
      this.racketMake = detailsPanel.getComponent('racketMake');
      this.racketModel = detailsPanel.getComponent('racketModel');
      this.stringPattern = detailsPanel.getComponent('stringPattern');
      this.headSize = detailsPanel.getComponent('headSize');
      this.racketImage = this.getComponent('topPanel').getComponent('imagePanel').getComponent('racketImage');

      detailsPanel.getForm().on('beforeaction', function(form, action) {
        //action.type = 'update';
      });
    }
    Ext.StoreManager.lookup('racketDetailsStore').on('load', this.racketDetailsLoaded, this, { single: true });

    this.addEvents(
      'updated',
      'updatecanceled',
      'updatefailed');
  },

  racketDetailsLoaded: function(arg1, racket) {

    this.racketId.setValue(racket.first().get('id'));
    this.racketMake.setValue(racket.first().get('racket_manufacturer_id'));
    this.racketModel.setValue(racket.first().get('model'));
    this.stringPattern.setValue(racket.first().get('string_pattern_id'));
    this.headSize.setValue(racket.first().get('head_size') + " sq in");
    this.racketImage.setSrc(racket.first().get('racket_image_url_medium'));
  }

});
