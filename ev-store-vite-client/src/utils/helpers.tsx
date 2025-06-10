export const getImageUrl = (imageId: number): string => {
    return `/api/v1/image?imageId=${imageId}`;
};

export const addItemToCart = (id: number, quantity: number) => {
    const cart = localStorage.getItem('cart');
    const cartItems = cart ? JSON.parse(cart) : [];
    const existingItem = cartItems.find((item: { id: number }) => item.id === id);
    
    if (existingItem) {
        updateItemQuantity(id, existingItem.quantity + quantity);
    } else {
        cartItems.push({ id, quantity });
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }
};

export const removeItemFromCart = (id: number) => {
    const cart = localStorage.getItem('cart');
    if (cart) {
        let cartItems = JSON.parse(cart);
        cartItems = cartItems.filter((item: { id: number }) => item.id !== id);
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }
};

export const updateItemQuantity = (id: number, quantity: number) => {
    const cart = localStorage.getItem('cart');
    if (cart) {
        const cartItems = JSON.parse(cart);
        cartItems.find((item: { id: number }) => item.id === id).quantity = quantity;
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }
};

export const getCart = () => {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
};
