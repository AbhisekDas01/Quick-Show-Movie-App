import toast from 'react-hot-toast';



//create a script tag and add it to the dom dynamically
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



const razorpayPaymentHandler = async (order, { axios, getToken, onSuccess, onFailure } = {}) => {

    try {

        //append the razorpay url
        const loaded = await loadScript(import.meta.env.VITE_RAZORPAY_URL);

        if (!loaded || !window.Razorpay) {
            toast.error("Failed to load payment Page");
            window.location.href = '/my-bookings'; // cannot use hooks here
            return;
        }


        const options = {
            "key": `${import.meta.env.VITE_RAZORPAY_KEY}`, // Enter the Key ID generated from the Dashboard
            "amount": order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            "currency": order.currency,
            "name": "QuickShow",
            "description": "Test Transaction",
            "image": "",
            "order_id": order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            "handler": async function (response) {

                try {

                    const payload = {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        bookingId: order?.notes?.bookingId
                    }

                    const { data } = await axios.post('/api/booking/verify-payment', payload, {
                        headers: {
                            Authorization: `Bearer ${await getToken()}`
                        }
                    });

                    if (data.success) {
                        toast.success(data.message);
                        onSuccess?.();
                    } else {
                        toast.error(data?.message || 'Verification failed');
                        onFailure?.();
                    }
                } catch (error) {
                    const msg = err.response?.data?.message || err.message || 'Verification failed';
                    toast.error(msg);
                    onFailure?.();
                }

            },
            modal: {
                ondismiss: () => {
                    toast.error('Payment cancelled');
                    onFailure?.();
                }
            },

            "theme": {
                "color": "#F84565"
            }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();



    } catch (error) {
        console.log("Errror in payment", error);
    }
}

export default razorpayPaymentHandler;