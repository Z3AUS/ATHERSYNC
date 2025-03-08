
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Tag, Info } from 'lucide-react';
import { Product, useAppContext } from '@/context/AppContext';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProductCardProps {
  product: Product;
  isAdminView?: boolean;
  onEdit?: (product: Product) => void;
  onDelete?: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  isAdminView = false,
  onEdit,
  onDelete,
}) => {
  const { addToCart } = useAppContext();
  
  const hasDiscount = product.discountedPrice && product.discountedPrice < product.price;
  const displayPrice = hasDiscount ? product.discountedPrice : product.price;
  
  const handleAddToCart = () => {
    if (product.stock <= 0) {
      toast.error('This product is out of stock');
      return;
    }
    
    addToCart(product, 1);
    toast.success(`Added ${product.name} to cart`);
  };

  return (
    <Card className="overflow-hidden hover-scale glass-card h-full flex flex-col">
      <div className="relative pt-[56.25%] overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-105"
          loading="lazy"
        />
        {hasDiscount && (
          <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
            {Math.round(((product.price - (product.discountedPrice || 0)) / product.price) * 100)}% Off
          </Badge>
        )}
        {product.stock <= 5 && product.stock > 0 && (
          <Badge variant="destructive" className="absolute top-2 left-2">
            Low Stock: {product.stock}
          </Badge>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
            <Badge variant="destructive" className="text-lg py-1 px-3">Out of Stock</Badge>
          </div>
        )}
      </div>
      
      <CardContent className="pt-4 flex-grow">
        <div className="mb-1 flex items-center gap-2">
          <Badge variant="outline" className="text-xs text-muted-foreground">
            {product.category}
          </Badge>
          {isAdminView && (
            <Badge variant="outline" className="text-xs text-muted-foreground">
              ID: {product.id.slice(0, 6)}
            </Badge>
          )}
        </div>
        
        <h3 className="text-lg font-medium line-clamp-1 mb-1">{product.name}</h3>
        
        <div className="flex items-baseline mb-2">
          <span className="text-lg font-semibold">
            ${displayPrice?.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="ml-2 text-sm text-muted-foreground line-through">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
          {product.description}
        </p>
        
        {isAdminView && (
          <div className="flex flex-col gap-1 text-xs text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Stock:</span>
              <span className="font-medium">{product.stock} units</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Added on:</span>
              <span className="font-medium">
                {new Date(product.addedOn).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-0 pb-4">
        {isAdminView ? (
          <div className="flex w-full gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => onEdit && onEdit(product)}
            >
              Edit
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              className="flex-1"
              onClick={() => onDelete && onDelete(product.id)}
            >
              Delete
            </Button>
          </div>
        ) : (
          <div className="flex w-full gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" className="flex-none">
                    <Info size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View product details</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Button 
              variant="default" 
              className="flex-1 button-hover" 
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              <ShoppingCart size={16} className="mr-2" />
              Add to Cart
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
