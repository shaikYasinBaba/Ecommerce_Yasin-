import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Rating,
  Grid,
  Stack,
  Chip,
  Avatar,
  IconButton,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert
} from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [snackOpen, setSnackOpen] = useState(false);
  const [error, setError] = useState('');
  const [isBuyNow, setIsBuyNow] = useState(false);

  const isWide = useMediaQuery('(min-width:900px)');

  useEffect(() => {
    fetch(`https://dummyjson.com/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setQuantity(data.minimumOrderQuantity || 1);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch product:', err);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCartClick = () => {
    setIsBuyNow(false);
    setDialogOpen(true);
    setError('');
  };

  const handleBuyNowClick = () => {
    setIsBuyNow(true);
    setDialogOpen(true);
    setError('');
  };

  const handleSave = () => {
    if (quantity > product.stock) {
      setError('Stock not available for this quantity');
      return;
    }

    const productToSave = { ...product, quantity };

    if (isBuyNow) {
      localStorage.setItem('buyNow', JSON.stringify(productToSave));
      setDialogOpen(false);
      navigate('/checkout?mode=buynow');
    } else {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const existing = cart.find((p) => p.id === product.id);
      const updatedCart = existing
        ? cart.map((p) =>
            p.id === product.id ? { ...p, quantity: p.quantity + quantity } : p
          )
        : [...cart, productToSave];

      localStorage.setItem('cart', JSON.stringify(updatedCart));
      setDialogOpen(false);
      setSnackOpen(true);
    }
  };

  const handleQuantityChange = (val) => {
    const newQty = quantity + val;
    if (newQty >= product.minimumOrderQuantity && newQty <= product.stock) {
      setQuantity(newQty);
      setError('');
    } else if (newQty > product.stock) {
      setError('Stock not available for this quantity');
    }
  };

  const toggleWishlist = () => {
    setWishlist(!wishlist);
  };

  if (loading) {
    return (
      <Box mt={5} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return (
      <Box mt={5} textAlign="center">
        <Typography variant="h6">Product not found.</Typography>
      </Box>
    );
  }

  const {
    title,
    description,
    price,
    discountPercentage,
    rating,
    stock,
    brand,
    category,
    images,
    warrantyInformation,
    shippingInformation,
    availabilityStatus,
    dimensions = {},
    weight,
    reviews = [],
    returnPolicy,
    minimumOrderQuantity,
    meta = {}
  } = product;


  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <Grid container spacing={4} alignItems="flex-start" direction={isWide ? 'row' : 'column'}>
        <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ position: { md: 'sticky', xs: 'relative' }, top: { md: 80 }, alignSelf: { md: 'flex-start' }, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 450 }}>
            <img
              src={images?.[0] || product.thumbnail}
              alt={title}
              style={{ width: '100%', objectFit: 'contain', background: '#f5f5f5', padding: '1rem', borderRadius: '8px' }}
            />
            <Box display="flex" mt={2} gap={1} flexWrap="wrap" justifyContent="center">
              {images?.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`img-${idx}`}
                  style={{ width: 60, height: 60, objectFit: 'contain', border: '1px solid #ccc', borderRadius: 4 }}
                />
              ))}
            </Box>
            <Stack direction={isWide ? 'row' : 'column'} spacing={2} m={3} sx={{ width: '100%' }}>
              <Button variant="contained" sx={{ backgroundColor: '#ffa500', color: '#000', fontWeight: 'bold', flex: 1 }} onClick={handleAddToCartClick}>
                Add to Cart
              </Button>
              <Button variant="contained" color="primary" sx={{ fontWeight: 'bold', flex: 1 }} onClick={handleBuyNowClick}>
                Buy Now
              </Button>
            </Stack>
          </Box>
        </Grid>

        <Grid item xs={12} md={7} sx={{ display: 'flex', justifyContent: 'center' }} p={'2rem'} pt={'0px'}>
          <Box sx={{ width: '100%', maxWidth: 700 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h4" gutterBottom>{title}</Typography>
              <Stack direction="row" spacing={1}>
                <IconButton onClick={toggleWishlist}>
                  {wishlist ? <FavoriteIcon sx={{ color: 'red' }} /> : <FavoriteBorderIcon />}
                </IconButton>
                <IconButton><ShareIcon /></IconButton>
              </Stack>
            </Box>

            <Typography variant="body1" gutterBottom color="text.secondary">{description}</Typography>

            <Stack direction="row" spacing={1} alignItems="center" mt={2}>
              <Rating value={rating} precision={0.1} readOnly />
              <Typography variant="body2">({rating})</Typography>
            </Stack>

            <Typography variant="h5" mt={2}>${price} USD</Typography>
            <Typography variant="subtitle2" color="error" gutterBottom>{discountPercentage}% off</Typography>

            <Stack direction="row" spacing={1} flexWrap="wrap" mt={1}>
              <Chip label={`Brand: ${brand}`} variant="outlined" />
              <Chip label={`Category: ${category}`} variant="outlined" />
            </Stack>

            <Typography mt={2}>Stock Available: {stock}</Typography>
            <Typography>Availability: {availabilityStatus}</Typography>
            <Typography mt={2}>Minimum Order Quantity: {minimumOrderQuantity}</Typography>
            <Typography>Weight: {weight}g</Typography>
            <Typography>Dimensions: {dimensions.width} x {dimensions.height} x {dimensions.depth} mm</Typography>
            <Typography mt={2}>Warranty: {warrantyInformation}</Typography>
            <Typography>Shipping: {shippingInformation}</Typography>
            <Typography>Return Policy: {returnPolicy}</Typography>

            {meta.qrCode && (
              <Box mt={4}>
                <Typography variant="subtitle2">QR Code:</Typography>
                <img src={meta.qrCode} alt="qr-code" width={120} />
              </Box>
            )}

            <Box mt={4}>
              <Typography variant="h5" gutterBottom>Customer Reviews</Typography>
              {reviews.length === 0 ? (
                <Typography>No reviews yet.</Typography>
              ) : (
                reviews.map((r, idx) => (
                  <Box key={idx} mb={2} p={2} border="1px solid #eee" borderRadius={2}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar>{r.reviewerName.charAt(0)}</Avatar>
                      <Typography variant="subtitle2">{r.reviewerName}</Typography>
                    </Stack>
                    <Rating value={r.rating} readOnly size="small" sx={{ mt: 1 }} />
                    <Typography variant="body2" mt={1}>{r.comment}</Typography>
                    <Typography variant="caption" color="text.secondary">{new Date(r.date).toLocaleDateString()}</Typography>
                  </Box>
                ))
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Select Quantity</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Button variant='outlined' sx={{fontWeight:'900', fontSize:'1.5rem',borderRadius:'25%'}}  onClick={() => handleQuantityChange(-1)} disabled={quantity <= minimumOrderQuantity}>-</Button>
              <TextField value={quantity} sx={{width:'4rem'}} inputProps={{ readOnly: true }}/>
              <Button variant='outlined' sx={{fontWeight:'900', fontSize:'1.5rem',borderRadius:'25%'}} onClick={() => handleQuantityChange(1)}>+</Button>
            </Stack>
            <Typography variant="body2">Stock Available: {stock}</Typography>
            <Typography variant="body2">Availability: {availabilityStatus}</Typography>
            <Typography variant="body2">Minimum Order Quantity: {minimumOrderQuantity}</Typography>
            <Typography variant="body2">Weight: {weight}g</Typography>
            <Typography variant="body2">Dimensions: {dimensions.width} x {dimensions.height} x {dimensions.depth} mm</Typography>
            <Typography variant="body2">Warranty: {warrantyInformation}</Typography>
            <Typography variant="body2">Shipping: {shippingInformation}</Typography>
            <Typography variant="body2">Return Policy: {returnPolicy}</Typography>
            {error && <Typography color="error">{error}</Typography>}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSave} variant="contained" color="success">Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled">Added to cart</Alert>
      </Snackbar>
    </Box>
  );
}
