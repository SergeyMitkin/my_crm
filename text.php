<select id="select-date-filter" onchange="onDateSelectionChange (this)">
    <option value="all">Все задачи</option>
    <?
    foreach ($statuses as $status) {
        echo '<option value="' . $status['status_id'] . '">'
            . $status['status_name'] . '</option>';
    }
    ?>
</select>




