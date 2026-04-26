package com.shopease.controller;

import com.shopease.model.Order;
import com.shopease.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // GET all orders → /api/orders  (admin)
    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // GET one order → /api/orders/1
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    // GET orders by user → /api/orders/user/1
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getOrdersByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(orderService.getOrdersByUser(userId));
    }

    // GET orders by status → /api/orders/status/PENDING
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Order>> getOrdersByStatus(@PathVariable String status) {
        return ResponseEntity.ok(orderService.getOrdersByStatus(status));
    }

    // POST place order → /api/orders/place
    // Body: { "userId": 1, "shippingAddress": "...", "items": [{"productId":1,"quantity":2}] }
    @PostMapping("/place")
    public ResponseEntity<Order> placeOrder(@RequestBody Map<String, Object> request) {
        Long userId = Long.valueOf(request.get("userId").toString());
        String shippingAddress = request.get("shippingAddress").toString();
        List<Map<String, Object>> items = (List<Map<String, Object>>) request.get("items");
        Order order = orderService.placeOrder(userId, items, shippingAddress);
        return ResponseEntity.status(HttpStatus.CREATED).body(order);
    }

    // PUT update order status → /api/orders/1/status
    // Body: { "status": "CONFIRMED" }
    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, body.get("status")));
    }

    // DELETE (cancel) order → /api/orders/1/cancel
    @DeleteMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelOrder(@PathVariable Long id) {
        orderService.cancelOrder(id);
        return ResponseEntity.noContent().build();
    }
}
