import React, { useState, useEffect } from "react";
import "./ResetPassword.css";
import Loader from "../layout/Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";
import { resetPassword,reset } from "../../slices/profileSlice";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import LockIcon from "@material-ui/icons/Lock";
import { useParams,useNavigate } from "react-router-dom";

const ResetPassword = () => {

    const dispatch = useDispatch();
  const navigate = useNavigate();
  const params=useParams()
  const alert = useAlert();
  const { error, success, isLoading } = useSelector((state) => state.profile);

  
    const [password,setPassword]=useState("");
    const [confirmPassword,setConfirmPassword]=useState("");


  const resetPasswordSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    const token=params.token;
    myForm.set('token',token)
    myForm.set('password',password);
    myForm.set('confirmPassword',confirmPassword);

    dispatch(resetPassword(myForm));
  };


  useEffect(() => {

    if (error) {
      alert.error(error);

    }

    if (success) {
      alert.success("Password Updated Successfully");
      navigate("/login");
      dispatch(reset())
    }
  }, [dispatch, error, alert,navigate, success]);


  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <MetaData title="Reset Password" />
          <div className="resetPasswordContainer">
            <div className="resetPasswordBox">
              <h2 className="resetPasswordHeading">Reset Password</h2>

              <form
                className="resetPasswordForm"
                onSubmit={resetPasswordSubmit}
              >

                <div>
                  <LockOpenIcon />
                  <input
                    type="password"
                    placeholder="New Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div>
                  <LockIcon />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <input
                  type="submit"
                  value="Update"
                  className="resetPasswordBtn"
                />
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default ResetPassword

