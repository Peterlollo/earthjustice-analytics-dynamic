export const path = state => state.path.path
export const providers = state => state.path.providers
export const providerSessions = state => state.path.providerSessions
export const pathFromParam = state => state.path.pathFromParam
export const pathFromParamStatus = state => state.path.pathFromParamStatus
export const fetchingPathData = state => state.path.fetchingData
export const pathFoundInStore = state => state.path.pathFoundInStore
export const pathError = state => state.path.error
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
export const keyProvidersBySectorSortedBySession = (state, get) => {
  const result = {}
  const reducer = (a, v) => a + v
  for (var sector in get.keyProvidersBySector) {
    result[sector] = get.keyProvidersBySector[sector].slice(0)
    result[sector].sort((kpA, kpB) => {
      return get.sessionsByKeyProviders[kpB].reduce(reducer) - get.sessionsByKeyProviders[kpA].reduce(reducer)
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

export const unlistedProvidersSortedBySession = (state, get) => {
  const reducer = (a, v) => a + v
  return get.unlistedProviders.slice(0).sort((p1, p2) => {
    return get.providerSessions[p2].reduce(reducer) - get.providerSessions[p1].reduce(reducer)
  })
}
