package ge.evstore.ev_store.response;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderHistoryResponse {
    private Long orderId;
    private String orderNumber;
    private LocalDateTime orderDate;
    private BigDecimal totalPrice;
    private List<OrderItemResponse> items;
}
