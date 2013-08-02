
Ext.define('CustomerRacketDetailsPanel', {
  extend: 'Ext.panel.Panel',
  alias: 'widget.customer_racket_details',
  border: false,
  autoScroll: true,
  layout: {
    type: 'vbox',
    align: 'stretch'
  },
  racketMake: null,
  racketModel: null,
  stringPattern: null,
  gripSize: null,
  headSize: null,
  racketImage: null,

  items: [
  {
    xtype: 'panel',
    border: false,
                      style: 'margin-left: 10px; margin-right: 10px',
    itemId: 'topPanel',
    layout: {
      type: 'hbox',
      align: 'stretch'
    },
    height: 300,
    flex: 0,

    items: [
      {
        xtype: 'form',
        itemId: 'detailsPanel',
        width: 250,
        flex: 0,
        border: false,
        items: [
          {
            xtype: 'fieldcontainer',
            itemId: 'racketMakeContainer',
            layout: 'fit',
            items: [
            {
              xtype: 'displayfield',
              fieldLabel: 'Make',
              name: 'racket_make',
              itemId: 'racketMake'
            }
            ]
          },
          {
            xtype: 'fieldcontainer',
            layout: 'fit',
            itemId: 'racketModelContainer',
            items: [
            {
              xtype: 'displayfield',
              fieldLabel: 'Model',
              itemId: 'racketModel',
              name: 'racket_model'
            }
            ]
          },
          {
            xtype: 'fieldcontainer',
            layout: 'fit',
            itemId: 'stringPatternContainer',
            items: [
            {
              xtype: 'displayfield',
              fieldLabel: 'String Pattern',
              itemId: 'stringPattern',
              name: 'string_pattern'
            }
            ]
          },
          {
            xtype: 'fieldcontainer',
            layout: 'fit',
            itemId: 'gripSizeContainer',
            items: [
            {
              xtype: 'displayfield',
              fieldLabel: 'Grip Size',
              itemId: 'gripSize',
              name: 'grip_size'
            }
            ]
          },
          {
            xtype: 'fieldcontainer',
            itemId: 'headSizeContainer',
            layout: 'fit',
            items: [
            {
              xtype: 'displayfield',
              fieldLabel: 'Headsize',
              itemId: 'headSize',
              name: 'head_size'
            }
            ]
          }
        ]
      },
      {
        xtype: 'panel',
        flex: 0,
        border: false,
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
  },
  {
    xtype: 'form',
    border: false,
    itemId: 'notesForm',
    layout: 'fit',
    margin: 5,
    flex: 1,
    items: [
      {
        xtype: 'htmleditor',
        itemId: 'notes',
        name: 'customer_racket_notes',
        enableColors: false,
        minHeight: 50,
        fieldLabel: 'Notes',
        labelAlign: 'top'
      }
    ],

    buttonAlign: 'left',

    buttons: [
      {
        text: 'Update',
        handler: function() {
          this.up('form').getForm().submit();
        }
      }
    ]
  }
  ],

  initComponent: function() {
    this.callParent(arguments);
    var detailsPanel = this.getComponent('topPanel').getComponent('detailsPanel');
    if (detailsPanel) {      
      this.racketMake = detailsPanel.getComponent('racketMakeContainer').getComponent('racketMake');
      this.racketModel = detailsPanel.getComponent('racketModelContainer').getComponent('racketModel');
      this.stringPattern = detailsPanel.getComponent('stringPatternContainer').getComponent('stringPattern');
      this.gripSize = detailsPanel.getComponent('gripSizeContainer').getComponent('gripSize');
      this.headSize = detailsPanel.getComponent('headSizeContainer').getComponent('headSize');
      this.racketImage = this.getComponent('topPanel').getComponent('imagePanel').getComponent('racketImage');
    }
    this.notesEditor = this.getComponent('notesForm').getComponent('notes');
    Ext.StoreManager.lookup('racketStringingDetailsStore').on('load', this.racketDetailsLoaded, this);
  },

  resizeImage: function(dimensions) {
    var newSize = dimensions;
    if (dimensions.width > 300) {
      newSize.width = 300;
      newSize.height = (300 / dimensions.width) * dimensions.height;
    }
    return newSize;
  },

  racketDetailsLoaded: function(arg1, customer_rackets, arg3) {

    var v = arg1;
    this.racketMake.setValue(customer_rackets[0].getAssociatedData().rackets[0].manufacturer)
    this.racketModel.setValue(customer_rackets[0].getAssociatedData().rackets[0].model)
    this.stringPattern.setValue(customer_rackets[0].getAssociatedData().rackets[0].pattern)
    this.headSize.setValue(customer_rackets[0].getAssociatedData().rackets[0].head_size + " sq in")
    this.gripSize.setValue(customer_rackets[0].get('grip'));
    this.notesEditor.setValue(customer_rackets[0].get('notes'));
    this.racketImage.setSrc(customer_rackets[0].getAssociatedData().rackets[0].racket_image_url_medium);
    this.notesEditor.up('form').getForm().url = "/customer_rackets/" + customer_rackets[0].get('id') + "/update_customer_racket_notes";
  }

});
