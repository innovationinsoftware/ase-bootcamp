using DomainLayer.Data;
using DomainLayer.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
//Microsoft.EntityFrameworkCore.Design   you may need these packages
//Microsoft.EntityFrameworkCore
//Npgsql.EntityFrameworkCore.PostgreSQL
using RepositoryLayer.IRepository;
using RepositoryLayer.Repository;
using ServiceLayer.CustomServices;
using ServiceLayer.ICustomServices;
var builder = WebApplication.CreateBuilder(args);
// Add services to the container.
//Sql Dependency Injection
//If the connection string is in the appsettings file this gets the connection for the postgresql now
var ConnectionString = builder.Configuration.GetConnectionString("DefaultConnection");
//this is the only line that needs to change for postgres instead of sql
builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseNpgsql(ConnectionString));
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
#region Service Injected
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped<ICustomService<Result>, ResultService>();
builder.Services.AddScoped<ICustomService<Department>, DepartmentService>();
builder.Services.AddScoped<ICustomService<SubjectGpa>, SubjectGpaService>();
#endregion
var app = builder.Build();
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();
