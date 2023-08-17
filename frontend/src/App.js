import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/layout/Header/Header";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import WebFont from "webfontloader";
import Footer from "./components/layout/Footer/Footer";
import Home from "./components/Home/Home";
import ProductDetails from "./components/Product/ProductDetail";
import Products from "./components/Product/Products";
import Search from "./components/Product/Search";
import Login from "./components/User/LoginSignUp";
import { useSelector, useDispatch } from "react-redux";
import { loadUser } from "./slices/userSlice";
import UserOptions from "./components/layout/Header/UserOptions";
import Profile from "./components/User/Profile";
import ProtectedRoute from "./components/Route/ProtectedRoute";
import UpdateProfile from "./components/User/UpdateProfile";
import UpdatePassword from "./components/User/UpdatePassword";
import ForgotPassword from "./components/User/ForgotPassword";
import ResetPassword from "./components/User/ResetPassword";
import Cart from "./components/Cart/Cart";
import Shipping from "./components/Cart/Shipping";
import ConfirmOrder from "./components/Cart/ConfirmOrder";
import Payment from "./components/Cart/Payment";
import axios from "axios";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import OrderSuccess from "./components/Cart/OrderSuccess";
import MyOrders from "./components/Order/MyOrders";
import OrderDetails from "./components/Order/OrderDetails";
import DashBoard from "./components/Admin/DashBoard";
import ProductList from "./components/Admin/ProductList";
import CreateProduct from "./components/Admin/CreateProduct";
import UpdateProduct from "./components/Admin/UpdateProduct";
import AllOrders from "./components/Admin/AllOrders";
import UpdateOrder from "./components/Admin/UpdateOrder";
import AllUsers from "./components/Admin/AllUsers";
import UpdateUser from "./components/Admin/UpdateUser";
import ProductReviews from './components/Admin/ProductReviews'
import Contact from './components/layout/Contact'
import AboutUs from './components/layout/AboutUs'
import NotFound from "./components/layout/404NotFound/NotFound";
import ExpenseTracker from "./components/User/ExpenseTracker";



function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    const { data } = await axios.get("/api/v1/stripeapikey");
    setStripeApiKey(data.stripeApiKey);
  }

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });

    dispatch(loadUser());
    getStripeApiKey();
  }, [dispatch]);
  return (
    <>
      <BrowserRouter>
        <Header />
        {isAuthenticated && <UserOptions user={user} />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:keyword" element={<Products />} />
          <Route path="/search" element={<Search />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/account"
            element={
              <ProtectedRoute redirectTo="/login">
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/me/update"
            element={
              <ProtectedRoute redirectTo="/login">
                <UpdateProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/password/update"
            element={
              <ProtectedRoute redirectTo="/login">
                <UpdatePassword />
              </ProtectedRoute>
            }
          />
          <Route path="/password/forgot" element={<ForgotPassword />} />
          <Route path="/password/reset/:token" element={<ResetPassword />} />
          <Route path="/cart" element={<Cart />} />

          <Route
            path="/shipping"
            element={
              <ProtectedRoute redirectTo="/login">
                <Shipping />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order/confirm"
            element={
              <ProtectedRoute redirectTo="/login">
                <ConfirmOrder />
              </ProtectedRoute>
            }
          />

          {stripeApiKey && (
            <Route
              path="/process/payment"
              element={
                <ProtectedRoute redirectTo="/login">
                  <Elements stripe={loadStripe(stripeApiKey)}>
                    <Payment />
                  </Elements>
                </ProtectedRoute>
              }
            />
          )}

          <Route
            path="/success"
            element={
              <ProtectedRoute redirectTo="/login">
                <OrderSuccess />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute redirectTo="/login">
                <MyOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order/:id"
            element={
              <ProtectedRoute redirectTo="/login">
                <OrderDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute isAdmin={true} redirectTo="/login">
                <DashBoard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/products"
            element={
              <ProtectedRoute isAdmin={true} redirectTo="/login">
                <ProductList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/product"
            element={
              <ProtectedRoute isAdmin={true} redirectTo="/login">
                <CreateProduct />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/product/:id"
            element={
              <ProtectedRoute isAdmin={true} redirectTo="/login">
                <UpdateProduct />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute isAdmin={true} redirectTo="/login">
                <AllOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/order/:id"
            element={
              <ProtectedRoute isAdmin={true} redirectTo="/login">
                <UpdateOrder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute isAdmin={true} redirectTo="/login">
                <AllUsers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/user/:id"
            element={
              <ProtectedRoute isAdmin={true} redirectTo="/login">
                <UpdateUser />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/reviews"
            element={
              <ProtectedRoute isAdmin={true} redirectTo="/login">
                <ProductReviews />
              </ProtectedRoute>
            }
          />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<AboutUs />} />

          <Route
            path="/me/expenses"
            element={
              <ProtectedRoute redirectTo="/login">
                <ExpenseTracker />
              </ProtectedRoute>
            }
          />

          <Route
          path="*" element={<NotFound/>
          }/>

        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
