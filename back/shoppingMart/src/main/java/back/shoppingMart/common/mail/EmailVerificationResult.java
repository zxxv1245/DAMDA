package back.shoppingMart.common.mail;

public class EmailVerificationResult {
    private boolean success;

    private EmailVerificationResult(boolean success) {
        this.success = success;
    }

    public static EmailVerificationResult of(boolean success) {
        return new EmailVerificationResult(success);
    }

    public boolean isSuccess() {
        return success;
    }

}