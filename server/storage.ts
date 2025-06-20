import { 
  users, User, InsertUser, 
  stores, Store, InsertStore,
  products, Product, InsertProduct,
  chats, Chat, InsertChat,
  messages, Message, InsertMessage,
  sales, Sale, InsertSale,
  waste, Waste, InsertWaste,
  LoginData
} from "@shared/schema";

// Interface for Storage
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string, role: string): Promise<User | undefined>;
  getUserById(userId: string, role: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Store operations
  getStore(id: number): Promise<Store | undefined>;
  getStoresBySupplier(supplierId: number): Promise<Store[]>;
  createStore(store: InsertStore): Promise<Store>;
  
  // Product operations
  getProduct(id: number): Promise<Product | undefined>;
  getProductsByStatus(status: string, supplierId?: number, storeId?: number): Promise<Product[]>;
  getProductsByStore(storeId: number): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProductStatus(id: number, status: string): Promise<Product>;
  
  // Chat operations
  getChat(id: number): Promise<Chat | undefined>;
  getChatsBySupplier(supplierId: number): Promise<Chat[]>;
  getChatsByStoreManager(storeManagerId: number): Promise<Chat[]>;
  createChat(chat: InsertChat): Promise<Chat>;
  
  // Message operations
  getMessage(id: number): Promise<Message | undefined>;
  getMessagesByChat(chatId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessagesAsRead(chatId: number, userId: number): Promise<void>;
  
  // Sales operations
  getSalesByStore(storeId: number): Promise<Sale[]>;
  getSalesByCategoryAndStore(storeId: number): Promise<{ category: string, amount: number }[]>;
  createSale(sale: InsertSale): Promise<Sale>;
  
  // Waste operations
  getWasteByStore(storeId: number): Promise<Waste[]>;
  createWaste(waste: InsertWaste): Promise<Waste>;
  
  // Dashboard stats
  getStoreManagerStats(storeId: number): Promise<{
    totalSales: number;
    inventoryValue: number;
    wasteValue: number;
    activeSupplierOrders: number;
  }>;
  
  getSupplierStats(supplierId: number): Promise<{
    totalRequestedProducts: number;
    totalInTransitProducts: number;
    totalDelayedProducts: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private stores: Map<number, Store>;
  private products: Map<number, Product>;
  private chats: Map<number, Chat>;
  private messages: Map<number, Message>;
  private sales: Map<number, Sale>;
  private wastes: Map<number, Waste>;
  
  private currentUserId: number;
  private currentStoreId: number;
  private currentProductId: number;
  private currentChatId: number;
  private currentMessageId: number;
  private currentSaleId: number;
  private currentWasteId: number;

  constructor() {
    this.users = new Map();
    this.stores = new Map();
    this.products = new Map();
    this.chats = new Map();
    this.messages = new Map();
    this.sales = new Map();
    this.wastes = new Map();
    
    this.currentUserId = 1;
    this.currentStoreId = 1;
    this.currentProductId = 1;
    this.currentChatId = 1;
    this.currentMessageId = 1;
    this.currentSaleId = 1;
    this.currentWasteId = 1;
    
    // Seed some initial data
    this.seedData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string, role: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email && user.role === role
    );
  }

  async getUserById(userId: string, role: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === userId && user.role === role
    );
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...userData, id, lastLogin: new Date() };
    this.users.set(id, user);
    return user;
  }

  // Store operations
  async getStore(id: number): Promise<Store | undefined> {
    return this.stores.get(id);
  }

  async getStoresBySupplier(supplierId: number): Promise<Store[]> {
    // In a real application, this would filter based on a relationship between suppliers and stores
    // For this prototype, we'll return all stores
    return Array.from(this.stores.values());
  }

  async createStore(store: InsertStore): Promise<Store> {
    const id = this.currentStoreId++;
    const newStore: Store = { ...store, id };
    this.stores.set(id, newStore);
    return newStore;
  }

  // Product operations
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByStatus(status: string, supplierId?: number, storeId?: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => {
      let match = product.status === status;
      if (supplierId !== undefined) match = match && product.supplierId === supplierId;
      if (storeId !== undefined) match = match && product.storeId === storeId;
      return match;
    });
  }

  async getProductsByStore(storeId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.storeId === storeId
    );
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const newProduct: Product = { ...product, id };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async updateProductStatus(id: number, status: string): Promise<Product> {
    const product = this.products.get(id);
    if (!product) throw new Error(`Product with ID ${id} not found`);
    
    const updatedProduct: Product = { ...product, status };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  // Chat operations
  async getChat(id: number): Promise<Chat | undefined> {
    return this.chats.get(id);
  }

  async getChatsBySupplier(supplierId: number): Promise<Chat[]> {
    return Array.from(this.chats.values()).filter(
      (chat) => chat.supplierId === supplierId
    );
  }

  async getChatsByStoreManager(storeManagerId: number): Promise<Chat[]> {
    return Array.from(this.chats.values()).filter(
      (chat) => chat.storeManagerId === storeManagerId
    );
  }

  async createChat(chat: InsertChat): Promise<Chat> {
    const id = this.currentChatId++;
    const newChat: Chat = { ...chat, id };
    this.chats.set(id, newChat);
    return newChat;
  }

  // Message operations
  async getMessage(id: number): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async getMessagesByChat(chatId: number): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter((message) => message.chatId === chatId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const id = this.currentMessageId++;
    const newMessage: Message = { ...message, id };
    this.messages.set(id, newMessage);
    
    // Update the chat's last message time and unread count
    const chat = await this.getChat(message.chatId);
    if (chat) {
      const updatedChat: Chat = { 
        ...chat, 
        lastMessageTime: message.timestamp,
        unreadCount: chat.unreadCount + 1
      };
      this.chats.set(chat.id, updatedChat);
    }
    
    return newMessage;
  }

  async markMessagesAsRead(chatId: number, userId: number): Promise<void> {
    // Mark all messages in this chat as read for this user
    const chat = await this.getChat(chatId);
    if (!chat) return;
    
    const chatMessages = await this.getMessagesByChat(chatId);
    chatMessages.forEach(message => {
      if (message.senderId !== userId && !message.isRead) {
        const updatedMessage: Message = { ...message, isRead: true };
        this.messages.set(message.id, updatedMessage);
      }
    });
    
    // Reset unread count
    const updatedChat: Chat = { ...chat, unreadCount: 0 };
    this.chats.set(chatId, updatedChat);
  }

  // Sales operations
  async getSalesByStore(storeId: number): Promise<Sale[]> {
    return Array.from(this.sales.values()).filter(
      (sale) => sale.storeId === storeId
    );
  }

  async getSalesByCategoryAndStore(storeId: number): Promise<{ category: string, amount: number }[]> {
    const storeSales = await this.getSalesByStore(storeId);
    const categorySales = new Map<string, number>();
    
    storeSales.forEach(sale => {
      const currentAmount = categorySales.get(sale.category) || 0;
      categorySales.set(sale.category, currentAmount + sale.amount);
    });
    
    return Array.from(categorySales.entries()).map(([category, amount]) => ({
      category,
      amount
    }));
  }

  async createSale(sale: InsertSale): Promise<Sale> {
    const id = this.currentSaleId++;
    const newSale: Sale = { ...sale, id };
    this.sales.set(id, newSale);
    return newSale;
  }

  // Waste operations
  async getWasteByStore(storeId: number): Promise<Waste[]> {
    return Array.from(this.wastes.values())
      .filter((waste) => waste.storeId === storeId)
      .sort((a, b) => {
        // Sort by year and then by month
        if (a.year !== b.year) return a.year - b.year;
        
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months.indexOf(a.month) - months.indexOf(b.month);
      });
  }

  async createWaste(waste: InsertWaste): Promise<Waste> {
    const id = this.currentWasteId++;
    const newWaste: Waste = { ...waste, id };
    this.wastes.set(id, newWaste);
    return newWaste;
  }

  // Dashboard stats
  async getStoreManagerStats(storeId: number): Promise<{
    totalSales: number;
    inventoryValue: number;
    wasteValue: number;
    activeSupplierOrders: number;
  }> {
    const storeSales = await this.getSalesByStore(storeId);
    const totalSales = storeSales.reduce((sum, sale) => sum + sale.amount, 0);
    
    const storeWastes = await this.getWasteByStore(storeId);
    const wasteValue = storeWastes.reduce((sum, waste) => sum + waste.amount, 0);
    
    const storeProducts = await this.getProductsByStore(storeId);
    const inventoryValue = storeProducts.length * 10000; // Simplified calculation
    
    const activeOrders = storeProducts.filter(
      product => product.status === "requested" || product.status === "in_transit"
    ).length;
    
    return {
      totalSales,
      inventoryValue,
      wasteValue,
      activeSupplierOrders: activeOrders
    };
  }

  async getSupplierStats(supplierId: number): Promise<{
    totalRequestedProducts: number;
    totalInTransitProducts: number;
    totalDelayedProducts: number;
  }> {
    const requestedProducts = await this.getProductsByStatus("requested", supplierId);
    const inTransitProducts = await this.getProductsByStatus("in_transit", supplierId);
    const delayedProducts = await this.getProductsByStatus("delayed", supplierId);
    
    return {
      totalRequestedProducts: requestedProducts.length,
      totalInTransitProducts: inTransitProducts.length,
      totalDelayedProducts: delayedProducts.length
    };
  }

  // Seed data for demo purposes
  private seedData() {
    // Seed users with 10-digit IDs for login
    const users: InsertUser[] = [
      {
        username: '1234567890',
        password: 'password123',
        email: 'store@example.com',
        role: 'storeManager',
        companyName: 'Walmart',
        storeId: 1
      },
      {
        username: '9876543210',
        password: 'password123',
        email: 'supplier@example.com',
        role: 'supplier',
        companyName: 'Fresh Farms Inc.',
        storeId: null
      }
    ];
    
    users.forEach(user => {
      const id = this.currentUserId++;
      const newUser: User = { 
        ...user, 
        id, 
        lastLogin: new Date(),
        profileImage: user.role === 'storeManager' 
          ? 'https://randomuser.me/api/portraits/men/32.jpg'
          : 'https://randomuser.me/api/portraits/men/43.jpg'
      };
      this.users.set(id, newUser);
    });
    
    // Seed stores
    const stores: InsertStore[] = [
      {
        name: 'Store #1423 - Central Mall',
        location: 'Dallas, TX',
        address: '123 Central Mall Ave, Dallas, TX 75001',
        contactPhone: '(214) 555-1234',
        deliverySchedule: 'Mon, Wed, Fri (8am-12pm)',
        lastDelivery: new Date('2023-02-28'),
        managerId: 1
      },
      {
        name: 'Store #2048 - Westside Plaza',
        location: 'Houston, TX',
        address: '456 Westside Dr, Houston, TX 77001',
        contactPhone: '(713) 555-5678',
        deliverySchedule: 'Tue, Thu, Sat (9am-1pm)',
        lastDelivery: new Date('2023-02-27'),
        managerId: 1
      },
      {
        name: 'Store #3476 - North County',
        location: 'San Antonio, TX',
        address: '789 North County Rd, San Antonio, TX 78201',
        contactPhone: '(210) 555-9012',
        deliverySchedule: 'Mon, Thu (10am-2pm)',
        lastDelivery: new Date('2023-02-26'),
        managerId: 1
      },
      {
        name: 'Store #5892 - Eastside Market',
        location: 'Austin, TX',
        address: '321 Eastside Blvd, Austin, TX 73301',
        contactPhone: '(512) 555-3456',
        deliverySchedule: 'Wed, Fri (7am-11am)',
        lastDelivery: new Date('2023-02-28'),
        managerId: 1
      }
    ];
    
    stores.forEach(store => {
      const id = this.currentStoreId++;
      this.stores.set(id, { ...store, id });
    });
    
    // Seed products with different statuses
    const products: InsertProduct[] = [
      {
        name: 'Organic Bananas (5lb)',
        category: 'Produce',
        supplierId: 2,
        quantity: 20,
        status: 'requested',
        requestDate: new Date(),
        deliveryDate: null,
        storeId: 1
      },
      {
        name: 'Fresh Tomatoes (10lb)',
        category: 'Produce',
        supplierId: 2,
        quantity: 15,
        status: 'requested',
        requestDate: new Date(),
        deliveryDate: null,
        storeId: 3
      },
      {
        name: 'Organic Spinach (2lb)',
        category: 'Produce',
        supplierId: 2,
        quantity: 25,
        status: 'requested',
        requestDate: new Date(),
        deliveryDate: null,
        storeId: 4
      },
      {
        name: 'Strawberries (16oz)',
        category: 'Produce',
        supplierId: 2,
        quantity: 30,
        status: 'requested',
        requestDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
        deliveryDate: null,
        storeId: 2
      },
      {
        name: 'Fresh Apples (5lb)',
        category: 'Produce',
        supplierId: 2,
        quantity: 15,
        status: 'in_transit',
        requestDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        deliveryDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        storeId: 1
      },
      {
        name: 'Whole Grain Bread',
        category: 'Bakery',
        supplierId: 2,
        quantity: 40,
        status: 'in_transit',
        requestDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        deliveryDate: new Date(Date.now() + 12 * 60 * 60 * 1000),
        storeId: 1
      },
      {
        name: 'Organic Milk (1gal)',
        category: 'Dairy',
        supplierId: 2,
        quantity: 25,
        status: 'delayed',
        requestDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        storeId: 1
      },
      {
        name: 'Great Value Eggs (18ct)',
        category: 'Dairy',
        supplierId: 2,
        quantity: 30,
        status: 'delayed',
        requestDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        deliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        storeId: 4
      }
    ];
    
    // Add more products to reach the stats in the UI
    for (let i = 0; i < 16; i++) {
      const statusType = i % 3;
      const status = statusType === 0 ? 'requested' : (statusType === 1 ? 'in_transit' : 'delayed');
      const storeId = (i % 4) + 1;
      
      products.push({
        name: `Additional Product ${i + 1}`,
        category: ['Produce', 'Bakery', 'Dairy', 'Meat', 'Food'][i % 5],
        supplierId: 2,
        quantity: 10 + i,
        status,
        requestDate: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000),
        deliveryDate: status !== 'requested' ? new Date(Date.now() + (i + 1) * 12 * 60 * 60 * 1000) : null,
        storeId
      });
    }
    
    products.forEach(product => {
      const id = this.currentProductId++;
      this.products.set(id, { ...product, id });
    });
    
    // Seed chats between supplier and store managers
    const chats: InsertChat[] = [
      {
        supplierId: 2,
        storeManagerId: 1,
        lastMessageTime: new Date(),
        unreadCount: 2
      },
      {
        supplierId: 2,
        storeManagerId: 1,
        lastMessageTime: new Date(Date.now() - 1 * 60 * 60 * 1000),
        unreadCount: 1
      },
      {
        supplierId: 2,
        storeManagerId: 1,
        lastMessageTime: new Date(Date.now() - 3 * 60 * 60 * 1000),
        unreadCount: 0
      },
      {
        supplierId: 2,
        storeManagerId: 1,
        lastMessageTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
        unreadCount: 0
      }
    ];
    
    chats.forEach(chat => {
      const id = this.currentChatId++;
      this.chats.set(id, { ...chat, id });
    });
    
    // Seed messages
    const messages: InsertMessage[] = [
      // Chat 1 messages
      {
        chatId: 1,
        senderId: 2,
        content: "We'll need to delay the produce delivery due to transportation issues. Can we reschedule for tomorrow?",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        isRead: false
      },
      {
        chatId: 1,
        senderId: 1,
        content: "That's very short notice. We're running low on several produce items already.",
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
        isRead: true
      },
      {
        chatId: 1,
        senderId: 2,
        content: "I understand. We can dispatch a partial order with the critical items today if that helps?",
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        isRead: false
      },
      
      // Chat 2 messages
      {
        chatId: 2,
        senderId: 2,
        content: "Hi there, we have a new organic product line launching next week. Would you like to place a pre-order?",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        isRead: false
      },
      {
        chatId: 2,
        senderId: 1,
        content: "That sounds interesting. Can you send me the product catalog and pricing details?",
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        isRead: true
      },
      {
        chatId: 2,
        senderId: 2,
        content: "Sure, I'll send it over right away. Also, we're offering a 15% discount for early adopters.",
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        isRead: false
      },
      
      // Chat 3 messages
      {
        chatId: 3,
        senderId: 1,
        content: "Our refrigeration unit is acting up. We might need to postpone tomorrow's dairy delivery.",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        isRead: true
      },
      {
        chatId: 3,
        senderId: 2,
        content: "Thanks for letting me know. Is there anything we can do to help from our end?",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        isRead: true
      },
      {
        chatId: 3,
        senderId: 1,
        content: "We've got a repair team coming in today. I'll update you once we know more.",
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        isRead: true
      },
      
      // Chat 4 messages
      {
        chatId: 4,
        senderId: 2,
        content: "Just checking in about the seasonal products rotation. Are you ready for the summer items?",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        isRead: true
      },
      {
        chatId: 4,
        senderId: 1,
        content: "Yes, we've cleared space in the front displays. We can take the first delivery next Monday.",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        isRead: true
      },
      {
        chatId: 4,
        senderId: 2,
        content: "Perfect! I'll schedule it. By the way, the tropical fruits have been exceptional this season.",
        timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000),
        isRead: true
      }
    ];
    
    messages.forEach(message => {
      const id = this.currentMessageId++;
      this.messages.set(id, { ...message, id });
    });
    
    // Seed sales data by category
    const categories = ['Food', 'Bakery', 'Dairy', 'Produce', 'Meat', 'Other'];
    const salesData = [128450, 102760, 92400, 76300, 61200, 51000];
    
    categories.forEach((category, index) => {
      const sale: InsertSale = {
        storeId: 1,
        category,
        amount: salesData[index],
        date: new Date()
      };
      
      const id = this.currentSaleId++;
      this.sales.set(id, { ...sale, id });
    });
    
    // Seed waste data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const wasteValues = [4200, 4800, 5100, 4900, 5300, 5245];
    
    months.forEach((month, index) => {
      const waste: InsertWaste = {
        storeId: 1,
        amount: wasteValues[index],
        month,
        year: 2023
      };
      
      const id = this.currentWasteId++;
      this.wastes.set(id, { ...waste, id });
    });
  }
}

export const storage = new MemStorage();
