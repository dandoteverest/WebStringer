// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults
function clickLink(linkobj) {
     var onclickHandler = linkobj.getAttribute('onclick')
     if (onclickHandler == null) document.location = linkobj.getAttribute('href');

     //pass self reference back to handler in case handler normally called with 'this', other params will fail:
     else eval(onclickHandler(linkobj));
}

// Disables the submit action of a textfield by hitting 'Enter'.  Add it to a texfield as such:
//    <%= f.text_field :attribute, :onkeypress => "return disableEnterSubmit(event);" %>
function disableEnterSubmit(e) {
  // 'window.event' is IE, 'e.which' is Firefox
  var key = (window.event ? window.event.keyCode : e.which);

  return (key != 13);
}

function toggleElementVisibleWithCollapseImage(element_id, image_id) {
  if ($(image_id).src.include('large_expand.gif')) {
    $(image_id).src = $(image_id).src.sub('large_expand', 'large_collapse');
    new Effect.Appear($(element_id), {duration:0.5});
  } else {
    $(image_id).src = $(image_id).src.sub('large_collapse', 'large_expand');
    new Effect.Fade($(element_id), {duration:0.5});
  }
}
