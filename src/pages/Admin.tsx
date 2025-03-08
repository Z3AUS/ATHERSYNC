
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAppContext, Product, Staff } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import QRScanner from '@/components/QRScanner';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend,
} from 'recharts';
import {
  Package, Store, Users, ShoppingBag, BarChart3, QrCode, Search,
  PlusCircle, Trash2, Edit, Save, XCircle, UserPlus, RefreshCw
} from 'lucide-react';

const Admin = () => {
  const navigate = useNavigate();
  const {
    isLoggedIn,
    userRole,
    products,
    addProduct,
    updateProduct,
    removeProduct,
    staff,
    addStaff,
    salesData,
    generateNewSalesData,
    bills
  } = useAppContext();

  const [activeTab, setActiveTab] = useState('products');
  const [showScanner, setShowScanner] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [newStaff, setNewStaff] = useState<{
    name: string;
    role: 'admin' | 'security';
    phone: string;
    email: string;
  }>({
    name: '',
    role: 'security',
    phone: '',
    email: '',
  });

  // Form for adding/editing product
  const [productForm, setProductForm] = useState<{
    id: string;
    name: string;
    price: number;
    discountedPrice?: number;
    image: string;
    stock: number;
    category: string;
    description: string;
  }>({
    id: '',
    name: '',
    price: 0,
    discountedPrice: undefined,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    stock: 0,
    category: '',
    description: '',
  });

  useEffect(() => {
    if (!isLoggedIn || userRole !== 'admin') {
      navigate('/login?role=admin');
    }
  }, [isLoggedIn, userRole, navigate]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);

  const handleScanResult = (result: string | Product | null) => {
    if (result && typeof result !== 'string' && 'stock' in result) {
      toast.success(`Successfully scanned: ${(result as Product).name}`);
      setEditingProduct(result as Product);
      setProductForm({
        id: (result as Product).id,
        name: (result as Product).name,
        price: (result as Product).price,
        discountedPrice: (result as Product).discountedPrice,
        image: (result as Product).image,
        stock: (result as Product).stock,
        category: (result as Product).category,
        description: (result as Product).description,
      });
    } else {
      toast.error('Failed to scan product. Please try again.');
    }
    setShowScanner(false);
  };

  const handleAddProduct = () => {
    try {
      const newProduct: Product = {
        ...productForm,
        id: editingProduct ? editingProduct.id : `PROD-${Math.floor(Math.random() * 10000)}`,
        addedOn: editingProduct ? editingProduct.addedOn : new Date(),
        qrCode: editingProduct ? editingProduct.qrCode : `qr-${Math.floor(Math.random() * 10000)}`,
      };

      if (editingProduct) {
        updateProduct(newProduct);
        toast.success(`Product "${newProduct.name}" updated successfully`);
      } else {
        addProduct(newProduct);
        toast.success(`Product "${newProduct.name}" added successfully`);
      }

      // Reset form
      setProductForm({
        id: '',
        name: '',
        price: 0,
        discountedPrice: undefined,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
        stock: 0,
        category: '',
        description: '',
      });
      setEditingProduct(null);
    } catch (error) {
      toast.error('Failed to save product');
      console.error(error);
    }
  };

  const handleDeleteProduct = (productId: string) => {
    try {
      removeProduct(productId);
      toast.success('Product removed successfully');
    } catch (error) {
      toast.error('Failed to remove product');
      console.error(error);
    }
  };

  const handleAddStaff = () => {
    try {
      const staffMember: Staff = {
        ...newStaff,
        id: `STAFF-${Math.floor(Math.random() * 10000)}`,
        addedOn: new Date(),
      };

      addStaff(staffMember);
      toast.success(`${staffMember.name} added to staff successfully`);

      // Reset form
      setNewStaff({
        name: '',
        role: 'security',
        phone: '',
        email: '',
      });
    } catch (error) {
      toast.error('Failed to add staff member');
      console.error(error);
    }
  };

  // Calculate dashboard metrics
  const totalProducts = products.length;
  const totalInventoryValue = products.reduce((total, product) => {
    return total + (product.price * product.stock);
  }, 0);
  const totalSales = bills.reduce((total, bill) => total + bill.totalAmount, 0);
  const lowStockProducts = products.filter(product => product.stock < 10).length;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 size={16} />
            <span className="hidden sm:inline">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package size={16} />
            <span className="hidden sm:inline">Products</span>
          </TabsTrigger>
          <TabsTrigger value="staff" className="flex items-center gap-2">
            <Users size={16} />
            <span className="hidden sm:inline">Staff</span>
          </TabsTrigger>
          <TabsTrigger value="bills" className="flex items-center gap-2">
            <ShoppingBag size={16} />
            <span className="hidden sm:inline">Bills</span>
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Products</p>
                    <h3 className="text-2xl font-bold">{totalProducts}</h3>
                  </div>
                  <Package className="text-primary h-8 w-8" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Inventory Value</p>
                    <h3 className="text-2xl font-bold">${totalInventoryValue.toFixed(2)}</h3>
                  </div>
                  <Store className="text-primary h-8 w-8" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Sales</p>
                    <h3 className="text-2xl font-bold">${totalSales.toFixed(2)}</h3>
                  </div>
                  <ShoppingBag className="text-primary h-8 w-8" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Low Stock Products</p>
                    <h3 className="text-2xl font-bold">{lowStockProducts}</h3>
                  </div>
                  <Badge variant="destructive">{lowStockProducts}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Sales Overview</span>
                  <Button variant="ghost" size="icon" onClick={generateNewSalesData}>
                    <RefreshCw size={16} />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={salesData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                    >
                      <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickFormatter={(value) => {
                        const date = new Date(value);
                        return `${date.getDate()}/${date.getMonth() + 1}`;
                      }} />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="amount"
                        stroke="#8884d8"
                        fillOpacity={1}
                        fill="url(#colorSales)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { category: 'Electronics', count: products.filter(p => p.category === 'Electronics').length },
                        { category: 'Fashion', count: products.filter(p => p.category === 'Fashion').length },
                        { category: 'Home & Kitchen', count: products.filter(p => p.category === 'Home & Kitchen').length },
                        { category: 'Others', count: products.filter(p => !['Electronics', 'Fashion', 'Home & Kitchen'].includes(p.category)).length },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Product Form */}
            <Card className="glass-card md:col-span-1">
              <CardHeader>
                <CardTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    {showScanner ? (
                      <QRScanner
                        scanType="product"
                        onScanSuccess={handleScanResult}
                        className="mb-4"
                      />
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => setShowScanner(true)}
                        className="w-full mb-4"
                      >
                        <QrCode className="mr-2 h-4 w-4" />
                        Scan Product QR
                      </Button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Product Name</label>
                      <Input
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        placeholder="Product Name"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Price ($)</label>
                        <Input
                          type="number"
                          value={productForm.price}
                          onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) })}
                          placeholder="Price"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Discounted Price ($)</label>
                        <Input
                          type="number"
                          value={productForm.discountedPrice || ''}
                          onChange={(e) => setProductForm({
                            ...productForm,
                            discountedPrice: e.target.value ? parseFloat(e.target.value) : undefined
                          })}
                          placeholder="Discounted Price (optional)"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Image URL</label>
                      <Input
                        value={productForm.image}
                        onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                        placeholder="Image URL"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Stock</label>
                        <Input
                          type="number"
                          value={productForm.stock}
                          onChange={(e) => setProductForm({ ...productForm, stock: parseInt(e.target.value) })}
                          placeholder="Stock"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Category</label>
                        <Input
                          value={productForm.category}
                          onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                          placeholder="Category"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Input
                        value={productForm.description}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        placeholder="Description"
                      />
                    </div>

                    <div className="flex space-x-2">
                      <Button onClick={handleAddProduct} className="flex-1">
                        {editingProduct ? (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Update Product
                          </>
                        ) : (
                          <>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Product
                          </>
                        )}
                      </Button>
                      {editingProduct && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            setEditingProduct(null);
                            setProductForm({
                              id: '',
                              name: '',
                              price: 0,
                              discountedPrice: undefined,
                              image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
                              stock: 0,
                              category: '',
                              description: '',
                            });
                          }}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product List */}
            <Card className="glass-card md:col-span-2">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Products</span>
                  <Badge variant="outline">{filteredProducts.length} Items</Badge>
                </CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    placeholder="Search products..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {filteredProducts.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                      <h3 className="text-lg font-medium">No products found</h3>
                      <p className="text-muted-foreground">
                        Add products or adjust your search filter.
                      </p>
                    </div>
                  ) : (
                    filteredProducts.map((product) => (
                      <div key={product.id} className="flex items-center space-x-4 border rounded-lg p-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-16 w-16 object-cover rounded-md"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between">
                            <h3 className="text-base font-medium truncate">{product.name}</h3>
                            <div className="flex space-x-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setEditingProduct(product);
                                  setProductForm({
                                    id: product.id,
                                    name: product.name,
                                    price: product.price,
                                    discountedPrice: product.discountedPrice,
                                    image: product.image,
                                    stock: product.stock,
                                    category: product.category,
                                    description: product.description,
                                  });
                                }}
                              >
                                <Edit size={16} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{product.description}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium">
                                ${product.discountedPrice || product.price}
                              </span>
                              {product.discountedPrice && (
                                <span className="text-xs line-through text-muted-foreground">
                                  ${product.price}
                                </span>
                              )}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              Stock: {product.stock}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {product.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Staff Tab */}
        <TabsContent value="staff" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Staff Form */}
            <Card className="glass-card md:col-span-1">
              <CardHeader>
                <CardTitle>Add Staff Member</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <Input
                      value={newStaff.name}
                      onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                      placeholder="Full Name"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Role</label>
                    <div className="flex space-x-2 mt-1">
                      <Button
                        variant={newStaff.role === 'admin' ? 'default' : 'outline'}
                        className="flex-1"
                        onClick={() => setNewStaff({ ...newStaff, role: 'admin' })}
                      >
                        Admin
                      </Button>
                      <Button
                        variant={newStaff.role === 'security' ? 'default' : 'outline'}
                        className="flex-1"
                        onClick={() => setNewStaff({ ...newStaff, role: 'security' })}
                      >
                        Security
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <Input
                      value={newStaff.phone}
                      onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                      placeholder="Phone Number"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      value={newStaff.email}
                      onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                      placeholder="Email Address"
                    />
                  </div>

                  <Button onClick={handleAddStaff} className="w-full">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Staff Member
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Staff List */}
            <Card className="glass-card md:col-span-2">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Staff Members</span>
                  <Badge variant="outline">{staff.length} Members</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {staff.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                      <h3 className="text-lg font-medium">No staff members</h3>
                      <p className="text-muted-foreground">
                        Add staff members using the form.
                      </p>
                    </div>
                  ) : (
                    staff.map((member) => (
                      <div key={member.id} className="flex items-center space-x-4 border rounded-lg p-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                          {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between">
                            <h3 className="text-base font-medium">{member.name}</h3>
                            <Badge variant={member.role === 'admin' ? 'default' : 'secondary'}>
                              {member.role}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                          <p className="text-sm text-muted-foreground">{member.phone}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Bills Tab */}
        <TabsContent value="bills" className="animate-fade-in">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>All Transactions</span>
                <Badge variant="outline">{bills.length} Bills</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {bills.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium">No transactions yet</h3>
                  <p className="text-muted-foreground">
                    Customer transactions will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {bills.map((bill) => (
                    <div key={bill.id} className="border rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium">Bill #{bill.id}</h3>
                        <Badge variant="outline">{new Date(bill.createdAt).toLocaleString()}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Customer: {bill.customerName}
                      </p>
                      <Separator className="my-2" />
                      <div className="space-y-1 mb-2">
                        {bill.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span>{item.product.name} × {item.quantity}</span>
                            <span>${((item.product.discountedPrice || item.product.price) * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-medium">
                        <span>Total Amount:</span>
                        <span>${bill.totalAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span>Payment Status:</span>
                        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                          {bill.paymentStatus}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
