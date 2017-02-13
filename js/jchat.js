(function(){
    this.jChat = function(){
        var _ = this;
        //Create the elements references
        this.channel = null;
        this.toolbar = null;
        this.textbox = null;
        //The div of message template in the channel
        this.messageTempate = document.createElement('div');
        this.messageTempate.className = "jchat-message";
        this.tools = {};

        var defaults = {
            ajaxConfig: {method: 'POST', action: '', data: null, evt: function(){
                return _.appendMessage(_.textbox.value);
            }},
            width: 400,
            appendTo: null,
            sendEvent: null,
            defaultName: '',
            sendKey: 'CR'
        };

        // Create options by extending defaults with the passed in arugments
        if (arguments[0] && typeof arguments[0] === "object") {
            this.options = toExtend(defaults, arguments[0]);
            this.options.ajaxConfig = toExtend(defaults.ajaxConfig, arguments[0].ajaxConfig);
            if (isElement(this.options.appendTo)){
                this.channel = this.options.appendTo.getElementsByClassName('jchat-channel')[0];
                this.toolbar = this.options.appendTo.getElementsByClassName('jchat-toolbar')[0];
                this.textbox = this.options.appendTo.getElementsByClassName('jchat-textbox')[0];
                this.options.appendTo.classList.add("jchat-container");
            }
            else{
                //If the required element doesn't exist, create the template
                this.channel = document.createElement('div');
                this.channel.className = 'jchat-channel';

                this.toolbar = document.createElement('div');
                this.toolbar.className = 'jchat-toolbar';
                this.textbox = document.createElement('div');
                this.textbox.className = 'jchat-textbox';
            }
        }


        //Send the message
        toolItemCreate(this, 'send', 'onclick', function(){
            var data = _.getChatStyle();
            if (_.options.sendEvent === null){

                data = toExtend(data, _.options.data);
                var xhr = new XMLHttpRequest();
                xhr.open(_.options.ajaxConfig.method, _.options.ajaxConfig.action);
                xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhr.send('style=' + JSON.stringify(data));

                xhr.onloadend = function () {
                    var arraybuffer = xhr.response;
                    _.options.ajaxConfig['evt'](arraybuffer);
                };
            }
            else{
                _.options.sendEvent(data);
            }
        });

        //Bold button functionality
        toolItemCreate(this, 'bold', 'onclick', function(){
            if (this.getAttribute('aria-pressed') === 'false'){
                this.setAttribute('aria-pressed', 'true');
                this.classList.add('jchat-active');
                _.textbox.style.fontWeight = 'bold';
            }else{
                this.setAttribute('aria-pressed', 'false');
                this.classList.remove('jchat-active');
                _.textbox.style.fontWeight = 'normal';
            }
        });

        //Italic button functionality
        toolItemCreate(this, 'italic', 'onclick', function(){
            if (this.getAttribute('aria-pressed') === 'false'){
                this.setAttribute('aria-pressed', 'true');
                this.classList.add('jchat-active');
                _.textbox.style.fontStyle = 'italic';
            }else {
                this.setAttribute('aria-pressed', 'false');
                this.classList.remove('jchat-active');
                _.textbox.style.fontStyle = 'normal';
            }
        });

        //Underline button functionality
        toolItemCreate(this, 'underline', 'onclick', function(){
            if (this.getAttribute('aria-pressed') === 'false'){
                this.setAttribute('aria-pressed', 'true');
                this.classList.add('jchat-active');
                _.textbox.style.textDecoration = 'underline';
            }else {
                this.setAttribute('aria-pressed', 'false');
                this.classList.remove('jchat-active');
                _.textbox.style.textDecoration = 'none';
            }
        });

        //font color
        toolItemCreate(this, 'text-color', 'onclick', function(){
            var palette = _.createPalette(this, function(color){
                _.textbox.style.color = color;
            });
            palette.focus();
            palette.addEventListener('blur', function(){
                this.parentNode.removeChild(this);
            }, true);
        });

        //Background color
        toolItemCreate(this, 'bgcolor', 'onclick', function(){
            var palette = _.createPalette(this, function(color){
                _.textbox.style.backgroundColor = color;
            });
            palette.focus();
            palette.addEventListener('blur', function(){
                this.parentNode.removeChild(this);
            }, true);
        });

        //Font size selection functionality
        this.tools.fontSize = this.toolbar.getElementsByClassName('jchat-font-size')[0];
        if (typeof(this.tools.fontSize) == 'undefined' || this.tools.fontSize == null) {
            _.tools.fontSize = document.createElement('input');
            _.tools.fontSize.type = 'number';
            _.tools.fontSize.value ='14';
            _.tools.fontSize.className = 'jchat-font-size';
            _.tools.fontSize.setAttribute('aria-pressed', 'false');
            var span = document.createElement('span');
            span.appendChild(_.tools.fontSize);
            _.toolbar.appendChild(span);
        }
        this.tools.fontSize.onchange = function(){
            _.textbox.style.fontSize = this.value + 'px';
        };


        //Hot key to send the message
        _.textbox.onkeydown = function(event){
            var keyCode = ('which' in event) ? event.which : event.keyCode;
            var extraKey;
            switch(_.options.sendKey) {
                case 'CR':
                    extraKey = event.ctrlKey;
                    break;
                case 'AR':
                    extraKey = event.altKey;
                    break;
                case 'SR':
                    extraKey = event.shiftKey;
                    break;
                case 'R':
                    extraKey = true;
                    break;
                default:
                    extraKey = event.ctrlKey;
            }
            // ctrl + enter to send the message
            if (keyCode === 13 && extraKey)_.tools.send.click();

            //ctrl + B to bold
            if(keyCode === 66 && event.ctrlKey)_.tools.bold.click();

            //ctrl+U to underline
            if(keyCode === 85 && event.ctrlKey)_.tools.underline.click();

            //ctrl+i to italic
            if (keyCode === 73 && event.ctrlKey)_.tools.italic.click();
        };

    };

    function isElement(obj) {
        try {
            return obj instanceof HTMLElement;
        }
        catch(e){
            return (typeof obj==="object") &&
                (obj.nodeType===1) && (typeof obj.style === "object") &&
                (typeof obj.ownerDocument ==="object");
        }
    }

    //Create palette html element
    jChat.prototype.createPalette = function(element, evt){
        var palette = document.createElement('div');
        palette.className = 'jchat-palette';
        palette.setAttribute('tabindex', '0');
        var colors = ['black', 'white', 'red', 'blue', 'green', 'purple', 'MediumPurple', 'LightGrey', 'grey', 'orange'];
        for(var i = 0; i < colors.length; i++){
            var slot = document.createElement("span");
            slot.style.backgroundColor = colors[i];
            slot.className = 'jchat-color';
            palette.appendChild(slot);
            slot.addEventListener('click', function(){
                evt(this.style.backgroundColor);
            });

        }
        element.parentNode.insertBefore(palette, element.nextSibling);
        return palette;
    };

    //Send the message to the channel
    jChat.prototype.appendMessage = function(text, name){
        var clone = this.messageTempate.cloneNode(true);
        text = text.replace(/ /g,"&nbsp;");
        text = text.replace(/[\r\n]/g, "<br />");
        clone.innerHTML = (name === undefined? this.options.defaultName: name) + (text === undefined? this.textbox.value: text);
        clone.style.cssText = this.textbox.style.cssText;
        this.channel.appendChild(clone);
        this.textbox.value = "";
    };

    jChat.prototype.getChatStyle = function(){
        return {
            fontSize: this.textbox.style.fontSize,
            textColor: this.textbox.style.color,
            textBgcolor: this.textbox.style.backgroundColor,
            underline: this.textbox.style.textDecoration === 'underline',
            italic: this.textbox.style.fontStyle === 'italic',
            bold: this.textbox.style.fontWeight === 'bold'
        };
    };

    // Utility method to extend defaults with user options
    function toExtend( defaults, options ) {
        var extended = {};
        var prop;
        for (prop in defaults) {
            if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
                extended[prop] = defaults[prop];
            }
        }
        for (prop in options) {
            if (Object.prototype.hasOwnProperty.call(options, prop)) {
                extended[prop] = options[prop];
            }
        }
        return extended;
    }

    function toolItemCreate(jchat, toolName, eventType, evt){
        jchat.tools[toolName] = jchat.toolbar.getElementsByClassName('icon-'+toolName)[0];
        if (typeof(jchat.tools[toolName]) == 'undefined' || jchat.tools[toolName] == null) {
            jchat.tools[toolName] = document.createElement('span');
            jchat.tools[toolName].className = 'icon jchat-'+toolName+' icon-'+toolName;
            jchat.tools[toolName].setAttribute('aria-pressed', false);
            var span = document.createElement('span');
            span.appendChild(jchat.tools[toolName]);
            jchat.toolbar.appendChild(span);
        }
        jchat.tools[toolName][eventType] = evt;
    }
}());
