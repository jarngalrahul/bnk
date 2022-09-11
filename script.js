'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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


const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  //.textContent = 0

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">
      ${i + 1} ${type}</div>
      <div class="movements__value">${mov}€</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const updateUI = function (currentAccount) {

  displayMovements(currentAccount.movements);
  calcDisplayBalance(currentAccount);
  calcDisplaySummary(currentAccount);
}
const calcDisplaySummary = function (account) {
  const incomes =
    account.movements.filter(mov => mov > 0)
      .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out =
    account.movements.filter(mov => mov < 0)
      .reduce((acc, ele) => acc + ele, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const intrest = account.movements.filter(mov => mov > 0)
    .map(deposit => deposit * account.interestRate / 100)
    .reduce((acc, val) => acc + val, 0);
  labelSumInterest.textContent = `${intrest}€`;
}

const calcDisplayBalance = function (acc) {
  const balance = acc.movements.reduce(
    (akumulator, mov) => akumulator + mov, 0);
  //const labelBalance = document.querySelector('.balance_value')
  acc.balance = balance;
  labelBalance.textContent = `${acc.balance}€`
};

const createUsername = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map((mov) => mov.at(0))
      .join('');
  });
};
createUsername(accounts);

//Event Handler
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  //Inside, <form> - pressing enter is equivalent to clicking
  //Prevents <form> from submitting
  e.preventDefault();

  //Passwords and login
  currentAccount = accounts.find(acc => acc.userName === inputLoginUsername.value);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    console.log('login');
  }
  labelWelcome.textContent = `Welcome Back! ${currentAccount.owner.split(' ')[0]}`;
  containerApp.style.opacity = 100;
  //clearing input feilds
  inputLoginPin.value = inputLoginUsername.value = '';
  inputLoginPin.blur();

  //Balance, summaries and data
  updateUI(currentAccount);
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount / 10)) {
    //add movement
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

//TRansfer money
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.userName === inputTransferTo.value);
  inputTransferTo.value = inputTransferAmount.value = '';

  if (amount > 0 && currentAccount.balance >= amount &&
    receiverAcc?.userName !== currentAccount.userName) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    updateUI(currentAccount);
  };
});

//closing account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  const closeAcc = inputCloseUsername.value;
  const closePin = Number(inputClosePin.value);
  if (closeAcc === currentAccount.userName && closePin === currentAccount.pin) {
    const index = accounts.findIndex(acc => acc.userName === currentAccount.userName);
    accounts.splice(index, 1);
    //Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false; //flag
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
})
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
/*
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
//SLICE - Does not mutates the original array.
//-----------------
let arr = ["a", "b", "c", "d", "e"];
const newArr = arr.slice(2, 4); // [c d]
console.log(newArr);
console.log(arr.slice(-2));
console.log(arr.slice(1, -1)); //[b,c,d]
console.log(arr.slice());//Shallow copy

//SPLICE - mutates original array
//-----------------
console.log(arr.splice(1, 2)); //[b,c]
console.log(arr); //[a,d,e] basically deletes the elements starting from 1 to 2

//REVERSE - mutates originl array
//-----------------------
arr = ["a", "b", "c", "d", "e"];
let arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse());
console.log(arr2);

//CONCAT
//---------
const letters = arr.concat(arr2)
console.log(letters);
console.log([...arr, ...arr2]); //same

//JOIN
//----------
const k = letters.join('-');
console.log(k);

//'at' METHOD
//--------------
const arrr = [23, 11, 76];
console.log(arrr.at(0));
console.log(typeof (arrr.at(0)));
//say you need to find last element of an array
console.log(arr[arr.length - 1]); //e
console.log(arr.slice(-1)[0]);    //e
console.log(arr.at(-1));          //e
console.log('rahul'.at(0));       //r (works on strings)

//FOR EACH --> (you cannot break out of a loop) i.e, you cannot use 'break' and 'continue' keywords
//---------------------------
//how 'FOR OF' works
console.log('----FOR OF-------');
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
for (const [i, movt] of movements.entries()) {
  if (movt > 0)
    console.log(`Movement ${i + 1}: You deposited ₹${movt}`);
  else
    console.log(`Movement ${i + 1}: You withdrew ₹${Math.abs(movt)}`);
};

console.log('------FOR EACH-------');
//order matters (element, index, array) -- always
movements.forEach(function (movt, i, array) {
  if (movt > 0)
    console.log(`Movement ${i + 1}: You deposited ₹${movt}`);
  else
    console.log(`Movement ${i + 1}: You withdrew ₹${Math.abs(movt)}`);
});
//basically forEach is an Higher order function which is receiving a
//call back function who is telling the forEach what to do.

//FOR EACH - for maps and sets
//-----------------------------
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound Sterling'],
]);

currencies.forEach(function (valueInIteration, key, wholeMap) {
  console.log(`${key}: ${valueInIteration}`);
});
// sets also work in same way as rest of the data since they dont have keys so js puts its values as the key
const uniqueCurrencies = new Set(['USD', 'EUR', 'EUR', 'USD', 'RNB', 'USD']);
uniqueCurrencies.forEach(function (valueInIteration, _, wholeMap) {
  console.log(`${valueInIteration}: ${valueInIteration}`);
});
//'_' --> this is throwaway variable

//USE of MAPS
//--------------
const EurToUSD = 1.1;
movements = [200, 450, -400, 3000, -650,
  -130, 70, 1300];

const movementsUSD = movements.map(function (mov) {
  return mov * EurToUSD;
});
console.log(movementsUSD);
//using arrow function

const movementsDescription = movements.map(
  (mov, i) =>
    `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'Withdrew'} ${Math.abs(mov)}`
);
console.log(...movementsDescription);

//using for of
const movementsUSDfor = [];
for (const mov of movements)
  movementsUSDfor.push(mov * EurToUSD);
console.log(movementsUSDfor);

//FILTER method - It gets acess to (element,index,array )
//-------------------------------------------------------

const deposit = movements.filter(function (mov) {
  return mov > 0;
});
console.log(deposit);
console.log(movements);

const withdrawals = movements.filter(function (mov) {
  return mov < 0;
});
console.log(withdrawals);

//REDUCE method -
//------------------------------
const movements = [200, 450, -400, 3000, -650,
  -130, 70, 1300];

console.log(movements);
const balance = movements.reduce(function (accumulator, curVal, index, array) {
  console.log(`Iteration ${index}: ${accumulator}`);
  return accumulator + curVal;
}, 0);
// value of accumulator is '0' initially;
console.log(balance);

//smallest value using reduce
const smallestMov = movements.reduce(
  (acc, ele) => acc > ele ? ele : acc, movements[0]);
console.log(smallestMov);
//maximum value using reduce
const maximumVal = movements.reduce((acc, mov) => acc > mov ? acc : mov, 0);
console.log(maximumVal);

//challenge
//----------

const dog = [[5, 2, 4, 1, 15, 8, 3],
[16, 6, 10, 5, 6, 1, 4]];  //Test data

const res = dog.forEach(function (dogAge) {
  const dodAgeToHumanYr = dogAge.map(function (objEle, index) {
    if (objEle <= 2) return 2 * objEle;
    else return objEle * 4 + 16;
  });
  console.log(dodAgeToHumanYr);
  const filteredDog = dodAgeToHumanYr.filter((age) => age >= 18);
  console.log(filteredDog);
  let count;
  const average = dodAgeToHumanYr.reduce((acc, val, index) => {
    acc += val;
    count = index;
    return acc;
  }, 0);
  console.log(average / count);
});

//FIND METHOD
//================

const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account);  //we get an object via comparing properties


//SOME AND INCLUDES METHOD
//==============================
const movements = [200, 450, -400, 3000, -650,
  -130, 70, 1300];
console.log(movements);
//Equality
console.log(movements.includes(-130));

//CONDITION
const anyDeposits = movements.some(mov => mov > 5000);
console.log(anyDeposits);


//EvERY METHOD - if every method passes conditon it returns true
//======================
console.log(`Every method: ${movements.every(mov => mov > 0)}`); //false


//Seperate callback
//=====================
const dep = mov => mov > 0;
console.log(movements.filter(dep));
console.log(movements.find(dep));
console.log(movements.every(dep));

//Flat method - flattens the array
//=====================================
const arr = [[1, 2, 3], [4, 5], 6, 7, 8, [9, 10]];
console.log(arr.flat()); //flat map enters only one level of array

const arr1 = [[1, 2, 3], [[4, 5]], 6, 7, 8, [9, 10]];
console.log(arr1.flat(2)); //this will go down two level deep

// const movts = accounts.map(mov => mov.movements);
// console.log(movts);
// const combinedMovts = movts.flat();
// console.log(combinedMovts);
// const sumOfCombinedMovts = combinedMovts.reduce((acc, val) => acc + val, 0);
// console.log(sumOfCombinedMovts);
//-----------------------------------
//using chaining
const movts = accounts.map(mov => mov.movements).flat().reduce((acc, mov) => acc + mov, 0);
console.log(movts);

//flatmap - this goes only one level deep thus if we need more depth we need to use flat method with args
//========================================================================================================
const movts1 = accounts.flatMap(acc => acc.movements).reduce((acc, mov) => acc + mov, 0);
console.log(movts1);


//SORTING - '.sort()' mutates the original array
//===============================================
const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
console.log(owners.sort());
console.log(owners);

const movements = [200, 450, -400, 3000, -650,
  -130, 70, 1300];
//console.log(movements.sort()); //E R R O R - sorting is done on strings not on numbers they will be considered as strings and then sorted accordingley

movements.sort((a, b) => {
  if (a >= b) return 1;   //this keeps order that is we don't need to change the order if this condition satisfies
  if (b > a) return -1;   //compiler will perform swaps if it finds this condition
});
//Ascending order
console.log(movements);

// movements.sort((a, b) => {
//   if (a > b) return -1;        //We dont need -1 any negative value works
//   else return 1;
// });

// -----------OR------------
movements.sort((a, b) => b - a); //b-a>0 when b>a
//Descending order
console.log(movements);

//============================================
//More ways of creating and filling an array
//============================================
//1.) Empty array
const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
console.log(arr);
console.log(new Array(1, 2, 3, 4, 5));

const x = new Array(7);
console.log(x);               //This and below this give us 7 empty slots.
console.log(x.map(() => 5));  //This does not work

// 2.) 'fill' method
x.fill(8);
console.log(x);
arr.fill(139, 0, 6); //fill 139 from position 3 to 6
console.log(arr);

//3.) Array.from( iterable<any> , ArrayLike any|<mapfn> ) - It is usually used to convert array like structures to arrays
const y = Array.from({ length: 7 }, () => 1);
console.log(y);
const z = Array.from({ length: 7 }, (_, i) => i + 1);
console.log(z);

labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', '')));

  const movementsUI2 = [...document.querySelectorAll('.movements__value')]
  console.log(movementsUI2); //this also gives the same result but we have to edit the object array individually
  console.log(movementsUI2.map((acc) => Number(acc.textContent.replace('€', '')))); //like this
  console.log(movementsUI);
});


//use of reduce method
console.log(accounts.flatMap(acc => acc.movements));
const depositsGreater1000 = accounts.flatMap(acc => acc.movements)
  .reduce((sum, val) => sum + val, 0);
console.log(depositsGreater1000);

//count number of instances where val >1000
const numDeposit1000 = accounts.flatMap(acc => acc.movements)
  .reduce((count, val) => val >= 1000 ? ++count : count, 0);
console.log(numDeposit1000);

//count withdrawls and deposits
const { withdrawl, deposits } = accounts.flatMap(acc => acc.movements).reduce((sums, val) => {
  // val > 0 ? sums.deposits += val : sums.withdrawl += val;
  //or
  sums[val > 0 ? 'deposits' : 'withdrawl'] += val;
  // console.log(sums['deposits']);
  return sums;
}, { withdrawl: 0, deposits: 0 });
console.log(withdrawl, deposits);

//Title case
//=============
//eg:- this is a nice title case --> This Is a Nice Title Case

const convertTitleCase = function (title) {
  const exceptions = ['a', 'an', 'the', 'but', 'or', 'on', 'in', 'with', 'are', 'and'];

  const titleCase = title.toLowerCase()
    .split(' ')
    .map(word => exceptions.includes(word) ? word : word[0].toUpperCase() + word.slice(1)).join(' ');
  return titleCase;
};
console.log(convertTitleCase('hello this is the first string that we are selecting'));
console.log(convertTitleCase('this is a NOT too Long title case'));
console.log(convertTitleCase('here is another title case with EXAMPLE'));

//challenge
//==============

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];
// console.log(dogs[0].weight);
//1.
dogs.forEach((dog) => { dog.recFoodPortion = Math.trunc(dog.weight ** 0.75 * 28); });
const eatingComp = function (dog) {
  if (dog.curFood > 1.1 * dog.recFoodPortion)
    return 1;
  else if (dog.curFood < 0.9 * dog.recFoodPortion)
    return -1;
  else
    return 0;
}

//2.
dogs.forEach(dog => {
  const temp = eatingComp(dog) === 1 ? 'too much' : eatingComp(dog) === -1 ? 'too less' : 'okay';
  if (dog.owners.includes('Sarah')) {
    console.log(`Sarah's dog eats ${temp}`);
  }
});
//3
const ownersEatTooMuch = [], ownersEatTooLess = [];
dogs.forEach(dog => {
  if (eatingComp(dog) === 1) {
    ownersEatTooMuch.push(dog.owners);
  }
  if (eatingComp(dog) === -1) {
    ownersEatTooLess.push(dog.owners);
  }
});
console.log(`${ownersEatTooLess.flat().join(' and ')}'s dogs eat too less`);
console.log(`${ownersEatTooMuch.flat().join(' and ')}'s dogs eat too much`);
console.log(dogs.some(dog => dog.curFood === dog.recFoodPortion));
console.log(dogs.some(dog => eatingComp(dog) === 0)); //okay amount of food
const okayAmtFood = dogs.map(dog => eatingComp(dog) === 0);

const shallowDogSort = dogs.slice().sort((a, b) => a.recFoodPortion - b.recFoodPortion);
console.log(shallowDogSort);
*/










