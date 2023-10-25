self.addEventListener('message', function(event) {
    const message = event.data;

    const options = {
        body: `You have a new message from ${message.sendBy}: ${message.message}`,
        icon: './public/favicon.png',
        badge: './public/logo192.png'
    };

    self.registration.showNotification('New message', options);
});
