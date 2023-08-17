import React, { useEffect } from "react";
import "./orderDetails.css";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../layout/MetaData";
import { Link, useParams } from "react-router-dom";
import { Typography } from "@material-ui/core";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";
import { getOrderDetails } from "../../slices/orderSlice";

const OrderDetails = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const alert = useAlert();
  const { orderDetail, error, isLoading } = useSelector(
    (state) => state.newOrder
  );
  useEffect(() => {
    if (error) {
      alert.error(error);
    }
    dispatch(getOrderDetails(params.id));
  }, [alert, error, dispatch, params.id]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <MetaData title="Order Details" />
          <div className="orderDetailsPage">
            <div className="orderDetailsContainer">
              <Typography component="h1">
                Order #{orderDetail && orderDetail._id}
              </Typography>
              <Typography>Shipping Info</Typography>
              <div className="orderDetailsContainerBox">
                <div>
                  <p>Name:</p>
                  <span>{orderDetail.user && orderDetail.user.name}</span>
                </div>
                <div>
                  <p>Phone:</p>
                  <span>
                    {orderDetail.shippingInfo && orderDetail.shippingInfo.phoneNo}
                  </span>
                </div>
                <div>
                  <p>Address:</p>
                  <span>
                    {orderDetail.shippingInfo &&
                      `${orderDetail.shippingInfo.address}, ${orderDetail.shippingInfo.city}, ${orderDetail.shippingInfo.state}, ${orderDetail.shippingInfo.pinCode}, ${orderDetail.shippingInfo.country}`}
                  </span>
                </div>
              </div>
              <Typography>Payment</Typography>
              <div className="orderDetailsContainerBox">
                <div>
                  <p
                    className={
                        orderDetail.paymentInfo &&
                        orderDetail.paymentInfo.status === "succeeded"
                        ? "greenColor"
                        : "redColor"
                    }
                  >
                    {orderDetail.paymentInfo &&
                    orderDetail.paymentInfo.status === "succeeded"
                      ? "PAID"
                      : "NOT PAID"}
                  </p>
                </div>

                <div>
                  <p>Amount:</p>
                  <span>{orderDetail.totalPrice && orderDetail.totalPrice}</span>
                </div>
              </div>

              <Typography>Order Status</Typography>
              <div className="orderDetailsContainerBox">
                <div>
                  <p
                    className={
                        orderDetail.orderStatus && orderDetail.orderStatus === "Delivered"
                        ? "greenColor"
                        : "redColor"
                    }
                  >
                    {orderDetail.orderStatus && orderDetail.orderStatus}
                  </p>
                </div>
              </div>
            </div>

            <div className="orderDetailsCartItems">
              <Typography>Order Items:</Typography>
              <div className="orderDetailsCartItemsContainer">
                {orderDetail.orderItems &&
                  orderDetail.orderItems.map((item) => (
                    <div key={item.product}>
                      <img src={item.image} alt="Product" />
                      <Link to={`/product/${item.product}`}>
                        {item.name}
                      </Link>{" "}
                      <span>
                        {item.quantity} X ₹{item.price} ={" "}
                        <b>₹{item.price * item.quantity}</b>
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default OrderDetails;
