const fetchCategoryData = async () => {
  const MLRequest = await fetch('https://multi-service-gkv32wdswa-ue.a.run.app/mapData', {
    method: 'GET',
  })
  const MLdata = await MLRequest.json()
  return MLdata.success
}

export default fetchCategoryData