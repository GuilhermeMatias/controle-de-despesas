const transactionsUl = window.document.querySelector('#transactions');
const balance = window.document.querySelector('#balance');
const moneyPlus = window.document.getElementById('money-plus');
const moneyMinus = window.document.getElementById('money-minus')
const newTransaction = window.document.querySelector('input#text');
const newValue = window.document.querySelector('input#amount')
const formDisplay = window.document.querySelector('#form');
const inputTransactionName = window.document.querySelector('#text');
const inputTransactionValue = window.document.querySelector('#amount');

const localStorageTransaction = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransaction : [];

const removeTransaction = ID =>
{
    transactions = transactions.filter(transaction => transaction.id !== ID);
    updateLocalStorage();
    initiate();
}

const addTransactionIntoDOM = transaction =>
{
    const operator =  transaction.amount > 0? "+":"-";
    const CSSClass =  transaction.amount > 0? "plus":"minus";
    const amountWithoutOperator = Math.abs(transaction.amount)
    const li = window.document.createElement("li");

    li.classList.add(CSSClass);
    li.innerHTML = `${transaction.name} <span>${operator}R$ ${amountWithoutOperator}</span>
                   <button class="delete-btn" onClick="removeTransaction(${transaction.id})">
                   x
                   </button>`
    transactionsUl.append(li);
}

const updateBalanceValues = () => {
    const transactionsAmounts = transactions
        .map(transaction => transaction.amount);
    const acumullateAmount = transactionsAmounts
        .reduce((acumullator, number) => acumullator + number, 0)
        .toFixed(2);
    const transactionPlus = transactionsAmounts
        .filter(item => item > 0)
        .reduce((acumullator, number) => acumullator + number, 0)
        .toFixed(2);
    const transactionMinus = Math.abs(transactionsAmounts
        .filter(item => item < 0)
        .reduce((acumullator, number) => acumullator + number, 0))
        .toFixed(2);

        moneyMinus.textContent = `R$ ${transactionMinus}`;
        moneyPlus.textContent = `R$${transactionPlus}`;
        balance.textContent = `R$${acumullateAmount}`;
}

const initiate = () => {
    transactionsUl.innerHTML = '';
    transactions.forEach(addTransactionIntoDOM);
    updateBalanceValues();
}

initiate();

const updateLocalStorage = () =>
{
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

const generateID = () => Math.round(Math.random()*1000);

const addToTransactionArray = (transactionName, transactionValue) =>
{
    const transaction = {
        id: generateID(), 
        name: transactionName, 
        amount: Number(transactionValue)
    };
    transactions.push(transaction);
}

const clearInput = () =>
{
    //Limpar as caixas de entrada
    inputTransactionName.value = '';
    inputTransactionValue.value = '';
}

const handleFormSubmit = event =>
{
    event.preventDefault();
    
    const transactionName = inputTransactionName.value.trim();
    const transactionValue = inputTransactionValue.value.trim();
    const isSomeInputEmpty = transactionName === '' || transactionValue === ''
    if(isSomeInputEmpty)
    {
        window.alert("Preencha corretamente os campos da transação!");
        return;
    }

    addToTransactionArray(transactionName, transactionValue); 
    initiate();
    updateLocalStorage();
    clearInput();
}

formDisplay.addEventListener('submit', handleFormSubmit);
