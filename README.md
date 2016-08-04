# papa.js

啪啪, 啪!

... 欧, 不是你想的那样的.

__papa.js__ 用来模拟人类打字.

请看效果 <https://flujoo.github.io/papa.js/>.


## 安装

1. 下载 [JQuery](https://jquery.com/).
2. 下载 `papa.js` 文件.
3. 加载 `jquery.js` 和 `papa.js`.

```html
<!-- html -->
<script src="jquery.js"></script>
<script src="papa.js"></script>
<!-- html -->
```


## 极简教程

```js
papa.pa(selector, content);
```


下面的例子中, `papa.pa('#target', 'too young, too simple')` 会在 `<p id="target"></p>` 中敲入 `'too young, too simple'`.

```html
<!-- some html code -->
<head>
    <!-- some code -->
    <script src="jquery.js"></script>
    <script src="papa.js"></script>
    <script>
        $(function() {
            papa.pa('#target', 'too young, too simple');
        });
    </script>
</head>

<body>
    <!-- some code -->
    <p id="target"></p>
    <!-- some code -->
</body>
<!-- more code -->
```


## 极简的不极简教程

### 设定速度

```js
papa.pa(selector, content, interval);
```

设定两次输入之间停顿的时长, 单位为毫秒, 比如 `papa.pa('#target', 'too young', 400)`. 默认值为 `200`.

### 删除内容

如果使用负值, 则会删掉相应的内容. 比如 `papa.pa('#target', 'too young', -400)` 会以 400 毫秒的间隔逐渐删掉 `'too young'`.

### 显示光标

```js
papa.pa(selector, content, cursor);
```

`papa.pa('#target', 'too young', true)` 在打字时会显示光标. 光标的 HTML 代码是 `<span class="papa-cursor">|</span>`, 可添加 CSS 获得动感效果. 比如:

```css
.papa-cursor {
    opacity: 1;
    -webkit-animation: blink 0.7s infinite;
    -moz-animation: blink 0.7s infinite;
    animation: blink 0.7s infinite;
}

@keyframes blink{
    0% { opacity:1; }
    50% { opacity:0; }
    100% { opacity:1; }
}

@-webkit-keyframes blink{
    0% { opacity:1; }
    50% { opacity:0; }
    100% { opacity:1; }
}

@-moz-keyframes blink{
    0% { opacity:1; }
    50% { opacity:0; }
    100% { opacity:1; }
}
```

### 回调函数

```js
papa.pa(selector, content, callback);
```

如果你想先敲入 `"too young, too simple"`, 然后删掉 `"too simple"`:

```js
papa.pa('#target', 'too young, too simple', function() {
    papa.pa('#target', 'too simple', -400);
});
```

### 脚本

```js
papa.pa(selector, [
    [content, interval, pause],
    [content, interval, pause],
    // more
]);
```

`papa.pa` 可以执行更复杂的 "脚本". 比如:

```js
var script = [
    ['I '], // 200 毫秒间隔输入, 停顿 200 毫米
    ['love ', , 1000], // 200 毫秒间隔输入, 停顿 1000 毫秒
    ['you', 400],
    ['you', -200, 500], // 200 毫米间隔删除, 停顿 500 毫秒
    ['her.']
];

papa.pa('#target', script);
```

如果 `interval` 没有提供, 则使用默认值 `200`; 如果 `pause` 没有提供, 则使用 `interval` 的值.

### HTML 元素

`papa.pa` 函数接收任何 HTML 代码, 以恰当的节律显示. 因此可以实现更复杂的效果. 比如敲入 `<table>` 元素:

```js
var tab = '<p>Table with colgroup</p>' +
    '<table>' +
    '<colgroup span="4"></colgroup>' +
    '<tr>' +
    '<th>Countries</th>' +
    '<th>Capitals</th>' +
    '<th>Population</th>' +
    '<th>Language</th>' +
    '</tr>' +
    '<tr>' +
    '<td>USA</td>' +
    '<td>Washington D.C.</td>' +
    '<td>309 million</td>' +
    '<td>English</td>' +
    '</tr>' +
    '<tr>' +
    '<td>Sweden</td>' +
    '<td>Stockholm</td>' +
    '<td>9 million</td>' +
    '<td>Swedish</td>' +
    '</tr>' +
    '</table>';

papa.pa('div#target', tab);
```

### 总结

```js
papa.pa(selector, content, interval, cursor, callback);
```

1. 其中 `content` 可以是 string 也可以是 array, 即上面所说的脚本.
2. 前两个变量必须是 `selector` 和 `content`, 后三个变量可有可无可乱序.
