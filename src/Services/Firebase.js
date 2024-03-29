import { FirebaseDatabase, FirebaseAuth, FirebaseStorage } from '../config/Firebase'
import uuidv4 from 'uuid/v4'

export default class FirebaseService {
  static getDataList = (nodePath, callback, size = 10) => {
    const query = FirebaseDatabase.ref(nodePath).limitToLast(size)
    query.on('value', dataSnapshot => {
      const items = []
      dataSnapshot.forEach(childSnapshot => {
        const item = childSnapshot.val()
        item.key = childSnapshot.key
        items.push(item)
      })
      callback(items)
    })
    return query
  }

  static pushData = (node, objToSubmit) => {
    const ref = FirebaseDatabase.ref(node).push()
    const id = FirebaseDatabase.ref(node).push().key
    ref.set(objToSubmit)
    return id
  }

  static remove = (id, node) => {
    return FirebaseDatabase.ref(node + '/' + id).remove()
  }

  static createUserWithEmailAndPassword = (email, password, datas) => {
    const data = { displayName: datas.name }
    return FirebaseAuth.createUserWithEmailAndPassword(email, password)
      .then(authUser => {
        authUser.user.updateProfile(data)
        return FirebaseDatabase.ref('users/' + authUser.user.uid).set(datas)
      })
  }

  static updateProfile = (data) => {
    return FirebaseAuth.currentUser.updateProfile(data)
  }

  static signInWithEmailAndPassword = (email, password) => {
    return FirebaseAuth.signInWithEmailAndPassword(email, password)
  }

  static onAuthChange = (callbackLogin, callbackLogout) => {
    FirebaseAuth.onAuthStateChanged(authUser => {
      if (!authUser) {
        callbackLogout(authUser)
      } else {
        callbackLogin(authUser)
      }
    })
  }

  static logout = () => {
    return FirebaseAuth.signOut()
  }

  static uploadImage = (image) => {
    const ref = FirebaseStorage.ref()
    const id = uuidv4()
    return ref.child(id).put(image)
  }
}
