<?php
session_start(); // Открываем сессию
require_once('db.conf.php'); // Подключаемся к БД через mysqli
require_once ('db.php'); // Подключаемся к БД через PDO
require_once('settings.php');
require_once('models/m_tasks.php');

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

// Создаём задачу
if (isset($_POST['ajax']) && $_POST['ajax'] == 'taskCreate'){

    $id = $_POST['id'];
    $task_title = $_POST['task_title'];
    $type = $_POST['task_type'];
    $deadline = $_POST['deadline'];
    $author = 'менеджер';
    $task_description = $_POST['task_description'];

    $marketer_array = $_POST['marketer'];
    $retailpoint_array = $_POST['retailpoint'];

    $last_inserted_task_id = setTask($id, $task_title, $type, $deadline, $author, $task_description, $marketer_array, $retailpoint_array);
    if ($last_inserted_task_id !== false){
        $last_inserted_task = getTask($last_inserted_task_id);
        echo json_encode($last_inserted_task);
    }
}

if (isset($_POST['ajax']) && $_POST['ajax'] == 'changeStatus'){
   $task_id = $_POST['task_id'];
   $marketer_id = $_POST['marketer_id'];
   $retailpoint_id = $_POST['retailpoint_id'];
   $status = $_POST['status'];

   echo json_encode(setImplementation($task_id, $marketer_id, $retailpoint_id, $status));
}

if (isset($_POST['ajax']) && $_POST['ajax'] == 'taskDelete'){
    $id = $_POST['id'];
    $response = deleteTask($id);
    echo json_encode($response);
}

if (isset($_POST['ajax']) && $_POST['ajax'] == 'coverImplementation'){
    $id = $_POST['id'];
    $response = coverImplementation($id);
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

$marketer_data = getMarketers();

// Получаем магазины
function getRetailpoints(){
    try {
        $q = "SELECT id, `name` FROM retailpoints";
        $sql = SQL::getInstance()->Select($q);
    }
    catch(PDOException $e){
        die("Error: ".$e->getMessage());
    }
    return $sql;
}

$retailpoint_data = getRetailpoints();

if (isset($_GET['ajax']) && $_GET['ajax'] == 'getTaskCreateAndDisplayDate'){
    $id = $_GET['id'];
    $task_data = getTaskCreateAndDisplayDate($id);

    echo json_encode($task_data);
}

if (isset($_GET['ajax']) && $_GET['ajax'] == 'getImplementations'){
    $task_id = $_GET['task_id'];
    $task_data = getImplementations($task_id);

    echo json_encode($task_data);
}

if (isset($_GET['ajax']) && $_GET['ajax'] == 'getTask'){
    $response = array();
    $id = $_GET['id'];

    $task_data = getTask($id);
    $selected_retailpoints = getSelectedRetailpoints($id);
    $selected_marketers = getSelectedMarketers($id);
    array_push($response, $task_data, $retailpoint_data, $selected_retailpoints, $marketer_data, $selected_marketers);
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