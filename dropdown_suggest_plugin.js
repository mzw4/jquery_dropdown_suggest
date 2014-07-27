
(function ($) {

  // Private variables
  var $dropdown = $('<div></div>').addClass('dropdown_suggest');
  var _settings;
  var _url;

  var _cacheSize = 10;
  var _cachedResults = {};
  var _cachedResultsKeys = [];
  var _cachedQueryResult = [];

  $.fn.dropdown_suggest = function(url, options) {

    // -------------------- Init plugin --------------------

    _url = url;

    _settings = $.extend({
      dataType: 'json',
      limit: 10,
      fade_time: 100,
      frontend_filter: false,
      select_callback: function() {},
    }, options);

    var $input = this;

    // -------------------- Event Bindings --------------------

    $input.on('click keyup', function(event) {
      event.preventDefault();
      var input = $input.val();
  
      // If arrow keys or enter are pressed, don't reload dropdown. If dropdown is hidden, down arrow opens it
      if(event.which == 40 && !$dropdown[0].hidden || event.which == 39 ||
        event.which == 38 || event.which == 37 || event.which == 13) {
        return;
      }

      // If the input is not empty, query for matching customer ids
      if(input) {
        $dropdown.data('selected_index', 'none');

        // If there are cached results, skip the ajax call
        if(_cachedResults[input]) {
          var suggestions = _cachedResults[input];
          populate_customer_dropdown(suggestions);
          _cachedQueryResult = suggestions;
        } else if(_cachedQueryResult) {
          // If the same set of data is being filtered, use the cached query results
          var suggestions = filterData(_cachedQueryResult, input);
          populate_customer_dropdown(suggestions);
          _cachedQueryResult = suggestions;
          _cachedResults[input] = suggestions;
          _cachedResultsKeys.push(input);
        } else {
          // Perform the ajax call
          ajax_call(input).done(function(data) {
            if(data && data.length > 0) {
              if(_settings.frontend_filter) {
                data = filterData(data, input);
              }
              _cachedQueryResult = data;
              _cachedResults[input] = data;
              _cachedResultsKeys.push(input);
              populate_customer_dropdown(data);
            } else {
              $dropdown.hide(_settings.fade_time);
            }
          });
        }

        // If the cache size exceeds the size limit, delete the oldest entry
        if(_cachedResultsKeys.length > _cacheSize) {
          var key = _cachedResultsKeys.shift();
          delete _cachedResults[key];
        }

      } else {
        $dropdown.hide(_settings.fade_time);
      }
  
    });

    // Update selection in customer dropdown if the arrow keys are pressed
    $input.on('keydown', function(event) {
      // If the input was empty, clear the query cache to start anew
      if(!$input.val()) {
        _cachedQueryResult = null;
      }

      var down = event.which == 40; // down arrow pressed
      var up = event.which == 38; // up arrow pressed

      if(!up && !down) return;

      event.preventDefault();
      var index = $dropdown.data('selected_index');
      var options = $dropdown.find('li');

      // If the user mouses over the dropdown, selection is cleared
      // Then if arrow pressed, set selected to first
      if(index == 'none') {
        index = 0;
      } else {
        if(down) {
          index = (index + 1) % options.length;
        } else if(up) {
          index = (index - 1) % options.length;
        }
      }

      // Update dropdown selected index
      $dropdown.data('selected_index', index);
      options.removeAttr('selected');
      options.eq(index).attr('selected', 'selected');
    });

    // If the mouse enters a dropdown element, highlight it and clear the selection
    $(document).on('mouseenter', '.customer_id_dropdown li', function(event) {
      $dropdown.data('selected_index', 'none');
      $dropdown.find('li').removeAttr('selected');
      $(event.target).attr('selected', 'selected');
    });

    // Hide the dropdown if clicked outside
    $(document).on('click', function(event) {
      if(!$input.is(event.target)) {
        $dropdown.hide(_settings.fade_time);
      }
    });

    // Select events
    $dropdown.on('click', function(event) {
      // Stop link activation
      event.preventDefault();
      $input.val($(event.target).data('id'));
      _settings.select_callback();
    });
    $input.keypress(function(event) {
      // Pressed enter
      if(event.which == 13) {
        event.preventDefault();
        if(!$dropdown[0].hidden && $dropdown.data('selected_index') !== 'none') {
          // Set value of input to the selected dropdown customer id
          var selected_val = $dropdown.find('li').eq($dropdown.data('selected_index')).data('id');
          $input.val(selected_val);
          // Hide dropdown
          $dropdown.hide(_settings.fade_time, function() {
            // Perform user defined callback
            _settings.select_callback(selected_val);
          });
        }
      }
    });

    // -------------------- Finalize elements --------------------

    $dropdown.hide();
    $input.after($dropdown);
    $input.attr('autocomplete', 'off')
    return $input;
  };

  /*
   * Filter the array according to the match string
   */
  function filterData(data, match_string) {
    return data.filter(function(entry) {
      return new RegExp('^' + match_string + '.*').test(entry)
    });
  }

  /**
   * Populates customer id dropdown
   */
  function populate_customer_dropdown(entries) {
    entries = entries.slice(0, _settings.limit);

    var list = $('<ul></ul>').addClass('list-group');
    entries.forEach(function(entry) {
      list.append($('<li></li>').text(entry).data('id', entry).addClass('list-group-item'));
    });

    $dropdown.html(list).show(_settings.fade_time, function() {
      // Reset dropdown selected index
      $dropdown.data('selected_index', 0);
      var options = $dropdown.find('li');
      options.removeAttr('selected');
      options.eq(0).attr('selected', 'selected');
    });
  }

  /*
   * Shows the dropdown error message
   */
  function show_dropdown_error(err) {
    var list = $('<ul></ul>').addClass('list-group');
    list.append($('<li></li>').text(entry).data('id', entry).addClass('list-group-item'));

    $dropdown.html(list).show(_settings.fade_time, function() {
      // Reset dropdown selected index
      $dropdown.data('selected_index', 0);
      var options = $dropdown.find('li');
      options.removeAttr('selected');
      options.eq(0).attr('selected', 'selected');
    });
  }

  /*
   * Makes an ajax call to the specified url
   */
  function ajax_call(match_string) {
    return $.ajax({
      type: _settings.type,
      url: _url,
      dataType: _settings.dataType,
      data: {
        match_string: match_string,
        limit: _settings.limit,
      }
    });
  }

} (jQuery));






// -------------------------- Test init --------------------------

// /**
//  * Retrieves customers matching the input string, and displays the results
//  */
// function get_matching_customers(match_string, limit) {
//   return $.ajax({
//     type: 'POST',
//     url: 'http://localhost:8888/ajax_test.php',
//     dataType: 'json',
//     data: {
//       // campaign_id: CAMPAIGN_ID,
//       match_string: match_string,
//       limit: limit,
//       // query_type: queryType
//     }
//   });
// }

$(function() {
  $('#customer_id_input').dropdown_suggest('http://localhost:8888/ajax_test.php',
    {
      limit: 10,
      frontend_filter: true,
      select_callback: function(entry) {
        alert(entry + ' selected!');
      }
    });
});



