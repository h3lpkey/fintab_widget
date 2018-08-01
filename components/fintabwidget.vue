<template>
    <div class="panel-white fntb-widget-calc">
        <div class="p-title">
            <a href="https://fintab.io" target="_blank">
                <img src="https://beta.fintab.io/assets/img/logo.svg?v=4" alt="">
            </a>
            <h1>Cryptocurrency Converter Calculator</h1>
        </div>
        <div class="currency-inputs">
            <div class="buttons">
                <div class="label-and-input">
                    <div class="input-group fntbwidg-input-group ">
                        <div class="input-info">
                            <img :src="first_currency_obj.img" alt="">
                        </div>
                        <input type="text"
                               class="form-control currency-input"
                               @focus="onFocus_first"
                               @blur="onBlur_first"
                               placeholder=""
                               v-model="first_currency_search"
                               aria-describedby="first_name">
                        <div class="dropdown-menu dropdown-menu-left fntbwidg-dropdown-menu"
                             v-if="showData_first"
                             style="display: block">
                            <a class="dropdown-item fntbwidg-dropdown-item"
                               href="#"
                               @mousedown="first_get_obj(item)"
                               v-for="item in filter_first">
                                <div class="currency-head">
                                    <img :src="item.img"
                                         alt="">
                                    <p class="item-name">{{item.name}}</p>
                                    <p class="item-symbol">({{item.symbol}})</p>
                                </div>
                                <p class="item-price">{{item.price}}</p>
                            </a>
                        </div>
                    </div>
                </div>
                <div @click="exchangeCurrency">
                    <icon name="exchange-alt"
                          class="exchange"
                          v-if="showExchange"
                          scale="2"></icon>
                </div>
                <div class="label-and-input">
                    <div class="input-group fntbwidg-input-group ">
                        <div class="input-info">
                            <img :src="second_currency_obj.img" alt="">
                        </div>
                        <input type="text"
                               class="form-control currency-input"
                               @focus="onFocus_second"
                               @blur="onBlur_second"
                               placeholder=""
                               v-model="second_currency_search"
                               aria-describedby="second_name">
                        <div class="dropdown-menu dropdown-menu-right fntbwidg-dropdown-menu"
                             v-if="showData_second"
                             style="display: block">
                            <a class="dropdown-item fntbwidg-dropdown-item"
                               href="#"
                               @mousedown="second_get_obj(item)"
                               v-for="item in filter_second">
                                <div class="currency-head">
                                    <img :src="item.img"
                                         alt="">
                                    <p class="item-name">{{item.name}}</p>
                                    <p class="item-symbol">({{item.symbol}})</p>
                                </div>
                                <p class="item-price">{{item.price}}</p>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="buttons">
                <div class="label-and-input">
                    <div class="input-group fntbwidg-input-group ">
                        <input type="text"
                               class="form-control"
                               @input="first_currency_amount_math()"
                               v-model="first_currency_amount"
                               placeholder="Amount to Convert">
                    </div>
                </div>
                <p class="p-helper">or</p>
                <div class="label-and-input">
                    <div class="input-group fntbwidg-input-group ">
                        <input type="text"
                               class="form-control"
                               @input="second_currency_amount_math()"
                               v-model="second_currency_amount"
                               placeholder="Amount to Convert">
                    </div>
                </div>
            </div>
            <div class="calendar">
                <div class="label-and-input">
                    <div class="input-group fntbwidg-input-group  ">
                        <div class="input-group-prepend">
                            <span class="input-group-text fntbwidg-input-group-text">Дата</span>
                        </div>
                        <datepicker v-model="date" :disabledDates="disabledDates"
                                    :bootstrap-styling="true"></datepicker>
                    </div>
                </div>
                <div class="link">
                    powered by <a href="https://fintab.io" target="_blank">Fintab</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Datepicker from 'vuejs-datepicker';

    var moment = require('moment');

    export default {
        name: "fintab_widget",
        components: {
            Datepicker,
        },
        data() {
            return {
                host_url: window.location.host,
                // url: 'https://dev5.fintab.io/ajax/index_no_auth.php',
                url: '//'+window.location.host+'/ajax/index_no_auth.php',
                what_get: 'currency',
                first_currency_search: '',
                second_currency_search: '',
                first_currency_obj: {
                    id: '',
                    name: '',
                    img: '',
                    price: '',
                },
                second_currency_obj: {
                    id: '',
                    name: '',
                    img: '',
                    price: '',
                },
                first_currency_amount: 0,
                second_currency_amount: 0,
                last_edit_first_input: true,
                price: null,
                currency_array: [],
                currency_array_formated: [],
                date: new Date(),
                showData_first: false,
                showData_second: false,
                disabledDates: {
                    from: new Date()
                },
                showExchange: true
            }
        },
        created: function () {
            // Закачиваем все валюты и курсы на сегоднящний день
            let that = this;
            that.getData_FinTab('controller=widget&action=get_all_currency', 'currency');
        },
        methods: {
            // Получение данных о всех валютах
            getData_FinTab(params, what_get) {
                let that = this;

                // IE triks
                let XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
                let xhr = new XHR();

                xhr.open('POST', that.url, true);
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4 && xhr.status == 200) {
                        switch (what_get) {
                            case 'currency' : // получить все валюты
                                that.currency_array = JSON.parse(xhr.response);
                                that.currency_array.forEach(function (item) {

                                    let obj = {};
                                    obj.id = item.from_id;
                                    if (item.price != null) {
                                        obj.price = item.price + ' $';
                                    } else {
                                        obj.price = '';
                                    }
                                    obj.name = item.name;
                                    obj.symbol = item.symbol;
                                    // obj.img = 'https://dev5.fintab.io/' + item.img_path;
                                    obj.img = '//' + host_url+'/'+item.img_path;

                                    // Выставляем btc и usd по дефолту
                                    if (item.symbol == 'BTC') {
                                        that.first_currency_obj = obj;
                                        that.first_currency_search = item.name;
                                    }
                                    if (item.symbol == 'USD') {
                                        that.second_currency_obj = obj;
                                        that.second_currency_search = item.name;
                                    }

                                    that.currency_array_formated.push(obj);


                                });
                                break;
                            case 'price': // получить цену валютной пары
                                that.price = JSON.parse(xhr.response);
                                if (that.first_currency_amount != 0 && that.second_currency_amount != 0) {
                                    if(that.last_edit_first_input) {
                                        that.second_currency_amount = that.first_currency_amount * that.price['first'];
                                    } else {
                                        that.first_currency_amount = that.second_currency_amount * that.price['second']
                                    }
                                } else {
                                    that.first_currency_amount = 1;
                                    that.second_currency_amount = that.price['first'];
                                }

                                break;
                        }
                    }
                };

                xhr.onerror = function () {
                    alert('Ошибка ' + this.status);
                };

                xhr.send(params);
            },
            // Получение ценника
            getPrices(first, second, date) {
                let history = moment().diff(date, 'days');
                let params = 'controller=widget&action=get_price&first_currency=' +
                    first + '&second_currency=' + second +
                    '&date=' + Math.round(date.getTime() / 1000) +
                    '&history=' + history;
                this.getData_FinTab(params, 'price');
            },
            // Запросить цену если есть обе валюты и дата
            checkInputs() {
                let that = this;
                if (that.first_currency_obj.id != '' && that.second_currency_obj.id != '') {
                    that.getPrices(that.first_currency_obj.id, that.second_currency_obj.id, that.date);
                }
            },
            // показывать ли dropdown
            onFocus_first() {
                this.showData_first = true;
            },
            onFocus_second() {
                this.showData_second = true;
            },
            onBlur_first() {
                this.showData_first = false;
            },
            onBlur_second() {
                this.showData_second = false;
            },
            // по клику в dropdown
            first_get_obj(item) {
                this.first_currency_obj = item;
                this.first_currency_search = item.name;
            },
            second_get_obj(item) {
                this.second_currency_obj = item;
                this.second_currency_search = item.name;
            },
            // Расчёт математики валют
            first_currency_amount_math() {
                let price = this.first_currency_amount * this.price['first'];
                this.last_edit_first_input = true;
                if (!isNaN(price)) {
                    this.second_currency_amount = price;
                } else {
                    this.second_currency_amount = '';
                }
            },
            second_currency_amount_math() {
                let price = this.second_currency_amount * this.price['second'];
                this.last_edit_first_input = false;
                if (!isNaN(price)) {
                    this.first_currency_amount = price;
                } else {
                    this.first_currency_amount = '';
                }
            },
            // смена позиций
            exchangeCurrency() {
                let buffer_obj = {};
                let buffer_search = '';
                let buffer_amount = 0;

                buffer_obj = this.first_currency_obj;
                this.first_currency_obj = this.second_currency_obj;
                this.second_currency_obj = buffer_obj;

                buffer_search = this.first_currency_search;
                this.first_currency_search = this.second_currency_search;
                this.second_currency_search = buffer_search;

                buffer_amount = this.first_currency_amount;
                this.first_currency_amount = this.second_currency_amount;
                this.second_currency_amount = buffer_amount;
            },
        },
        watch: {
            // TODO: костыль, как следить сразу за всеми?
            // Чекаем все ли inputs заполненны
            first_currency_obj() {
                this.checkInputs();
            },
            second_currency_obj() {
                this.checkInputs();
            },
            date() {
                this.checkInputs();
            },
            first_currency_amount() {
                let num = this.first_currency_amount.toString().replace(",", ".");
                this.first_currency_amount = num;
            },
            second_currency_amount() {
                let num = this.second_currency_amount.toString().replace(",", ".");
                this.second_currency_amount = num;
            }
        },
        computed: {
            filter_first(currency) {
                return this.currency_array_formated.filter(currency => {
                    return currency.name.toLowerCase().includes(this.first_currency_search.toLowerCase()) ||
                        currency.symbol.toString().toLowerCase().includes(this.first_currency_search.toLowerCase())
                })
            },
            filter_second(currency) {
                return this.currency_array_formated.filter(currency => {
                    return currency.name.toLowerCase().includes(this.second_currency_search.toLowerCase()) ||
                        currency.symbol.toString().toLowerCase().includes(this.second_currency_search.toLowerCase())
                })
            }
        }
    }
</script>

<style lang="scss">
    $color_white: #fff;
    $color_black: #313131;
    $color_red: #ff6d52;
    $color_green: #1dc116;
    $color_black: #212121;
    $color_gray: #d9d9d9;
    $color_gray_08: rgba(153, 155, 169, 0.8);
    $color_gray_1: rgba(238, 238, 238, 1);
    $color_yellow: #FFDA46;

    $border_gray_08: 1px solid rgba(153, 155, 169, 0.8);
    $border_gray_02: 1px solid rgba(153, 155, 169, 0.2);
    $border_radius: 7px;

    $gray_text_05: rgba(67, 73, 106, 0.5);
    $gray_text_07: rgba(67, 73, 106, 0.7);
    $black_text: rgba(41, 35, 11, 1);
    $black_text_07: rgba(41, 35, 11, 0.7);
    $attention_text: #ad6d1b;

    $input_color: rgba(0, 0, 0, 0.5);

    $background_white: #fff;

    $fb_background: #3F58A4;
    $google_background: #D84132;

    $btn_yellow: #ffd400;
    $btn_yellow_hover: #f2c700;

    $shadow: 0 0 64px -1px #d2d2d2;

    textarea:focus,
    input[type="text"]:focus,
    input[type="password"]:focus,
    input[type="datetime"]:focus,
    input[type="datetime-local"]:focus,
    input[type="date"]:focus,
    input[type="month"]:focus,
    input[type="time"]:focus,
    input[type="week"]:focus,
    input[type="number"]:focus,
    input[type="email"]:focus,
    input[type="url"]:focus,
    input[type="search"]:focus,
    input[type="tel"]:focus,
    input[type="color"]:focus,
    .uneditable-input:focus {
        border-color: #FFDA46;
        box-shadow: 0 1px 1px $color_yellow inset, 0 0 8px $color_yellow;
        outline: 0 none;
    }

    .exchange {
        margin: auto;
        cursor: pointer;
    }

    .fntbwidg-dropdown-menu {
        max-height: 300px;
        width: 350px;
        padding: 0px;
        overflow-y: scroll;
        .fntbwidg-dropdown-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 5px 15px;

            &:hover {
                background-color: $color_yellow;
            }
            img {
                width: 30px;
                height: 30px;
            }
            .currency-head {
                display: flex;
                flex-direction: row;
                justify-content: start;
                align-items: center;
            }
            .item-name {
                display: flex;
                justify-content: center;
                flex-direction: column;
                text-align: center;
                margin: 0 10px;
            }
            .item-symbol {
                display: flex;
                justify-content: center;
                flex-direction: column;
                text-align: center;
                margin: 0 0px;
                font-size: 14px;
            }
            .item-price {
                display: flex;
                justify-content: center;
                flex-direction: column;
                text-align: center;
                margin: 0 10px;
                color: $gray_text_05;
                font-size: 0.8em;
            }
        }
    }

    .vdp-datepicker {
        .input-group {
            height: 100%;
        }
        .vdp-datepicker__calendar .cell.selected {
            background: $color_yellow;
        }

        .vdp-datepicker__calendar header {
            line-height: 30px;
        }

        .vdp-datepicker__calendar {
            left: -80px;
            margin-top: 5px;
            border-radius: .25rem;
        }

        .vdp-datepicker__calendar .cell:not(.blank):not(.disabled).day:hover,
        .vdp-datepicker__calendar .cell:not(.blank):not(.disabled).month:hover,
        .vdp-datepicker__calendar .cell:not(.blank):not(.disabled).year:hover {
            border: 1px solid $color_yellow;
        }
    }

    .fntbwidg-input-group {
        height: 50px;
        flex-wrap: nowrap;

    }

    .fntbwidg-input-group-text {
        background-color: $color_yellow;
        border: 1px solid $color_yellow;
    }

    .input-group > .custom-file, .input-group > .custom-select, .input-group > .form-control {
        border-bottom-left-radius: 0px;
        border-top-left-radius: 0px;
    }

    .fntb-widget-calc {
        max-width: 600px;
    }

    .fntbwidg-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        line-height: 0px !important;
        font-size: 16px;
        border-radius: 8px;
        border-width: 2px;
        height: 44px;
        min-width: 160px;
        padding: 10px 0;
        font-weight: 300;
        .fntbwidg-btn-text {
            flex-grow: 1;
        }
        .fntbwidg-btn-icon {
            flex-grow: 1;
        }
    }

    .calendar {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin: 10px;
        .link {
            margin-top: auto;
        }
    }

    .buttons {
        display: flex;
        flex-direction: row;
        margin: 10px;
        justify-content: space-between;
        align-items: center;
        button {
            margin-right: 40px;
        }
    }

    .label-and-input {
        display: flex;
        flex-direction: column;
        margin: 5px;
        max-width: 200px;
        .currency-input {
            padding-left: 45px;
            background-color: rgba(0, 0, 0, 0)
        }
        .input-info {
            position: absolute;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            width: 200px;
            align-self: center;
            img {
                margin: 10px;
                width: 30px;
                height: 30px;
            }
        }
    }

    .panel-white {
        background-color: $background_white;
        margin: 10px auto;
        font-size: 16px;
        .p-helper {
            color: $gray_text_05;
            margin: auto;
        }
        .p-title {
            margin: 40px;
            text-align: center;
            img {
                width: 250px;
            }
            h1 {
                font-size: 1em;
                padding-top: 20px;
                line-height: 0.8em;
                color: $color_black;
            }

        }
        .panel-block-l {
            margin: 40px;
        }
    }

    .currency-inputs {
        margin: 40px;
    }
</style>