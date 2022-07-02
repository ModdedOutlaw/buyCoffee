const cust_name = sessionStorage.getItem('name');
console.log('CUSTOMER-NAME: ' +cust_name);
document.getElementById('customer-name').innerHTML += '<b>'+cust_name+'</b>';