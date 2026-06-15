import {z} from "zod"

export type ProductType = {
    id:string | number
    name:string 
    shortDescription:string
    description:string
    price:number
    sizes:[string,...string[]]
    colors:[string,...string[]]
    images:Record<string,string>
}

export type ProductsType = ProductType[]

export type CartItemType = ProductType & {
    quantity:number;
    selectedSize:string;
    selectedColor:string;
}

export type CartItemsType = CartItemType[]

export const shippingFormSchema = z.object({
    name:z.string().min(1, "name is required"),
    email:z.string()
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "invalid email format")
    .min(1, "email is required"),
    phone:z.string()
    .max(10, "phone number must be between 7 and 10 digits!")
    .min(7, "phone number must be between 7 and 10 digits!")
    .regex(/^\d+$/, "phone number must contain only numbers!"),
    address:z.string().min(1, "address is required"),
    city: z.string().min(1, "city is required")
})

export type ShippingFormInputs = z.infer<typeof shippingFormSchema>

export const paymentFormSchema = z.object({
    cardHolder:z.string().min(1, "card holder is required"),
    cardNumber:z
    .string()
    .min(16, "card number is required")
    .max(16,"card number is required"),
    expirationDate:z
    .string()
    .regex(
        /^(0[1-9]|1[0-2])\/\d{2}$/,
        "expiration date must be in MM/YY format!"
    ),
    cvv:z
    .string()
    .min(3, "CVV is required!")
    .max(3, "CVV is required")
})

export type PaymentFormInputs = z.infer<typeof paymentFormSchema>

export type CartStoreStateType = {
    cart:CartItemsType
    hasHydrated:boolean
}

export type CartStoreActionsType = {
    addToCart: (product:CartItemType) => void
    removeFromCart: (product:CartItemType) => void
    clearCart: ()=> void
}