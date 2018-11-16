// import db from './app';
firebase.initializeApp({
    apiKey: "AIzaSyBAySAEiHNMFgxTejOrRpRg483ri_qnOok",
    authDomain: "crudv3.firebaseapp.com",
    databaseURL: "https://crudv3.firebaseio.com",
    projectId: "crudv3",
    storageBucket: "crudv3.appspot.com",
    messagingSenderId: "843071385099"
});

// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();

// Disable deprecated features
db.settings({
    timestampsInSnapshots: true
});


window.addEventListener('DOMContentLoaded',function(){
    var form = document.getElementById('form');
    var inputNombre = document.getElementById('nombres');
    var inputApellidos = document.getElementById('apellidos');
    var inputEdad = document.getElementById('edad');
    var list = document.getElementById('tbListPers');
    var btnAdd  = document.getElementById('btnAdd');
    var TituloEditar = document.getElementById('TituloEditar');

    var todoList = [];
    var ListItem = "";
    var i=0;
    eventos();

    //btnRemove.addEventListener("click", removeItem);
    if (localStorage.length > 0) {
        displayList();
    }
    function eventos(){

        document.addEventListener('click',function(e){
            // Fixed

            if(e.target.tagName.toLowerCase() === 'button'){

                        if(e.target.id  === 'btnAdd'){
                            console.log(e.target.id);
                            addItem();
                        }
                        if(e.target.name === 'btnEdit'){
                            editItem(e.target.id);
                        }
                        if(e.target.name === 'update'){
                            guardarItem(e.target.id);
                        }
                        if(e.target.name === 'btnRemove'){
                            removeItem(e.target.id);
                        }
            }
        })
    }
    function addItem(){
        todoList.push({ nombres: inputNombre.value,apellidos: inputApellidos.value,edad: inputEdad.value });
        addToLocalStorage({ nombres: inputNombre.value,apellidos: inputApellidos.value,edad: inputEdad.value });
        limpiarTabla();
        displayList();
        form.reset();
    }

    function removeItem(id){
        removeToLocalStorage(id);
        limpiarTabla();
        displayList();
    }
    function editItem(dataId){

        var batch = db.batch();
        var sfRef = db.collection("data").doc(dataId);

        console.log(sfRef);
        inputNombre.value =    todoList[dataId].nombres;
        inputApellidos.value = todoList[dataId].apellidos;
        inputEdad.value = todoList[dataId].edad;
        document.getElementById("btnAdd").setAttribute("id",dataId);
        document.getElementById(dataId).setAttribute("name","update");
        document.getElementById(dataId).innerText = "Guardar";
        document.getElementById("TituloEditar").innerText = "Editar Persona";
    }


    function addToLocalStorage(data) {
        if (typeof(Storage) !== "undefined") {
            guardarFireStore(data);
        }
        else {
            alert("browser doesn't support local storage!");
        }
    }
    function editToLocalStorage(dataId){

        var todoListCopia = todoList.slice();
        if (typeof(Storage) !== "undefined") {
            todoList = [];
            todoList = JSON.parse(localStorage.getItem("todoList"));
            todoList.splice(dataId, 1,todoListCopia[0]);
            localStorage.setItem("todoList", JSON.stringify(todoList));
        }
        else {
            alert("browser doesn't support local storage!");
        }
    }
    function removeToLocalStorage(dataId)
    {
        var batch = db.batch();
        var laRef = db.collection("data").doc(dataId);
        batch.delete(laRef);

    }

    function guardarItem(dataId)
    {
        todoList = [];
        todoList.push({ nombres: inputNombre.value,apellidos: inputApellidos.value,edad: inputEdad.value });
        editToLocalStorage(dataId);
        document.getElementsByName("update")[0].id = "btnAdd";
        document.getElementById("btnAdd").innerText = "Agregar";
        document.getElementById("btnAdd").setAttribute("name","");
        document.getElementById("TituloEditar").innerText = "Agregar Persona";
        limpiarTabla();
        displayList();
        form.reset();

    }
    function displayList(){

       db.collection("data").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                //todoList[doc.id] = { 'nombres' : doc.data().nombres , 'apellidos' : doc.data().apellidos, 'edad' : doc.data().edad  }
                var item = "<tr id='li-"+doc.id+"'><td>" + doc.data().nombres + "</td>" +
                    "<td>" + doc.data().apellidos +  "</td>" +
                    "<td>" + doc.data().edad +  "</td>" +
                    "<td> <button type='button'  id="+doc.id+" name='btnRemove' class='btn btn-danger glyphicon glyphicon-trash btnRemove'>" +
                    "</button> <button type='button' id="+doc.id+" name='btnEdit' class='btn btn-primary glyphicon glyphicon-edit btnEdit'>" +
                    "</button></td></tr>";
                list.insertAdjacentHTML('beforeend',item);

            });

        });


    }

    function limpiarTabla(){
        var tbListPers = document.getElementById("tbListPers");

        while (tbListPers.firstChild) {

            tbListPers.removeChild(tbListPers.firstChild);
        }
    }

    function guardarFireStore(data) {

        db.collection("data").add(data)
            .then(function (docRef) {
                console.log("Document written with ID: ", docRef.id);
            })
            .catch(function (error) {
                console.error("Error adding document: ", error);
            });
    }

});