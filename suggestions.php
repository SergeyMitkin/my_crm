<?php

include 'db.conf.php';

header('Content-Type: application/json;charset=utf-8');

$suggestions = array();
if (isset($_GET['query']) && trim($_GET['query']) != '') {
	$query = $_GET['query'];

    $sql = "SELECT name, part, value from goods g LEFT OUTER JOIN barcodes b on g.id = b.good_id where  g.group_id not in (1426751,95207,3141198) AND (LOWER(g.name) like '%".$query."%' OR
    g.part like '".$query."%' OR value='".$query."') group by name;";

    $db = new MysqlWrapper();
    $data = $db->query($sql);
    if (null != $data ){
        while( null!=($row = $data->fetch_assoc()) && count($suggestions) < 8){
            $suggestions[] = array(
                'value' => $row['name'],//$row['name'],
                'data' => array(
                    $row['part'],
                    $row['value'] == "null" ? "" : $row['value'])
            );
        }
    }
    $db->disconnect();
}

function _strtolower($string) {
	$small = array('�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�', '�', '�');
	$large = array('�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�','�', '�', '�');
	return strtolower(str_replace($large, $small, $string));
}

echo json_encode(array('suggestions' => $suggestions),JSON_PRETTY_PRINT);

