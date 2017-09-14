function updateCounters() {
  var todoCount = $(".todo").size();
  var completedCount = $(".success").size();
  var uncompletedToDoCount = todoCount - completedCount;
  //

  $("#total-count").html(todoCount);
  $("#completed-count").html(completedCount);
  $("#todo-count").html(uncompletedToDoCount);

}

function toggleDone() {
  var checkbox = this;
  var tableRow = $(this).parent().parent();

  var todoId = tableRow.data('id');
  var isCompleted = !tableRow.hasClass("success");

  $.ajax({
    type: "PUT",
    url: "/todos/" + todoId + ".json",
    data: JSON.stringify({
      todo: { completed: isCompleted }
    }),
    contentType: "application/json",
    dataType: "json"
  })
  .done(function(data) {
    console.log(data);

    tableRow.toggleClass("success", data.completed);

    updateCounters();
  });
}

function submitTodo(event) {
// stop the form from doing the default action, submitting...
  event.preventDefault();
  resetErrors();

  var title = $("#todo_title").val();

  createTodo(title);

  $("#todo_title").val(null);
  updateCounters();
}

function createTodo(title) {
  var newTodo = { title: title, completed: false };
  $.ajax({
    type: "POST",
    url: "/todos.json",
    data: JSON.stringify({
        todo: newTodo
    }),
    contentType: "application/json",
    dataType: "json"})
  .done(function(data) {
    console.log(data);

    var checkboxId = data.id;

    var label = $('<label></label>')
      .attr('for', checkboxId)
      .html(title);

    var checkbox = $('<input type="checkbox" value="1" />')
      .attr('id', checkboxId)
      .bind('change', toggleDone);

    var tableRow = $('<tr class="todo"></td>')
      .attr('data-id', checkboxId)
      .append($('<td>').append(checkbox))
      .append($('<td>').append(label));

    $("#todoList").append( tableRow );

    updateCounters();
  })

  .fail(function(error) {
    console.log(error);

    error_message = error.responseJSON.title[0];
    showError(error_message);
  });
}

function showError(message) {
  var errorHelpBlock = $('<span class="help-block"></span>')
    .attr('id', 'error_message')
    .text(message);

  $("#formgroup-title")
    .addClass("has-error")
    .append(errorHelpBlock);
}

function resetErrors() {
  $("#error_message").remove();
  $("#formgroup-title").removeClass("has-error");
}



var CountCompleted = 0;

function cleanUpDoneTodos(event) {
  var CountSession = $(".success").size();
  CountCompleted = CountCompleted + CountSession;
  event.preventDefault();
  $.each($(".success"), function(index, tableRow) {
    todoId = $(tableRow).data('id');
    deleteTodo(todoId);
  });
  $("#deleted-count").html(CountCompleted);
}


function deleteTodo(todoId) {
  $.ajax({
    type: "DELETE",
    url: "/todos/" + todoId + ".json",
    contentType: "application/json",
    dataType: "json"
  })
  .done(function(data) {
    $('tr[data-id="'+todoId+'"]').remove();
    updateCounters();
  });
}

$(document).ready(function() {

  $("input[type=checkbox]").bind('change', toggleDone);
  $("form").bind('submit', submitTodo);
  $("#clean-up").bind('click', cleanUpDoneTodos);
  updateCounters();
});
