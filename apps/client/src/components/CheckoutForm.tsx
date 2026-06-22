"use client"

import { ShippingFormInputs } from "@repo/types"
import { PaymentElement, useCheckout } from "@stripe/react-stripe-js/checkout"

import { ConfirmError } from "@stripe/stripe-js/dist/stripe-js"
import { useState } from "react"

const CheckoutForm = ({shippingForm}:{shippingForm:ShippingFormInputs}) => {

    const checkout = useCheckout() as any
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<ConfirmError | null>(null)

    const handleClick = async ()=> {
        setLoading(true)
        const res = await checkout.checkout.confirm({ email: shippingForm.email })
        if(res?.type==="error"){
            setError(res.error)
        }
        setLoading(false)
    }

  return (
    <form action="">
        <PaymentElement options={{layout:"accordion"}}/>
        <button  disabled={loading} onClick={handleClick}>
            {loading ? "loading..." : "Pay"}
        </button>
        {error && <div>{error.message}</div>}
    </form>
  )
}

export default CheckoutForm