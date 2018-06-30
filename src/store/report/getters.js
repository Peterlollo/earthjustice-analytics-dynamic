export const path = state => state.report.path
export const providers = state => state.report.providers
export const providerSessions = state => state.report.providerSessions
export const pathFromParam = state => state.report.pathFromParam
export const pathFromParamStatus = state => state.report.pathFromParamStatus
export const fetchingPathData = state => state.report.fetchingData
export const pathFoundInStore = state => state.report.pathFoundInStore
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
