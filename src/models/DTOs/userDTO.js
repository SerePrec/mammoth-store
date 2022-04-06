class UserDTO {
  constructor(data) {
    this.username = data.username;
    this.password = data.password;
    this.name = data.name;
    this.address = data.address;
    this.age = data.age;
    this.phone = data.phone;
    this.avatar = data.avatar;
    this.role = data.role;

    data.id || data._id ? (this.id = data.id || data._id.toString()) : null;
    data.timestamp
      ? (this.timestamp =
          typeof data.timestamp === "object"
            ? data.timestamp.toISOString()
            : data.timestamp.toString())
      : null;
  }
}

export { UserDTO };
