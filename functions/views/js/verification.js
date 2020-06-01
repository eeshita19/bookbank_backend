var selected = document.querySelector(".selected");
var listitem = document.querySelector("#country");
var optionscontainer = document.querySelector(".options-container");
var optionslist = document.querySelectorAll(".options");

selected.addEventListener("click", () => {
optionscontainer.classList.toggle("active");    
});

optionslist.forEach((option) => {
  option.addEventListener("click",() => {
      listitem.innerHTML = option.querySelector("label").innerHTML;
      optionscontainer.classList.remove("active");
  });  
});

function dofirst(){
    var button = document.getElementById("getotp")
    window.addEventListener("click", saveinfo , false);

}
function saveinfo(){
    var one;
    var two = document.getElementById("inputphoneno").value;
    sessionStorage.setItem(one,two);
    window.console.log(sessionStorage);
    
//    display(one);
//    window.console.log(display);
}
//function display(one){
// var two = sessionStorage.getItem(one);
//listitem.innerHTML = two;
//}
window.addEventListener("load", dofirst , false);
