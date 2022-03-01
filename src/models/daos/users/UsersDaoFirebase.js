import ContenedorFirebase from "../../containers/ContenedorFirebase.js";

class UsersDaoFirebase extends ContenedorFirebase {
  constructor() {
    super("users");
  }

  async getByUsername(username) {
    try {
      const snapshot = await this.collection
        .where("username", "==", username)
        .limit(1)
        .get();

      if (snapshot.empty) {
        return null;
      } else {
        let docs = [];
        snapshot.forEach(doc =>
          docs.push({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp.toDate()
          })
        );
        return docs[0];
      }
    } catch (error) {
      throw new Error(
        `Error al obtener el usuario con username:'${username}': ${error}`
      );
    }
  }
}

export default UsersDaoFirebase;
