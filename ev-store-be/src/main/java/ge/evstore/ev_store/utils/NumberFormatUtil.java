package ge.evstore.ev_store.utils;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class NumberFormatUtil {

    private NumberFormatUtil() {
    }

    public static BigDecimal roundDouble(final double n) {
        final BigDecimal bd = new BigDecimal(n);
        return bd.setScale(2, RoundingMode.HALF_UP);
    }
}
