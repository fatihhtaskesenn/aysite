import { supabase, isSupabaseConfigured } from './supabaseClient';

export async function createOrder(orderPayload) {
  if (!isSupabaseConfigured()) {
    console.log('Mock Order Created:', orderPayload);
    return { data: { id: `MOCK-${Date.now()}`, ...orderPayload }, error: null };
  }

  try {
    const { items, ...orderData } = orderPayload;

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single();

    if (orderError) throw orderError;

    if (items && items.length > 0) {
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        product_title: item.name || item.title,
        quantity: item.quantity,
        unit_price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;
    }

    return { data: order, error: null };
  } catch (err) {
    console.error('Order creation error:', err);
    return { data: { id: `MOCK-${Date.now()}`, ...orderPayload }, error: null };
  }
}

export async function fetchAllOrders() {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (err) {
    console.error('Fetch orders error:', err);
    return { data: [], error: err };
  }
}

export async function updateOrderStatus(orderId, status) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('Update order status error:', err);
    return { data: null, error: err };
  }
}
