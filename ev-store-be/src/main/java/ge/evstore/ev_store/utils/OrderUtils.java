package ge.evstore.ev_store.utils;

import java.util.Calendar;
import java.util.Random;


public class OrderUtils {
    private static final int SUFFIX_RANDOM_LENGTH = 6;

    public static String generateOrderNumber() {
        return "#ORD-" + getOrderDateSuffix();
    }

    public static String getOrderDateSuffix() {
        final Calendar calendar = Calendar.getInstance();
        final int i = calendar.get(Calendar.YEAR);
        final int i1 = calendar.get(Calendar.MONTH);
        final int i2 = calendar.get(Calendar.DATE);

        return i + "-" + i1 + "-" + i2 + "-" + generateRandomOrderSuffixString(SUFFIX_RANDOM_LENGTH);
    }

    public static String generateRandomOrderSuffixString(final int length) {
        final Random random = new Random();
        final StringBuilder sb = new StringBuilder();
        for (int i = 0; i < length; i++) {
            final int randomCharType = random.nextInt(3); // 0: digit, 1: lowercase, 2: uppercase
            final char randomChar = switch (randomCharType) {
                case 0 -> (char) (random.nextInt(10) + '0');
                case 1 -> (char) (random.nextInt(26) + 'a');
                case 2 -> (char) (random.nextInt(26) + 'A');
                default -> ' '; // Should not happen, added for safety
            };
            sb.append(randomChar);
        }
        return sb.toString();
    }
}
