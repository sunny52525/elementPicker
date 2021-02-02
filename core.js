// Unique ID for the className.
var MOUSE_VISITED_CLASSNAME = 'crx_mouse_visited';
var CHECKED_CLASSNAME="crx_mouse_checked"

// Previous dom, that we want to track, so we can remove the previous styling.
var prevDOM = null;

var checkBox = document.createElement('input');
checkBox.setAttribute("type", "checkbox");
checkBox.setAttribute('id', 'selector_checkbox');

var currentDom;
// Mouse listener for any move event on the current document.
document.addEventListener('mousemove', function (e) {
    var srcElement = e.srcElement;

    if (srcElement.id !== "selector_checkbox") {



        if (prevDOM != null) {
            prevDOM.classList.remove(MOUSE_VISITED_CLASSNAME);

        }


        srcElement.classList.add(MOUSE_VISITED_CLASSNAME);

        currentDom = srcElement

        if (srcElement.id !== "selector_checkbox")
            srcElement.prepend  (checkBox)
        if (srcElement.classList.contains(CHECKED_CLASSNAME)){

            document.getElementById('selector_checkbox').checked = true;

        }
        prevDOM = srcElement;
        checkBox.checked = false

    }
}, false);


checkBox.addEventListener('click', () => {
    if (checkBox.checked) {
        console.log(currentDom)
        currentDom.classList.add(CHECKED_CLASSNAME)
    }
})
