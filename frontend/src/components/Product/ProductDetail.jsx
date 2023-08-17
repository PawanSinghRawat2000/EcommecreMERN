import React, { useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import "./productDetail.css";
import { useSelector, useDispatch } from "react-redux";
import { getProductDetails } from "../../slices/productDetailsSlice";
import { useParams } from "react-router-dom";
import { Rating } from "@mui/material";
import ReviewCard from "./ReviewCard";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";
import { addItemsToCart } from "../../slices/cartSlice";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@material-ui/core";
import { addProductReview,reset } from "../../slices/productDetailsSlice";

const ProductDetail = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const alert = useAlert();
  const { product, isLoading, error ,success} = useSelector(
    (state) => state.productDetails
  );

  useEffect(() => {
    if (error) {
      return alert.error(error);
    }
    if(success){
      alert.success("Review Submitted Successfully");
      dispatch(reset())
    }
    dispatch(getProductDetails(params.id));
  }, [dispatch, params.id, error, alert,success]);

  const options = {
    size: "large",
    value: product.ratings,
    readOnly: true,
    precision: 0.5,
  };

  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const increaseQuantity = () => {
    if (product.stock <= quantity) return;

    const qty = quantity + 1;
    setQuantity(qty);
  };
  const decreaseQuantity = () => {
    if (quantity <= 1) return;

    const qty = quantity - 1;
    setQuantity(qty);
  };

  const addToCartHandler = () => {
    dispatch(addItemsToCart({ id: params.id, quantity: quantity }));
    alert.success("Item added to cart");
  };

  const submitReviewToggle = () => {
    open ? setOpen(false) : setOpen(true);
  };
  const reviewSubmitHandler = () => {
    const data={
      rating:rating,
      comment:comment,
      productId:params.id
    }
    dispatch(addProductReview(data))
    setOpen(false)

  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="ProductDetails">
            <div>
              <Carousel style={{ flexGrow: 1 }}>
                {product.images &&
                  product.images.map((item, i) => (
                    <img
                      className="CarouselImage"
                      key={item.url}
                      src={item.url}
                      alt={`${i} Slide`}
                    />
                  ))}
              </Carousel>
            </div>

            <div>
              <div className="detailsBlock-1">
                <h2>{product.name}</h2>
                <p>Product # {product._id}</p>
              </div>
              <div className="detailsBlock-2">
                <Rating {...options} />
                <span className="detailsBlock-2-span">
                  {" "}
                  ({product.numOfReviews} Reviews)
                </span>
              </div>

              <div className="detailsBlock-3">
                <h1>{`₹${product.price}`}</h1>
                <div className="detailsBlock-3-1">
                  <div className="detailsBlock-3-1-1">
                    <button onClick={decreaseQuantity}>-</button>
                    <input readOnly type="number" value={quantity} />
                    <button onClick={increaseQuantity}>+</button>
                  </div>
                  <button
                    disabled={product.stock < 1 ? true : false}
                    onClick={addToCartHandler}
                  >
                    Add to Cart
                  </button>
                </div>

                <p>
                  Status:
                  <b className={product.stock < 1 ? "redColor" : "greenColor"}>
                    {product.stock < 1 ? "OutOfStock" : "InStock"}
                  </b>
                </p>
              </div>

              <div className="detailsBlock-4">
                Description : <p>{product.description}</p>
              </div>

              <Dialog
                aria-labelledby="simple-dialog-title"
                open={open}
                onClose={submitReviewToggle}
              >
                <DialogTitle>Submit Review</DialogTitle>
                <DialogContent className="submitDialog">
                  <Rating
                    onChange={(e) => setRating(e.target.value)}
                    value={rating}
                    size="large"
                  />

                  <textarea
                    className="submitDialogTextArea"
                    cols="30"
                    rows="5"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  ></textarea>
                </DialogContent>
                <DialogActions>
                  <Button onClick={submitReviewToggle} color="secondary">
                    Cancel
                  </Button>
                  <Button onClick={reviewSubmitHandler} color="primary">
                    Submit
                  </Button>
                </DialogActions>
              </Dialog>

              <button onClick={submitReviewToggle} className="submitReview">
                Submit Review
              </button>
            </div>
          </div>
          <h3 className="reviewsHeading">REVIEWS</h3>

          {product.reviews && product.reviews[0] ? (
            <div className="reviews">
              {product.reviews &&
                product.reviews.map((review) => (
                  <ReviewCard key={review._id} review={review} />
                ))}
            </div>
          ) : (
            <p className="noReviews">No Reviews Yet</p>
          )}
        </>
      )}
    </>
  );
};

export default ProductDetail;
