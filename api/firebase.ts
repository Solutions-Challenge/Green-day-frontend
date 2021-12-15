import firestore from '@react-native-firebase/firestore';

const read_data = async() => {
  const users = await firestore().collection('geoLocation').get();
  console.log(users)
}

export default read_data