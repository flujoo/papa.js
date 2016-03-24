(function(exports) {

    var interval_default = 200;



    // test if a tag is empty
    // empty eles:
    // https://developer.mozilla.org/en-US/docs/Glossary/Empty_element
    // string -> boolean
    var is_empty = function(tag) {
        var tmp = tag.match(/^\<(\w+).*?\>$/);
        if (tmp !== null) {
            var empty_tag_names = ['hr', 'img', 'br', 'input'];
            var name = tmp[1];
            if (empty_tag_names.indexOf(name) >= 0) {
                return true;
            }
        }
        return false;
    };
    // is_empty('abc');
    // is_empty('<p>');
    // is_empty('<br>');
    // is_empty('<img src="./pic.jpg">');



    // split html code for simulating typing
    // string -> [strings]
    var h_t_m_l = function(html_code) {
        var html_split = [];
        var len = html_code.length;
        var i = 0;
        var current = '';
        var splitting = function() {
            if (i >= len) {
                return;
            }
            // when a tag is encountered
            if (html_code[i] === '<') {
                var tag = '';
                while (html_code[i] !== '>') {
                    tag = tag + html_code[i];
                    i = i + 1;
                }
                tag = tag + html_code[i];
                // when it is an empty tag
                if (is_empty(tag)) {
                    if (current === '') {
                        html_split.push(tag);
                    } else {
                        var split_len = html_split.length;
                        var last = html_split[split_len - 1];
                        current = last + current;
                        html_split.pop();
                        html_split.push(current);
                        html_split.push(tag);
                        current = '';
                    }
                } else {
                    current = current + tag;
                }               
                // when it is the last nonempty tag
                if (i === len - 1) {
                    var split_len = html_split.length;
                    var last = html_split[split_len - 1];
                    current = last + current;
                    html_split.pop();
                    html_split.push(current);
                    current = '';
                }
                i = i + 1;
                splitting();
            // escaped chars
            } else if (html_code[i] === '&') {
                var esc = '';
                while (html_code[i] !== ';') {
                    esc = esc + html_code[i];
                    i = i + 1;
                }
                esc = esc + html_code[i];
                current = current + esc;
                html_split.push(current);
                i = i + 1;
                current = '';
                splitting();
            // plain text
            } else {
                current = current + html_code[i];
                html_split.push(current);
                i = i + 1;
                current = '';
                splitting();
            }
        };
        splitting();
        return html_split;
    };
    // h_t_m_l('ab c');
    // h_t_m_l('<span class="intro">xy. &amp;</span>');
    // var x = 'ab<span class="intro"><a href="."> cd</a>' +
        // '</span><br>f<input>g<strong>hi</strong><br>&lt;';
    // h_t_m_l(x)



    var pa_string = function(selector, content) {
        
        // args
        var arg_len = arguments.length;
        if (arg_len < 2) {
            return;
        } else {
            for (var i = 2; i < arg_len; i = i + 1) {
                var arg = arguments[i];
                if (typeof arg === 'number') {
                    var interval = arg;
                } else if (typeof arg === 'boolean') {
                    var cursor = arg;
                } else if (typeof arg === 'function') {
                    var callback = arg;
                }
            }
            if (typeof interval === 'undefined') {
                var interval = interval_default;
            } else if (interval < 0) {
                var rm = true;
                interval = Math.abs(interval);
            }
            if (typeof cursor === 'undefined') {
                var cursor = false;
            }
        }

        // content_: html for cursor
        var content_ = '<span class="papa-cursor">|</span>';
        // $content: html in $(selector)
        var $content = $(selector).html();
        // remove html for cursor
        $content = $content.replace(content_, '');
        if (rm) {
            $content = h_t_m_l($content);
        }
        // content: html to type
        content = h_t_m_l(content);
        var len = content.length;
        var i = 0;

        // typing loop
        var typing = function() {
            if (i >= len) {
                if (typeof callback !== 'undefined') {
                    callback();
                }
                return;
            }

            if (rm) {
                $content.pop();
                if (cursor) {
                    $(selector).html($content.join('') + content_);
                } else {
                    $(selector).html($content.join(''));
                }
            } else {
                $content = $content + content[i];
                if (cursor) {
                    $(selector).html($content + content_);
                } else {
                    $(selector).html($content);
                }
            }

            i = i + 1;
            setTimeout(function() {
                typing();
            }, interval);
        }
        
        // do it
        typing();
    };



    var pa_script = function(selector, script) {

        // args
        var arg_len = arguments.length;
        if (arg_len < 2) {
            return;
        } else {
            for (var i = 2; i < arg_len; i = i + 1) {
                var arg = arguments[i];
                if (typeof arg === 'boolean') {
                    var cursor = arg;
                } else if (typeof arg === 'function') {
                    var callback = arg;
                }
            }
            if (typeof cursor === 'undefined') {
                var cursor = false;
            }
        }

        var len = script.length;
        var i = 0;
        var typing = function() {
            if (i >= len) {
                if (typeof callback !== 'undefined') {
                    callback();
                }
                return;
            }

            var step = script[i];
            var content = step[0];
            if (typeof step[1] !== 'undefined') {
                var interval = step[1];
            } else {
                var interval = interval_default;
            }
            if (typeof step[2] !== 'undefined') {
                var pause = step[2];
            } else {
                var pause = interval;
            }

            pa_string(selector, content, interval, cursor, function() {
                i = i + 1;
                setTimeout(function() {
                    typing();
                }, pause);
            });
        };

        typing();
    };
    // var script = [
        // ['I '],
        // ['love ', , 1000],
        // ['you', 400],
        // ['you', -200, 500],
        // ['her.']
    // ]



    exports.pa = function(selector, content) {
        if (arguments.length < 2) {
            return;
        } else if (typeof content === 'string') {
            pa_string.apply(this, arguments);
        } else if (typeof content === 'object') {
            pa_script.apply(this, arguments);
        } else {
            return;
        }
    };

})(this.papa = {});
