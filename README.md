# TODO List

## Description

A todo list with database implementation. The interface allows a user to add tasks to be displayed on the DOM. A user will enter their task, a category under which to file the task and a date the task should be accomplished by. All tasks are displayed on the right side of the DOM. Tasks are ordered by their status, uncompleted tasks will always appear above completed. An icon on the left side of the task shows what category the task belongs to. The task is displayed in the middle of the task container, the date it was added and the target date of completion are listed underneath. On the right side of the task are buttons to mark task completed, edit the task and delete it.

Editing the task will empty out the task container and allow the user to edit that task. Marking task complete will change the color from blue to pink and move it to the bottom of the task stack. The word completed will also appear on the left side of the task card. Only one task can be edited at a time. Confirming or canceling changes will allow the user to edit another.

All categories will be displayed as tags underneath the task input field. The user has the ability to create and delete custom tags here.
