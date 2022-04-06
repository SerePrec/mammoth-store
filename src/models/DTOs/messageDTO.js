class MessageDTO {
  constructor(data) {
    this.user = data.user;
    this.text = data.text;
    this.type = data.type;
    this.replyMessage = data.replyMessage;

    data.id || data._id ? (this.id = data.id || data._id.toString()) : null;
    data.timestamp
      ? (this.timestamp =
          typeof data.timestamp === "object"
            ? data.timestamp.toISOString()
            : data.timestamp.toString())
      : null;
  }
}

export { MessageDTO };
