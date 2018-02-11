var baseUrl = "http://localhost:53610/api/category";

$(document).ready(function(){    
    getCategories();

    $("#category-info").submit(function(event){
        upsertCategory();
        event.preventDefault();
    });

    $(".content button#add").click(function(){
        showAddCategoryBlock();
    });

    $(".category-info-back").click(function(event){
        var target = $(event.target);
        if( target.is($(".category-info-back"))){
            hideCategoryBlock()
        }
    });
});

function refreshCategories(categories){
    var tableBody = document.createElement('tbody');
    addTableHeader(tableBody);

    categories.forEach(category => {
        tableBody = appendCategory(category, tableBody);
    });

    $(".content table tbody").replaceWith(tableBody);
}

function getCategories(){
    $.get(baseUrl, function(response){
        refreshCategories(response.categories);
    });
}

function showAddCategoryBlock(){
    $(".category-info-form h1").text("Add category");
    $(".category-info-back").css("display", "block");
    $('input[name="name"]').val("");
    $('input[type="submit"]').val("Add");
    document.getElementById("category-info").setAttribute("data-action", "create");
}

function showUpdateCategoryBlock(category){
    $(".category-info-form h1").text("Update category");
    $(".category-info-back").css("display", "block");
    $('input[name="id"]').val(category.id);
    $('input[name="name"]').val(category.name);
    $('input[type="submit"]').val("Update");
    document.getElementById("category-info").setAttribute("data-action", "update");
}

function hideCategoryBlock(){
    $(".category-info-form h1").text("");
    $(".category-info-back").css("display", "none");
}

function appendCategory(category, tableBody){    
    var tableRow = document.createElement('tr');
    
    var id = document.createElement('td');
    id.innerHTML = category.id;
    tableRow.appendChild(id);

    var userId = document.createElement('td');
    userId.innerHTML = category.name;
    tableRow.appendChild(userId);

    var actionCell = document.createElement('td');
    var buttonUpdate = document.createElement("button");
    buttonUpdate.innerHTML = "Update";
    buttonUpdate.setAttribute("data-category-id", category.id);
    buttonUpdate.setAttribute("class", "button-update");
    buttonUpdate.addEventListener("click", function(){
        showUpdateCategoryBlock(category);
    });
    buttonUpdate.style.display = "inline-block";
    actionCell.appendChild(buttonUpdate);

    var buttonDelete = document.createElement("button");
    buttonDelete.innerHTML = "Delete";
    buttonDelete.setAttribute("data-category-id", category.id);
    buttonDelete.setAttribute("class", "button-delete");
    buttonDelete.addEventListener("click", function(){
        deleteCategory(category.id);
    });
    buttonDelete.style.display = "inline-block";
    actionCell.appendChild(buttonDelete);

    tableRow.appendChild(actionCell);

    tableBody.appendChild(tableRow);

    return tableBody;
}

function deleteCategory(id){
    $.ajax({
        url: baseUrl+"?ids=" + id,
        type: "delete",
        success: function(){
            getCategories();
        },
        error: function(){
            console.log("error delete category");
        }
    });
}

function addTableHeader(tableBody){
    var id = document.createElement('th');
    id.innerHTML = "Id";
    tableBody.appendChild(id);
    
    var name = document.createElement('th');
    name.innerHTML = "Name";
    tableBody.appendChild(name);

    var action = document.createElement('th');
    action.innerHTML = "Action";
    tableBody.appendChild(action);
}

function upsertCategory(){
    switch(document.getElementById("category-info").getAttribute("data-action")){
        case "create":{
            addCatogory();
            break;
        }
        case "update":{
            updateCategory();
            break;
        }
        default:{
            console.log("Can not identify action(create or update).")
        }
    }
}

function addCatogory(){
    $.post(baseUrl,
        $("#category-info").serialize())
        .success(function(){
            getCategories();
            hideCategoryBlock();
        })
        .error(function(){
            alert("Error")
        });
}

function updateCategory(){
    $.ajax({
        url: baseUrl,
        type: "put",
        data: $("#category-info").serialize(),
        success: function(){
            getCategories();
            hideCategoryBlock();
        },
        error: function(){
            alert("Error");
        }
    });
}