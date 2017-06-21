function cashRegisterController(model, view) {
    this._model = model;
    this._view = view;

    var _this = this;

    this._view.registryMoneyAdded.attach(function (sender, args) {
        _this.updateCoinAmount(args.coin, args.value, args.elementId);
    });

    this._view.makeCalculationEvent.attach(function (sender, args) {
        _this.calculateChange(args.price, args.cash);
    });

    this._view.makePaymentEvent.attach(function (sender, args) {
        _this.makePayment(args.price, args.cash);
    });

}

cashRegisterController.prototype = function () {

    return {
        updateCoinAmount: function (coin, amount, elementId) {
            this._model.updateMoney(coin, amount, elementId);
        },
        calculateChange: function (price, cash) {
            this._model.calculateChange(price, cash);
        },
        makePayment: function (price, cash) {
            this._model.makePayment(price, cash);
        },
    }
}();