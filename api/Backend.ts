import { currentUser } from "./Auth";

const develop = "http://100.64.58.72:8080";
const prod = "https://multi-service-gkv32wdswa-ue.a.run.app";
const ifDev = true;

/**
 * @param {string} image_id the unique id of the image stored both in firestore and localstorage
 * @param {boolean} authChange checks if user has been properly signed in before sending data to backend
 * 
 * deletes a picture using its image id from firestore
 */
export const deletePic = async (image_id: string, authChange: boolean) => {
  if (authChange) {
    const id_token = await currentUser().getIdToken();

    let details = {
      id_token: id_token,
      image_id: image_id,
      meta_flag: "true",
    } as any;

    let formBody = [];
    for (let props in details) {
      let encodedKey = encodeURIComponent(props);
      let encodedVal = encodeURIComponent(details[props]);
      formBody.push(encodedKey + "=" + encodedVal);
    }
    formBody = formBody.join("&") as any;
    const data = await fetch(`${ifDev ? develop : prod}/database/deleteImg`, {
      method: "DELETE",
      body: formBody,
      headers: {
        "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });
  }
};

export const getPic = async (image_id: string, authChange: boolean) => {
  if (authChange) {
    const id_token = await currentUser().getIdToken();

    let details = {
      id_token: id_token,
      image_id: image_id,
      meta_flag: "true",
    } as any;

    let formBody = [];
    for (let props in details) {
      let encodedKey = encodeURIComponent(props);
      let encodedVal = encodeURIComponent(details[props]);
      formBody.push(encodedKey + "=" + encodedVal);
    }
    formBody = formBody.join("&") as any;
    const data = await fetch(`${ifDev ? develop : prod}/database/getImg`, {
      method: "POST",
      body: formBody,
      headers: {
        "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });

    let json = await data.json();

    let copy = {
      image: {
        uri: json.success.photo.substring(2),
      },
      ...json.success["photo-meta"],
    };

    return copy;
  }
};

export const getAllPics = async (authChange: boolean) => {
  if (authChange) {
    const id_token = await currentUser().getIdToken();

    let details = {
      id_token: id_token,
    } as any;

    let formBody = [];
    for (let props in details) {
      let encodedKey = encodeURIComponent(props);
      let encodedVal = encodeURIComponent(details[props]);
      formBody.push(encodedKey + "=" + encodedVal);
    }
    formBody = formBody.join("&") as any;
    const data = await fetch(`${ifDev ? develop : prod}/database/getImgKeys`, {
      method: "POST",
      body: formBody,
      headers: {
        "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });

    const json = await data.json();

    return json;
  }
};

export const deleteUser = async () => {
  const id_token = await currentUser().getIdToken();

  let details = {
    id_token: id_token,
  } as any;

  let formBody = [];
  for (let props in details) {
    let encodedKey = encodeURIComponent(props);
    let encodedVal = encodeURIComponent(details[props]);
    formBody.push(encodedKey + "=" + encodedVal);
  }
  formBody = formBody.join("&") as any;
  const data = await fetch(`${ifDev ? develop : prod}/database/deleteUser`, {
    method: "DELETE",
    body: formBody,
    headers: {
      "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
  });
};

export const addImg = async (uniqueID: any, data: any, results: any) => {
  const id_token = await currentUser().getIdToken();
  let details = {
    id_token: id_token,
    data: JSON.stringify({
      key: uniqueID,
      multi: data,
    }),
    image_base64: results.uri,
  } as any;

  let formBody = [];
  for (let props in details) {
    let encodedKey = encodeURIComponent(props);
    let encodedVal = encodeURIComponent(details[props]);
    formBody.push(encodedKey + "=" + encodedVal);
  }
  formBody = formBody.join("&") as any;
  const d = await fetch(`${ifDev ? develop : prod}/database/addImg`, {
    method: "POST",
    body: formBody,
    headers: {
      "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
  });
};

export const analyzeImg = async (formData: any) => {
  const MLRequest = await fetch(`${ifDev ? develop : prod}/predict`, {
    method: "POST",
    body: formData,
    headers: {
      "content-type": "multipart/form-data",
    },
  });

  const MLdata = await MLRequest.json();
  return MLdata;
};

export const addTrashImg = async (props: any) => {
  const id_token = await currentUser().getIdToken();
  let details = {
    id_token: id_token,
    image_base64: props.base64,
    longitude: props.longitude,
    latitude: props.latitude,
    recyling_types: props.name,
    date_taken: Date.now(),
    image_id: props.uuid,
  } as any;

  let formBody = [];
  for (let props in details) {
    let encodedKey = encodeURIComponent(props);
    let encodedVal = encodeURIComponent(details[props]);
    formBody.push(encodedKey + "=" + encodedVal);
  }
  props.setMapPic("");
  formBody = formBody.join("&") as any;
  await fetch(`${ifDev ? develop : prod}/database/createTrashcanCoords`, {
    method: "POST",
    body: formBody,
    headers: {
      "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
  });
};
