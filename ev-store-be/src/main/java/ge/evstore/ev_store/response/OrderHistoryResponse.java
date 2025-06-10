package ge.evstore.ev_store.response;

import ge.evstore.ev_store.entity.Order;
import ge.evstore.ev_store.entity.OrderItem;
import ge.evstore.ev_store.entity.OrderStatus;
import ge.evstore.ev_store.utils.NumberFormatUtil;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Slf4j
public class OrderHistoryResponse {
    private Long orderId;
    private String orderNumber;
    private LocalDateTime orderDate;
    private BigDecimal totalPrice;
    private List<OrderItemResponse> items;
    private OrderStatus orderStatus;

    public static OrderHistoryResponse createFrom(final Order order){
        log.info("Creating order history for order {}", order.getOrderNumber());
        final OrderHistoryResponse orderHistoryResponse = new OrderHistoryResponse();
        orderHistoryResponse.setOrderNumber(order.getOrderNumber());
        orderHistoryResponse.setOrderDate(order.getOrderDate());
        orderHistoryResponse.setTotalPrice(NumberFormatUtil.roundDouble(order.getTotalPrice()));
        orderHistoryResponse.setOrderId(order.getId());
        orderHistoryResponse.setOrderStatus(order.getStatus());
        final List<OrderItemResponse> orderItemResponses = new ArrayList<>();
        final List<OrderItem> items = order.getItems();
        for (final OrderItem orderItem : items) {
            orderItemResponses.add(new OrderItemResponse(orderItem));
        }
        orderHistoryResponse.setItems(orderItemResponses);
        return orderHistoryResponse;
    }
}
