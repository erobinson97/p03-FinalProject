var sByName = true;

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie(a) {
    var cookie = getCookie(a);
    if (cookie != "") {
        return true;
    } else {
        return false;
    }
}

function searchByName() {
    sByName = true;
    document.getElementById("by-name").classList.remove("label-default");
    document.getElementById("by-name").classList.add("label-primary");
    document.getElementById("by-type").classList.remove("label-primary");
    document.getElementById("by-type").classList.add("label-default");
    document.getElementById("search").value = "";
    generateList();
}

function searchByType() {
    sByName = false;
    document.getElementById("by-type").classList.remove("label-default");
    document.getElementById("by-type").classList.add("label-primary");
    document.getElementById("by-name").classList.remove("label-primary");
    document.getElementById("by-name").classList.add("label-default");
    document.getElementById("search").value = "";
    generateList();
}

function generateList() {
    var search = document.getElementById("search").value;

    if (search == "") {
        console.log('empty');

        document.getElementById("list").innerHTML = "";

        

        $.getJSON('pokedex.json', function (data) {
            $.each(data.pokemon, function (i, f) {
                var tblRow = "<tr onclick=\"updateView(" + f.id + ")\">" + "<td>" + f.num + "</td>" +
                 "<td>" + f.name + "</td>" + "</tr>"
                $(tblRow).appendTo("#pdata tbody");
            });

        });
    }
    else if(sByName){

        document.getElementById("list").innerHTML = "";
        var temp;
        $.getJSON('pokedex.json', function (data) {
            $.each(data.pokemon, function (i, f) {
                temp = 0;
                for (var q = 0; q < search.length; q++) {
                    if (f.name[q].toLowerCase() == search[q].toLowerCase()) {
                        temp++;
                    }
                    else{
                        break;
                    }
                }
                if (temp == search.length) {
                    var tblRow = "<tr onclick=\"updateView(" + f.id + ")\">" + "<td>" + f.num + "</td>" +
                 "<td>" + f.name + "</td>" + "</tr>"
                    $(tblRow).appendTo("#pdata tbody");
                }

            });

        });

    }
    else {
        //search by type

        document.getElementById("list").innerHTML = "";
        var temp;
        $.getJSON('pokedex.json', function (data) {
            $.each(data.pokemon, function (i, f) {
                temp = 0;
                for (var p = 0; p < f.type.length; p++) {
                    for (var q = 0; q < search.length; q++) {
                        if (f.type[p][q].toLowerCase() == search[q].toLowerCase()) {
                            temp++;
                            console.log("hi");
                            console.log(f.type[p]);
                        }
                        else {
                            break;
                        }
                    }
                }
                if (temp == search.length) {
                    var tblRow = "<tr onclick=\"updateView(" + f.id + ")\">" + "<td>" + f.num + "</td>" +
                 "<td>" + f.name + "</td>" + "</tr>"
                    $(tblRow).appendTo("#pdata tbody");
                }

            });

        });

    }
    
    /*
    if search is empty:
        display all pokemon{

        }
    If its a string:
        search by name{

        }
    if its a number:
        search by id{
        
        }
    */
}



function updateView(a) { 
    $.getJSON('pokedex.json', function (data) {
        $.each(data.pokemon, function (i, f) {
            if (f.id == a) {
                document.getElementById("pokemon-name").innerHTML = f.name;
                document.getElementById("poke-img").innerHTML = "<img src=\"" + f.img + "\" height=\"180px\" width=\"180px\">";

                if (checkCookie(sessionStorage.usersName + f.name)) {
                    document.getElementById("caught").checked = true;
                }
                else {
                    document.getElementById("caught").checked = false;
                }
                

                document.getElementById("type").innerHTML = f.type;
                document.getElementById("height").innerHTML = f.height;
                document.getElementById("weight").innerHTML = f.weight;
                document.getElementById("candy").innerHTML = f.candy;
                document.getElementById("weakness").innerHTML = f.weaknesses;

                //next evolve
                if (f.hasOwnProperty("next_evolution")) {
                    document.getElementById("nevolve-img").style.opacity = 1;
                    document.getElementById("nevolve").innerHTML = f.next_evolution[0].name;

                    $.each(data.pokemon, function (id, key) {
                        if (key.name == f.next_evolution[0].name) {
                            document.getElementById("nevolve-img").src = key.img;

                        }
                    });


                }
                else {
                    document.getElementById("nevolve").innerHTML = "none"
                    document.getElementById("nevolve-img").style.opacity = 0;
                }

                //prev evolve

                if (f.hasOwnProperty("prev_evolution")) {
                    document.getElementById("pevolve-img").style.opacity = 1;
                    document.getElementById("pevolve").innerHTML = f.prev_evolution[0].name;

                    $.each(data.pokemon, function (id, key) {
                        if (key.name == f.prev_evolution[0].name) {
                            document.getElementById("pevolve-img").src = key.img;

                        }
                    });


                }
                else {
                    document.getElementById("pevolve").innerHTML = "none"
                    document.getElementById("pevolve-img").style.opacity = 0;
                }



            }
        });

       
    });


}

function login() {
    var username = document.getElementById("login-name").value;
    var pass = document.getElementById("login-pass").value;
    console.log("username is " + username);
    console.log("password is " + pass);

    sessionStorage.usersName = username;
    if (document.getElementById("remember").checked) {
        setCookie("current", username, 30);
        setCookie("checked", true, 30);
    }
    else {
        setCookie("checked", false, 30);
    }

    if (checkCookie(username)) {
        console.log("user exsists")
        var usr = getCookie(username);
        console.log("users pass should be " + usr);
        if (usr == pass) {
            console.log("password is correct");
            window.location.href = "pokedex.html";
        }
        else {
            console.log("Incorrect Pass");
            
            document.getElementById("login-alert").innerHTML = "Incorrect Password!";
            document.getElementById("login-alert").classList.remove("alert-info");
            document.getElementById("login-alert").classList.add("alert-danger");
            document.getElementById("login-alert").style.opacity = 1;


        }
    }
    else {
        //make new user
        
        setCookie(username, pass, 1000000);
        document.getElementById('login-alert').style.opacity = 1;
        
    }
}

function welcomeName() {
    document.getElementById("welcome-name").innerHTML = "Welcome " + sessionStorage.usersName;
}

function rememberMe() {
    if (getCookie("checked") == 'true') {
        if (checkCookie("current")) {
            document.getElementById("login-name").value = getCookie("current");
            document.getElementById("remember").checked = true;
        }
    }
}

function caught() {

    var pokemon = document.getElementById("pokemon-name").innerHTML;
    console.log("You caught a " + pokemon + "!");
    if (document.getElementById("caught").checked) {
        setCookie(sessionStorage.usersName + pokemon, "caught", 999999999);
    }
    else {
        setCookie(sessionStorage.usersName + pokemon, "", 999999999);
    }
}
