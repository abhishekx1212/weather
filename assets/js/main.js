let selectValue1 = document.getElementById('selectValue1');
let selectValue2 = document.getElementById('selectValue2');
let selectValue3 = document.getElementById('selectValue3');

$.ajax({
    url: 'https://api.countrystatecity.in/v1/countries',
    method: 'GET',
    headers: {
        "X-CSCAPI-KEY": "RU1oZVNOQjRieWZyQlM1alNhNFdIZkRpMm02YUhmdHVxZm9UWXo3eQ=="
    },
    success: function (res) {
        getCountry(res);
        countrySelect(res);
        resetCoun(res);
    }
});

function getCountry(res) {
    for (let val of res) {
        selectValue1.innerHTML += `<option value="${val.name}">${val.name}</option> `
    }
}

function countrySelect(country) {
    selectValue1.addEventListener('change', function Select1() {
        const selectedCountry = country.find((item) => {
            return item.name === this.value;
        })
        var countryCode = selectedCountry.iso2;
        commonSelect(this.value);
        countryCodeSelect(countryCode);
        emptyCity();
    })
}

function countryCodeSelect(countryCode) {
    $.ajax({
        url: `https://api.countrystatecity.in/v1/countries/${countryCode}/states`,
        method: 'GET',
        headers: {
            "X-CSCAPI-KEY": "RU1oZVNOQjRieWZyQlM1alNhNFdIZkRpMm02YUhmdHVxZm9UWXo3eQ=="
        },
        success: function (res) {
            var states = res;
            getStates(states);
            stateSelect(states, countryCode);
        }
    })
}

function getStates(states) {
    selectValue2.innerHTML = "";
    if (selectValue2.innerHTML === "") {
        selectValue2.innerHTML = `
                <option value="">Select state</option>
       `;
    }
    for (let val of states) {
        selectValue2.innerHTML += `
                <option value="${val.name}">${val.name}</option>
       `
    }
}

function stateSelect(states, countryCode) {
    let countryCode2 = countryCode;
    selectValue2.addEventListener('change', function Select2() {
        const selectedState = states.find((item) => {
            return item.name === this.value;
        })
        var stateCode = selectedState.iso2;
        commonSelect(this.value);
        citySelect(stateCode, countryCode2);
    })
}

function citySelect(stateCode, countryCode2) {
    $.ajax({
        url: `https://api.countrystatecity.in/v1/countries/${countryCode2}/states/${stateCode}/cities`,
        method: 'GET',
        headers: {
            "X-CSCAPI-KEY": "RU1oZVNOQjRieWZyQlM1alNhNFdIZkRpMm02YUhmdHVxZm9UWXo3eQ=="
        },
        success: function (res) {
            var cities = res;
            getCities(cities);
        }
    })
}

function emptyCity() {
    selectValue3.innerHTML = `<option value="">Select City</option>`;
}

function getCities(cities) {
    selectValue3.innerHTML = "";
    if (selectValue3.innerHTML === "") {
        selectValue3.innerHTML = `
                <option value="">Select City</option>
       `;
    }
    for (let val of cities) {
        selectValue3.innerHTML += `
                <option value="${val.name}">${val.name}</option>
       `
    }
}

selectValue3.addEventListener('change', function select3() {
    commonSelect(this.value);
    console.log(this.value)
})

function commonSelect(place) {
    $.ajax({
        url: `https://api.openweathermap.org/data/2.5/weather?q=${place}&appid=ebbbf2b76d183c63466e54ffa1149718`,
        type: 'GET',
        success: function (response) {
            console.log(response);
            var weather = response.main;
            var humidity = weather.humidity;
            var pressure = weather.pressure;
            var temp = weather.temp;
            var place = response.name;

            document.querySelector('#result').innerHTML = `
                <ul class="p-0 ps-2">
                    <li><span style="color:lightcoral;"><i class="fa-solid fa-location-dot"></i> PLACE: ${place}</span></li>
                    <li class="py-3"><span style="color:lightsalmon;"><i class="fa-solid fa-temperature-half"></i> TEMPERATURE: ${temp}</span></li>
                    <li><span style="color:lightskyblue;"><i class="fa-solid fa-fire"></i> HUMIDITY: ${humidity}%</span></li>
                    <li class="pt-3"><span style="color:violet;"><i class="fa-solid fa-gauge-high"></i> PRESSURE: ${pressure} psi</span></li>
                </ul>
            `
        }
    })
}

function resetCoun(countryreset) {
    let reset = document.getElementById('reset');
    reset.addEventListener('click', () => {
        for (let val of countryreset) {
            selectValue1.innerHTML += `<option value="${val.name}">${val.name}</option>`
        }

        document.querySelector('#selectValue2').innerHTML = `<option id="opt" value="">Select state</option>`;
        document.querySelector('#selectValue3').innerHTML = `<option id="opt" value="">Select city</option>`;
        document.querySelector('#result').innerHTML = "";
    })
}
