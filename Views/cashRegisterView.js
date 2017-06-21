function cashRegisterView(model, elements) {
    var self = this;

    this._model = model;
    this._elements = elements;

    this.registryMoneyAdded = new Event(this);
    this.makeCalculationEvent = new Event(this);
    this.makePaymentEvent = new Event(this);

    this._model.registryMoneyAdded.attach(function (sender, item) {
        self.buildCashRegistry(item.elementId);
    });
    this._model.registryTotalUpdated.attach(function (sender) {
        self.updateTotalField();
    });

    this._model.displayChange.attach(function (sender, item) {
        self.updateChangeFields(item.insufficientFunds);
    });

    this._model.updateRegisterStatus.attach(function (sender) {
        self.updateStatusFields();
    });


    this.init();
}


cashRegisterView.prototype = function () {


    var cleanValue = function (value, coin) {
        var result;
        if (value % 1 === 0) {
            result = parseInt((coin) * (value));
        }
        else {
            result = parseFloat((coin) * (value));
        }
        return result;
    };

    var amtFocusHandler = function () {
        if (this.value == '0') { this.value = '' }
        return false;
    };

    var amtBlurHandler = function () {
        if (this.value == '') { this.value = '0' }
        return false;
    };

    var clearValue = function (pValue) {
        return parseFloat(pValue).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    };

    return {
        init: function () {
            this.setupHandlers()
                .enableHandlers();
        },
        setupHandlers: function () {
            this.makeCalculationButtonHandler = this.makeCalculation.bind(this);
            this.makePaymentButtonHandler = this.makePayment.bind(this);
            return this;
        },
        enableHandlers: function () {
            this._elements.calculateButton.addEventListener("click", this.makeCalculationButtonHandler, false);
            this._elements.btnMakePayment.addEventListener("click", this.makePaymentButtonHandler, false);
            return this;
        },
        atachEvents: function () {
            var self = this;

            for (var i = 0; i < this._elements.registryCoins.length; i++) {
                var el = this._elements.registryCoins[i];
                var id = el.id;
                el.addEventListener("blur", amtBlurHandler, false);
                el.addEventListener("focus", amtFocusHandler, false);
                el.addEventListener("keyup", self.inputChanged.bind(self, id), false);
                el.addEventListener("change", self.inputChanged.bind(self, id), false);
            }
        },
        inputChanged: function (elementId) {
            var domElement = document.getElementById(elementId);
            var coin = elementId.replace("in-", "").toUpperCase();
            var amount = parseInt(domElement.value.replace(/\D/g, '').replace(/^0+/, ''));
            if (isNaN(amount)) {
                amount = 0;
            }
            this.registryMoneyAdded.notify({ coin: coin, value: amount, elementId: elementId });

        },

        show: function () {
            this.buildCashRegistry(null);
            this.updateTotalField();
            this.updateChangeFields();
            this.updateStatusFields();
            this.updateStatusFields();
        },

        updateTotalField: function () {
            var totalAmount = this._model.getTotalAmt();
            var list = this._elements.cashRegistry;
            var div = document.createElement('div');

            div.className = 'col-md-6';
            div.innerHTML =
                '<div class="input-group">' +
                '<span class="input-group-addon">Total</span>' +
                '<input id="in-total" type="text" value="' + totalAmount + '" class="form-control input-md" placeholder="Total" aria-describedby="basic-addon1">' +
                '</div>' +
                '</div>';

            list.lastElementChild.appendChild(div);

        },

        buildCashRegistry: function (elementId) {
            var list, coins, coins_values, coins_labels, key;

            list = this._elements.cashRegistry;
            list.innerHTML = '';

            coins = this._model.getAllPossibleCoins();
            coins_values = this._model.getAllPossibleCoinsValues();
            coins_labels = this._model.getAllPossibleCoinsLabels();

            var htmlmarkup = '';
            for (var i = 0; i < coins_labels.length; i++) {

                if (i % 2 == 0) {
                    htmlmarkup += '<div class="row top-buffer">'
                }
                for (var j = i; j < (i + 2) && j < coins_labels.length; j++) {
                    var coinName = coins_labels[j];
                    var coinNumericValue = coins_values[j];
                    var coinNameLower = coinName.toLowerCase();
                    var coinValue = this._model.getCoinAmt(coinName);
                    htmlmarkup += '<div class="col-md-6">' +
                        '<div class="input-group">' +
                        '<span class="input-group-addon">' + coinNumericValue + '</span>' +
                        '<input id="in-' + coinNameLower + '" type="text" value="' + coinValue + '" class="form-control input-md regCoin" aria-describedby="basic-addon1">' +
                        '</div>' +
                        '</div >';
                }

                if (i % 2 == 0) {
                    htmlmarkup += '</div >';
                }
                i = j - 1;

            }
            list.insertAdjacentHTML('beforeend', htmlmarkup);

            this.atachEvents();
            if (elementId != null) {
                var elementToFocus = document.getElementById(elementId);
                elementToFocus.focus();
                var val = elementToFocus.value;
                elementToFocus.value = '';
                elementToFocus.value = val;
            }
        },
        updateStatusFields: function () {
            var inputTotalAmountAvailable = this._elements.intotalAmountAvailable;
            var inputInitialCash = this._elements.ininitialCash;
            var inputSoldAmount = this._elements.insoldAmount;

            var initialCash = '' + this._model.getInitialCash();
            var soldAmount = this._model.getSoldAmount();
            var totalAmountValue = clearValue(parseFloat(initialCash.replace(/,/g, '')) + parseFloat(soldAmount));

            inputInitialCash.innerHTML = initialCash;
            inputSoldAmount.innerHTML = soldAmount;
            inputTotalAmountAvailable.innerHTML = totalAmountValue;

        },
        updateChangeFields: function (changeMessage) {
            var list, coins, coins_labels, key;

            list = this._elements.changeDetails; 
            this._elements.changeDue.innerHTML = '' + this._model.getTotalChange();
            list.innerHTML = '';

            coins = this._model.getAllPossibleCoins();
            coins_changes = this._model.getAllPossibleCoinsValues();
            coins_labels = this._model.getAllPossibleCoinsLabels();

            if (typeof changeMessage == 'undefined') {
                this._elements.statusContainer.style.display = 'none';
                this._elements.btnMakePayment.style.display = 'none';


            } else if (!changeMessage) {
                var htmlmarkup = '<ul>';
                for (var i = 0; i < coins.length; i++) {
                    var coinName = coins[i];
                    var coinNameLower = coinName.toLowerCase();
                    var coinNameFirstCharUp = coinNameLower.capitalize();
                    var coinChangeValue = this._model.getCoinValue(coinName);
                    var coinChangeAmt = this._model.getCoinChange(coinName);
                    var coinRepresentation = this._model.getCoinRepresentation(coinName);
                    var totalCoinValAmt = clearValue((coinChangeValue * coinChangeAmt));
                    htmlmarkup += '<li>' + coinNameFirstCharUp + ' (' + coinRepresentation + '): <span id="' + coinNameLower + 'Quantity">' + coinChangeAmt + '</span>, Total = <span id="' + coinNameLower + 'Total">' + totalCoinValAmt + '</span></li>';
                }


                htmlmarkup += '</ul >';



                list.insertAdjacentHTML('beforeend', htmlmarkup);
                this._elements.statusY.style.display = 'inherit';
                this._elements.statusContainer.style.display = 'inherit';
                this._elements.statusN.style.display = 'none';
                this._elements.btnMakePayment.style.display = 'inherit';
            } else {
                this._elements.statusY.style.display = 'none';
                this._elements.statusContainer.style.display = 'inherit';
                this._elements.statusN.style.display = 'inherit';
                this._elements.btnMakePayment.style.display = 'none';

            }
        },


        makeCalculation: function () {//TODO: validations on inputs
            var cash = this._elements.cashInput.value;
            var price = this._elements.priceInput.value;
            this.makeCalculationEvent.notify({ cash: cash, price: price });
        },

        makePayment: function () {
            var cash = this._elements.cashInput.value;
            var price = this._elements.priceInput.value;
            this.makePaymentEvent.notify({ cash: cash, price: price });
        }
    }
}();

function nextButtonClick() {
    var nextId = this.parentNode.getAttribute("data-next-step");
    if (nextId !== null) {
        var tabToShow = document.getElementById(nextId).style.display = 'block';
        this.parentNode.style.display = 'none';

        document.querySelectorAll("a[href='#" + nextId + "']")[0].parentNode.setAttribute('class', 'active');
        document.querySelectorAll("a[href='#" + this.parentNode.id + "']")[0].parentNode.setAttribute('class', '');

    }
}