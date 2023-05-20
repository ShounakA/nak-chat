using Microsoft.AspNetCore.SignalR;

namespace NakChatServer.Hubs;

public class ChatHub : Hub
{
    public static HashSet<string> ConnectedIds = new HashSet<string>();
    public ChatHub() {}
    public async Task NewMessage(string username, string message) =>
        await Clients.All.SendAsync("messageReceived", username, message);

    public async Task GetClientCount() {
        await Clients.All.SendAsync("networkUpdate", ConnectedIds.Count);
    }

    public override async Task OnConnectedAsync()
    {
        ConnectedIds.Add(Context.ConnectionId);
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception exception)
    {
        ConnectedIds.Remove(Context.ConnectionId);
        await Clients.All.SendAsync("networkUpdate", ConnectedIds.Count);
        await base.OnDisconnectedAsync(exception);
    }
}