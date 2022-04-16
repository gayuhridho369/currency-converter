const amountInput = document.getElementById('amountInput');
const dropLists = document.querySelectorAll('.drop-list select');
const fromCurreny = document.getElementById('fromCurrency');
const toCurrency = document.getElementById('toCurrency');
const iconReverse = document.getElementById('iconReverse');
const exchangeRateResult = document.getElementById('exchangeRateResult');
const exchangeButton = document.getElementById('exchangeButton');

iconReverse.addEventListener('click', () => {
    const defaultFromCurrency = fromCurreny.value;
    fromCurreny.value = toCurrency.value;
    toCurrency.value = defaultFromCurrency;

    getFlag(fromCurreny);
    getFlag(toCurrency);
    getExchangeRate();
});

exchangeButton.addEventListener('click', event => {
    event.preventDefault();
    getExchangeRate();
});

dropLists.forEach((dropList, index) => {
    for (currencyCode in countryCode) {
        const optionTag = document.createElement('option');
        optionTag.textContent = currencyCode;
        optionTag.setAttribute('value', currencyCode);

        if (index == 0) {
            if (currencyCode == 'USD') {
                optionTag.setAttribute('selected', true);
            }
        } else if (index == 1) {
            if (currencyCode == 'IDR') {
                optionTag.setAttribute('selected', true);
            }
        }

        dropList.insertAdjacentElement('beforeend', optionTag);
    }

    dropList.addEventListener('change', event => {
        getFlag(event.target);
    })
});

function getFlag(selected) {
    for (code in countryCode) {
        if (code == selected.value) {
            let imgTag = selected.parentElement.querySelector('img');
            imgTag.src = `https://flagcdn.com/60x45/${countryCode[code].toLowerCase()}.png`
        }
    }
}

async function exchangeAPI() {
    try {
        const url = `https://v6.exchangerate-api.com/v6/b6074cba7eab22e090ff5f70/latest/${fromCurreny.value}`;
        return await fetch(url).then((response) => response.json());
    } catch (error) {
        throw new Error(`Something is wrong: ${error.message}!!!`);
    }
}

function getExchangeRate() {
    let amountValue = amountInput.value;

    if (amountValue == '' || amountValue == '0') {
        amountInput.value = '1';
        amountValue = 1;
    }

    const defaultTextButton = exchangeButton.textContent;
    exchangeButton.classList.add('loading');
    exchangeButton.textContent = 'Loading...';

    exchangeAPI()
        .then((result) => {
            let exchangeRatePerOne = result.conversion_rates[toCurrency.value];
            let totalExchangeRate = (amountValue * exchangeRatePerOne).toFixed(2);
            exchangeRateResult.value = `${amountValue} (${fromCurreny.value}) = ${totalExchangeRate} (${toCurrency.value})`;
        })
        .catch((error) => {
            exchangeRateResult.innerHTML = `<span>${error.message}</span>`;
        })
        .finally(() => {
            exchangeButton.classList.remove('loading');
            exchangeButton.textContent = defaultTextButton;
        })
}

getExchangeRate();