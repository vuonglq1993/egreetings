using System;
using Microsoft.EntityFrameworkCore;

namespace server.Models
{
    public partial class EGreetingDbContext : DbContext
    {
        public EGreetingDbContext()
        {
        }

        public EGreetingDbContext(DbContextOptions<EGreetingDbContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Category> Categories { get; set; }
        public virtual DbSet<Feedback> Feedbacks { get; set; }
        public virtual DbSet<Package> Packages { get; set; }
        public virtual DbSet<Report> Reports { get; set; }
        public virtual DbSet<Subscription> Subscriptions { get; set; }
        public virtual DbSet<SubscriptionRecipient> SubscriptionRecipients { get; set; }
        public virtual DbSet<Template> Templates { get; set; }
        public virtual DbSet<Transaction> Transactions { get; set; }
        public virtual DbSet<User> Users { get; set; }

        // ✅ ĐÃ SỬA: Không còn hardcode connection string
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                var connectionString = Environment.GetEnvironmentVariable("EGREETING_DB_CONNECTION");
                if (!string.IsNullOrEmpty(connectionString))
                {
                    optionsBuilder.UseSqlServer(connectionString);
                }
                else
                {
                    throw new InvalidOperationException("❌ Missing database connection string in .env (EGREETING_DB_CONNECTION)");
                }
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("PK__Categori__3214EC07AB7CD10E");
                entity.Property(e => e.Description).HasMaxLength(255);
                entity.Property(e => e.Name).HasMaxLength(50);
            });

            modelBuilder.Entity<Feedback>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("PK__Feedback__3214EC07E8149A91");
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
                entity.HasOne(d => d.User).WithMany(p => p.Feedbacks)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.SetNull)
                    .HasConstraintName("FK_Feedbacks_Users");
            });

            modelBuilder.Entity<Package>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("PK__Packages__3214EC0702837F6E");
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
                entity.Property(e => e.Description).HasMaxLength(255);
                entity.Property(e => e.IsActive).HasDefaultValue(true);
                entity.Property(e => e.Name).HasMaxLength(100);
                entity.Property(e => e.Price).HasColumnType("decimal(10, 2)");
            });

            modelBuilder.Entity<Report>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("PK__Reports__3214EC073F4527EC");
                entity.HasIndex(e => e.ReportDate, "UQ__Reports__826382E8A0B294CE").IsUnique();
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
                entity.Property(e => e.TotalPayments).HasColumnType("decimal(18, 2)");
            });

            modelBuilder.Entity<Subscription>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("PK__Subscrip__3214EC074C132C3A");
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
                entity.Property(e => e.IsActive).HasDefaultValue(true);
                entity.Property(e => e.PaymentStatus)
                    .HasMaxLength(20)
                    .HasDefaultValue("Pending");

                entity.HasOne(d => d.Package).WithMany(p => p.Subscriptions)
                    .HasForeignKey(d => d.PackageId)
                    .HasConstraintName("FK_Subscriptions_Packages");

                entity.HasOne(d => d.User).WithMany(p => p.Subscriptions)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.SetNull)
                    .HasConstraintName("FK_Subscriptions_Users");
            });

            modelBuilder.Entity<SubscriptionRecipient>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("PK__Subscrip__3214EC07D80BFCC5");
                entity.Property(e => e.RecipientEmail).HasMaxLength(100);
                entity.HasOne(d => d.Subscription).WithMany(p => p.SubscriptionRecipients)
                    .HasForeignKey(d => d.SubscriptionId)
                    .HasConstraintName("FK_SubscriptionRecipients_Subscriptions");
            });

            modelBuilder.Entity<Template>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("PK__Template__3214EC0718A4981D");
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
                entity.Property(e => e.ImageUrl).HasMaxLength(255);
                entity.Property(e => e.IsActive).HasDefaultValue(true);
                entity.Property(e => e.Price).HasColumnType("decimal(10, 2)");
                entity.Property(e => e.Title).HasMaxLength(100);
                entity.Property(e => e.VideoUrl).HasMaxLength(255);

                entity.HasOne(d => d.Category).WithMany(p => p.Templates)
                    .HasForeignKey(d => d.CategoryId)
                    .HasConstraintName("FK_Templates_Categories");
            });

            modelBuilder.Entity<Transaction>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("PK__Transact__3214EC07A5079B4B");
                entity.Property(e => e.PaymentMethod).HasMaxLength(50);
                entity.Property(e => e.PaymentStatus)
                    .HasMaxLength(20)
                    .HasDefaultValue("Completed");
                entity.Property(e => e.Price).HasColumnType("decimal(10, 2)");
                entity.Property(e => e.RecipientEmail).HasMaxLength(100);
                entity.Property(e => e.SentAt).HasDefaultValueSql("(getdate())");
                entity.Property(e => e.Subject).HasMaxLength(255);

                entity.HasOne(d => d.Template).WithMany(p => p.Transactions)
                    .HasForeignKey(d => d.TemplateId)
                    .HasConstraintName("FK_Transactions_Templates");

                entity.HasOne(d => d.User).WithMany(p => p.Transactions)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FK_Transactions_Users");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("PK__Users__3214EC0738417F95");
                entity.HasIndex(e => e.Email, "UQ__Users__A9D105343D0E715B").IsUnique();
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
                entity.Property(e => e.Email).HasMaxLength(100);
                entity.Property(e => e.FullName).HasMaxLength(100);
                entity.Property(e => e.PasswordHash).HasMaxLength(255);
                entity.Property(e => e.Role)
                    .HasMaxLength(20)
                    .HasDefaultValue("User");
                entity.Property(e => e.Status).HasDefaultValue(true);
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
