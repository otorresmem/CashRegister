var paymentModel = function () {
    var price = 0;
    var cash = 0;

    var notifyController = function () {
        $('body').trigger('updateView');
    }
    // public methods
    return {
        addMoney: function (coin, amount) {
            _amtMoney[coin] += amount;
            notifyController();
        },
        removeMoney: function (coin, amount) {
            _amtMoney[coin] -= amount;
            notifyController();
        },
        resetMoney: function (coin) {
            _amtMoney[coin] = 0;
            notifyController();
        },
        getCoinAmt: function (coin) {
            return _amtMoney[coin];
        }
    };
};