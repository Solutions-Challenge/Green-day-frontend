const fetchCategoryData = async () => {
  const MLRequest = await fetch('http://100.64.58.72:8081/mapData', {
    method: 'GET',
  })
  const MLdata = await MLRequest.json()
  return MLdata.success
}

export default fetchCategoryData