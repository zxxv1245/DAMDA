package back.shoppingMart.discount.entity;

public enum DiscountType {
    NONE,
    TEN,
    THIRTY,
    HALF;

    public String getDiscountValue() {
        switch (this) {
            case TEN:
                return "10";
            case THIRTY:
                return "30";
            case HALF:
                return "50";
            default:
                return "0";
        }
    }
}