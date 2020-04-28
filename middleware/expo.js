const {Expo} = require('expo-server-sdk');

// Create a new Expo SDK client
let expo = new Expo();

class ExpoMessenger {
	async sendMessage(pushToken, message, data_obj) {


		return new Promise(async (resolve, reject) => {
			try {
				let messages = [];
				if (!Expo.isExpoPushToken(pushToken)) {
					reject(new Error(`Push token ${pushToken} is not a valid Expo push token`));
				} else {
					messages.push({
						to: pushToken,
						sound: 'default',
						body: message,
						data: data_obj,
					});
					let chunks = expo.chunkPushNotifications(messages);
					for (let chunk of chunks) {
						try {
							let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
							console.log(ticketChunk);
							// tickets.push(...ticketChunk);
							// NOTE: If a ticket contains an error code in ticket.details.error, you
							// must handle it appropriately. The error codes are listed in the Expo
							// documentation:
							// https://docs.expo.io/versions/latest/guides/push-notifications#response-format
						} catch (e) {
							reject(e)
						}
					}
					resolve(1)
				}
			} catch (e) {
				reject(e)
			}
		});


	}
}


module.exports = ExpoMessenger;


