const CURRENCIES = [
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'THBs', name: 'Thai Baht' },
    {code:  'CNY', name: 'Chinese Yuan'},
    { code: 'JPY', name: 'Japanese Yen' },
]

function populateSelect(selectE1, items, opts) {
    const selected = opts?.selected ?? null;
    const sortBy = opts?.sortBy ?? "code";
    const labelFn = opts?.label ?? ((i) => `${i.code} - ${i.name}`);

    const list = sortBy
        ? [...items].sort((a, b) =>
            String(a[sortBy]).localeCompare(String(b[sortBy]))
        )
        : items;

    const frag = document.createDocumentFragment();
    for (const item of list) {
        const opt = new Option(
            labelFn(item),
            item.code,
            false,
            item.code === selected
        )
        frag.appendChild(opt)
    }
    selectE1.innerHTML = ""
    selectE1.appendChild(frag)
}

const currencyE1_one = document.getElementById("currency-one");
const currencyE1_two = document.getElementById("currency-two");

populateSelect(currencyE1_one, CURRENCIES, { selected: 'USD' });
populateSelect(currencyE1_two, CURRENCIES, { selected: 'EUR' });

function calculate() {
    const currencyOne = currencyE1_one.value;
    const currencyTwo = currencyE1_two.value;

    fetch(`https://api.exchangerate-api.com/v4/latest/${currencyOne}`)
        .then((res) => res.json())
        .then((data) => {
            const rate = data.rates[currencyTwo];
            
            document.getElementById("rate").innerText = 
                `1 ${currencyOne} = ${rate} ${currencyTwo}`;
            
            document.getElementById("amount-two").value = (
                document.getElementById("amount-one").value * rate
            ).toFixed(2);
        });
}


document.getElementById("amount-one").addEventListener("input", calculate);
document.getElementById("currency-one").addEventListener("change", calculate);
currencyE1_one.addEventListener("change", calculate);
currencyE1_two.addEventListener("change", calculate);

document.getElementById("swap").addEventListener("click", () => {
    const temp = currencyE1_one.value;
    currencyE1_one.value = currencyE1_two.value;
    currencyE1_two.value = temp;
    calculate();
})

calculate()