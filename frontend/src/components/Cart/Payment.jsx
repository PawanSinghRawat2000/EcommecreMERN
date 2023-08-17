import React, { useEffect, useRef } from "react";
import CheckoutSteps from "../Cart/CheckoutSteps";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../layout/MetaData";
import { Typography } from "@material-ui/core";
import { useAlert } from "react-alert";
import axios from "axios";
import {
    CardNumberElement,
    CardCvcElement,
    CardExpiryElement,
    useStripe,
    useElements,
  } from "@stripe/react-stripe-js";
  import "./payment.css";
  import CreditCardIcon from "@material-ui/icons/CreditCard";
  import EventIcon from "@material-ui/icons/Event";
  import VpnKeyIcon from "@material-ui/icons/VpnKey";
  import { useNavigate } from "react-router-dom";
  import { createOrder , resetOrder } from "../../slices/orderSlice";


const Payment = () => {
    const dispatch=useDispatch()
    const alert=useAlert()
    const stripe=useStripe()
    const elements=useElements()
    const navigate=useNavigate()

    const {cartItems}=useSelector(state=>state.cart)
    const {shippingInfo}=useSelector(state=>state.shippingInfo)
    const {user}=useSelector(state=>state.user)
     const {error}=useSelector(state=>state.newOrder);

    const orderInfo=JSON.parse(sessionStorage.getItem("orderInfo"))

    const payBtn=useRef(null)


    const paymentData={
        amount:Math.round(orderInfo.totalPrice*100),
    }

    const submitHandler=async(e)=>{
        e.preventDefault()
        payBtn.current.disabled=true;

        const order={
            shippingInfo:shippingInfo,
            orderItems:cartItems,
            itemsPrice:orderInfo.subtotal,
            taxPrice:orderInfo.tax,
            shippingPrice:orderInfo.shippingCharges,
            totalPrice:orderInfo.totalPrice,
        }

        try{
            const config={
                header:{
                    "Content-Type":"application/json",
                }
            }
            const {data}= await axios.post("/api/v1/payment/process",
            paymentData,
            config);

            const client_secret=data.client_secret;

            if(!stripe || !elements)return;

            const result=await stripe.confirmCardPayment(client_secret,{
                payment_method:{
                    card:elements.getElement(CardNumberElement),
                    billing_details:{
                        name:user.name,
                        email:user.email,
                        address:{
                           line1:shippingInfo.address,
                           city:shippingInfo.city,
                           state:shippingInfo.state,
                           postal_code:shippingInfo.pinCode,
                           country:shippingInfo.country, 
                        }
                    }
                }
            })
            if(result.error){
                payBtn.current.disabled=false;
                alert.error(result.error.message);
            }else{
                if(result.paymentIntent.status==='succeeded'){
                    order.paymentInfo={
                        id:result.paymentIntent.id,
                        status:result.paymentIntent.status,
                    }
                    dispatch(createOrder(order))
                    navigate('/success');
                }else{
                    alert.error("Payment Failed!");
                }
            }

        }catch(error){
            payBtn.current.disabled=false;
            alert.error(error.response.data.messsage)
        }
    }

    useEffect(()=>{
        if(error){
            alert.error(error);
            dispatch(resetOrder());
        }
        
    },[dispatch,error,alert])

  return (
    <>
    <MetaData title="Payment" />
    <CheckoutSteps activeStep={2} />

    <div className="paymentContainer">
        <form className="paymentForm" onSubmit={(e)=>submitHandler(e)} >
            <Typography>Card Info</Typography>
            <div>
                <CreditCardIcon/>
                <CardNumberElement className="paymentInput"/>
            </div>
            <div>
            <EventIcon />
            <CardExpiryElement className="paymentInput" />
          </div>
          <div>
            <VpnKeyIcon />
            <CardCvcElement className="paymentInput" />
          </div>

          <input
            type="submit"
            value={`Pay - ₹${orderInfo && orderInfo.totalPrice}`}
            ref={payBtn}
            className="paymentFormBtn"
          />
        </form>
    </div>
      
    </>
  )
}

export default Payment
