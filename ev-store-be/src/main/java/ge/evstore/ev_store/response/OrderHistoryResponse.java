package ge.evstore.ev_store.response;

import lombok.Data;

import java.util.List;

@Data
public class OrderHistoryResponse {
    private Long orderId;
    private String orderNumber;
    private String orderDate;
    private Double totalPrice;
    private List<OrderItemResponse> items;
}
