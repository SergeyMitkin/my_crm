<?php
foreach ($retailpoint_data as $retailpoint) {
    echo '<option value="' . $retailpoint['id'] . '">'
        . $retailpoint['name'] . '</option>';
}
?>



