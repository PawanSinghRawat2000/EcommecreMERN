import React, { useEffect } from 'react'
import './productList.css'
import { useDispatch ,useSelector} from 'react-redux'
import { getAdminProducts,deleteProduct,reset } from '../../slices/productSlice';
import Sidebar from './Sidebar';
import MetaData from '../layout/MetaData';
import { DataGrid } from '@material-ui/data-grid';
import { Link } from 'react-router-dom';
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import { useNavigate } from 'react-router-dom';

const ProductList = () => {
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const alert=useAlert();
    const {adminProducts,isDeleted,error}=useSelector(state=>state.products)
    const deleteProductHandler = (id) => {
        dispatch(deleteProduct(id));
      };

    
    const columns=[
        { field: "id", headerName: "Product ID", minWidth: 250, flex: 0.6 },
        {
            field: "name",
            headerName: "Name",
            minWidth: 150,
            flex: 0.6,
            
          },
          {
            field: "stock",
            headerName: "Stock",
            type: "number",
            minWidth: 130,
            flex: 0.3,
          },
          {
            field: "price",
            headerName: "Price",
            type: "number",
            minWidth: 200,
            flex: 0.5,
          },
          {
            field:"actions",
            headerName:"Actions",
            minWidth:130,
            type:"number",
            sortable:false,
            className: "actions" , 
            renderCell:(params)=>{
                return(
                    <>
                        <Link to={`/admin/product/${params.getValue(params.id,"id")}`}>
                            <EditIcon/>
                        </Link>

                        <Button onClick={()=>deleteProductHandler(params.getValue(params.id,"id"))}>
                            <DeleteIcon/>
                        </Button>
                    </>
                )
            }
          }
        ]
    const rows=[];

    adminProducts && adminProducts.forEach((item)=>{
        rows.push({
            id:item._id,
            stock:item.stock,
            price:item.price,
            name:item.name
        })
    })

    useEffect(()=>{
        if(error){
            alert.error(error);
            dispatch(reset());
        }

        if(isDeleted){
            alert.success("Product Deleted successfully");
            navigate('/admin/dashboard');
            dispatch(reset());
        }
        dispatch(getAdminProducts())

    },[dispatch,error,alert,isDeleted,navigate])
  return (
    <>
    <MetaData title={`ALL PRODUCTS - Admin`} />
      <div className="dashboard">
        <Sidebar/>
        <div className="dashboardContainer">
            <h1 id='productListHeading' >All Products</h1>
            <DataGrid
                rows={rows}
                columns={columns}
                
                pageSize={10}
                disableSelectionOnClick
                className='productListTable'
                autoHeight
            >

            </DataGrid>
        </div>

      </div>
    </>
  )
}

export default ProductList
