{:noCode: Simple HTML Editor :}
===============================

Allows you to edit the content of previously created templates or designs, it does not have options to change the design.

![ncSimpleHtmlEditor](https://user-images.githubusercontent.com/114579121/192867050-06d6869a-f514-4866-87a7-e7e1a4ff4062.gif)

## DEMO

For the first example I have downloaded from [here](https://templatemo.com/tm-568-digimedia) the template, I have placed it on my server only adding at the end of index.html the code of the editor.

Once the editing is finished, I save the changes I receive in an index.html file to replace the downloaded one.

- [DEMO template 1](https://thenocoder.github.io/ncSimpleHtmlEditor/demo/digimedia/)

Same procedure for this example by downloading the template from [here](https://startbootstrap.com/theme/grayscale)

- [DEMO template 2](https://thenocoder.github.io/ncSimpleHtmlEditor/demo/grayscale/)

## Get started

Download or use the CDN, you need ncsimplehtmleditor.css and ncsimplehtmleditor.js

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/TheNocoder/ncSimpleHtmlEditor@master/ncsimplehtmleditor.css">
<script src="https://cdn.jsdelivr.net/gh/TheNocoder/ncSimpleHtmlEditor@master/ncsimplehtmleditor.js"></script>
```

It is important that all the editor code is wrapped in a div with the id "ncsedt-implement" and placed at the bottom of the page, immediately before "/body", including .js and .css.

This will start the editor with the default options:

```html
<div id="ncsedt-implement">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/TheNocoder/ncSimpleHtmlEditor@master/ncsimplehtmleditor.css">
    <script src="https://cdn.jsdelivr.net/gh/TheNocoder/ncSimpleHtmlEditor@master/ncsimplehtmleditor.js"></script>
    <script>
        var editor = new ncSimpleHtmlEditor();
        editor.start();
    </script>
</div>
```

Better:

```html
<div id="ncsedt-implement">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/TheNocoder/ncSimpleHtmlEditor@master/ncsimplehtmleditor.css">
    <script src="https://cdn.jsdelivr.net/gh/TheNocoder/ncSimpleHtmlEditor@master/ncsimplehtmleditor.js"></script>
    <script>
        window.addEventListener('DOMContentLoaded', function () {
            if (!("ncSHEditor" in window)) {
                var ncSHEditor = new ncSimpleHtmlEditor();
                ncSHEditor.start();
            }
        });
    </script>
</div>
```

## Options

```javascript
var options = {

    // editable element, default "body"
    editable: "body",

    // Non-linear undo/redo history possible
    linearHistory: true,

    // Several mutations can belong to the same update in the history, they are grouped by time, in milliseconds.
    groupingHistory: 200,

    // Number of toolbar columns, by default null, as set in css
    toolbarCols: null,

    // Save button, disable on click in milliseconds
    saveTimeout: 500,

    // Active buttons and toolbar order
    toolbar: ['edit', 'undo', 'redo', 'up', 'down', 'cut', 'copy', 'paste', 'code', 'link', 'image', 'head', 'save'],
};

var editor = new ncSimpleHtmlEditor(options);
editor.start();
```

### Create a custom button

```javascript
var options = {
    buttons: {
        help: {

            /*
                * Same a key name: "help"
                */
            name: 'help',

            /*
                * Image for toolbar icon
                */
            icon: 'help.png',

            /*
                * Alt text
                */
            title: 'Help',

            /*
                * Set when the button is disabled, in this case never
                */
            disabled: function () { return false },

            /*
                * On click action
                */
            action: function () {
                var link = document.createElement('a');
                var ncsedt = document.querySelector('#ncsedt-implement');

                link.setAttribute('href', 'https://github.com/TheNocoder/ncSimpleHtmlEditor');
                link.setAttribute('target', '_blank');
                ncsedt.appendChild(link);
                link.click();
            }
        }
    },

    /*
        * Add the button at the end of the toolbar
        */
    toolbar: ['edit', 'undo', 'redo', 'up', 'down', 'cut', 'copy', 'paste', 'code', 'link', 'image', 'head', 'save', 'help']
};

var editor = new ncSimpleHtmlEditor(options);
editor.start();
```
## License

MIT License
