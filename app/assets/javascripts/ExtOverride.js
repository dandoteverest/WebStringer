Ext.override(Ext.form.field.Text, {

    setCursorPosition: function(pos) {
        var el = this.getEl().query("input").first();
        if (el.createTextRange) {
            var range = el.createTextRange();
            range.move("character", pos);
            range.select();
        } else if(typeof el.selectionStart == "number" ) {
            el.focus();
            el.setSelectionRange(pos, pos);
        } else {
            alert('Method not supported');
        }
    },

    getCursorPosition: function() {
        var el = this.getEl().query("input").first();
        var rng, ii=-1;
        if (typeof el.selectionStart=="number") {
            ii=el.selectionStart;
        } else if (document.selection && el.createTextRange){
            rng=document.selection.createRange();
            rng.collapse(true);
            rng.moveStart("character", -el.value.length);
            ii=rng.text.length;
        }
        return ii;
    }

});

