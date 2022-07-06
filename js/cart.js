import { getLocalStorage, setLocalStorage } from './script.js';

import { displayCartIcon } from './products.js';

const currentCartItemsContainer = document.querySelector('.item');
let totalPrice = document.querySelector('.totalPrice');
let currentPrice = [];

updateWaxPrice();



function selectElementsForCart(card) {
  const image = card.querySelector('img').src;
  const id = card.id;
  const title = card.querySelector('h3').innerText;

  return [image, id, title];
}

function displayCartItems(currentCart) {
  
  updateWaxPrice();

  currentCartItemsContainer.innerHTML = '';

  currentPrice = [];

  currentCart.forEach((item) => {

    const currentQtyPrice = Number(item.price) * item.qty;
    currentPrice.push(currentQtyPrice);
   
    currentCartItemsContainer.innerHTML += `
    <div class="cartItem" id=${item.id}>
        <div class="cartInfo">
          <h3 class="product__1--title">${item.title}</h3>
          <div class="product__1--image">
            <img
              class="image--1"
              src="${item.image}"
              alt="product 1"
              class="product-image"
            />
        </div>
        <h5 class="product__1--price">${item.price} $</h5>
      </div>
      <div class="buttons-action">
        <form class="form">
          <label for="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            class="quantity"
            min="1"
            max="50"
            value="${item.qty}"
            autofocus
          />
        </form>
        <button class="btn add-cart deleteBtn">Delete</button>
      </div>
    </div>
    `;
  });



  totalPrice.innerText = currentPrice
    .reduce((curr, acc) => curr + acc, 0)
    .toFixed(2);

     console.log(currentPrice.reduce((curr, acc) => curr + acc, 0).toFixed(2));


    console.log(sessionStorage.getItem('wax_price'));

    let total_wax_session = currentPrice.reduce((curr, acc) => curr + acc, 0).toFixed(2) / sessionStorage.getItem('wax_price');

    console.log("TOTAL PRICE SESSION $$$$ = " + totalPrice.innerText);

    document.getElementById('total_wax_order').textContent = '$'+totalPrice.innerText+ ' = '+total_wax_session.toFixed(8).toString() +' wax';

    console.log("TOTAL PRICE SESSION WAX = " + total_wax_session);





    sessionStorage.setItem('final_price_wax',total_wax_session.toFixed(8).toString());

    sessionStorage.setItem('final_price_usd',totalPrice.innerText);

    console.log(currentCart);

    currentCart.forEach((item) =>{
       sessionStorage.setItem(item.id,item.qty.toString());
    } );

  
    
    
    console.log("TOTAL 12ozEspresso = " + sessionStorage
    .getItem('1'));
console.log("TOTAL 12ozJitteryBean = " +
    sessionStorage.getItem('2'));
console.log("TOTAL 12ozJitteryGround = " +
    sessionStorage.getItem('3'));

console.log("TOTAL 12ozOGBean = " + sessionStorage
    .getItem('4'));
console.log("TOTAL 12ozOGEspresso = " +
    sessionStorage.getItem('5'));
console.log("TOTAL 12ozOGGround = " + sessionStorage
    .getItem('6'));

  loadCartListeners();
}


async function fetchUpdateWaxPrice() {

  const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=wax&vs_currencies=usd');

  const wax_price = await response.json();

  return wax_price;

}


async function updateWaxPrice() {


  await fetchUpdateWaxPrice().then(price => {



      //localStorage.setItem('price_wax',price.wax.usd);
      sessionStorage.setItem('wax_price',price.wax.usd);

  });

}






function loadCartListeners() {
  const deleteBtn = document.querySelectorAll('.deleteBtn');
  const qtyInput = document.querySelectorAll('.quantity');
  const form = document.querySelectorAll('.form');

  deleteBtn.forEach((btn) => btn.addEventListener('click', handleDelete));
  form.forEach((el) =>
    el.addEventListener('submit', (e) => e.preventDefault())
  );
  qtyInput.forEach((btn) => btn.addEventListener('change', handleChange));
}

function handleDelete(e) {
  const id = e.target.closest('.cartItem').id;
  const qty = e.target.previousElementSibling.querySelector('.quantity').value;

  const currentCart = getLocalStorage('currentCart');
  const currentQty = getLocalStorage('qtyCart');

  const filteredCart = currentCart.filter((product) => product.id !== id);
  const filteredQty = currentQty - qty;

  setLocalStorage('currentCart', filteredCart);
  setLocalStorage('qtyCart', filteredQty);

  sessionStorage.setItem(id, '0');


}

function handleChange(e) {
  const newQty = e.target.closest('.quantity').value;
  const id = e.target.closest('.cartItem').id;

  const currentCart = getLocalStorage('currentCart');

  const filteredCart = currentCart.map((product) =>
    product.id === id ? { ...product, qty: newQty } : { ...product }
  );

  const filteredQty = filteredCart.reduce(
    (acc, curr) => acc + Number(curr.qty),
    0
  );



  setLocalStorage('currentCart', filteredCart);
  setLocalStorage('qtyCart', filteredQty);
}





export { displayCartItems, selectElementsForCart };
