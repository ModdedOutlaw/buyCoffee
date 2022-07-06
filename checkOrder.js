const cust_name = sessionStorage.getItem('name');
const transferNum = sessionStorage.getItem('transferId');
console.log('CUSTOMER-NAME: ' +cust_name);
document.getElementById('customer-name').innerHTML += '<b>'+cust_name+'</b><br><b>WAX transaction Number: '+transferNum+'</b>';
