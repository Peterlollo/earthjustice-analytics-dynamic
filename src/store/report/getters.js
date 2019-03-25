const hasPath = (object, path) => {
  if (!object) {
    console.log('object not defined +++++++++++++++++++++++++++++++++++')
    return false
  }
  let pathWithSlash = `${path}/`
  if (Array.isArray(object)) {
    return (object.indexOf(path) > -1 || object.indexOf(pathWithSlash) > -1)
  } else {
    return (object[path] || object[pathWithSlash])
  }
}

const valAtPath = (object, path) => {
  if (!object) {
    console.log('object not defined +++++++++++++++++++++++++++++++++++')
    return false
  }
  let pathWithSlash = `${path}/`
  return (object[path] || object[pathWithSlash] || 0)
}

export const path = state => state.report.pathFromParam
export const providers = state => state.report.providers
export const providerSessions = state => state.report.providerSessions
export const providerSessionsWithPathFilter = (state, get) => {
  // returns all pages visited by a provider, *IF* that provider has visited the path in current url's path param
  let result = {}
  Object.keys(get.providerSessions).forEach((p) => {
    if (hasPath(get.providerSessions[p], get.path)) {
    // providerSessions includes a session for this provider on current url param path
      result[p] = get.providerSessions[p]
    }
  })
  return result
}
export const providersWithPathFilter = (state, get) => Object.keys(get.providerSessionsWithPathFilter)
export const pathFromParam = state => state.report.pathFromParam
export const pathFromParamStatus = state => state.report.pathFromParamStatus
export const fetchingPathData = state => state.report.fetchingData
export const pathError = state => state.report.error
export const whitelist = state => state.whitelist.whitelist
export const whitelistSectors = state => state.whitelist.whitelistSectors

export const keyProviders = (state, get) => {
  return get.providers.filter((p) => get.whitelist[p])
}
export const sessionsByKeyProviders = (state, get) => {
  const result = {}
  get.keyProviders.map((kp) => {
    result[kp] = get.providerSessions[kp]
  })
  return result
}
export const keyProvidersBySector = (state, get) => {
  const result = {}
  get.keyProviders.map((kp) => {
    let sector = get.whitelist[kp].sector
    result[sector] = result[sector] || []
    result[sector].push(kp)
  })
  return result
}
export const keyProvidersBySectorSortedBySessionTimes = (state, get) => {
  const result = {}
  for (var sector in get.keyProvidersBySector) {
    result[sector] = get.keyProvidersBySector[sector].slice(0)
    result[sector].sort((kpA, kpB) => {
      return valAtPath(get.sessionsByKeyProviders[kpB], get.path) - valAtPath(get.sessionsByKeyProviders[kpA], get.path)
    })
  }
  return result
}
export const keySectorsSortedByProviderCount = (state, get) => {
  return Object.keys(get.keyProvidersBySector).sort((s1, s2) => {
    return get.keyProvidersBySector[s2].length - get.keyProvidersBySector[s1].length
  })
}

export const unlistedProviders = (state, get) => {
  return get.providers.filter((p) => !get.whitelist[p])
}

export const unlistedProvidersSortedBySessionTimes = (state, get) => {
  return get.unlistedProviders.slice(0).sort((p1, p2) => {
    return valAtPath(get.providerSessions[p2], get.path) - valAtPath(get.providerSessions[p1], get.path)
  })
}

// WTIH FILTER //
// *************//

export const keyProvidersWithPathFilter = (state, get) => {
  return get.providersWithPathFilter.filter((p) => get.whitelist[p])
}
export const sessionsByKeyProvidersWithPathFilter = (state, get) => {
  const result = {}
  get.keyProvidersWithPathFilter.map((kp) => {
    result[kp] = get.providerSessionsWithPathFilter[kp]
  })
  console.log('sessionsByKeyProvidersWithPathFilter>>>>', result)
  return result
}
export const keyProvidersBySectorWithPathFilter = (state, get) => {
  const result = {}
  get.keyProvidersWithPathFilter.map((kp) => {
    let sector = get.whitelist[kp].sector
    result[sector] = result[sector] || []
    result[sector].push(kp)
  })
  return result
}
export const keyProvidersBySectorSortedBySessionTimesWithPathFilter = (state, get) => {
  const result = {}
  for (var sector in get.keyProvidersBySectorWithPathFilter) {
    result[sector] = get.keyProvidersBySectorWithPathFilter[sector].slice(0)
    result[sector].sort((kpA, kpB) => {
      return valAtPath(get.providerSessions[kpB], get.path) - valAtPath(get.providerSessions[kpA], get.path)
    })
  }
  return result
}
export const keySectorsSortedByProviderCountWithPathFilter = (state, get) => {
  return Object.keys(get.keyProvidersBySectorWithPathFilter).sort((s1, s2) => {
    return get.keyProvidersBySectorWithPathFilter[s2].length - get.keyProvidersBySectorWithPathFilter[s1].length
  })
}

export const unlistedProvidersWithPathFilter = (state, get) => {
  return get.providersWithPathFilter.filter((p) => !get.whitelist[p])
}

export const unlistedProvidersSortedBySessionTimesWithPathFilter = (state, get) => {
  return get.unlistedProvidersWithPathFilter.slice(0).sort((p1, p2) => {
    return valAtPath(get.providerSessions[p2], get.path) - valAtPath(get.providerSessions[p1], get.path)
  })
}
