package ge.evstore.ev_store.response;

import ge.evstore.ev_store.entity.OrderItem;
import lombok.Data;

@Data
public class OrderItemResponse {

    private String productNameGe;
    private String productNameEng;
    private String productNameRUS;
    private int quantity;
    private Double unitPrice;
    private Double totalPrice;

    public OrderItemResponse(final OrderItem orderItem) {
        this.productNameGe = orderItem.getProduct().getNameGE();
        this.productNameEng = orderItem.getProduct().getNameENG();
        this.productNameRUS = orderItem.getProduct().getNameRUS();
        this.quantity = orderItem.getQuantity();
        this.unitPrice = orderItem.getUnitPrice();
        this.totalPrice = orderItem.getTotalPrice();
    }
}
