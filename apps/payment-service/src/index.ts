import { serve } from '@hono/node-server'
import { timeStamp } from 'console'
import { Hono } from 'hono'
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import { shouldBeUser } from './middleware/authMiddleware.js'
import stripe from './utils/stripe.js'
import sessionRoute from './routes/session.route.js'
import { cors } from "hono/cors"


const app = new Hono()
app.use('*', clerkMiddleware())
app.use("*", cors({origin:["http://localhost:3002"]}))

app.get('/health', (c) => {
  return c.json({
    status:"ok",
    uptime: process.uptime(),
    timestamp: Date.now()
  })
})

app.route("/sessions", sessionRoute)

// app.post('/create-stripe-product', async (c) => {
//   const res = await stripe.products.create({
//     id:"123",
//     name:"test-product",
//     default_price_data:{
//       currency: "usd",
//       unit_amount: 10 * 100 
//     },
//   })

//   return c.json(res)

// })

// app.get('/stripe-product-price', async (c) => {
//   const res = await stripe.prices.list({
//     product: "123"
//   })

//   return c.json(res)

// })

const start = () => {
  try{
    serve(
      {
        fetch:app.fetch,
        port:8002
      },
      (info) => {
        console.log("Payment service is running on port 8002")
      }
    )
  }catch(error){
    console.log(error)
    process.exit(1)
  }
}
start()