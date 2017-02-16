# jChat
A pure javascript chat plugin


## Create a Channel

You could create a new chat channel by adding the following html

```html
<div class="jchat-container" id="container">
    <div class="jchat-channel">

    </div>
    <div class="jchat-toolbar">
        <span class='icon jchat-send icon-send' aria-pressed="false"></span>
        <span class="icon jchat-bold icon-bold" aria-pressed="false"></span>
        <span class="icon jchat-italic icon-italic" aria-pressed="false"></span>
        <span class="icon jchat-underline icon-underline" aria-pressed="false"></span>
        <span><span class="icon jchat-text-color icon-text-color" aria-pressed="false"></span></span>
        <span><span class="icon jchat-bgcolor icon-bgcolor" aria-pressed="false"></span></span>
        <input title='Font Size' class='jchat-font-size' type="number" value="14">
    </div>
    <textarea class='jchat-textbox' title="Channel"></textarea>
</div>
```

Then Add the following javascript
```javascript
    var container = document.getElementById('container');
    var chat = new jChat({
        appendTo: container,
        ajaxConfig: {
            action: 'get.php',
            data: {test: 'test'}
        }
    });
```