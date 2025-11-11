using Microsoft.AspNetCore.Http;
using server.Helpers;
using server.Services.Interfaces;
using System.Threading.Tasks;

namespace server.Middleware
{
    public class JwtMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly JwtHelper _jwtHelper;

        public JwtMiddleware(RequestDelegate next, JwtHelper jwtHelper)
        {
            _next = next;
            _jwtHelper = jwtHelper;
        }

        public async Task Invoke(HttpContext context, IUserService userService)
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

            if (token != null)
            {
                var principal = _jwtHelper.ValidateToken(token);
                if (principal != null)
                {
                    var userId = int.Parse(principal.FindFirst("id")?.Value ?? "0");
                    var user = await userService.GetByIdAsync(userId);
                    context.Items["User"] = user;
                }
            }

            await _next(context);
        }
    }
}