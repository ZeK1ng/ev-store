package ge.evstore.ev_store.response;

import ge.evstore.ev_store.entity.OrderItem;
import ge.evstore.ev_store.utils.NumberFormatUtil;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class OrderItemResponse {

    private String productNameGe;
    private String productNameEng;
    private String productNameRUS;
    private int quantity;
    private Double unitPrice;
    private BigDecimal totalPrice;

    public OrderItemResponse(final OrderItem orderItem) {
        this.productNameGe = orderItem.getProduct().getNameGE();
        this.productNameEng = orderItem.getProduct().getNameENG();
        this.productNameRUS = orderItem.getProduct().getNameRUS();
        this.quantity = orderItem.getQuantity();
        this.unitPrice = orderItem.getUnitPrice();
        this.totalPrice = NumberFormatUtil.roundDouble(orderItem.getTotalPrice());
    }
}
