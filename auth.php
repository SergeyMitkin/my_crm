<?php
session_start(); // Открываем сессию
require_once('db.conf.php'); // Подключаемся к БД через mysqli
require_once ('db.php'); // Подключаемся к БД через PDO
require_once('settings.php');
require_once ('madals/m_tasks.php');

$db = false;
$shop_id = false;
$shopname = false;
$store_id = false;

if (isset($_POST['shop_manager'])) {
    $_SESSION['shop_manager'] = $_POST['shop_manager'];
}

if (isset($_POST['manager_password']) && md5($_POST['manager_password'].'VOMOLOKO') == $manager_password) {
    $_SESSION['manager_authorized'] = true;
}

if (isset($_POST['manager_exit'])) {
    $_SESSION['manager_authorized'] = false;
    $_SESSION['shop_id'] = false;
}

$tasks = getTasks();
$statuses = getStatuses();

if (isset($_POST['ajax']) && $_POST['ajax'] == 'taskCreate'){
    $last_inserted_task_id = setTask($_POST['task_id']);
    if ($last_inserted_task_id !== false){
        $last_inserted_task = getTask($last_inserted_task_id);
        echo json_encode($last_inserted_task);
    }
}

if (isset($_POST['ajax']) && $_POST['ajax'] == 'changeStatus'){
   $task_id = $_POST['task_id'];
   $marketer_id = $_POST['marketer_id'];
   $store_id = $_POST['store_id'];
   $status_id = $_POST['status_id'];

   echo json_encode(setImplement($task_id, $marketer_id, $store_id, $status_id));
}

if (isset($_POST['ajax']) && $_POST['ajax'] == 'taskDelete'){
    $task_id = $_POST['task_id'];
    $response = deleteTask($task_id);
    echo json_encode($response);
}

if (isset($_POST['ajax']) && $_POST['ajax'] == 'coverImplement'){
    $implement_id = $_POST['implement_id'];
    $response = coverImplement($implement_id);
    echo json_encode($response);
}


// Получаем исполнителей
function getMarketers(){
    try {
        $q = "SELECT id, `name` FROM marketers";
        $sql = SQL::getInstance()->Select($q);
    }
    catch(PDOException $e){
        die("Error: ".$e->getMessage());
    }
    return $sql;
}

$marketers_data = getMarketers();

// Получаем магазины
function getStores(){
    try {
        $q = "SELECT id, `name` FROM stores";
        $sql = SQL::getInstance()->Select($q);
    }
    catch(PDOException $e){
        die("Error: ".$e->getMessage());
    }
    return $sql;
}

$stores_data = getStores();

if (isset($_GET['ajax']) && $_GET['ajax'] == 'getTaskCreateAndDisplayDate'){
    $task_id = $_GET['task_id'];
    $task_data = getTaskCreateAndDisplayDate($task_id);

    echo json_encode($task_data);
}

if (isset($_GET['ajax']) && $_GET['ajax'] == 'getImplements'){
    $task_id = $_GET['task_id'];
    $task_data = getImplements($task_id);

    echo json_encode($task_data);
}

if (isset($_GET['ajax']) && $_GET['ajax'] == 'getTask'){
    $response = array();

    $task_data = getTask($_GET['task_id']);
    $selected_stores = getSelectedStores($_GET['task_id']);
    $selected_marketers = getSelectedMarketers($_GET['task_id']);
    array_push($response, $task_data, $stores_data, $selected_stores, $marketers_data, $selected_marketers);
    echo json_encode($response);
}

if (isset($_GET['ajax']) && $_GET['ajax'] == 'getTasksByDate'){
    $date = $_GET['date'];
    $tasks = getTasksByDate($date);
    echo json_encode($tasks);
}

if (isset($_GET['ajax']) && $_GET['ajax'] == 'getTasksByMarketer'){
    $marketer_id = $_GET['marketer_id'];
    $tasks = getTasksByMarketer($marketer_id);
    echo json_encode($tasks);
}

if (isset($_GET['ajax']) && $_GET['ajax'] == 'getTasks'){
    $tasks = getTasks();
    echo json_encode($tasks);
}

if (isset($_GET['ajax']) && $_GET['ajax'] == 'getStatuses'){
    $statuses = getStatuses();
    echo json_encode($statuses);
}

if (isset($_GET['ajax']) && $_GET['ajax'] == 'getMarketers'){
    $marketers = getMarketers();
    echo json_encode($marketers);
}


/**
 * @param $db
 * @return array
 */
function load_shops($db)
{
    $shops = array();
    $sql = "SELECT id, name, ipv4 as ip, store_id, address from retailpoints WHERE closed is NULL order by name;";
    $data = $db->query($sql);
    if (null != $data) {
        while (null != ($row = $data->fetch_assoc())) {
            $shops[] = array(
                "ip" => $row['ip'],
                "title" => $row['name'],
                "store_id" => $row['store_id'],
                "address" => $row['address'],
                "id" => $row['id']);
        }
    }
    return $shops;
}

while(!isset($_SESSION['shops']) || sizeof($_SESSION['shops'])<1 || sizeof($_SESSION['shops'][0])<4) { //shops are loaded to session
    if($db===false) {
        $db = new MysqlWrapper();
    }
    $shops = load_shops($db);
    $_SESSION['shops'] = $shops;
}
$shops = $_SESSION['shops'];


if (isset($_SESSION['shop_manager'])){
    if(!isset($_SESSION['shopname']) || $_SESSION['shopname'] !=$_SESSION['shop_manager']) {

        foreach ($shops as $shop) {
            if ($shop['title'] == $_SESSION['shop_manager']) {
                $shopname = $shop['title'];
                $shop_id = $shop['id'];
                $store_id = $shop['store_id'];
                $_SESSION['shop_id'] = $shop_id;
                $_SESSION['shopname'] = $shopname;
                $_SESSION['store_id'] = $store_id;
                break;
            }
        }
    } else {
        $shop_id = $_SESSION['shop_id'];
        $shopname = $_SESSION['shopname'];
        $store_id = $_SESSION['store_id'];
    }

} else if(!isset($_SESSION['shop_id']) || !isset($_SESSION['shopname']) || !isset($_SESSION['$store_id'] ) ) { //session authorized
    $ip = $_SERVER['REMOTE_ADDR'];

    foreach ($shops as $shop) {
        if ($shop['ip'] == $ip) {
            $shopname = $shop['title'];
            $shop_id = $shop['id'];
            $store_id = $shop['store_id'];
            $_SESSION['shop_id'] = $shop_id;
            $_SESSION['shopname'] = $shopname;
            $_SESSION['store_id'] = $store_id;
            break;
        }
    }
}

if(!isset($_SESSION['cashiers'])) { //cashier authorized
    if($db===false) {
        $db = new MysqlWrapper();
    }
    $cashiers = array();
    $sql = "SELECT id, name from marketers where retired is NULL order by name;";
    $data = $db->query($sql);
    if (null != $data ){
        while(null!=($row = $data->fetch_assoc())) {
            $cashiers[] = $row['name'];
        }
    }
    $_SESSION['cashiers'] = $cashiers;
} else {
    $cashiers = $_SESSION['cashiers'];
}

if( !($db===false)) {
    $db->disconnect();
}