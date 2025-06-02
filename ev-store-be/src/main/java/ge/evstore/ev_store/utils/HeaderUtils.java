package ge.evstore.ev_store.utils;

import jakarta.servlet.http.HttpServletRequest;

public class HeaderUtils {

    public static String extractBearer(final HttpServletRequest request) {
        final String header = request.getHeader("Authorization");
        return (header != null && header.startsWith("Bearer ")) ? header.substring(7) : null;
    }
}
