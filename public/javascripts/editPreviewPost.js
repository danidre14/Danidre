let markDownToUp;
const previewThePost = function() {
    if(!markDownToUp) markDownToUp = new MarkDownToUp();
    document.getElementById('Edits').style.display = "none";
    document.getElementById('Previews').innerHTML = markDownToUp.convert(document.getElementById('content').value);
    document.getElementById('Previews').style.display = "block";
}
const editThePost = function() {
    document.getElementById('Previews').style.display = "none";
    document.getElementById('Previews').innerHTML = '';
    document.getElementById('Edits').style.display = "block";
}