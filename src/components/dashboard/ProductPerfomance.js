import React, { useState } from "react";
import Link from 'next/link'
import {
  Typography,
  Table,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import BaseCard from "../baseCard/BaseCard";

const ProductPerfomance = ({ products, setProducts, setKey }) => {
  const [key2, setKey2] = useState(0)
  const handelDelete = async (productId) => {
    setKey(Math.random(1, 10))
    setKey2(Math.random(1, 10))
    for (const item of products) {
      if (item._id == productId) {
        let body = { productId }
        let response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/deleteProduct`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        })
        let json = await response.json()
        setProducts(json.product)
      }
    }
  }

  const handleProduct = () => {
    // 
  }
  return (
    <BaseCard key={key2} title="All Products">
      <Table
        aria-label="simple table"
        sx={{
          mt: 3,
          whiteSpace: "nowrap",
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell >
              <Typography color="textSecondary" variant="h6">
                Image
              </Typography>
            </TableCell>



            <TableCell>
              <Typography color="textSecondary" variant="h6">
                Title
              </Typography>
            </TableCell>


            <TableCell>
              <Typography color="textSecondary" variant="h6">
                Category
              </Typography>
            </TableCell>


            <TableCell>
              <Typography color="textSecondary" variant="h6">
                Color/Size
              </Typography>
            </TableCell>



            <TableCell>
              <Typography color="textSecondary" variant="h6">
                Quantity
              </Typography>
            </TableCell>


            <TableCell >
              <Typography color="textSecondary" variant="h6">
                Price
              </Typography>
            </TableCell>


          </TableRow>
        </TableHead>

        {products && products.map((product) => (
          <TableHead key={product.slug}>
            <TableRow>
              <TableCell >
                <Typography color="textSecondary" variant="h6">
                  <img style={{ "height": "3rem" }} src={product.img} />
                </Typography>
              </TableCell>


              <TableCell>
                <Link href={`${process.env.NEXT_PUBLIC_HOST}/admin/product/${product.slug}`}><Typography className="cursor-pointer hover:underline" onClick={handleProduct} color="textSecondary" variant="h6">
                  {product.title}
                </Typography></Link>
              </TableCell>


              <TableCell>
                <Typography color="textSecondary" variant="h6">
                  {product.category.slice(0, 1).toUpperCase() + product.category.slice(1, product.length)}
                </Typography>
              </TableCell>


              <TableCell>
                <Typography color="textSecondary" variant="h6">
                  {product.color.slice(0, 1).toUpperCase() + product.color.slice(1, product.length)}<b> / </b>{product.size}
                </Typography>
              </TableCell>



              <TableCell>
                <Typography color="textSecondary" variant="h6">
                  {product.availableQty}
                </Typography>
              </TableCell>


              <TableCell >
                <Typography color="textSecondary" variant="h6">
                  {product.price}
                </Typography>
              </TableCell>

              <TableCell >
                <span onClick={() => { handelDelete(product._id) }} className="cursor-pointer text-sm font-bold text-red-400">Delete</span>

              </TableCell>
              {/* <TableCell >
                <Typography onClick={() => { handelDelete(product._id) }} color="textSecondary" variant="h6">
                  <a><b>Delete</b></a>
                </Typography>
              </TableCell> */}


            </TableRow>
          </TableHead>
        ))}
      </Table>
    </BaseCard>
  );
};


export default ProductPerfomance;

