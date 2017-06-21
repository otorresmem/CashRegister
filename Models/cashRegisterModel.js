function cashRegisterModel() {
    this.totalAvailable = 0;
    this.initialCash = 0;
    this.totalSold = 0;
    this.payments = new Array();

    this.paymentAdded = new Event(this);
    this.registryMoneyAdded = new Event(this);
    this.registryMoneyRemoved = new Event(this);
    this.registryTotalUpdated = new Event(this);
    this.displayChange = new Event(this);
    this.updateRegisterStatus = new Event(this);

    this.init();
}


cashRegisterModel.prototype = function () {
    var _coinValues = {};
    var _amtMoney = {};
    var _changeMoney = {};
    function Payment(price, cash) {
        var _cash = cash;
        var _price = price;
        var paymentDone = false;
        return {
            getPrice: function () {
                return _price;
            }
        };
    }

    _coinValues[constants.PENNY] = 0.01;
    _coinValues[constants.NICKEL] = 0.05;
    _coinValues[constants.DIME] = 0.1;
    _coinValues[constants.QUARTER] = 0.25;
    _coinValues[constants.ONE] = 1;
    _coinValues[constants.FIVE] = 5;
    _coinValues[constants.TEN] = 10;
    _coinValues[constants.TWENTY] = 20;
    _coinValues[constants.HUNDRED] = 100;


    _amtMoney[constants.PENNY] = 0;
    _amtMoney[constants.NICKEL] = 0;
    _amtMoney[constants.DIME] = 0;
    _amtMoney[constants.QUARTER] = 0;
    _amtMoney[constants.ONE] = 0;
    _amtMoney[constants.FIVE] = 0;
    _amtMoney[constants.TEN] = 0;
    _amtMoney[constants.TWENTY] = 0;
    _amtMoney[constants.HUNDRED] = 0;

    var initializeChangeMoney = function () {
        _changeMoney[constants.PENNY] = 0;
        _changeMoney[constants.NICKEL] = 0;
        _changeMoney[constants.DIME] = 0;
        _changeMoney[constants.QUARTER] = 0;
        _changeMoney[constants.ONE] = 0;
        _changeMoney[constants.FIVE] = 0;
        _changeMoney[constants.TEN] = 0;
        _changeMoney[constants.TWENTY] = 0;
        _changeMoney[constants.HUNDRED] = 0;
    }

    var _allCoins = [constants.HUNDRED, constants.TWENTY, constants.TEN, constants.FIVE, constants.ONE, constants.QUARTER, constants.DIME, constants.NICKEL, constants.PENNY];
    var _allCoinsLabels = [constants.HUNDRED, constants.QUARTER, constants.TWENTY, constants.DIME, constants.TEN, constants.NICKEL, constants.FIVE, constants.PENNY, constants.ONE];
    var _allCoinsValues = [constants.HUNDRED_VALUE, constants.QUARTER_VALUE, constants.TWENTY_VALUE, constants.DIME_VALUE, constants.TEN_VALUE, constants.NICKEL_VALUE, constants.FIVE_VALUE, constants.PENNY_VALUE, constants.ONE_VALUE];

    var getSingleCoinAmount = function (coinName) {//returns the total amount of each coin denomination
        var factor = _coinValues[coinName];
        var amount = _amtMoney[coinName];
        var result = 0;
        if (factor % 1 === 0) {
            result = parseInt((amount) * (factor));
        }
        else {
            result = parseFloat((amount) * (factor));
        }
        return result;
    };

    var calculateTotalAmount = function (self) {
        var totalAmount = 0;
        var totalAmountDecimals = 0;
        var totalAmountIntegers = 0;

        for (var i = 0; i < _allCoins.length; i++) {
            var coinName = _allCoins[i];
            switch (coinName) {
                case constants.PENNY:
                    totalAmountDecimals += getSingleCoinAmount(constants.PENNY);
                    break;
                case constants.NICKEL:
                    totalAmountDecimals += getSingleCoinAmount(constants.NICKEL);
                    break;
                case constants.DIME:
                    totalAmountDecimals += getSingleCoinAmount(constants.DIME);
                    break;
                case constants.QUARTER:
                    totalAmountDecimals += getSingleCoinAmount(constants.QUARTER);
                    break;
                case constants.ONE:
                    totalAmountIntegers += getSingleCoinAmount(constants.ONE);
                    break;
                case constants.FIVE:
                    totalAmountIntegers += getSingleCoinAmount(constants.FIVE);
                    break;
                case constants.TEN:
                    totalAmountIntegers += getSingleCoinAmount(constants.TEN);
                    break;
                case constants.TWENTY:
                    totalAmountIntegers += getSingleCoinAmount(constants.TWENTY);
                    break;
                case constants.HUNDRED:
                    totalAmountIntegers += getSingleCoinAmount(constants.HUNDRED);
                    break;
            }
        }
        totalAmount = totalAmountIntegers + totalAmountDecimals;
        return clearValue(totalAmount);
    };

    var clearValue = function (pValue) {
        return parseFloat(pValue).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    };

    var calculateIntegerChanges = function (coinName, difference) {
        var coinValue = _coinValues[coinName];
        var coinCount = _amtMoney[coinName];
        var coinNeeded = Math.floor((difference * 100) / (coinValue * 100));
        var changeAmtNeeded = 0;
        if (difference >= coinValue && coinCount > 0) {
            if (coinCount < coinNeeded) {
                changeAmtNeeded = coinCount;
            } else {
                changeAmtNeeded = Math.floor(coinNeeded);
            }
            _changeMoney[coinName] = changeAmtNeeded;
            difference -= coinValue * changeAmtNeeded;
        }
        return clearValue(difference);
    };

    var calculateChangeLogic = function (price, cash) {
        var enoughFounds = false;
        var difference = cash - price;
        if (difference >= 0) {
            for (var i = 0; i < _allCoins.length; i++) {
                var coinName = _allCoins[i];
                difference = calculateIntegerChanges(coinName, difference);
            }
            enoughFounds = difference == 0;
        }
        return enoughFounds;

    };

    var updateRemainingChange = function () {
        for (var i = 0; i < _allCoins.length; i++) {
            var coinName = _allCoins[i];

            _amtMoney[coinName] -= _changeMoney[coinName];
        }
    };


    return {
        init: function () {
            initializeChangeMoney();
        },
        makePayment: function (price, cash) {
            var actualPayment = new Payment(price, cash);
            this.payments.push(actualPayment);
            updateRemainingChange();
            this.totalAvailable = calculateTotalAmount(this);
            this.registryMoneyAdded.notify({ elementId: null });
            this.registryTotalUpdated.notify();
            this.updateRegisterStatus.notify();
        },

        calculateChange: function (price, cash) {
            initializeChangeMoney();
            var enoughFounds = calculateChangeLogic(price, cash);
            this.displayChange.notify({ insufficientFunds: !enoughFounds });
        },
        getAllPossibleCoins: function () {
            return [].concat(_allCoins);
        },
        getAllPossibleCoinsLabels: function () {
            return [].concat(_allCoinsLabels);
        },
        getAllPossibleCoinsValues: function () {
            return [].concat(_allCoinsValues);
        },
        updateTotal: function () {
            this.totalAvailable = calculateTotalAmount(this);
            this.initialCash = this.totalAvailable;
            this.registryTotalUpdated.notify();
            this.updateRegisterStatus.notify();
        },
        updateMoney: function (coin, amount, elementId) {
            _amtMoney[coin] = amount;
            this.registryMoneyAdded.notify({ coin: coin, amount: amount, elementId: elementId });
            this.updateTotal();
            this.updateRegisterStatus.notify();
        },
        addMoney: function (coin, amount) {
            _amtMoney[coin] += amount;
            this.registryMoneyAdded.notify({ coin: coin, amount: amount });
        },
        removeMoney: function (coin, amount) {
            _amtMoney[coin] -= amount;
            this.registryMoneyRemoved.notify({ coin: coin, amount: amount });
        },
        resetMoney: function (coin) {
            _amtMoney[coin] = 0;
            notifyController();
        },
        getSoldAmount: function () {
            var totalSold = 0;
            for (var i = 0; i < this.payments.length; i++) {
                var paymentPrice = this.payments[i].getPrice();
                totalSold += parseFloat(paymentPrice);
            }
            return clearValue(totalSold);
        },
        getInitialCash: function () {
            return this.initialCash;
        },
        getCoinAmt: function (coin) {
            return _amtMoney[coin];
        },
        getTotalAmt: function () {
            return this.totalAvailable;
        },
        addPayment: function (payment) {
            payments.push(payment);
        },
        getCoinValue: function (coin) {
            return _coinValues[coin];
        },
        getCoinChange: function (coin) {
            return _changeMoney[coin];
        },
        getTotalChange: function () {
            var totalChange = 0;
            for (var i = 0; i < _allCoins.length; i++) {
                var coinName = _allCoins[i];
                totalChange += parseFloat(_changeMoney[coinName] * _coinValues[coinName]);
            }
            return clearValue(totalChange);
        },
        getCoinRepresentation: function (coinName) {
            var representation = '';
            switch (coinName) {
                case constants.PENNY:
                    representation = constants.PENNY_VALUE;
                    break;
                case constants.NICKEL:
                    representation = constants.NICKEL_VALUE;
                    break;
                case constants.DIME:
                    representation = constants.DIME_VALUE;
                    break;
                case constants.QUARTER:
                    representation = constants.QUARTER_VALUE;
                    break;
                case constants.ONE:
                    representation = constants.ONE_VALUE;
                    break;
                case constants.FIVE:
                    representation = constants.FIVE_VALUE;
                    break;
                case constants.TEN:
                    representation = constants.TEN_VALUE;
                    break;
                case constants.TWENTY:
                    representation = constants.TWENTY_VALUE;
                    break;
                case constants.HUNDRED:
                    representation = constants.HUNDRED_VALUE;
                    break;
            }
            return representation;
        },
    }
}();


