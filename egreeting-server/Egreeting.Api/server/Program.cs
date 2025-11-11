using Microsoft.EntityFrameworkCore;
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

var builder = WebApplication.CreateBuilder(args);

// ===== Read config from environment =====
var jwtKey = Environment.GetEnvironmentVariable("JWT_KEY")!;
var jwtIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER")!;
var jwtAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE")!;
var jwtDuration = int.Parse(Environment.GetEnvironmentVariable("JWT_DURATION")!);

var dbConnection = Environment.GetEnvironmentVariable("EGREETING_DB_CONNECTION")!;

// ===== Add controllers & Swagger =====
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ===== Database configuration =====
builder.Services.AddDbContext<EGreetingDbContext>(options =>
    options.UseSqlServer(dbConnection));

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

// ===== JWT Helper =====
builder.Services.AddSingleton(new JwtHelper(jwtKey, jwtDuration));

// ===== Build app =====
var app = builder.Build();

// ===== Swagger (dev only) =====
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStaticFiles();
app.UseHttpsRedirection();

// ===== JWT Middleware =====
app.UseMiddleware<JwtMiddleware>();

// ===== Map Controllers =====
app.MapControllers();

// ===== Run =====
app.Run();
