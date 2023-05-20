using NakChatServer.Hubs;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSignalR().AddStackExchangeRedis($"{Environment.GetEnvironmentVariable("REDIS_HOST")}:{Environment.GetEnvironmentVariable("REDIS_PORT")},password={Environment.GetEnvironmentVariable("REDIS_PASSWORD")}");
builder.Services.AddCors(options => options.AddPolicy("CorsPolicy",
        builder =>
        {
            builder.AllowAnyHeader()
                   .AllowAnyMethod()
                   .SetIsOriginAllowed((host) => true)
                   .AllowCredentials();
        }));

var app = builder.Build();

app.MapGet("/health", () => "LIVE AND HEALTHY!!!");
app.UseCors("CorsPolicy");
app.MapHub<ChatHub>("/hub");

app.Run();
