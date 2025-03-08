
import React from 'react';
import { useAppContext, CartItem as CartItemType } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Minus, Plus, X } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { removeFromCart, updateCartItemQuantity } = useAppContext();
  
  const { product, quantity } = item;
  const price = product.discountedPrice || product.price;
  const totalPrice = price * quantity;
  
  const handleIncreaseQuantity = () => {
    if (quantity < product.stock + quantity) {
      updateCartItemQuantity(product.id, quantity + 1);
    }
  };
  
  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      updateCartItemQuantity(product.id, quantity - 1);
    }
  };
  
  const handleRemove = () => {
    removeFromCart(product.id);
  };

  return (
    <div className="flex items-start gap-4 py-4 border-b last:border-0 transition-all-ease animate-fade-in">
      <div className="w-20 h-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      
      <div className="flex-grow">
        <div className="flex justify-between">
          <h3 className="font-medium mb-1">{product.name}</h3>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive -mt-1 -mr-1" 
            onClick={handleRemove}
          >
            <X size={16} />
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
          {product.description}
        </p>
        
        <div className="flex justify-between items-end">
          <div className="flex items-center space-x-1">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-7 w-7 rounded-full" 
              onClick={handleDecreaseQuantity} 
              disabled={quantity <= 1}
            >
              <Minus size={14} />
            </Button>
            
            <span className="w-8 text-center">{quantity}</span>
            
            <Button 
              variant="outline" 
              size="icon" 
              className="h-7 w-7 rounded-full" 
              onClick={handleIncreaseQuantity} 
              disabled={quantity >= product.stock + quantity}
            >
              <Plus size={14} />
            </Button>
          </div>
          
          <div className="text-right">
            <div className="font-medium">${totalPrice.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">
              ${price.toFixed(2)} each
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
