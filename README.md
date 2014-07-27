jquery_dropdown_suggest
=======================

Dropdown suggest jQuery plugin. Data can be preloaded or pulled via ajax.

Usage:

$your_element.dropdown_suggest(ajax_url);

By default, your ajax request should return a json encoded array. You can change the datatype in the options if desired.

Options:

var options = {
  dataType: string, // return type of the ajax call
  limit: int, // number of suggestions to display in the dropdown
  fade_time: int, // millis delay for the dropdown animation. If you don't want an animation, use 0
  clientside_filter: bool,  // whether or not to filter on the clientside. Set to false if you are filtering your data in the ajax call
  select_callback: function // action to perform when an suggestion item is selected
}

$your_element.dropdown_suggest(ajax_url, options);

