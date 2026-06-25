import fp from "fastify-plugin"
import { FastifyInstance } from "fastify";
import { shouldBeAdmin, shouldBeUser } from "../middleware/authMiddleware";
import { Order } from "@repo/order-db"
import { startOfMonth, subMonths } from "date-fns";
import { OrderChartType } from "@repo/types";

export const orderRoute = fp(async (fastify: FastifyInstance) => {
    fastify.get(
        "/user-orders",
        { preHandler: shouldBeUser },
        async (request, reply) => {
            const orders = await Order.find({ userId: request.userId })
            return reply.send(orders)
        }
    )

    fastify.get("/orders",{preHandler: shouldBeAdmin}, async (request, reply) => {
        const {limit} = request.query as {limit:string}
        const orders = await Order.find().limit(parseInt(limit) || 10).sort({createdAt: -1})
        return reply.send(orders)
    })

    fastify.post("/orders", { preHandler: shouldBeAdmin }, async (request, reply) => {
        const { userId, email, amount, status, product } = request.body as {
            userId: string
            email: string
            amount: number
            status: "success" | "failed"
            product: { name: string; quantity: number; price: number }[]
        }
        const order = await Order.create({ userId, email, amount, status, product })
        return reply.status(201).send(order)
    })

    fastify.get(
  "/order-chart",
  { preHandler: shouldBeAdmin },
  async (request, reply) => {
    const now = new Date();
    const sixMonthsAgo = startOfMonth(subMonths(now, 5));

    const raw = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo, $lte: now },
        },
      },
      {
        $group: {
            _id: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
                },
                total: { $sum: 1 },
                successful: {
                $sum: {
                $cond: [{ $eq: ["$status", "success"] }, 1, 0],
                },
                },
            },
        },
        {
            $project: {
            _id: 0,
            year: "$_id.year",
            month: "$_id.month",
            total: 1,
            successful: 1,
        },
        },
        {
        $sort: { year: 1, month: 1 },
        },
    ]);
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const results: OrderChartType[] = [];

    for (let i = 5; i >= 0; i--) {
    const d = subMonths(now, i);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;

    const match = raw.find(
    (item) => item.year === year && item.month === month
    );

    results.push({
    month: monthNames[month - 1] as string,
    total: match ? match.total : 0,
    successful: match ? match.successful : 0,
    });
    }

    return reply.send(results);

    });
})