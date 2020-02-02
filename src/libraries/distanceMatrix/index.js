const distance = (lat1, lon1, lat2, lon2, unit = 'K') => {
  if (lat1 === lat2 && lon1 === lon2) {
    return 0
  } else {
    let radlat1 = (Math.PI * lat1) / 180
    let radlat2 = (Math.PI * lat2) / 180
    let theta = lon1 - lon2
    let radtheta = (Math.PI * theta) / 180
    let dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta)
    if (dist > 1) {
      dist = 1
    }
    dist = Math.acos(dist)
    dist = (dist * 180) / Math.PI
    dist = dist * 60 * 1.1515
    if (unit == 'K') {
      dist = dist * 1.609344
    }
    if (unit == 'N') {
      dist = dist * 0.8684
    }
    return Math.ceil(dist * 1000)
  }
}

const chunk = (arr, len) => {
  let chunks = [],
    i = 0,
    n = arr.length

  while (i < n) {
    chunks.push(arr.slice(i, (i += len)))
  }

  return chunks
}

export const distanceMatrix = location => {
  let ans = []
  let distanceCacheKey = []
  for (let i = 0; i < location.length; i++) {
    for (let j = 0; j < location.length; j++) {
      if (i === j) {
        ans.push(0)
      } else {
        if (location[j] !== undefined) {
          if (!distanceCacheKey[`${j}${i}`]) {
            let dist = distance(
              location[i].lat,
              location[i].lng,
              location[j].lat,
              location[j].lng
            )
            distanceCacheKey[`${i}${j}`] = dist
            ans.push(dist)
          } else {
            ans.push(distanceCacheKey[`${j}${i}`])
          }
        }
      }
    }
  }
  return chunk(ans, location.length)
}
