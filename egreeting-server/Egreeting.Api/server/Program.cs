using DotNetEnv;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using server.Models;
using server.Repositories.Interfaces;
using server.Repositories.Implementations;
using server.Services.Interfaces;
using server.Services.Implementations;

var builder = WebApplication.CreateBuilder(args);

// ==============================
// Load environment variables
// ==============================
Env.Load();

var connectionString = Environment.GetEnvironmentVariable("CONNECTION_STRING");
if (string.IsNullOrEmpty(connectionString))
{
    throw new Exception("⚠️ Missing CONNECTION_STRING in .env file!");
}

var allowedOrigins = Environment.GetEnvironmentVariable("ALLOWED_ORIGINS") ?? "";
var originsArray = allowedOrigins
    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

// ==============================
// Database Context
// ==============================
builder.Services.AddDbContext<EGreetingDbContext>(options =>
    options.UseSqlServer(connectionString));

// ==============================
// Dependency Injection
// ==============================

// Base generic repository/service
builder.Services.AddScoped(typeof(IBaseRepository<>), typeof(BaseRepository<>));
builder.Services.AddScoped(typeof(IBaseService<>), typeof(BaseService<>));


// Example for specific entity (register all your custom repositories & services here)
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IFeedbackRepository, FeedbackRepository>();
builder.Services.AddScoped<IFeedbackService, FeedbackService>();


// ==============================
// CORS Configuration
// ==============================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        if (originsArray.Length > 0)
        {
            policy.WithOrigins(originsArray)
                .AllowAnyHeader()
                .AllowAnyMethod();
        }
        else
        {
            // fallback for local dev
            policy.AllowAnyOrigin()
                .AllowAnyHeader()
                .AllowAnyMethod();
        }
    });
});

// ==============================
// Controllers + Swagger
// ==============================
builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "E-Greeting API",
        Version = "v1",
        Description = "RESTful API for E-Greeting platform using .NET 8 and SQL Server"
    });
});

// ==============================
// Build the app
// ==============================
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ==============================
// Middlewares
// ==============================
app.UseCors("AllowReactApp");
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
