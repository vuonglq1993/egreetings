using PayPalCheckoutSdk.Core;
using PayPalCheckoutSdk.Orders;

public class PayPalService : IPayPalService
{
    private readonly PayPalHttpClient _client;

    public PayPalService()
    {
        var clientId = Environment.GetEnvironmentVariable("PAYPAL_CLIENT_ID")
                      ?? throw new Exception("PAYPAL_CLIENT_ID missing");

        var secret = Environment.GetEnvironmentVariable("PAYPAL_SECRET")
                    ?? throw new Exception("PAYPAL_SECRET missing");

        var mode = Environment.GetEnvironmentVariable("PAYPAL_MODE") ?? "sandbox";

        PayPalEnvironment env =
            mode == "live"
            ? new LiveEnvironment(clientId, secret)
            : new SandboxEnvironment(clientId, secret);

        _client = new PayPalHttpClient(env);
    }

    public async Task<string> CreatePayment(decimal amount, string returnUrl, string cancelUrl)
    {
        var order = new OrderRequest
        {
            CheckoutPaymentIntent = "CAPTURE",
            PurchaseUnits = new List<PurchaseUnitRequest>
            {
                new PurchaseUnitRequest
                {
                    AmountWithBreakdown = new AmountWithBreakdown
                    {
                        CurrencyCode = "USD",
                        Value = amount.ToString("F2")
                    }
                }
            },
            ApplicationContext = new ApplicationContext
            {
                ReturnUrl = returnUrl,
                CancelUrl = cancelUrl,
                UserAction = "PAY_NOW"
            }
        };

        var req = new OrdersCreateRequest();
        req.Prefer("return=representation");
        req.RequestBody(order);

        var response = await _client.Execute(req);
        var result = response.Result<Order>();

        return result.Links.First(x => x.Rel == "approve").Href;
    }

    public async Task<bool> CapturePayment(string token)
    {
        var req = new OrdersCaptureRequest(token);
        req.RequestBody(new OrderActionRequest());

        var response = await _client.Execute(req);
        var result = response.Result<Order>();

        return result.Status == "COMPLETED";
    }
}
