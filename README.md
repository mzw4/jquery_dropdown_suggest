jQuery Dropdown Suggest
=======================

Dropdown suggest jQuery plugin. Data can be preloaded or pulled via ajax.

### Details

This plugin is mainly intended for datasets that are too large to cache in the client, so it receives data via an ajax call on each keypress.
That way, the user can perform filtering on the server side and return filtered suggestions. Ie. limit results for an SQL query.

To improve performance, this plugin caches the most recent filtered results for specific query strings on the client.

Optionally, the user may decide to have the plugin perform all filtering on the clientside, by setting the `clientside_filter` option to true.
In that case, the plugin also caches the most recent query result if the same set of data is being filtered. In other words, if you keep typing into the input box, an ajax call will only be made on the first letter, and everything else will be filtered on the query results produced for the previous string.

### How to use:

```
$('your_element').dropdown_suggest('ajax_url');
```

The ajax request will receive two parameters:

{
  match_string: string  // query input to filter against
  limit: int            // number of suggestions to display
}

By default, your ajax request should return a json encoded array. You can change the datatype in the options if desired.

#### Options:

(Default values are displayed)

```
var options = {
  requestType: 'POST'             // 'GET' or 'POST'
  dataType: 'json',               // return type of the ajax call
  limit: 10,                      // number of suggestions to display in the dropdown
  fade_time: 100,                 // millis delay for the dropdown animation. If you don't want an animation, use 0
  clientside_filter: true,        // whether or not to filter on the clientside. Set to false if you are filtering your data in the ajax call
  select_callback: function() {}  // action to perform when an suggestion item is selected
}

$('your_element').dropdown_suggest('ajax_url', options);
```

## Contributors

[Mike Wang](https://github.com/mzw4)