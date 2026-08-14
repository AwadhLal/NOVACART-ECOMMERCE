import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, selectCurrentProduct, selectProductsLoading } from '../../features/products/productSlice';
import ProductForm from '../../components/admin/ProductForm';
import Spinner from '../../components/ui/Spinner';

export default function EditProductPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const product = useSelector(selectCurrentProduct);
  const loading = useSelector(selectProductsLoading);

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [id, dispatch]);

  if (loading || !product) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  return <ProductForm product={product} />;
}
