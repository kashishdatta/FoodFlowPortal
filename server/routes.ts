import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, insertProductSchema, insertMessageSchema, 
  LoginData, User
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Login endpoint
  app.post("/api/login", async (req: Request, res: Response) => {
    try {
      const { userId, password, role } = req.body as LoginData;
      
      if (!userId || !password || !role) {
        return res.status(400).json({ message: "User ID, password, and role are required" });
      }
      
      const user = await storage.getUserById(userId, role);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Don't send password to client
      const { password: _, ...userWithoutPassword } = user;
      
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  // User endpoints
  app.get("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't send password to client
      const { password, ...userWithoutPassword } = user;
      
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error("Get user error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  // Store endpoints
  app.get("/api/stores/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const store = await storage.getStore(id);
      
      if (!store) {
        return res.status(404).json({ message: "Store not found" });
      }
      
      return res.status(200).json(store);
    } catch (error) {
      console.error("Get store error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/suppliers/:supplierId/stores", async (req: Request, res: Response) => {
    try {
      const supplierId = parseInt(req.params.supplierId);
      const stores = await storage.getStoresBySupplier(supplierId);
      
      return res.status(200).json(stores);
    } catch (error) {
      console.error("Get supplier stores error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  // Product endpoints
  app.get("/api/products/status/:status", async (req: Request, res: Response) => {
    try {
      const { status } = req.params;
      const supplierId = req.query.supplierId ? parseInt(req.query.supplierId as string) : undefined;
      const storeId = req.query.storeId ? parseInt(req.query.storeId as string) : undefined;
      
      const products = await storage.getProductsByStatus(status, supplierId, storeId);
      
      return res.status(200).json(products);
    } catch (error) {
      console.error("Get products by status error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/stores/:storeId/products", async (req: Request, res: Response) => {
    try {
      const storeId = parseInt(req.params.storeId);
      const products = await storage.getProductsByStore(storeId);
      
      return res.status(200).json(products);
    } catch (error) {
      console.error("Get store products error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/products", async (req: Request, res: Response) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      
      return res.status(201).json(product);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      console.error("Create product error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  app.patch("/api/products/:id/status", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      
      const product = await storage.updateProductStatus(id, status);
      
      return res.status(200).json(product);
    } catch (error) {
      console.error("Update product status error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  // Chat endpoints
  app.get("/api/suppliers/:supplierId/chats", async (req: Request, res: Response) => {
    try {
      const supplierId = parseInt(req.params.supplierId);
      const chats = await storage.getChatsBySupplier(supplierId);
      
      // Enhance chats with user info
      const enhancedChats = await Promise.all(chats.map(async (chat) => {
        const storeManager = await storage.getUser(chat.storeManagerId);
        return {
          ...chat,
          storeManager: storeManager ? {
            id: storeManager.id,
            username: storeManager.username,
            profileImage: storeManager.profileImage,
            storeId: storeManager.storeId
          } : null
        };
      }));
      
      return res.status(200).json(enhancedChats);
    } catch (error) {
      console.error("Get supplier chats error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/store-managers/:storeManagerId/chats", async (req: Request, res: Response) => {
    try {
      const storeManagerId = parseInt(req.params.storeManagerId);
      const chats = await storage.getChatsByStoreManager(storeManagerId);
      
      // Enhance chats with user info
      const enhancedChats = await Promise.all(chats.map(async (chat) => {
        const supplier = await storage.getUser(chat.supplierId);
        return {
          ...chat,
          supplier: supplier ? {
            id: supplier.id,
            username: supplier.username,
            companyName: supplier.companyName,
            profileImage: supplier.profileImage
          } : null
        };
      }));
      
      return res.status(200).json(enhancedChats);
    } catch (error) {
      console.error("Get store manager chats error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/chats/:chatId/messages", async (req: Request, res: Response) => {
    try {
      const chatId = parseInt(req.params.chatId);
      const messages = await storage.getMessagesByChat(chatId);
      
      return res.status(200).json(messages);
    } catch (error) {
      console.error("Get chat messages error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/chats/:chatId/messages", async (req: Request, res: Response) => {
    try {
      const chatId = parseInt(req.params.chatId);
      const messageData = insertMessageSchema.parse({
        ...req.body,
        chatId,
        timestamp: new Date()
      });
      
      const message = await storage.createMessage(messageData);
      
      return res.status(201).json(message);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      console.error("Create message error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/chats/:chatId/read", async (req: Request, res: Response) => {
    try {
      const chatId = parseInt(req.params.chatId);
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      
      await storage.markMessagesAsRead(chatId, userId);
      
      return res.status(200).json({ message: "Messages marked as read" });
    } catch (error) {
      console.error("Mark messages as read error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  // Sales endpoints
  app.get("/api/stores/:storeId/sales/by-category", async (req: Request, res: Response) => {
    try {
      const storeId = parseInt(req.params.storeId);
      const sales = await storage.getSalesByCategoryAndStore(storeId);
      
      return res.status(200).json(sales);
    } catch (error) {
      console.error("Get sales by category error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  // Waste endpoints
  app.get("/api/stores/:storeId/waste", async (req: Request, res: Response) => {
    try {
      const storeId = parseInt(req.params.storeId);
      const waste = await storage.getWasteByStore(storeId);
      
      return res.status(200).json(waste);
    } catch (error) {
      console.error("Get waste error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  // Dashboard stats
  app.get("/api/store-managers/:storeId/stats", async (req: Request, res: Response) => {
    try {
      const storeId = parseInt(req.params.storeId);
      const stats = await storage.getStoreManagerStats(storeId);
      
      return res.status(200).json(stats);
    } catch (error) {
      console.error("Get store manager stats error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/suppliers/:supplierId/stats", async (req: Request, res: Response) => {
    try {
      const supplierId = parseInt(req.params.supplierId);
      const stats = await storage.getSupplierStats(supplierId);
      
      return res.status(200).json(stats);
    } catch (error) {
      console.error("Get supplier stats error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
