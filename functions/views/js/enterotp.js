function movecursor(moveFrom, moveTo) {
    var length = moveFrom.value.length;
    var maxlength = moveFrom.getAttribute("maxlength");

    if (length == maxlength) {
        document.getElementById(moveTo).focus();
    }
}