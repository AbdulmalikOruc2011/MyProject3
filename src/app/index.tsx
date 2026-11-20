import React, { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SectionList,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Category = 'Fruits' | 'Meat' | 'Sweets' | 'Drinks';

interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
}

interface CartItem {
  product: Product;
  quantity: number;
}

const CATEGORIES: { label: Category; icon: keyof typeof Ionicons.glyphMap }[] = [
  { label: 'Fruits', icon: 'nutrition-outline' },
  { label: 'Meat', icon: 'flame-outline' },
  { label: 'Sweets', icon: 'ice-cream-outline' },
  { label: 'Drinks', icon: 'cafe-outline' },
];

const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Red Apple', price: 2.5, category: 'Fruits' },
  { id: '2', name: 'Banana', price: 3, category: 'Fruits' },
  { id: '3', name: 'Green Grapes', price: 4.2, category: 'Fruits' },
  { id: '4', name: 'Fresh Strawberry', price: 5.5, category: 'Fruits' },
  { id: '5', name: 'Sweet Peach', price: 3.8, category: 'Fruits' },
  { id: '6', name: 'Beef Steak', price: 14, category: 'Meat' },
  { id: '7', name: 'Chicken Fillet', price: 7.5, category: 'Meat' },
  { id: '8', name: 'Lamb Chops', price: 16.5, category: 'Meat' },
  { id: '9', name: 'Turkey Breast', price: 9.2, category: 'Meat' },
  { id: '10', name: 'Ground Beef', price: 11, category: 'Meat' },
  { id: '11', name: 'Dark Chocolate', price: 4, category: 'Sweets' },
  { id: '12', name: 'Honey Cake', price: 5.5, category: 'Sweets' },
  { id: '13', name: 'Pistachio Baklava', price: 8.5, category: 'Sweets' },
  { id: '14', name: 'Vanilla Croissant', price: 3.2, category: 'Sweets' },
  { id: '15', name: 'Caramel Tart', price: 4.8, category: 'Sweets' },
  { id: '16', name: 'Orange Juice', price: 3.5, category: 'Drinks' },
  { id: '17', name: 'Sparkling Water', price: 1.5, category: 'Drinks' },
  { id: '18', name: 'Iced Matcha Latte', price: 5, category: 'Drinks' },
  { id: '19', name: 'Cold Brew Coffee', price: 4.5, category: 'Drinks' },
  { id: '20', name: 'Pomegranate Juice', price: 4.2, category: 'Drinks' },
];

function formatPrice(value: number): string {
  return Number.isInteger(value) ? `${value}` : value.toFixed(2);
}

export default function SmartMarketScreen() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<Category>('Fruits');
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);

  const handleAddProduct = () => {
    const trimmedName = productName.trim();
    const parsedPrice = parseFloat(productPrice.replace(',', '.'));

    if (!trimmedName || isNaN(parsedPrice) || parsedPrice <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid product name and price.');
      return;
    }

    const newProduct: Product = {
      id: Date.now().toString(),
      name: trimmedName,
      price: parsedPrice,
      category: selectedCategory,
    };

    setProducts((prev) => [...prev, newProduct]);
    setProductName('');
    setProductPrice('');
  };

  const handleRemoveProduct = (id: string) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
    setCart((prev) => prev.filter((item) => item.product.id !== id));
  };

  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((i) => i.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      }
      return [...prev, { product, quantity: 1 }];
    });

    Alert.alert('Added to Cart', `${product.name} (${formatPrice(product.price)} AZN) added to cart.`);
  };

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const totalPrice = useMemo(
    () => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cart]
  );

  const sections = useMemo(() => {
    const filtered = products.filter((p) => p.category === selectedCategory);
    return [
      {
        title: selectedCategory,
        data: [filtered],
      },
    ];
  }, [products, selectedCategory]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />

      <View style={styles.contentWrapper}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Smart Market</Text>
            <Text style={styles.subtitle}>Curated daily pantry & fresh picks</Text>
          </View>
          <View style={styles.cartBadge}>
            <Ionicons name="bag-handle" size={18} color="#fbbf24" />
            <Text style={styles.cartText}>
              Cart: {totalItems} items / {formatPrice(totalPrice)} AZN
            </Text>
          </View>
        </View>

        <View style={styles.categoryWrapper}>
          <FlatList
            data={CATEGORIES}
            horizontal
            keyExtractor={(item) => item.label}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryRow}
            renderItem={({ item: { label, icon } }) => {
              const isActive = label === selectedCategory;
              return (
                <TouchableOpacity
                  style={[styles.categoryChip, isActive && styles.categoryChipActive]}
                  onPress={() => setSelectedCategory(label)}
                  activeOpacity={0.82}
                >
                  <Ionicons
                    name={icon}
                    size={16}
                    color={isActive ? '#181412' : '#d6cbbd'}
                  />
                  <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Add new item to {selectedCategory}</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, styles.nameInput]}
              placeholder="Product name..."
              placeholderTextColor="#8c7f73"
              value={productName}
              onChangeText={setProductName}
              returnKeyType="next"
            />
            <TextInput
              style={[styles.input, styles.priceInput]}
              placeholder="Price (AZN)"
              placeholderTextColor="#8c7f73"
              value={productPrice}
              onChangeText={setProductPrice}
              keyboardType="decimal-pad"
              returnKeyType="done"
              onSubmitEditing={handleAddProduct}
            />
            <TouchableOpacity
              style={styles.addBtn}
              onPress={handleAddProduct}
              activeOpacity={0.82}
            >
              <Ionicons name="add" size={22} color="#181412" />
            </TouchableOpacity>
          </View>
        </View>

        <SectionList
          sections={sections}
          keyExtractor={(_, index) => `section-row-${index}`}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <View style={styles.countPill}>
                <Text style={styles.sectionCount}>
                  {section.data[0]?.length ?? 0} items
                </Text>
              </View>
            </View>
          )}
          renderItem={({ item: rowProducts }) => (
            <View style={styles.gridContainer}>
              {rowProducts.length === 0 ? (
                <View style={styles.emptyBox}>
                  <Ionicons name="storefront-outline" size={44} color="#574d44" />
                  <Text style={styles.emptyText}>No products in this category yet.</Text>
                </View>
              ) : (
                rowProducts.map((product) => (
                  <View key={product.id} style={styles.card}>
                    <View>
                      <View style={styles.cardTop}>
                        <View style={styles.categoryTag}>
                          <Text style={styles.categoryTagText}>{product.category}</Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => handleRemoveProduct(product.id)}
                          style={styles.removeBtn}
                          activeOpacity={0.7}
                        >
                          <Ionicons name="trash-outline" size={18} color="#fb7185" />
                        </TouchableOpacity>
                      </View>

                      <Text style={styles.productName} numberOfLines={1}>
                        {product.name}
                      </Text>
                      <Text style={styles.productPrice}>{formatPrice(product.price)} AZN</Text>
                    </View>

                    <TouchableOpacity
                      style={styles.cartBtn}
                      onPress={() => handleAddToCart(product)}
                      activeOpacity={0.82}
                    >
                      <Ionicons name="add" size={18} color="#ecfdf5" />
                      <Text style={styles.cartBtnText}>+ Add</Text>
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </View>
          )}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#14110f',
    paddingTop: 36,
    paddingHorizontal: 16,
  },
  contentWrapper: {
    flex: 1,
    width: '100%',
    maxWidth: 1120,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 18,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#faf5ef',
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 13,
    color: '#a89b8e',
    marginTop: 3,
  },
  cartBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#231d19',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#f59e0b',
  },
  cartText: {
    color: '#fef3c7',
    fontSize: 13,
    fontWeight: '700',
  },
  categoryWrapper: {
    marginBottom: 16,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: '#211c18',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#382f28',
  },
  categoryChipActive: {
    backgroundColor: '#f59e0b',
    borderColor: '#fbbf24',
  },
  categoryText: {
    color: '#d6cbbd',
    fontWeight: '600',
    fontSize: 14,
  },
  categoryTextActive: {
    color: '#181412',
    fontWeight: '700',
  },
  formCard: {
    backgroundColor: '#1e1915',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#332b24',
    marginBottom: 20,
  },
  formTitle: {
    color: '#e7ddd3',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    backgroundColor: '#14110f',
    color: '#faf5ef',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#3a3028',
  },
  nameInput: {
    flex: 2.2,
  },
  priceInput: {
    flex: 1,
  },
  addBtn: {
    backgroundColor: '#f59e0b',
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 36,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#29221c',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#faf5ef',
  },
  countPill: {
    backgroundColor: '#231d19',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#382f28',
  },
  sectionCount: {
    fontSize: 12,
    color: '#c7b9aa',
    fontWeight: '600',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48.8%',
    backgroundColor: '#1e1915',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#332b24',
    justifyContent: 'space-between',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryTag: {
    backgroundColor: '#2b231d',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 8,
  },
  categoryTagText: {
    color: '#fbbf24',
    fontSize: 11,
    fontWeight: '700',
  },
  removeBtn: {
    padding: 4,
  },
  productName: {
    color: '#faf5ef',
    fontSize: 17,
    fontWeight: '700',
  },
  productPrice: {
    color: '#34d399',
    fontSize: 16,
    fontWeight: '800',
    marginTop: 6,
    marginBottom: 14,
  },
  cartBtn: {
    backgroundColor: '#059669',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
  },
  cartBtnText: {
    color: '#ecfdf5',
    fontWeight: '700',
    fontSize: 13,
  },
  emptyBox: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 52,
  },
  emptyText: {
    color: '#8c7f73',
    fontSize: 14,
    marginTop: 10,
  },
});