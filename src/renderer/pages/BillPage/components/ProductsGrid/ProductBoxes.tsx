import { ArrowForward } from "@mui/icons-material";
import { Button, Grid } from "@mui/material";
import { Product } from "main/product/entities/product.entity";
import { Link } from "react-router-dom";
import ProductBox from "../ProductBox/ProductBox";

type IProps = {
  products: Product[];
  page: number;
}

const ProductBoxes = ({ products, page } : IProps) => {
  return (
    <>
      {products && (
        <Grid
          container
          spacing={{ xs: 1, md: 2 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
          sx={{ marginLeft: '5px', height: '200px', marginBottom: '30px' }}
        >
          {Array.from(products)
            .slice((page - 1) * 9, page * 9)
            .map((product) => (
              <Grid
                item
                key={product.id}
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={2}
              >
                <ProductBox product={product} />
              </Grid>
            ))}
        </Grid>
      )}
      {(products != undefined && products?.length == 0 && (
        <div>
          <span
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '-38%',
              fontSize: '14px',
              color: 'dimgray',
            }}
          >
            상품이 없습니다.
          </span>
          <Link
            to={'/products'}
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '5px',
              fontSize: '13px',
              color: 'darkslateblue',
              marginLeft: '2px',
            }}
          >
            <Button variant="text" sx={{ color: '#2DCDDF' }}>
              상품 추가하러 가기{' '}
              <ArrowForward sx={{ fontSize: '15px' }} />
            </Button>
          </Link>
        </div>
      )) ||
        ''}
    </>
  )
};

export default ProductBoxes;
