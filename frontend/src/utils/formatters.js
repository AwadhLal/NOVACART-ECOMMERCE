export const formatPrice = (price) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

export const formatDate = (date) =>
  new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(
    new Date(date)
  );

export const getDiscountedPrice = (price, discount) =>
  discount > 0 ? parseFloat((price * (1 - discount / 100)).toFixed(2)) : price;

export const statusBadgeClass = (status) => {
  const map = {
    Pending: 'badge-pending',
    Confirmed: 'badge-confirmed',
    Shipped: 'badge-shipped',
    Delivered: 'badge-delivered',
    Cancelled: 'badge-cancelled',
  };
  return map[status] || 'badge-pending';
};
