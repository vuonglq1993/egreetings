using Microsoft.EntityFrameworkCore;

using server.Models;
using server.Repositories;
using server.Repositories.Implementations;
using server.Services;
using server.Services.Implementations;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 🔹 Database
builder.Services.AddDbContext<EGreetingDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("EGreetingDB")));

// 🔹 Dependency Injection cho base
builder.Services.AddScoped(typeof(IBaseRepository<>), typeof(BaseRepository<>));
builder.Services.AddScoped(typeof(IBaseService<>), typeof(BaseService<>));
builder.Services.AddScoped<UserRepository>();
builder.Services.AddScoped<UserService>();


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.MapControllers();
app.Run();