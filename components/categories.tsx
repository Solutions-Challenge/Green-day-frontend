const fetchCategoryData = async () => {
  const MLRequest = await fetch('http://10.0.0.222:8080/mapData', {
    method: 'GET',
  })
  const MLdata = await MLRequest.json()
  return MLdata.success
}

export default fetchCategoryData