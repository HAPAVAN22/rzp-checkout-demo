import logo from './logo.svg';
import './App.css';


function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = src
    script.onload = () => {
      resolve(true)
    }
    script.onerror = () => {
      resolve(false)
    }
    document.body.appendChild(script)
  })
}

function App() {

  const price = 100

async function displayRazorpay () {

      const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')

      if (!res){
        alert('Razropay failed to load!!')
        return 
      }

      const orderPayload = {
        amount : price
      }

      const data = await fetch('http://localhost:4000/payment/orders', {
        method: 'POST',
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      }).then((t) => 
        t.json()
      ) 

      console.log(data)

    const options = {
      "key": "rzp_test_H1yXRjukIxwx5b", // Enter the Key ID generated from the Dashboard
      "amount": data.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      "currency": "INR",
      "name": "ABC Corp",
      "description": "Payment Demo",
      "order_id": data.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      "callback_url":"http://localhost:3000",
      "notes": {
          "address": "Razorpay Corporate Office"
      },
      "theme": {
          "color": "#3322cc"
      }
  };
  const paymentObject = new window.Razorpay(options); 
  paymentObject.open();
  }

  return (
    <div className="App">
      <img src="dairy_milk.jpg" alt="Example" className="img-fluid" />
       <p className="mt-4 text-center">Dairy Milk</p>
       <p className="mt-4 text-center">₹ {price/100}</p> 
        <button
        onClick={displayRazorpay}
        >
          Pay now 
        </button>
    </div>
  );
}

export default App;
