export async function showNotification(
  text: string, options?: { [key: string]: string }): Promise<Notification | undefined> {
  const permission = await Notification.requestPermission();

  if (permission === 'granted') {
    return new Notification(text, options);
  }

  return undefined;
}

export default showNotification;
