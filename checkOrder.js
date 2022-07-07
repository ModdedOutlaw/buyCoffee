const cust_name = sessionStorage.getItem('name');
const transferNum = sessionStorage.getItem('transferId');
console.log('CUSTOMER-NAME: ' + cust_name);
document.getElementById('customer-name').innerHTML += '<b>' + cust_name + '</b><br><b>WAX transaction Number: ' + transferNum + '</b><br><b>Amount of WAX sent: ' +sessionStorage.getItem('final_price_wax');

console.log("TOTAL 12ozEspresso = " + sessionStorage.getItem('1'));
console.log("TOTAL 12ozJitteryBean = " + sessionStorage.getItem('2'));
console.log("TOTAL 12ozJitteryGround = " +sessionStorage.getItem('3'));

console.log("TOTAL 12ozOGBean = " + sessionStorage.getItem('4'));
console.log("TOTAL 12ozOGEspresso = " +sessionStorage.getItem('5'));
console.log("TOTAL 12ozOGGround = " + sessionStorage.getItem('6'));
console.log("AMOUNT OF WAX SENT = " + sessionStorage.getItem('final_price_wax'));