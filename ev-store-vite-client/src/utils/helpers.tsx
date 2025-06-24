export const getImageUrl = (imageId: number): string => {
    return `https://brook-boulevard-reno-shake.trycloudflare.com/api/v1/image?imageId=${imageId}`;
};

export const addItemToCart = (productId: number, quantity: number) => {
    const cart = localStorage.getItem('cart');
    const cartItems = cart ? JSON.parse(cart) : [];
    const existingItem = cartItems.find((item: { productId: number }) => item.productId === productId);
    
    if (existingItem) {
        updateItemQuantity(productId, existingItem.quantity + quantity);
    } else {
        cartItems.push({ productId, quantity });
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }
};

export const removeItemFromCart = (productId: number) => {
    const cart = localStorage.getItem('cart');
    if (cart) {
        let cartItems = JSON.parse(cart);
        cartItems = cartItems.filter((item: { productId: number }) => item.productId !== productId);
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }
};

export const updateItemQuantity = (productId: number, quantity: number) => {
    const cart = localStorage.getItem('cart');
    if (cart) {
        const cartItems = JSON.parse(cart);
        cartItems.find((item: { productId: number }) => item.productId === productId).quantity = quantity;
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }
};

export const getCart = () => {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
};

export const clearCart = () => {
    localStorage.removeItem('cart');
};
