<?php
$arr = array();

if($_POST) {
  $limit = $_POST['limit'];	
}

for($i = 0; $i < 10000; $i++) {
  $arr[] = $i;
}

echo json_encode($arr);