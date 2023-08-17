import React, { useEffect } from 'react'
import {CgMouse} from 'react-icons/cg'
import './Home.css'
import ProductCard from './ProductCard'
import MetaData from '../layout/MetaData'
import { fetchProducts } from '../../slices/productSlice'
import {useSelector,useDispatch} from 'react-redux'
import Loader from '../layout/Loader/Loader'


const Home = () => {
  const dispatch=useDispatch();
  const {isLoading,error,products}=useSelector(state=>state.products)
  
  useEffect(()=>{
    console.log("Home")

    dispatch(fetchProducts({keyword:"",currentPage:1,price:[0,250000],ratings:0}))
  },[dispatch,error])
  
  return (
    <>{isLoading?<Loader/>:<>
    <MetaData title={"Ecommerce"} />
      <div className="banner">
      <p>Welcome to Ecommerce</p>
            <h1>FIND AMAZING PRODUCTS BELOW</h1>

            <a href="#container">
              <button>
                Scroll <CgMouse />
              </button>
            </a>
      </div>
      <h2 className="homeHeading">Featured Products</h2>
      <div className="container" id="container">
        {products && products.map((product)=>(
          <ProductCard key={product._id} product={product}/>
        ))}
      </div>
    </>
    }
    </>
  )
}

export default Home
