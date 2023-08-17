import React, { useState } from 'react'
import './Search.css'
import { useNavigate } from 'react-router-dom'

const Search = () => {
    const [keyword,setKeyWord]=useState('')
    const navigate=useNavigate()
    const searchSubmitHandler=(e=>{
        e.preventDefault();
        if(keyword.trim()){
            navigate(`/products/${keyword}`)
        }else navigate('/products')
    })
  return (
    <>
    <form className='searchBox' onSubmit={searchSubmitHandler} >
        <input 
            type="text"
            placeholder='Search a product'
            onChange={(e)=>setKeyWord(e.target.value)}

        />
        <input type="submit" value="search"  />
    </form>
      
    </>
  )
}

export default Search
