import ContenedorMem from "../../containers/ContenedorMem.js";

class UsersDaoMem extends ContenedorMem {
  constructor() {
    super();
    this.elements = [
      {
        id: 1,
        timestamp: "2022-02-26T21:23:26.082Z",
        username: "admin@mammoth.com",
        password:
          "$2b$10$UQMuNJPkJ7pNe37lNu10m.VZ8kMPy2x4fmOQAiPV6Chvj7U5HaD7y",
        name: "Sergio Emanuel Prellezo",
        address: "33 #922",
        age: 43,
        phone: "+5492215737971",
        avatar: "/img/avatars/admin_avatar.svg",
        role: "admin"
      }
    ];
    this.nextId = 2;
  }
  getByUsername(username) {
    const match = this.elements.find(user => user.username === username);
    return match ? match : null;
  }
}

export default UsersDaoMem;
