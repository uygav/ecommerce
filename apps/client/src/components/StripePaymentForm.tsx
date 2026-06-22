"use client"

import { useAuth } from '@clerk/nextjs';
import { CheckoutElementsProvider as CheckoutProvider } from '@stripe/react-stripe-js/checkout';
import { CartItemsType, ShippingFormInputs } from '@repo/types';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import CheckoutForm from './CheckoutForm';
import useCartStore from '@/stores/cartStore';

export const stripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const fetchClientSecret = async (cart:CartItemsType ,token:string)=> {
    return fetch(
        `${process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL}/sessions/create-checkout-session`,
        {method:"POST", 
        body:JSON.stringify({
            cart,
        }),
        headers:{
        "Content-Type":"application/json",
        Authorization:`Bearer ${token}`
        }}
    ).then((response)=> response.json())
    .then((json)=> {
        console.log("payment service response:", json)
        return json.checkoutSessionClientSecret
    })

}

const StripePaymentForm = ({shippingform}:{shippingform:ShippingFormInputs}) => {

    const {cart} = useCartStore()
    const [clientSecret, setClientSecret] = useState<string | null>(null)
    const {getToken} = useAuth()

    useEffect(()=> {
        getToken().then(async (token: string | null)=> {
            if(!token) return
            const secret = await fetchClientSecret(cart, token)
            setClientSecret(secret)
        })
    }, [])

    if(!clientSecret){
        return <div>Loading ...</div>
    }
  return (
    <CheckoutProvider stripe={stripe} options={{clientSecret}}>
        <CheckoutForm shippingForm={shippingform}/>
    </CheckoutProvider>
  )
}

export default StripePaymentForm