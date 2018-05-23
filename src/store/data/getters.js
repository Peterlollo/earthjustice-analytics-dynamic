export const path = state => state.data.path
export const providers = state => state.data.providers
export const providerSessions = state => state.data.providerSessions
export const pathFromParam = state => state.data.pathFromParam
export const pathFromParamStatus = state => state.data.pathFromParamStatus
export const fetchingData = state => state.data.fetchingData
export const pathFoundInStore = state => state.data.pathFoundInStore
export const error = state => state.data.error
export const whitelist = state => state.data.whitelist
export const whitelistSectors = state => state.data.whitelistSectors
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
// export const keyProvidersBySector = state => {
//   let sectors = {}
//   this.keyProviders.slice(0).map((kp) => {
//     let sector = this.whitelist[kp].sector
//     sectors[sector] = sectors[sector] || []
//     sectors[sector].push(kp)
//   })
//   return sectors
// }
