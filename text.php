SELECT DISTINCT taskimplementations.marketer_id FROM task_marketers
LEFT JOIN taskimplementations ON task_marketers.task_id = taskimplementations.task_id
WHERE task_marketers.task_id = 328 AND taskimplementations.marketer_id NOT IN (SELECT DISTINCT taskimplementations.marketer_id FROM task_marketers
LEFT JOIN taskimplementations ON task_marketers.task_id = taskimplementations.task_id
WHERE task_marketers.task_id = 328 ANd `status` = 'Выполнена')
UNION
SELECT DISTINCT marketer_id FROM task_marketers WHERE task_id = 328
AND marketer_id NOT IN (
SELECT DISTINCT taskimplementations.marketer_id FROM task_marketers
LEFT JOIN taskimplementations ON task_marketers.task_id = taskimplementations.task_id
WHERE task_marketers.task_id = 328 ANd `status` = 'Выполнена')
;
