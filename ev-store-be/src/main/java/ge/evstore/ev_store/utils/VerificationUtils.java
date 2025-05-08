package ge.evstore.ev_store.utils;

public class VerificationUtils {

    public static String generateVerificationCode(){
        // Generates a number between 100000 and 999999 (inclusive)
        return String.valueOf(100000 + new java.util.Random().nextInt(900000));
    }
}
