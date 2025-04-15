import Order from "../model/orderModel.js";
import Product from "../model/productModel.js";
import Stripe from 'stripe';


// COD Order
export const placeOrderCOD = async (req, res) => {
  try {
    const { userId, items, address } = req.body;

    if (!userId || !address || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Missing or invalid userId/items/address",
      });
    }

    const products = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.product);
        if (!product) throw new Error("Product not found");
        return product.offerPrice * item.quantity;
      })
    );

    let amount = products.reduce((sum, val) => sum + val, 0);
    amount += Math.floor(amount * 0.02); // 2% tax

    const newOrder = await Order.create({
      userId,
      items,
      address,
      amount,
      paymentType: "COD",
      isPaid: false,
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Stripe Order
export const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, address } = req.body;
    const { origin } = req.headers;

    if (!userId || !address || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Missing or invalid userId/items/address",
      });
    }

    const productData = [];
    const products = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.product);
        if (!product) throw new Error("Product not found");
        productData.push({
          name: product.name,
          price: product.offerPrice,
          quantity: item.quantity,
        });
        return product.offerPrice * item.quantity;
      })
    );

    let amount = products.reduce((sum, val) => sum + val, 0);
    amount += Math.floor(amount * 0.02); // tax

    const order = await Order.create({
      userId,
      items,
      address,
      amount,
      paymentType: "Online",
    });

    
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

    const line_items = productData.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round((item.price + item.price * 0.02) * 100), // add tax
      },
      quantity: item.quantity,
    }));

    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/loader?next=my-orders`,
      cancel_url: `${origin}/cart`,
      metadata: {
        orderId: order._id.toString(),
        userId,
      },
    });

    res.status(201).json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


//stripe webhook to verify paymenst action  on stripe
export const stripeWebhooks = async (request,response) => {
  //stripe get way initailaiaze
  const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = request.headers['stripe-signature']
  let event;

  try {
    event= stripeInstance.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (error) {
    response.status(400).send(`webhook error:${error.message}`)
  }

  //handle event
  switch(event.type){
    case "payment_intent.succeeded":{
      const paymentIntent =event.data.object;
      const paymentIntentId =paymentIntent.id;

      //getting session metadata
      const session= await  stripeInstance.checkout.sessions.list({
        payment_intent:paymentIntentId,
      });
      const{orderId,userId}= session.data[0].metadata;
      //mark payment as paid
      await Order.findByIdAndUpdate(orderId,{isPaid:true})
      // clear user cart
      await User.findByIdAndUpdate(userId,{cartItems:{}})
      break;
    }
   case "payment_intent.payment_failed":{
    const paymentIntent =event.data.object;
    const paymentIntentId =paymentIntent.id;

    //getting session metadata
    const session= await  stripeInstance.checkout.sessions.list({
      payment_intent:paymentIntentId,
    });
    const{orderId}= session.data[0].metadata;
    await Order.findByIdAndDelete(orderId)
    break;
   }
      default:
        console.error(`unhandled event type ${event.type}`)
        break;
  }
  response.json({received:true})
}

// Get Orders by User
export const getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const orders = await Order.find({
      $or: [{ paymentType: 'COD' }, { isPaid: true }],
      userId
    }).populate('items.product address').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error fetching user orders:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get All Orders (admin/seller)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: 'COD' }, { isPaid: true }]
    }).populate('items.product address').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error fetching all orders:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
