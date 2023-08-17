import React, { Fragment, useEffect, useState } from "react";
import MetaData from "../layout/MetaData";
import { Link, useParams } from "react-router-dom";
import { Typography } from "@material-ui/core";
import SideBar from "./Sidebar";
import {
  getOrderDetails,
  resetOrder,
  updateOrder,
} from "../../slices/orderSlice";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import { Button } from "@material-ui/core";
import "./updateOrder.css";

const UpdateOrder = () => {
  const { orderDetail, error, isLoading,isUpdated } = useSelector((state) => state.newOrder);
    const params=useParams()

  const updateOrderSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("status", status);

    dispatch(updateOrder({id:params.id,formData:myForm}));
  };

  const dispatch = useDispatch();
  const alert = useAlert();

  const [status, setStatus] = useState("");

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(resetOrder());
    }
    if (error) {
      alert.error(error);
      dispatch(resetOrder());
    }
    if (isUpdated) {
      alert.success("Order Updated Successfully");
      dispatch(resetOrder());
    }

    dispatch(getOrderDetails(params.id));
    
  }, [dispatch, alert, error,params.id, isUpdated]);

  return (
    <Fragment>
      <MetaData title="Process Order" />
      <div className="dashboard">
        <SideBar />
        <div className="newProductContainer">
          {isLoading ? (
            <Loader />
          ) : (
            <div
              className="confirmOrderPage"
              style={{
                display: orderDetail.orderStatus === "Delivered" ? "block" : "grid",
              }}
            >
              <div>
                <div className="confirmshippingArea">
                  <Typography>Shipping Info</Typography>
                  <div className="orderDetailContainerBox">
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
                  <div className="orderDetailContainerBox">
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
                  <div className="orderDetailContainerBox">
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
                <div className="confirmCartItems">
                  <Typography>Your Cart Items:</Typography>
                  <div className="confirmCartItemsContainer">
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
              {/*  */}
              <div
                style={{
                  display: orderDetail.orderStatus === "Delivered" ? "none" : "block",
                }}
              >
                <form
                  className="updateOrderForm"
                  onSubmit={updateOrderSubmitHandler}
                >
                  <h1>Process Order</h1>

                  <div>
                    <AccountTreeIcon />
                    <select onChange={(e) => setStatus(e.target.value)}>
                      <option value="">Choose Category</option>
                      {orderDetail.orderStatus === "Processing" && (
                        <option value="Shipped">Shipped</option>
                      )}

                      {orderDetail.orderStatus === "Shipped" && (
                        <option value="Delivered">Delivered</option>
                      )}
                    </select>
                  </div>

                  <Button
                    id="createProductBtn"
                    type="submit"
                    disabled={
                      isLoading ? true : false || status === "" ? true : false
                    }
                  >
                    Process
                  </Button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default UpdateOrder;
