package com.shopease.service;

import com.shopease.exception.ResourceNotFoundException;
import com.shopease.model.*;
import com.shopease.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private ProductService productService;

    // ✅ Get all orders
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // ✅ Get order by ID
    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
    }

    // ✅ Get orders by user
    public List<Order> getOrdersByUser(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    // ✅ Get orders by status
    public List<Order> getOrdersByStatus(String status) {
        return orderRepository.findByStatus(status);
    }

    // ✅ Place Order
    @Transactional
    public Order placeOrder(Long userId, List<Map<String, Object>> cartItems, String shippingAddress) {

        User user = userService.getUserById(userId);

        Order order = new Order();
        order.setUser(user);
        order.setShippingAddress(shippingAddress);
        order.setStatus("PLACED");

        BigDecimal total = BigDecimal.ZERO;

        for (Map<String, Object> item : cartItems) {

            Long productId = Long.valueOf(item.get("productId").toString());
            int quantity = Integer.parseInt(item.get("quantity").toString());

            Product product = productService.getProductById(productId);

            // Reduce stock
            productService.reduceStock(productId, quantity);

            // Create order item
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(quantity);
            orderItem.setPrice(product.getPrice());

            // Calculate total
            BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(quantity));
            total = total.add(itemTotal);
        }

        order.setTotalAmount(total);

        return orderRepository.save(order);
    }

    // ✅ Update order status (FIXED ERROR)
    public Order updateOrderStatus(Long id, String status) {
        Order order = getOrderById(id);
        order.setStatus(status);
        return orderRepository.save(order);
    }

    // ✅ Cancel order (FIXED ERROR)
    public void cancelOrder(Long id) {
        Order order = getOrderById(id);

        if (order.getStatus().equals("SHIPPED") || order.getStatus().equals("DELIVERED")) {
            throw new IllegalArgumentException("Cannot cancel this order");
        }

        order.setStatus("CANCELLED");
        orderRepository.save(order);
    }
}
// package com.shopease.service;

// import com.shopease.exception.ResourceNotFoundException;
// import com.shopease.model.*;
// import com.shopease.repository.OrderRepository;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;
// import org.springframework.transaction.annotation.Transactional;

// import java.math.BigDecimal;
// import java.util.List;
// import java.util.Map;

// @Service
// public class OrderService {

//     @Autowired
//     private OrderRepository orderRepository;

//     @Autowired
//     private UserService userService;

//     @Autowired
//     private ProductService productService;

//     public List<Order> getAllOrders() {
//         return orderRepository.findAll();
//     }

//     public Order getOrderById(Long id) {
//         return orderRepository.findById(id)
//                 .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
//     }

//     public List<Order> getOrdersByUser(Long userId) {
//         return orderRepository.findByUserId(userId);
//     }

//     public List<Order> getOrdersByStatus(String status) {
//         return orderRepository.findByStatus(status);
//     }

// @Transactional
// public Order placeOrder(Long userId, List<Map<String, Object>> cartItems, String shippingAddress) {

//     User user = userService.getUserById(userId);

//     Order order = new Order();
//     order.setUser(user);
//     order.setShippingAddress(shippingAddress);
//     order.setStatus("PLACED");

//     BigDecimal total = BigDecimal.ZERO;

//     // Process items
//     for (Map<String, Object> item : cartItems) {

//         Long productId = Long.valueOf(item.get("productId").toString());
//         int quantity = Integer.parseInt(item.get("quantity").toString());

//         Product product = productService.getProductById(productId);

//         productService.reduceStock(productId, quantity);

//         OrderItem orderItem = new OrderItem();
//         orderItem.setOrder(order);
//         orderItem.setProduct(product);
//         orderItem.setQuantity(quantity);
//         orderItem.setPrice(product.getPrice());

//         BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(quantity));
//         total = total.add(itemTotal);
//     }

//     // ✅ SET TOTAL BEFORE SAVE
//     order.setTotalAmount(total);

//     // ✅ SAVE ONLY ONCE (FINAL)
//     return orderRepository.save(order);
// }
// }
