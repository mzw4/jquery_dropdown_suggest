

$(function() {
  $('#customer_id_input').dropdown_suggest('http://localhost:8888/plugin_test/ajax_test.php',
    {
      limit: 10,
      select_callback: function(entry) {
        alert(entry + ' selected!');
      }
    });
});