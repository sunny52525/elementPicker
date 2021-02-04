// Unique ID for the className.
var MOUSE_VISITED_CLASSNAME = 'crx_mouse_visited';
var CHECKED_CLASSNAME = "crx_mouse_checked";
var SELECTED_CHECKBOX = 'selector_checkbox';
// Previous dom, that we want to track, so we can remove the previous styling.
var prevDOM = null;

var checkBox = document.createElement('input');
checkBox.setAttribute("type", "checkbox");
checkBox.setAttribute('id', SELECTED_CHECKBOX);

var currentDom;
// Mouse listener for any move event on the current document.
document.addEventListener('mousemove', function (e) {
    var srcElement = e.srcElement;

    if (srcElement.id !== "selector_checkbox" && srcElement.nodeName === "DIV") {


        if (prevDOM != null) {
            prevDOM.classList.remove(MOUSE_VISITED_CLASSNAME);

        }


        srcElement.classList.add(MOUSE_VISITED_CLASSNAME);

        currentDom = srcElement

        if (srcElement.id !== "selector_checkbox")
            srcElement.prepend(checkBox)
        if (srcElement.classList.contains(CHECKED_CLASSNAME)) {

            document.getElementById('selector_checkbox').checked = true;

        }
        prevDOM = srcElement;
        checkBox.checked = false

    }
}, false);


checkBox.addEventListener('click', () => {
    if (checkBox.checked) {

        // var json=processSchema.create(currentDom)
        console.log(currentDom)
        html2Json(currentDom)
        processTest(process.HTML2json(currentDom))
        // console.log(processRequest())


        try {

            console.log(process.json2HTML(json))  //throwing error
        } catch (e) {
            console.log(e)
        }
        currentDom.classList.add(CHECKED_CLASSNAME)
    }
})

class process {
    static json2HTML(form) {
        var output = document.createElement(form.tagName);
        process.assignAttributes(form, output);
        if (form.innerText) {
            output.innerText = form.innerText;
        }
        if (form.childNodes.length > 0) {
            process.assignChildNodes(form.childNodes, output, process.json2HTML);
        }
        return output;
    }

    static assignAttributes(obj, objResponse) {
        if (!obj) return;
        if (!objResponse) {
            var objResponse = {};
        }
        for (var key in obj) {
            if (key !== "tagName" && key !== "childNodes")
                objResponse = process.setData(obj, objResponse, key);
        }
        return objResponse;
    }

    static assignChildNodes(child, childResponse, callback) {
        if (!child) return;
        if (!childResponse) {
            var childResponse = [];
        }
        ;
        for (var i = 0; i < child.length; i++) {
            childResponse = process.setData(child, childResponse, i, callback);
        }
        return childResponse;
    }

    static setData(input, output, key, callback = {}) {
        if (output instanceof Array) {
            if (input[key].nodeType === Node.TEXT_NODE)
                output.push(input[key].textContent);
            else if (typeof callback === "function")
                output.push(callback(input[key]));
        }
        if (typeof output === 'object' && input[key].value !== undefined)
            output[input[key].name] = input[key].value;
        if (output instanceof HTMLElement)
            if (typeof key === 'number' && typeof callback === "function")
                output.appendChild(callback(input[key]));
            else
                output.setAttribute(key, input[key]);
        return output;
    }

    static HTML2json(nodeE) {
        return {
            tagName: nodeE.tagName,
            attributes: process.assignAttributes(nodeE.attributes, {}),
            childNodes: process.assignChildNodes(nodeE.childNodes, [], process.HTML2json),
        };
    }
}


class storageHelper {
    static saveToLocal = (json) => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([JSON.stringify(json, null, 2)], {
            type: "application/json"
        }));
        a.setAttribute("download", "data.json");
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }


}

// window.onload(processRequest)

const getCssStyle = (selectedDocument,
                     getCssOfChild = false,
                     CssChildLevel = 0 //How many levels of styles needed
) => {

    let styles = {}
    console.log(selectedDocument)
    try {
        let selectedDomId = selectedDocument.id || `selected_dom_level_${CssChildLevel}`
        selectedDocument.setAttribute('id', selectedDomId);
        const element = document.getElementById(selectedDomId),
            style = window.getComputedStyle(element)


        for (let i = 0; i < style.length; ++i) {
            styles[style[i]] = style.getPropertyValue(style[i]);
        }

    } catch (e) {
        console.warn(e)
    }
    if (getCssOfChild === false) {
        return styles;
    }

    console.log(selectedDocument)
    console.log(selectedDocument.childElementCount)
    console.log(selectedDocument.firstElementChild)
    for (let i = 0; i < selectedDocument.childElementCount; ++i) {


        if (selectedDocument.children[i].classList.contains(SELECTED_CHECKBOX)) {


            // selectedDocument.removeChild(selectedDocument.firstElementChild)
            continue;
        }
        let getChild = false;
        if (CssChildLevel > 0) {
            getChild = true
        }


        styles[i] = getCssStyle(selectedDocument.children[i], getChild, CssChildLevel - 1)


    }

    return styles;

}


const processRequest = () => {
    let stylesheet = document.styleSheets;
    var styles = {}
    for (let i = 0; i < stylesheet.length; ++i) {

        try {
            // console.log(stylesheet[i].cssRules)

            for (let j = 0; j < stylesheet[i].cssRules.length; ++j) {
                // console.log(stylesheet[i].cssRules[j])
                styles[stylesheet[i].cssRules[j].selectorText] = extractCss(stylesheet[i].cssRules[j].cssText)
            }


        } catch (e) {
            console.error(stylesheet[i])
           try{
               fetch(stylesheet[i].href)
                   .then(function (response) {
                       response.text().then(function (text) {
                           console.log(text)
                       });
                   });
           }catch (e1) {
               console.log(e1)
           }
        }
    }

    return styles;
}

const extractCss = (raw) => {
    var re = /{(.*?)}/;
    raw = raw.toString().split(re);

    return raw[1]
}







class processSchema {

    static schema2(input, output,key,value) {
        if (!Object.keys(input).length) return;// if there's no keys, then the call returns undefined
        switch (input?.constructor) {
            case Object:
                processSchema.processObj(input, output,key,value);
            case Array:
                processSchema.processArr(input, output,key,value);
            case String:
            //processSchema.processString(input, output);
            default:
            // return
        }
        return output;
    }
    static create(input, output,key,value) {
        if (getEntityType(output).includes("HTML")) { //Only HTML creation
            //    console.log("got request for  from create", input, output, key, value)

            if (getEntityType(value) === 'Object') {//An object property generates a fieldset, i.e. a <fieldset> element.
                //   console.log("creating div object", key, value)
                var nwEle = document.createElement("div");
                nwEle.className = input;
                //  nwEle.className = "createdFromObject";
            } else if (getEntityType(value) === 'Array') {
                var nwEle = document.createElement(input);
                nwEle.className = "createdFromArrayProperty";

            } else if (getEntityType(value) === 'String' || getEntityType(value) === 'Boolean') {
                //     console.log("create Request property for ", input, output, key, value, formElements.indexOf(input))
                if (formElements.indexOf(input) < 0) { //check if the input is a formElement by crosschecking in the define array.
                    var nwEle = document.createElement("div");
                    nwEle.className = input;
                    // console.log("divElement", nwEle);
                } else {

                    //    console.log("create Request property for ", input, output, key, value, formElements.indexOf(input))
                    var nwEle = document.createElement(input);
                    nwEle.className = "createdFromStringProperty";
                    var content = document.createTextNode(value);
                    nwEle.appendChild(content);
                    //  nwEle.setAttribute("value", key);
                    //    console.log("formElement", nwEle);

                }
            } else {
                console.log("strays")
            }
            // console.log("new element from create",nwEle)
            return nwEle;
        }
    }
    static setAttributes(input, output, key) {

    }

    static appendChild(input, output, key ,value) {

        if (getEntityType(output).includes("HTML")) {

            if (getEntityType(input).includes("HTML") && typeof value !== 'string') {
                output.appendChild(input);
            }
            if (getEntityType(input).includes("String") && typeof value !== 'string') {
                //   output.appendChild(currentNode);
            }
        }
    }

    static processObj(input,output,key,value) {

        for (var key in input) {
            if (getEntityType(input[key]) === 'Object') {

                // console.log("creating fieldSet object", key, input[key])

                var currentNode = processSchema.create(key, output, key, input[key]);
                //  console.log("recived from create",currentNode)
                processSchema.schema2(input[key], currentNode,key,input[key]);

                processSchema.appendChild(currentNode, output);

            } else if (getEntityType(input[key]) === 'Array') {

                var currentNode = processSchema.create(key, output, key, input[key]);
                //  console.log("recived from create", currentNode)

                processSchema.schema2(input[key], currentNode, key, input[key]);
                processSchema.appendChild(currentNode, output);


            }else if (getEntityType(input[key]) === 'String' || getEntityType(input[key]) === 'Function' || getEntityType(input[key]) === 'Boolean') {
                //   console.log("create req property object", key, input[key])
                var currentNode = processSchema.create(key, output, key, input[key]);

                if (processSchema.validate(input[key], supportedType, key, input[key], "isOneOf")){
                    currentNode.setAttribute("type", input[key]);
                }
                processSchema.appendChild(currentNode, output);
            } else {
                console.log("strays",input,key,value)
            }

        }
        return output;
    }
    static processArr(input, output,key,value) {

        for (var i = 0; i < input.length; i++) {
            if (getEntityType(input[i]) === 'Object') {
                // console.log("found Object in array", input[i],output)

                var currentNode = processSchema.create(key, output, input[i], input[i]);
                //console.log("recived from create",currentNode)
                processSchema.schema2(input[i], currentNode, key, input[i]);

                processSchema.appendChild(currentNode, output);

            } else if (getEntityType(input[i]) === 'Array') {
                //  console.log("found Object in array", input[i])
            } else if (getEntityType(input[i]) === 'String' || getEntityType(input[i]) === 'Function' || getEntityType(input[i]) === 'Boolean') {
                var currentNode = processSchema.create(key, output, input[i], input[i]);
                processSchema.appendChild(currentNode, output);
            } else {
            }
            //            console.log(input[i], getEntityType(input[i]));
            //   processSchema.setAppendEntity(input[i], output, input[i]);


        }



        return output;


    }

    static validate(input, output,key,value,validation) {
        //  console.log("validating", input, output, validation)
        //this condition primarly check for the presence of a keys in any an array, if not present and options [ returns false and update and return position]

        if (validation === 'isOneOf') {
            if (output.indexOf(input) === -1 && typeof input !== null && typeof input !== undefined) {
                return false;
            } else {
                return true;
            }
        }
    }
}

function getEntityType(entity) {
    //  console.log(entity, Object.getPrototypeOf(entity).constructor.name)
    return Object.getPrototypeOf(entity).constructor.name;//entity.__proto__.constructor.name
}


function processTest(json) {
    //  e.preventDefault();
    var in2 = json;
    console.log(in2)
    var outputElement = document.createElement("outputElement");
    console.log(outputElement)
    var outputE = processSchema.schema2(in2, outputElement);
    console.log("outputElement", outputE)
    //  const depth = getMax(outputArray,2);

    // var table = createTable(outputArray);
    // outputJson = arr2(outputArray,{} ,depth);
    // console.log(outputJson);
    //  document.getElementById("output").innerText = JSON.stringify(outputArray);
    // document.getElementById("output").appendChild(outputE);
}
