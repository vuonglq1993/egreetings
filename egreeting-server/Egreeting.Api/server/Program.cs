using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

using System.Text; 
using server.Helpers;
using server.Models;
using server.Repositories.Interfaces;
using server.Repositories.Implementations;
using server.Services.Interfaces;
using server.Services.Implementations;
using server.Middleware;
using DotNetEnv;
using server.Repositories;
using server.Services;

// ===== Load .env =====
DotNetEnv.Env.Load();

// ===== Read configuration from environment =====
var builder = WebApplication.CreateBuilder(args);

// ----- JWT Config -----
var jwtKey = Environment.GetEnvironmentVariable("JWT_KEY") ?? throw new ArgumentException("JWT_KEY missing");
var key = Encoding.UTF8.GetBytes(jwtKey); 

var jwtIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER") ?? "EGreetingAPI";
var jwtAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? "EGreetingClient";
var jwtDuration = int.TryParse(Environment.GetEnvironmentVariable("JWT_DURATION"), out var minutes) ? minutes : 1440;

// ----- Database -----
var dbConnection = Environment.GetEnvironmentVariable("EGREETING_DB_CONNECTION") 
                   ?? throw new ArgumentException("EGREETING_DB_CONNECTION missing");

// ----- Allowed origins -----
var allowedOrigins = Environment.GetEnvironmentVariable("ALLOWED_ORIGINS")?
    .Split(',', StringSplitOptions.RemoveEmptyEntries) ?? Array.Empty<string>();

// ===== Add services =====
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ===== EF Core DbContext =====
builder.Services.AddDbContext<EGreetingDbContext>(options =>
    options.UseSqlServer(dbConnection)
);

// ===== CORS =====
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// ===== Base Repositories & Services (generic) =====
builder.Services.AddScoped(typeof(IBaseRepository<>), typeof(BaseRepository<>));
builder.Services.AddScoped(typeof(IBaseService<>), typeof(BaseService<>));

// ===== Specific Repositories =====
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IFeedbackRepository, FeedbackRepository>();
builder.Services.AddScoped<IPackageRepository, PackageRepository>();
builder.Services.AddScoped<IReportRepository, ReportRepository>();
builder.Services.AddScoped<ISubscriptionRepository, SubscriptionRepository>();
builder.Services.AddScoped<ISubscriptionRecipientRepository, SubscriptionRecipientRepository>();
builder.Services.AddScoped<ITemplateRepository, TemplateRepository>();
builder.Services.AddScoped<ITransactionRepository, TransactionRepository>();

// ===== Specific Services =====
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IFeedbackService, FeedbackService>();
builder.Services.AddScoped<IPackageService, PackageService>();
builder.Services.AddScoped<IReportService, ReportService>();
builder.Services.AddScoped<ISubscriptionService, SubscriptionService>();
builder.Services.AddScoped<ISubscriptionRecipientService, SubscriptionRecipientService>();
builder.Services.AddScoped<ITemplateService, TemplateService>();
builder.Services.AddScoped<ITransactionService, TransactionService>();

builder.Services.AddScoped<IPayPalService, PayPalService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddHttpClient();


builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtIssuer,
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };
});
// ===== JWT Helper (inject IConfiguration via factory) =====
builder.Services.AddSingleton<JwtHelper>(sp =>
{
    return new JwtHelper(new ConfigurationBuilder().AddEnvironmentVariables().Build());
});

// ===== Build App =====
var app = builder.Build();



// ===== Middleware =====
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
// ===== CORS =====
app.UseCors("AllowFrontend");
// ===== JWT Middleware =====
app.UseMiddleware<JwtMiddleware>();

// ===== Map Controllers =====
app.MapControllers();

// ===== Run App =====
app.Run();
