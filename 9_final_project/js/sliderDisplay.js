let indicators = document.getElementsByClassName("indicator");
for(let i = 0; i < indicators.length; i++) {
    let indicator = indicators[i];
    let slider = document.getElementById(indicator.getAttribute("attached"));
    indicator.innerHTML = slider.value;
    slider.addEventListener(
        "input",
        function() {
            indicator.innerHTML = slider.value;
        },
        false
    );
}