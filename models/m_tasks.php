<?php
require_once('db.conf.php'); // Подключаемся к БД через mysqli
require_once ('db.php'); // Подключаемся к БД через PDO
require_once('settings.php');

// Добавляем реализацию
function setImplementation($task_id, $marketer_id, $retailpoint_id, $status)
{

    try {
        $t = 'taskimplementations';
        $v = array(
            'task_id' => $task_id,
            'marketer_id' => $marketer_id,
            'retailpoint_id' => $retailpoint_id,
            'status' => $status
        );

        $sql = SQL::getInstance()->Insert($t, $v);
        $response = $sql;
    }
    catch (PDOException $e) {
        die("Error: " . $e->getMessage());
    }
    return $response;
}

function coverImplementation($id){

    try {
        $t = 'taskimplementations';
        $v = array(
            'is_covered' => 1,
        );
        $w = "id =" . $id;

        $sql = SQL::getInstance()->Update($t, $v, $w);
        $response = 1;
    }
    catch(PDOException $e){
        die("Error: ".$e->getMessage());
    }
    return $response;
}

function getTaskMarketers($task_id){
    try {
        $q = "SELECT distinct marketer_id FROM taskimplementations WHERE task_id = " . $task_id;
        $sql = SQL::getInstance()->Select($q);
    }
    catch(PDOException $e){
        die("Error: ".$e->getMessage());
    }

    return $sql;
}

// Получаем реализации
function getImplementations($task_id){
    try {
        // Подготовленное выражение
        $q = "SELECT taskimplementations.id, taskimplementations.created_at, taskimplementations.`status`, is_covered, marketers.name AS marketer_name,
        retailpoints.name AS retailpoint_name
        FROM taskimplementations 
        LEFT JOIN marketers ON taskimplementations.marketer_id = marketers.id
        LEFT JOIN retailpoints ON taskimplementations.retailpoint_id = retailpoints.id
        WHERE task_id = " . $task_id;

        $sql = SQL::getInstance()->Select($q); // Обращение к БД
    } catch (PDOException $e) {
        die("Error: " . $e->getMessage());
    }
    return $sql;
}


// Добавляем или редактируем задачу
function setTask($id = 0, $task_title, $type, $deadline, $author, $task_description, $marketer_array, $retailpoint_array){
    $response = '';

    // Добавляем данные в таблицу tasks
    try {
        $t = 'tasks';
        $v = array(
            'task_title' => $task_title,
            'type' => $type,
            'deadline' => $deadline,
            'author' => $author,
            'task_description' => $task_description
        );

        // Если Id задачи больше 0, значит задача редактируется
        if($id > 0) {
            $w = "id =" . $id; // Id редактируемой задачи
            // Обращаемся к БД
            $sql = SQL::getInstance()->Update($t, $v, $w);
            $response = $id;
        }

        // Иаче добавляем новую задачу
        else {
            $sql = SQL::getInstance()->Insert($t, $v);
            $id = $sql;
            $response = $sql;
        }

        // Если задача редактируется, удаляем предыдущих пользователей
        if($id > 0){
            $table = 'task_marketers';
            $where = "task_id = " . $id;
            $sql = SQL::getInstance()->Delete($table, $where);
        }

        // Добавляем данные в таблицу task-marketers
        $t= 'task_marketers';
        $marketer_count = count($marketer_array);

        for ($i=0; $i<$marketer_count; $i++){
            $v = array(
                'task_id' => $id,
                'marketer_id' => $marketer_array[$i],
            );
            SQL::getInstance()->Insert($t, $v);
        }

        // Если задача редактируется, удаляем предыдущие магазины
        if($id > 0){
            $table = 'task_retailpoints';
            $where = "task_id = " . $id;
            $sql = SQL::getInstance()->Delete($table, $where);
        }

        // Добавляем данные в таблицу task-marketers
        $t = 'task_retailpoints';
        $retailpoint_count = count($retailpoint_array);

        for ($i=0; $i<$retailpoint_count; $i++){
            $v = array(
                'task_id' => $id,
                'retailpoint_id' => $retailpoint_array[$i],
            );
            SQL::getInstance()->Insert($t, $v);
        }

    }
    catch(PDOException $e){
        die("Error: ".$e->getMessage());
    }

    return $response;
}

// Получаем список задач
function getTasks(){
    // Получаем данные задач на странице из БД
    try {
        // Подготовленное выражение
        $q = "SELECT * FROM tasks";
        $sql = SQL::getInstance()->Select($q); // Обращение к БД
    } catch (PDOException $e) {
        die("Error: " . $e->getMessage());
    }
    return $sql;
}

function getTasksByDate($date){
    try {
        // Подготовленное выражение
        $q = "SELECT * FROM tasks
            WHERE deadline = '" . $date."'";

        $sql = SQL::getInstance()->Select($q); // Обращение к БД
    } catch (PDOException $e) {
        die("Error: " . $e->getMessage());
    }
    return $sql;
}

function getTasksByMarketer($marketer_id){
    try {
        // Подготовленное выражение
        $q = "SELECT task_marketers.task_id, tasks.task_title, tasks.type_id FROM task_marketers
            LEFT JOIN tasks ON task_marketers.task_id = tasks.task_id
            WHERE marketer_id = '" . $marketer_id."'";

        $sql = SQL::getInstance()->Select($q); // Обращение к БД
    } catch (PDOException $e) {
        die("Error: " . $e->getMessage());
    }
    return $sql;
}

function getTask($id){
    try {
        // Подготовленное выражение
        $q = "SELECT * FROM tasks
        WHERE id = " . $id;
        $sql = SQL::getInstance()->Select($q); // Обращение к БД
    } catch (PDOException $e) {
        die("Error: " . $e->getMessage());
    }
    return $sql;
}

function getTaskCreateAndDisplayDate($id){
    try {
        // Подготовленное выражение
        $q = "SELECT created_at, first_display FROM tasks
        WHERE id = " . $id;
        $sql = SQL::getInstance()->Select($q); // Обращение к БД
    } catch (PDOException $e) {
        die("Error: " . $e->getMessage());
    }
    return $sql;
}

function deleteTask($id){
    $response = '';
    $id = (int)$id;

    // Удаляем задачу из таблицы tasks
    try{
        $table = 'tasks';
        $where = "id = " . $id;
        $sql = SQL::getInstance()->Delete($table, $where);
        $response = 'Задача удалена';
    }
    catch(PDOException $e){
        die("Error: ".$e->getMessage());
    }

    // Удаляем магазины из таблицы task_stores
    try{
        $table = 'task_retailpoints';
        $where = "task_id = " . $id;
        $sql = SQL::getInstance()->Delete($table, $where);
    }
    catch(PDOException $e){
        die("Error: ".$e->getMessage());
    }

    // Удаляем иполнителей из таблицы task_marketers
    try{
        $table = 'task_marketers';
        $where = "task_id = " . $id;
        $sql = SQL::getInstance()->Delete($table, $where);
    }
    catch(PDOException $e){
        die("Error: ".$e->getMessage());
    }

    return $response;
}

// Получаем актуальные статусы задачи
function getTaskStatuses($task_id){

    $data_status_string = ''; // Строка для параметра фильтра по статаусу

    try {
        $q = "SELECT `status`, `marketer_id` from taskimplementations where task_id = " . $task_id;
        $sql = SQL::getInstance()->Select($q);
    }
    catch(PDOException $e){
        die("Error: ".$e->getMessage());
    }

    // Если у задачиесть реализации, определяем их исполнителей и актуальные статусы
    if (!empty($sql)){

        $marketers = [];

        for ($i=0; $i<count($sql); $i++){
            $s = $sql[$i]['marketer_id'];
            $marketers[$s] = $sql[$i]['status'];
        }

        $actual_statuses = array_unique($marketers);

        $data_status_string = implode(' ', $actual_statuses);
    }

    return $data_status_string;
}

// Функция выбора магазинов задачи
function getSelectedRetailpoints($task_id, $is_ajax = ''){

        try {
            // Подготовленное выражение
            $q = "SELECT retailpoint_id FROM task_retailpoints WHERE task_id = " . $task_id;
            $sql = SQL::getInstance()->Select($q);
        } catch (PDOException $e) {
            die("Error: " . $e->getMessage());
        }

        // Если запрос пришёл через ajax, возвращаем строку с id исполнителей
    if ($is_ajax == 'ajax'){

        $retailpoints = [];
        $str = '';

        for ($i=0; $i<=count($sql); $i++){
           array_push($retailpoints, $sql[$i]['retailpoint_id']);
        }

        $str = ' ' . implode($retailpoints, ' ') . ' ';
        return $str;
    } else {

        return $sql;
    }
}

// Функция выбора исполнителей задачи
function getSelectedMarketers($task_id, $is_ajax = ''){

    try {
        // Подготовленное выражение
        $q = "SELECT marketer_id FROM task_marketers WHERE task_id = " . $task_id;
        $sql = SQL::getInstance()->Select($q);
    } catch (PDOException $e) {
        die("Error: " . $e->getMessage());
    }


    // Если запрос пришёл через ajax, возвращаем строку с id исполнителей
    if ($is_ajax == 'ajax'){

        $marketers = [];
        $str = '';

        for ($i=0; $i<=count($sql); $i++){
            array_push($marketers, $sql[$i]['marketer_id']);
        }

        $str = ' ' . implode($marketers, ' ') . ' ';
        return $str;
    } else {

        return $sql;
    }
}

