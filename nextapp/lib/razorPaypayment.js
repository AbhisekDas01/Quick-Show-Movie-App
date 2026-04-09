import toast from 'react-hot-toast';

function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
}

const razorpayPaymentHandler = async (order, { axios, getToken, onSuccess, onFailure } = {}) => {
    try {
        const loaded = await loadScript(process.env.NEXT_PUBLIC_RAZORPAY_URL);

        if (!loaded || !window.Razorpay) {
            toast.error('Failed to load payment Page');
            window.location.href = '/my-bookings';
            return;
        }

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
            amount: order.amount,
            currency: order.currency,
            name: 'QuickShow',
            description: 'Test Transaction',
            image: '',
            order_id: order.id,
            handler: async function (response) {
                try {
                    const payload = {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        bookingId: order?.notes?.bookingId
                    };

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
                } catch (err) {
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
            theme: {
                color: '#F84565'
            }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    } catch (error) {
        console.error('Error in payment', error);
    }
};

export default razorpayPaymentHandler;
