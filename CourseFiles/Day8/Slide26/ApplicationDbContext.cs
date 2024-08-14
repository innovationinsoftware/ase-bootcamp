using DomainLayer.Models;
using Microsoft.EntityFrameworkCore;


namespace DomainLayer.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext()
        {
        }
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }
        protected override void OnModelCreating(ModelBuilder builder)
        {

            base.OnModelCreating(builder);
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder = optionsBuilder.UseSqlServer("Server=tcp:[servername].database.windows.net,1433;Initial Catalog=[databasename];Persist Security Info=False;User ID=[userid];Password=[password];MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;");
            base.OnConfiguring(optionsBuilder);
        }
        public DbSet<Student> Students
        {
            get;
            set;
        }
        public DbSet<Department> Departments
        {
            get;
            set;
        }
        public DbSet<SubjectGpa> SubjectGpas
        {
            get;
            set;
        }
        public DbSet<Result> Results
        {
            get;
            set;
        }
    }
}
