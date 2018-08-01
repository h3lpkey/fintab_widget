# fintab_widget
widget for embedding in sites

Пример работы. Писалось наспех, изучая по пути vuejs :)

Задача виджета - получать цены валютных пар во временном отрезке, шобы реактивно и быстро.

## Установка
```
git clone https://github.com/h3lpkey/fintab_widget
npm install
npm run build
```
Сгенерируется *fintab_widget.js*, его собсвтенно всталвять на сайт, в вёрстке добавляем такое

```
<div id="fintabwidget">
    <fintabwidget></fintabwidget>
</div>
<script src="fintab_widget.js"></script>
```
