'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-08-20T23:36:17.929Z',
    '2022-08-22T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const formatMovementsDate = function(date){
  const now = new Date();
  const calcDifferenceDays = function(date1,date2){
    return Math.abs(date1-date2)/(1000*24*3600);
  };

  const daysPassed = Math.round(calcDifferenceDays(new Date(), date));
  console.log(daysPassed);
  
  if(daysPassed === 0) 
      return 'Today';
  if(daysPassed === 1) 
      return 'Yesterday';
  if(daysPassed <= 7) 
      return `${daysPassed} days ago`;
  else
  {
  const month = `${date.getMonth()+1}`.padStart(2,0);
  const year = `${date.getFullYear()}`.padStart(2,0);
  const day = date.getDate();
  return `${day}/${month}/${year}`;}
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? acc.movements.slice()
  .sort((a, b) => a - b) : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const now = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementsDate(now);
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">
        ${i + 1} ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${new Intl.NumberFormat(acc.locale,{style:'currency',
      currency:acc.currency}).format(mov)}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out.toFixed(2))}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

const startLogOutTimer = function(){
  
  //Call the timer every second
  const tick = function(){
      const min = String(Math.trunc(time/60)).padStart(2,0);
      const sec = time%60;
      labelTimer.textContent = `${min}:${sec}`;
      
      if(time===0){
        clearInterval(timer);
        labelWelcome.textContent = 'Log in to get started';
        containerApp.style.opacity=0;
      }
      time--;
  };
    
    //set time to 5 minutes
  let time = 100;
  tick();
  const timer = setInterval(tick,1000);
  return timer;
};
///////////////////////////////////////
// Event handlers
let currentAccount,timer;

// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity=100;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]
      }`;
    containerApp.style.opacity = 100;
    
    // current date
    const now = new Date();
    const options ={
      hour:'numeric',
      minute:'numeric',
      day:'numeric',
      month:'numeric',
      year:'numeric',
      weekday:'long',
    };
    const locale = 'en-GB';
    console.log(locale);
    labelDate.textContent = new Intl.DateTimeFormat(
      locale,options).format(now);

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    if(timer) clearInterval(timer);
    timer = startLogOutTimer();
    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    //Reset the timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    setTimeout(function(){
      currentAccount.movements.push(amount);

      //add date
      currentAccount.movementsDates.push(new Date().toISOString());
      // Update UI
      updateUI(currentAccount);
      //update time
      clearInterval(timer);
      timer = startLogOutTimer();
    },2500);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/*
// ---> In java all numbers are floating point numbers
console.log(23 === 23.0);  //true
console.log(0.1 + 0.2);    //0.300000000000000004

//conversion to number - both below are ok
console.log(Number('23'));
console.log(+'23');

//Parsing( .parseInt(string , radix/base) ) --> string must start with a number
//this is a global function thus we can directly call it without using Number
//but it is encouraged to do so.
// Number ===> namespace
console.log(Number.parseInt('30jhoisj', 10));   //30
console.log(Number.parseInt('e30'));        //NaN
console.log(Number.parseFloat('2.5rem'));   //2.5
console.log(Number.parseInt('2.5', 10));     //2
console.log(parseFloat('3.878dfh'));        //3.878

console.log(Number.isNaN(20));     //false
console.log(Number.isNaN('20'));   //false
console.log(Number.isNaN(+'20X')); //true
console.log(Number.isNaN(20 / 0));  //false - infinity is not considered a number

console.log(Number.isInteger(20));  //true
console.log(Number.isFinite(20/0)); //false
console.log(Number.isInteger(23.77)); //false

//Sqrt
console.log(Math.sqrt(25));
console.log(25 **(1/2));  //also sqrt
console.log(125**(1/3));  //cube root

//Max and min--> does type coersion but not parsing
console.log(Math.max(1,2,3,4,5)); //5
console.log(Math.max(1,2,'23',22,21)); //23
console.log(Math.max(1,2,3,'23px',23)); //NaN
console.log(Math.min(1,2,3,4,5)); //1

//other functions 
console.log(Math.PI); //3.141592653589793
console.log(Math.random());//random number b/w 0-1

//Rounding integers --> 'Tofixed' returns a string
console.log((2.7).toFixed(0)); //3 string
console.log((2.3).toFixed(0)); //2  "
console.log((2.3).toFixed(5)); //2.30000  "
console.log(+(2.3496).toFixed(2)); //2.35 decimal

//Here java script does 'Boxing' - that is converting the
//number to a number object and then applying methods
//then converting back to strings

//Numeric Seperators --> We can place '_' anywhere in a number as a seperator but not after/before points
//NOTE: DOES NOT WORK IN PARSING
//================================
const diameter = 287_788_000_000;
console.log(diameter);

//BIG INT
//=================
console.log(Number.MAX_SAFE_INTEGER);
console.log(2 ** 53 -1);  //same as above
        //this means that out of 64 bits used to store the integer
        //only 53 are used for that rest are used for storing points
        //negative numbers etc.
console.log(982489723987927489734729478932477n);
console.log(BigInt(78562378));

const num = 100;
const numHuge = 101n;
// console.log(num+ numHuge);  //error
console.log(BigInt(num)+numHuge); //200n
console.log(typeof(numHuge)); //bigint
//But binary operators work
console.log(num>numHuge); //false
console.log(num<numHuge); //true
console.log(20n===20);  //false
console.log(20n==20); //true
console.log(20n=='20');//true
//Bigint with strings
console.log(numHuge+' is really BIG!');//whole thing becomes string
//Divisions with bigint
console.log(11n/3n);  //3n truncates the data after point

//////////////////
//DATES AND TIME
///////////////////
//Create a date
const now = new Date(0);
console.log(now); //Thu Jan 01 1970 05:30:00 GMT+0530 -->We can add milliseconds into this to move next
console.log(new Date(30*375*24*60*60*1000));//Fri Oct 20 2000

console.log(new Date('August 23 2022'));
console.log(new Date(2022 ,0,12)); //0=january --> Jan 12 2022

console.log(now.getFullYear());
console.log(now.getMonth());
console.log(now.getDay());
console.log(now.getTime());
console.log(now.getHours());
console.log(now.getMinutes());
console.log(now.getSeconds());
console.log(now.getMilliseconds());
//similarly
now.setFullYear(1999);
now.setMonth(12); //it will move to next year since months are from (0-11)
console.log(now);

const now = new Date(2037, 10, 20, 15, 23);
const future = new Date(2037, 10, 19, 15, 23);
console.log(+future); //number

const calcDifferenceDays = function(date1,date2){
  return Math.abs(date1-date2)/(1000*24*3600);
};
console.log(calcDifferenceDays(now,future));
/////////////////////////////////
const num = 3884764.23;

const options={
  style:"unit",
  unit:'celsius',
  currency:'EUR',
}
console.log('US:      ',
new Intl.NumberFormat('en-US',options).format(num));

console.log('Germany: ',
new Intl.NumberFormat('en-DE',options).format(num));

console.log(navigator.language,
  new Intl.NumberFormat(navigator.language, options).format(num));

//SetTimeout function - Asynchronous JS
//======================================
const ingredients = ['olives','Spinach'];
const pizzaTimer = setTimeout((ing1,ing2)=>console.log
(`Here is your pizza with ${ing1} and ${ing2}🍕🍕`)
,3000,...ingredients); //3sec

console.log('Waiting.....');
//We can cancel the timeout before the time is complete

if(ingredients.includes('olives')) 
  clearTimeout(pizzaTimer); //It will print waiting if olives are in the ingredients

//SetInterval - function executed after every t seconds
//======================================================
setInterval(function(){
  const now = new Date();
  console.log(now);
},1000);
*/

















