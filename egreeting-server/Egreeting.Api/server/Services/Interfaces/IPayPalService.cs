public interface IPayPalService
{
    Task<string> CreatePayment(decimal amount, string returnUrl, string cancelUrl);
    Task<bool> CapturePayment(string token);
}
