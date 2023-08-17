import React, { useEffect, useState } from "react";
import "./Products.css";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../layout/Loader/Loader";
import { fetchProducts } from "../../slices/productSlice";
import ProductCard from "../Home/ProductCard";
import Pagination from "react-js-pagination";
import Slider from "@material-ui/core/Slider";
import { Typography } from "@material-ui/core";
import { useParams } from "react-router-dom";
import MetaData from "../layout/MetaData";

const categories = [
  "Laptop",
  "Footwear",
  "Bottom",
  "Tops",
  "Attire",
  "Camera",
  "SmartPhones",
];

const Products = () => {
  const {
    products,
    isLoading,
    productCount,
    resultPerPage,
    filteredProductCount,
  } = useSelector((state) => state.products);

  const [currentPage, setCurrentPage] = useState(1);
  const params=useParams()
  const keyword=params.keyword || ""

  const dispatch = useDispatch();
  const [price, setPrice] = useState([0, 1000000]);
  const [category, setCategory] = useState();
  const [ratings,setRatings]=useState(0)

  const setCurrentPageNo = (e) => {
    setCurrentPage(e);
  };
  const priceHandler = (e, newPrice) => {
    setPrice(newPrice);
  };

  useEffect(() => {
    
    // console.log(currentPage)
    // console.log(keyword)
    // console.log(price)
    // console.log(category)
    // console.log(ratings)

    dispatch(
      fetchProducts({
        keyword: keyword,
        currentPage: currentPage,
        price: price,
        category:category,
        ratings:ratings,
      })
    );
  }, [dispatch, currentPage, keyword, price,category,ratings]);

  let count = filteredProductCount;
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
        <MetaData title={'Product'} />
          <h2 className="productsHeading">Products</h2>
          <div className="products">
            {products &&
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
          </div>

          <div className="filterBox">
            <Typography>Price</Typography>
            <Slider
              value={price}
              onChange={priceHandler}
              valueLabelDisplay="auto"
              aria-labelledby="range-slider"
              min={0}
              max={100000}
            />

            <Typography>Categories</Typography>
            <ul className="categoryBox">
              {categories.map((category) => (
                <li
                  className="category-link"
                  key={category}
                  onClick={() => setCategory(category)}
                >
                  {category}
                </li>
              ))}
            </ul>

            <fieldset>
                <Typography>Ratings Above</Typography>
                <Slider
                    value={ratings}
                    onChange={(e,newRating)=>setRatings(newRating)}
                    aria-labelledby="continuous-slider"
                    min={0}
                    max={5}
                    valueLabelDisplay="auto"
                    
                />
            </fieldset>

          </div>

          {resultPerPage < count && (
            <div className="paginationBox">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={resultPerPage}
                totalItemsCount={productCount}
                onChange={setCurrentPageNo}
                nextPageText="Next"
                prevPageText="Prev"
                firstPageText="1st"
                lastPageText="Last"
                itemClass="page-item"
                linkClass="page-link"
                activeClass="pageItemActive"
                activeLinkClass="pageLinkActive"
              />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Products;
