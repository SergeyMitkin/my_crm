<?php
session_start(); // Открываем сессию
require_once('db.conf.php'); // Подключаемся к БД через mysqli
require_once ('db.php'); // Подключаемся к БД через PDO
require_once('settings.php');

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


// Добавляем или задачу
function setTask(){
    $response = '';

    // Добавляем данные в таблицу tasks
    try {
        $t = 'tasks';
        $v = array(
            'task_title' => $_POST['task_title'],
            'type_id' => $_POST['task_type'],
            'deadline' => $_POST['deadline'],
            'author' => 'менеджер',
            'status_id' => 1,
            'task_description' => $_POST['task_description']

        );
            $sql = SQL::getInstance()->Insert($t, $v);

        // Добавляем данные в таблицу task-marketers
        $t= 'task_marketers';
        $marketers_count = count($_POST['marketer']);

        for ($i=0; $i<$marketers_count; $i++){
            $v = array(
                'task_id' => $sql,
                'marketer_id' => $_POST['marketer'][$i],
            );
            SQL::getInstance()->Insert($t, $v);
        }

        // Добавляем данные в таблицу task-marketers
        $t = 'task_stores';
        $marketers_count = count($_POST['store']);

        for ($i=0; $i<$marketers_count; $i++){
            $v = array(
                'task_id' => $sql,
                'store_id' => $_POST['store'][$i],
            );
            SQL::getInstance()->Insert($t, $v);
        }

    }
    catch(PDOException $e){
        die("Error: ".$e->getMessage());
    }

    $response = 'Задача добавлена';
    return $response;
}

// Получем ajax-запрос из get или post параметра
function getAjax(){
    $isAjax = '';

    if (isset($_GET['ajax'])){
        $isAjax = $_GET['ajax'];
    }elseif (isset($_POST['ajax'])){
        $isAjax = $_POST['ajax'];
    }else{
        $isAjax = false;
    }

    return $isAjax;
};

if (isset($_POST['ajax']) && $_POST['ajax'] == 'taskCreate'){
    echo setTask();
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

// Получаем типы задач
function getTaskTypes(){
    try {
        $q = "SELECT * FROM task_types";
        $sql = SQL::getInstance()->Select($q);
    }
    catch(PDOException $e){
        die("Error: ".$e->getMessage());
    }

    return $sql;
}

$task_types_data = getTaskTypes();

// Получаем список задач
function get_tasks($db){
    $tasks = array();
    $sql = "SELECT * FROM tasks";
    $data = $db->query($sql);
    //var_dump($data);

     if (null != $data) {
        while (null != ($row = $data->fetch_assoc())) {
            //var_dump($row);

            $tasks[] = array(
                "task_id" => $row['task_id'],
                "task_title" => $row['task_title'],
                "task_type" => $row['task_type'],
                "store_id" => $row['store_id'],
                "author" => $row['author'],
                "status_id" => $row['status_id'],
                "task_description" => $row['task_description']
            );

        }
    }
    return $tasks;
}

//$tasks = get_tasks($db);
if($db===false) {
    $db = new MysqlWrapper();
}
$tasks = get_tasks($db);
// var_dump($tasks);


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