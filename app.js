(function (model) {
    
    String.prototype.capitalize = function () {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }
    var model = new cashRegisterModel(),
        view = new cashRegisterView(model, {
            'registryCoins': document.getElementsByClassName('regCoin'), 
            'regCoinPayment': document.getElementsByClassName('regCoinPayment'), 
            'cashRegistry': document.getElementById('cashRegistry'),
            'calculateButton': document.getElementById('btnCalculate'),
            'cashInput': document.getElementById('in-cash'),
            'priceInput': document.getElementById('in-price'),
            'changeDetails': document.getElementById('changeDetails'),
            'changeDue': document.getElementById('changeDue'),
            'statusY': document.getElementById('statusY'),
            'statusN': document.getElementById('statusN'),
            'statusContainer': document.getElementById('statusContainer'), 
            'btnMakePayment': document.getElementById('btnMakePayment'),
            'insoldAmount': document.getElementById('in-soldAmount'),
            'ininitialCash': document.getElementById('in-initialCash'),
            'intotalAmountAvailable': document.getElementById('in-totalAmountAvailable') 
        }),
        controller = new cashRegisterController(model, view);

    view.show();
})();
