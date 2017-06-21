(function () {
    document.getElementById("step1Btn").addEventListener("click", function () {
        document.getElementById("step1Btn").className = "active";
        document.getElementById("step2Btn").className = "";
        document.getElementById("step3Btn").className = "";
        document.getElementById("step1").className = "tab-pane active";
        document.getElementById("step2").className = "tab-pane";
        document.getElementById("step3").className = "tab-pane";
    });

    document.getElementById("step2Btn").addEventListener("click", function () {
        document.getElementById("step1Btn").className = "";
        document.getElementById("step2Btn").className = "active";
        document.getElementById("step3Btn").className = "";
        document.getElementById("step1").className = "tab-pane";
        document.getElementById("step2").className = "tab-pane active";
        document.getElementById("step3").className = "tab-pane";
    });

    document.getElementById("step3Btn").addEventListener("click", function () {
        document.getElementById("step1Btn").className = "";
        document.getElementById("step2Btn").className = "";
        document.getElementById("step3Btn").className = "active";
        document.getElementById("step1").className = "tab-pane";
        document.getElementById("step2").className = "tab-pane";
        document.getElementById("step3").className = "tab-pane active";
    });
})();
